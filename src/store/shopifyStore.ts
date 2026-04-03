import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/data/products';
import type { PageRoute } from '@/lib/router';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  variantId?: string;
}

export interface ShopifyCart {
  id: string;
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
  addToCart: (product: Product, quantity: number, color: string, variantId?: string) => void;
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
      
      addToCart: (product, quantity, selectedColor, variantId) => {
        const items = get().cart?.lines || [];
        const existingIndex = items.findIndex(
          (item) => item.product.id === product.id && item.selectedColor === selectedColor
        );
        
        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += quantity;
          set({ cart: { ...get().cart!, lines: updated, subtotal: get().getCartTotal() } });
        } else {
          set({
            cart: {
              ...get().cart!,
              lines: [...items, { product, quantity, selectedColor, variantId }],
              subtotal: get().getCartTotal(),
              totalQuantity: (get().cart?.totalQuantity || 0) + quantity,
            },
          });
        }
      },

      updateCartItem: (index, quantity) => {
        const items = [...(get().cart?.lines || [])];
        items[index].quantity = quantity;
        set({ cart: { ...get().cart!, lines: items, subtotal: get().getCartTotal() } });
      },

      removeFromCart: (index) => {
        const items = (get().cart?.lines || []).filter((_, i) => i !== index);
        set({ cart: { ...get().cart!, lines: items, subtotal: get().getCartTotal() } });
      },

      clearCart: () => set({ cart: null, cartId: null }),
      
      getCartTotal: () => {
        const items = get().cart?.lines || [];
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
      
      getCartCount: () => {
        const items = get().cart?.lines || [];
        return items.reduce((count, item) => count + item.quantity, 0);
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
      partialize: (state) => ({
        cart: state.cart,
        cartId: state.cartId,
        wishlistItems: state.wishlistItems,
        isAnnouncementOpen: state.isAnnouncementOpen,
      }),
    }
  )
);
