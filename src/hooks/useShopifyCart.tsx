'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTransition } from 'react';
import { addToCartAction, createCartAction, getCartAction, updateCartLineAction, removeFromCartAction } from '@/app/actions/shopify-cart';
import { useStore } from '@/store/useStore';
import { useStore as useShopifyStore } from '@/store/shopifyStore';
import type { Product } from '@/data/products';
import { cn } from '@/lib/utils';

const CART_ID_COOKIE = 'daneya_cart_id';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const matches = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return matches ? matches[2] : null;
}

interface OptimisticCartButtonProps {
  product: Product;
  quantity?: number;
  selectedColor?: string;
  variantId?: string;
  className?: string;
  children?: React.ReactNode;
}

export function OptimisticCartButton({
  product,
  quantity = 1,
  selectedColor = '',
  variantId,
  className,
  children,
}: OptimisticCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const setCartDrawerOpen = useShopifyStore((s) => s.setCartDrawerOpen);
  const cartId = useShopifyStore((s) => s.cartId);
  const setCartId = useShopifyStore((s) => s.setCartId);
  const addToCartLocal = useShopifyStore((s) => s.addToCart);
  
  // Optimistic update - immediately add to local store
  const handleAddToCart = useCallback(() => {
    // Optimistically update local store immediately
    addToCartLocal(product, quantity, selectedColor || product.colors[0]?.name || '');
    setCartDrawerOpen(true);

    // Then make the server action call
    startTransition(async () => {
      try {
        const result = await addToCartAction(cartId, variantId || '', quantity);
        
        if (result.success && result.cart) {
          // Update cart ID if newly created
          if (!cartId && result.cart.id) {
            setCartId(result.cart.id);
          }
        }
      } catch (error) {
        console.error('Failed to sync with Shopify:', error);
        // Local optimistic update already shows the item, 
        // user can still checkout even if Shopify sync fails temporarily
      }
    });
  }, [product, quantity, selectedColor, variantId, cartId, setCartId, addToCartLocal, setCartDrawerOpen]);

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPending}
      className={cn(className, isPending && 'opacity-70 cursor-wait')}
    >
      {children || 'Add to Bag'}
    </button>
  );
}

// Hook for managing cart with Shopify sync
export function useShopifyCart() {
  const cart = useShopifyStore((s) => s.cart);
  const cartId = useShopifyStore((s) => s.cartId);
  const setCart = useShopifyStore((s) => s.setCart);
  const setCartId = useShopifyStore((s) => s.setCartId);
  const addToCartLocal = useShopifyStore((s) => s.addToCart);
  const updateCartItem = useShopifyStore((s) => s.updateCartItem);
  const removeFromCart = useShopifyStore((s) => s.removeFromCart);
  const clearCart = useShopifyStore((s) => s.clearCart);
  const setCartDrawerOpen = useShopifyStore((s) => s.setCartDrawerOpen);
  
  const [isPending, startTransition] = useTransition();
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync cart from Shopify on mount - ONLY if we have a cartId
  useEffect(() => {
    async function syncCartFromShopify() {
      const storedCartId = useShopifyStore.getState().cartId;
      if (!storedCartId) return;
      
      try {
        const result = await getCartAction(storedCartId);
        if (result.success && result.cart) {
          const shopifyCart = result.cart;
          const lines = shopifyCart.lines?.edges?.map((edge: any) => ({
            product: {
              id: parseInt(edge.node.merchandise.product.id.split('/').pop()) || 0,
              name: edge.node.merchandise.product.title || 'Product',
              price: parseFloat(edge.node.merchandise.price?.amount || '0'),
              image: edge.node.merchandise.product.images?.edges?.[0]?.node?.url || '',
              images: [edge.node.merchandise.product.images?.edges?.[0]?.node?.url || ''],
              colors: [],
              sizes: [],
              category: '',
              material: '',
              description: '',
              rating: 0,
              reviews: 0,
              badge: '',
              sku: '',
              tags: [],
            } as Product,
            quantity: edge.node.quantity,
            selectedColor: edge.node.merchandise.selectedOptions?.find((o: any) => o.name === 'Color')?.value || '',
            selectedSize: edge.node.merchandise.selectedOptions?.find((o: any) => o.name === 'Size')?.value || undefined,
            variantId: edge.node.merchandise.id,
          })) || [];
          
          setCart({
            id: shopifyCart.id,
            checkoutUrl: shopifyCart.checkoutUrl || '',
            totalQuantity: shopifyCart.totalQuantity || 0,
            lines: lines,
            subtotal: parseFloat(shopifyCart.cost?.subtotalAmount?.amount || '0'),
          });
        }
      } catch (e) {
        // Silent fail
      }
    }
    
    syncCartFromShopify();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addItem = useCallback(async (product: Product, quantity: number, color: string, size?: string, variantId?: string) => {
    // Always add to local cart first (optimistic)
    addToCartLocal(product, quantity, color, size);
    setCartDrawerOpen(true);

    // If we have a valid Shopify variant, sync with Shopify
    if (variantId && variantId.startsWith('gid://')) {
      startTransition(async () => {
        try {
          let result = await addToCartAction(cartId, variantId, quantity);
          
          if (result.success && result.cart) {
            // Get the cart ID - either new or existing
            const newCartId = result.cart.id || cartId;
            
            if (newCartId && newCartId !== cartId) {
              setCartId(newCartId);
            }
            
            // Sync the FULL cart with local store
            const shopifyCart = result.cart;
            
            const lines = shopifyCart.lines?.edges?.map((edge: any) => ({
              product: {
                id: parseInt(edge.node.merchandise.product.id.split('/').pop()) || 0,
                name: edge.node.merchandise.product.title || 'Product',
                price: parseFloat(edge.node.merchandise.price?.amount || '0'),
                image: edge.node.merchandise.product.images?.edges?.[0]?.node?.url || '',
                images: [edge.node.merchandise.product.images?.edges?.[0]?.node?.url || ''],
                colors: [],
                sizes: [],
                category: '',
                material: '',
                description: '',
                rating: 0,
                reviews: 0,
                badge: '',
                sku: '',
                tags: [],
              } as Product,
              quantity: edge.node.quantity,
              selectedColor: edge.node.merchandise.selectedOptions?.find((o: any) => o.name === 'Color')?.value || '',
              selectedSize: edge.node.merchandise.selectedOptions?.find((o: any) => o.name === 'Size')?.value || undefined,
              variantId: edge.node.merchandise.id,
            })) || [];
            
            setCart({
              id: shopifyCart.id,
              checkoutUrl: shopifyCart.checkoutUrl || '',
              totalQuantity: shopifyCart.totalQuantity || 0,
              lines: lines,
              subtotal: parseFloat(shopifyCart.cost?.subtotalAmount?.amount || '0'),
            });
          }
        } catch (e) {
          // Silent fail
        }
      });
    }
  }, [cartId, addToCartLocal, setCartDrawerOpen, setCartId, setCart]);

  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    if (!cartId) return;
    
    // Optimistic update handled by store
    // Server action would go here
    
    startTransition(async () => {
      await updateCartLineAction(cartId, lineId, quantity);
    });
  }, [cartId]);

  const removeItem = useCallback(async (lineIds: string[]) => {
    if (!cartId) return;
    
    // Optimistic update handled by store
    
    startTransition(async () => {
      await removeFromCartAction(cartId, lineIds);
    });
  }, [cartId]);

  return {
    cart,
    cartId,
    isPending,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    setCartDrawerOpen,
  };
}
