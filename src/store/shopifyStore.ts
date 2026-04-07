import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/data/products';
import type { PageRoute } from '@/lib/router';

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
  // Cart
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

  // UI
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  isQuickViewOpen: boolean;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isAnnouncementOpen: boolean;
  setAnnouncementOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Wishlist
  wishlistItems: number[];
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;

  // Filters
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;

  // Home Sections
  homeSections: any[];
  setHomeSections: (sections: any[]) => void;
  reorderSections: (activeId: string, overId: string) => void;
  toggleSection: (sectionId: string) => void;
  updateSection: (sectionId: string, updates: any) => void;
  addSection: (type: any) => void;
  deleteSection: (sectionId: string) => void;

  // Site Config
  siteConfig: any;
  updateSiteConfig: (updates: any) => void;

  // Admin
  adminSection: string;
  setAdminSection: (section: string) => void;
  adminProducts: any[];
  setAdminProducts: (products: any[]) => void;
  adminCollections: any[];
  setAdminCollections: (collections: any[]) => void;
  adminOrders: any[];
  setAdminOrders: (orders: any[]) => void;
  adminSettings: any;
  setAdminSettings: (settings: any) => void;

  // Theme
  activeTheme: any;
  setActiveTheme: (theme: any) => void;
}

export const sectionTypeConfig: Record<string, { label: string; description: string; defaultConfig: Record<string, any> }> = {
  hero: { label: 'Hero Banner', description: 'Full-width hero slideshow', defaultConfig: { autoplay: true, interval: 7 } },
  collections: { label: 'Collections', description: 'Shop by collection circles', defaultConfig: { layout: 'circles' } },
  featured_products: { label: 'Featured Products', description: 'Best sellers slider', defaultConfig: { count: 8 } },
  new_arrivals: { label: 'New Arrivals', description: 'Latest products slider', defaultConfig: { count: 8 } },
  banner: { label: 'Promo Banner', description: 'Full-width image banner', defaultConfig: {} },
  testimonials: { label: 'Testimonials', description: 'Customer reviews', defaultConfig: {} },
  newsletter: { label: 'Newsletter', description: 'Email signup', defaultConfig: {} },
  product_grid: { label: 'Product Grid', description: 'Custom product grid', defaultConfig: { count: 8 } },
  instagram_feed: { label: 'Instagram Feed', description: 'Social feed', defaultConfig: {} },
  brand_manifesto: { label: 'Brand Manifesto', description: 'Brand story', defaultConfig: {} },
  custom_html: { label: 'Custom HTML', description: 'Custom content', defaultConfig: { html: '' } },
  size_guide: { label: 'Size Guide', description: 'Size chart image', defaultConfig: {} },
  collection_products: { label: 'Collection Products', description: 'Products from a collection', defaultConfig: { collection: '', count: 8 } },
};

export const defaultSections = [
  { id: 'sec-1', type: 'hero', enabled: true, title: 'Redefine Your Style', config: { autoplay: true, interval: 7 } },
  { id: 'sec-2', type: 'new_arrivals', enabled: true, title: 'New Arrivals', config: { count: 8 } },
  { id: 'sec-3', type: 'featured_products', enabled: true, title: 'Best Sellers', config: { count: 8 } },
  { id: 'sec-4', type: 'collection_products', enabled: true, title: 'Abayas', config: { collection: 'abaya', count: 8 } },
  { id: 'sec-5', type: 'collection_products', enabled: true, title: 'Capes', config: { collection: 'capes', count: 8 } },
  { id: 'sec-6', type: 'collections', enabled: true, title: 'Shop by Collection', config: {} },
  { id: 'sec-7', type: 'size_guide', enabled: true, title: 'Size Guide', config: {} },
];

