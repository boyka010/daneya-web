'use client';

import { useState, useCallback } from 'react';
import { useTransition } from 'react';
import { addToCartAction, createCartAction } from '@/app/actions/shopify-cart';
import { useStore } from '@/store/useStore';
import type { Product } from '@/data/products';
import { cn } from '@/lib/utils';

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
  const setCartDrawerOpen = useStore((s) => s.setCartDrawerOpen);
  const cartId = useStore((s) => s.cartId);
  const setCartId = useStore((s) => s.setCartId);
  const addToCartLocal = useStore((s) => s.addToCart);
  
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
  const cart = useStore((s) => s.cart);
  const cartId = useStore((s) => s.cartId);
  const setCart = useStore((s) => s.setCart);
  const setCartId = useStore((s) => s.setCartId);
  const addToCartLocal = useStore((s) => s.addToCart);
  const updateCartItem = useStore((s) => s.updateCartItem);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const clearCart = useStore((s) => s.clearCart);
  const setCartDrawerOpen = useStore((s) => s.setCartDrawerOpen);
  
  const [isPending, startTransition] = useTransition();

  const addItem = useCallback(async (product: Product, quantity: number, color: string, variantId?: string) => {
    // Optimistic update
    addToCartLocal(product, quantity, color);
    setCartDrawerOpen(true);

    startTransition(async () => {
      const result = await addToCartAction(cartId, variantId || '', quantity);
      if (result.success && result.cart) {
        if (!cartId && result.cart.id) {
          setCartId(result.cart.id);
        }
        // Optionally sync cart from Shopify
        if (result.cart) {
          // Transform Shopify cart to local format
          setCart({
            id: result.cart.id,
            checkoutUrl: result.cart.checkoutUrl,
            totalQuantity: result.cart.totalQuantity,
            lines: result.cart.lines.edges?.map((edge: any) => ({
              product: {
                id: parseInt(edge.node.merchandise.product.id.replace('gid://shopify/Product/', '')),
                name: edge.node.merchandise.product.title,
                price: parseFloat(edge.node.merchandise.price.amount),
                image: edge.node.merchandise.product.images.edges[0]?.node.url || '',
              } as Product,
              quantity: edge.node.quantity,
              selectedColor: edge.node.merchandise.selectedOptions.find((o: any) => o.name === 'Color')?.value || '',
            })) || [],
            subtotal: parseFloat(result.cart.cost.subtotalAmount.amount),
          });
        }
      }
    });
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
