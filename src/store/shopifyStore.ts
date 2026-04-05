import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/data/products';
import type { PageRoute } from '@/lib/router';

const CART_ID_COOKIE = 'daneya_cart_id';

function getCartIdFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const matches = document.cookie.match(new RegExp('(^| )' + CART_ID_COOKIE + '=([^;]+)'));
  return matches ? matches[2] : null;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
  variantId?: string;
}

export interface ShopifyCart {
  id: string | null;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartItem[];
  subtotal: number;
}

interface StoreState {
  // Cart - Shopify-backed
  cart: ShopifyCart | null;
  cartId: string | null;
  setCart: (cart: ShopifyCart | null) => void;
  setCartId: (id: string | null) => void;
  addToCart: (product: Product, quantity: number, color: string, selectedSize?: string, variantId?: string) => void;
  updateCartItem: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Wishlist
  wishlistItems: number[];
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;

  // UI
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  isQuickViewOpen: boolean;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isAnnouncementOpen: boolean;
  setAnnouncementOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Page
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;

  // Filters
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: null,
      cartId: null,
      setCart: (cart) => set({ cart }),
      setCartId: (cartId) => set({ cartId }),
      
      addToCart: (product, quantity, selectedColor, selectedSize, variantId) => {
        const existingItems = get().cart?.lines || [];
        const existingIndex = existingItems.findIndex(
          (item) => item.product.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
        );
        
        let newItems;
        if (existingIndex > -1) {
          newItems = [...existingItems];
          newItems[existingIndex].quantity += quantity;
        } else {
          newItems = [...existingItems, { product, quantity, selectedColor, selectedSize, variantId }];
        }
        
        const newSubtotal = newItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
        
        // Only create a cart ID if we have a real Shopify variant
        const existingCartId = get().cart?.id;
        const newCartId = (variantId && variantId.startsWith('gid://') && existingCartId)
          ? existingCartId
          : (variantId && variantId.startsWith('gid://') ? `shopify_${Date.now()}` : null);
        
        set({
          cart: {
            id: newCartId,
            checkoutUrl: get().cart?.checkoutUrl || '',
            totalQuantity: newItems.reduce((count, item) => count + item.quantity, 0),
            lines: newItems,
            subtotal: newSubtotal,
          },
        });
      },

      updateCartItem: (index, quantity) => {
        const items = [...(get().cart?.lines || [])];
        if (items[index]) {
          items[index].quantity = quantity;
        }
        const newSubtotal = items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
        set({ cart: { ...get().cart!, lines: items, subtotal: newSubtotal } });
      },

      removeFromCart: (index) => {
        const currentCart = get().cart;
        if (!currentCart) return;
        const items = (currentCart.lines || []).filter((_, i) => i !== index);
        const newSubtotal = items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
        set({ cart: { ...currentCart, lines: items, subtotal: newSubtotal } });
      },

      clearCart: () => set({ cart: null, cartId: null }),
      
      getCartTotal: () => {
        const items = get().cart?.lines;
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((total, item) => total + ((item?.product?.price || 0) * (item?.quantity || 0)), 0);
      },
      
      getCartCount: () => {
        const items = get().cart?.lines;
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((count, item) => count + (item?.quantity || 0), 0);
      },

      // Wishlist
      wishlistItems: [],
      toggleWishlist: (productId) => {
        const items = get().wishlistItems;
        if (items.includes(productId)) {
          set({ wishlistItems: items.filter((id) => id !== productId) });
        } else {
          set({ wishlistItems: [...items, productId] });
        }
      },
      isInWishlist: (productId) => get().wishlistItems.includes(productId),

      // UI
      isCartDrawerOpen: false,
      setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
      isQuickViewOpen: false,
      quickViewProduct: null,
      setQuickViewProduct: (product) => set({ isQuickViewOpen: !!product, quickViewProduct: product }),
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      isAnnouncementOpen: true,
      setAnnouncementOpen: (open) => set({ isAnnouncementOpen: open }),
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),

      // Page
      currentPage: { type: 'home' },
      setCurrentPage: (page) => set({ currentPage: page }),

      // Filters
      activeCategory: 'all',
      setActiveCategory: (category) => set({ activeCategory: category }),
      sortBy: 'featured',
      setSortBy: (sort) => set({ sortBy: sort }),
    }),
    {
      name: 'daneya-store',
      partialize: (state) => {
        const cookieCartId = getCartIdFromCookie();
        
        // If there's a Shopify cart ID in cookie but different in localStorage, 
        // we should NOT persist the local cart - it will be synced from Shopify
        if (cookieCartId && state.cartId !== cookieCartId) {
          return {
            wishlistItems: state.wishlistItems,
            isAnnouncementOpen: state.isAnnouncementOpen,
          };
        }
        
        return {
          cart: state.cart,
          cartId: state.cartId,
          wishlistItems: state.wishlistItems,
          isAnnouncementOpen: state.isAnnouncementOpen,
        };
      },
    }
  )
);