export const defaultSiteConfig = {
  storeName: 'Daneya',
  colors: { primary: '#1C1614', accent: '#C9A97A', background: '#FAF7F4' },
  typography: { headingFont: 'Playfair Display', bodyFont: 'Inter' },
  announcementEnabled: true,
  announcementText: 'Free shipping on orders over EGP 2,000',
  announcementBgColor: '#1C1614',
  announcementTextColor: '#FFFFFF',
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ── Cart ──
      cart: null,
      cartId: null,
      setCart: (cart) => set({ cart }),
      setCartId: (id) => set({ cartId: id }),

      addToCart: (product, quantity, color, selectedSize, variantId) => {
        const currentCart = get().cart;
        const existingLines = currentCart?.lines || [];
        const existingIndex = existingLines.findIndex(
          (item) => item.product.id === product.id && item.selectedColor === color && item.selectedSize === selectedSize
        );

        let newLines: CartItem[];
        if (existingIndex > -1) {
          newLines = [...existingLines];
          newLines[existingIndex] = { ...newLines[existingIndex], quantity: newLines[existingIndex].quantity + quantity };
        } else {
          newLines = [...existingLines, { product, quantity, selectedColor: color, selectedSize, variantId }];
        }

        const subtotal = newLines.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
        const totalQuantity = newLines.reduce((count, item) => count + item.quantity, 0);

        set({
          cart: {
            id: currentCart?.id || null,
            checkoutUrl: currentCart?.checkoutUrl || '',
            totalQuantity,
            lines: newLines,
            subtotal,
          },
        });
      },

      updateCartItem: (index, quantity) => {
        const currentCart = get().cart;
        if (!currentCart) return;
        const newLines = [...currentCart.lines];
        if (quantity <= 0) {
          newLines.splice(index, 1);
        } else {
          newLines[index] = { ...newLines[index], quantity };
        }
        const subtotal = newLines.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
        const totalQuantity = newLines.reduce((count, item) => count + item.quantity, 0);
        set({ cart: { ...currentCart, lines: newLines, subtotal, totalQuantity } });
      },

      removeFromCart: (index) => {
        const currentCart = get().cart;
        if (!currentCart) return;
        const newLines = currentCart.lines.filter((_, i) => i !== index);
        const subtotal = newLines.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
        const totalQuantity = newLines.reduce((count, item) => count + item.quantity, 0);
        set({ cart: { ...currentCart, lines: newLines, subtotal, totalQuantity } });
      },

      clearCart: () => set({ cart: null }),

      getCartTotal: () => {
        const lines = get().cart?.lines;
        if (!lines) return 0;
        return lines.reduce((total, item) => total + ((item?.product?.price || 0) * (item?.quantity || 0)), 0);
      },

      getCartCount: () => {
        const lines = get().cart?.lines;
        if (!lines) return 0;
        return lines.reduce((count, item) => count + (item?.quantity || 0), 0);
      },

      // ── UI ──
      isCartDrawerOpen: false,
      setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
      isQuickViewOpen: false,
      quickViewProduct: null,
      setQuickViewProduct: (product) => set({ isQuickViewOpen: !!product, quickViewProduct: product }),
      isAnnouncementOpen: true,
      setAnnouncementOpen: (open) => set({ isAnnouncementOpen: open }),
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),

      // ── Wishlist ──
      wishlistItems: [],
      toggleWishlist: (productId) => {
        const items = get().wishlistItems;
        set({ wishlistItems: items.includes(productId) ? items.filter((id) => id !== productId) : [...items, productId] });
      },
      isInWishlist: (productId) => get().wishlistItems.includes(productId),

      // ── Filters ──
      activeCategory: 'all',
      setActiveCategory: (category) => set({ activeCategory: category }),
      sortBy: 'featured',
      setSortBy: (sort) => set({ sortBy: sort }),

      // ── Home Sections ──
      homeSections: defaultSections,
      setHomeSections: (sections) => set({ homeSections: sections }),
      reorderSections: (activeId, overId) => {
        const sections = [...get().homeSections];
        const activeIdx = sections.findIndex((s) => s.id === activeId);
        const overIdx = sections.findIndex((s) => s.id === overId);
        if (activeIdx === -1 || overIdx === -1) return;
        const [moved] = sections.splice(activeIdx, 1);
        sections.splice(overIdx, 0, moved);
        set({ homeSections: sections });
      },
      toggleSection: (sectionId) => {
        set({
          homeSections: get().homeSections.map((s) => (s.id === sectionId ? { ...s, enabled: !s.enabled } : s)),
        });
      },
      updateSection: (sectionId, updates) => {
        set({
          homeSections: get().homeSections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
        });
      },
      addSection: (type) => {
        const config = sectionTypeConfig[type]?.defaultConfig || {};
        const newSection = {
          id: `sec-${Date.now()}`,
          type,
          enabled: true,
          title: sectionTypeConfig[type]?.label || 'New Section',
          config,
        };
        set({ homeSections: [...get().homeSections, newSection] });
      },
      deleteSection: (sectionId) => {
        set({ homeSections: get().homeSections.filter((s) => s.id !== sectionId) });
      },

      // ── Site Config ──
      siteConfig: defaultSiteConfig,
      updateSiteConfig: (updates) => set({ siteConfig: { ...get().siteConfig, ...updates } }),

      // ── Admin ──
      adminSection: 'dashboard',
      setAdminSection: (section) => set({ adminSection: section }),
      adminProducts: [],
      setAdminProducts: (products) => set({ adminProducts: products }),
      adminCollections: [],
      setAdminCollections: (collections) => set({ adminCollections: collections }),
      adminOrders: [],
      setAdminOrders: (orders) => set({ adminOrders: orders }),
      adminSettings: {},
      setAdminSettings: (settings) => set({ adminSettings: settings }),

      // ── Theme ──
      activeTheme: { name: 'Default' },
      setActiveTheme: (theme) => set({ activeTheme: theme }),
    }),
    {
      name: 'daneya-store-v14',
      partialize: (state) => ({
        cart: state.cart,
        cartId: state.cartId,
        wishlistItems: state.wishlistItems,
        isAnnouncementOpen: state.isAnnouncementOpen,
        homeSections: state.homeSections,
        activeTheme: state.activeTheme,
        adminProducts: state.adminProducts,
        adminCollections: state.adminCollections,
        adminOrders: state.adminOrders,
        adminSettings: state.adminSettings,
        siteConfig: state.siteConfig,
      }),
    }
  )
);
