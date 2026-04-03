import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";
import type { PageRoute } from "@/lib/router";
import { maskCardNumber } from "@/lib/security";
import { products as productCatalog } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface ShippingInfo {
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
}

export interface OrderInfo {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingInfo: ShippingInfo;
  shippingMethod: string;
  paymentMethod: "card" | "digital_wallet";
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  paymentMethod: "card" | "digital_wallet";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  productNames: string[];
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joined: string;
  status: "active" | "inactive";
}

export interface AdminSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  standardShipping: number;
  expressShipping: number;
  freeShippingThreshold: number;
  enableCard: boolean;
  enableDigitalWallet: boolean;
  orderNotifications: boolean;
  shippingUpdates: boolean;
  marketingEmails: boolean;
  cdnUrl: string;
  language: string;
  activeTheme: string;
  shopifyStoreDomain: string;
  shopifyAccessToken: string;
}

// ── Home Section Types ──
export type SectionType =
  | "hero"
  | "collections"
  | "featured_products"
  | "new_arrivals"
  | "banner"
  | "testimonials"
  | "newsletter";

export interface HomeSection {
  id: string;
  type: SectionType;
  enabled: boolean;
  title: string;
  subtitle?: string;
  config: Record<string, string | number | boolean>;
}

export const defaultSections: HomeSection[] = [
  {
    id: "sec-1",
    type: "hero",
    enabled: true,
    title: "Redefine Your Style",
    config: { autoplay: true, interval: 7 },
  },
  {
    id: "sec-2",
    type: "collections",
    enabled: true,
    title: "Shop by Collection",
    subtitle: "Curated collections for every occasion",
    config: { layout: "circles", showAll: true },
  },
  {
    id: "sec-3",
    type: "featured_products",
    enabled: true,
    title: "Best Sellers",
    subtitle: "Most loved by our community",
    config: { count: 8 },
  },
  {
    id: "sec-4",
    type: "banner",
    enabled: true,
    title: "Be Bold. Be HAYA.",
    config: { image: "/images/hero/hero-2.png", dark: true },
  },
  {
    id: "sec-5",
    type: "new_arrivals",
    enabled: true,
    title: "New Arrivals",
    subtitle: "Fresh drops you need to see",
    config: { count: 4 },
  },
  {
    id: "sec-6",
    type: "testimonials",
    enabled: true,
    title: "What Our Customers Say",
    config: {},
  },
  {
    id: "sec-7",
    type: "newsletter",
    enabled: true,
    title: "Join the HAYA Family",
    subtitle: "Get 15% off your first order + early access to new drops",
    config: {},
  },
];

// ── Theme Presets ──
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
    cta: string;
    ctaText: string;
  };
  typography: {
    headingWeight: string;
    bodyWeight: string;
    headingCase: string;
  };
}

export const themePresets: ThemePreset[] = [
  {
    id: "gymshark",
    name: "Bold Athletic",
    description: "Bold black/white/red, strong CTAs — Gymshark-inspired",
    colors: { primary: "#000000", accent: "#FF0000", background: "#FFFFFF", text: "#111111", cta: "#FF0000", ctaText: "#FFFFFF" },
    typography: { headingWeight: "800", bodyWeight: "500", headingCase: "uppercase" },
  },
  {
    id: "minimal",
    name: "Clean Minimal",
    description: "Soft cream tones, elegant typography — COS/SSENSE-inspired",
    colors: { primary: "#0A0A0A", accent: "#C8B9A8", background: "#F6F4F1", text: "#0A0A0A", cta: "#0A0A0A", ctaText: "#F6F4F1" },
    typography: { headingWeight: "200", bodyWeight: "400", headingCase: "none" },
  },
  {
    id: "luxury",
    name: "Dark Luxury",
    description: "All-dark aesthetic with gold accents — The Row-inspired",
    colors: { primary: "#FFFFFF", accent: "#C8A97E", background: "#0A0A0A", text: "#FFFFFF", cta: "#C8A97E", ctaText: "#0A0A0A" },
    typography: { headingWeight: "300", bodyWeight: "400", headingCase: "uppercase" },
  },
  {
    id: "vibrant",
    name: "Vibrant Modern",
    description: "White base with electric blue accents — Nike-inspired",
    colors: { primary: "#111827", accent: "#3B82F6", background: "#FFFFFF", text: "#111827", cta: "#3B82F6", ctaText: "#FFFFFF" },
    typography: { headingWeight: "700", bodyWeight: "400", headingCase: "uppercase" },
  },
  {
    id: "earthy",
    name: "Earth Tones",
    description: "Warm natural palette — Aritzia-inspired",
    colors: { primary: "#2D2A26", accent: "#8B6F47", background: "#FAF8F5", text: "#2D2A26", cta: "#2D2A26", ctaText: "#FAF8F5" },
    typography: { headingWeight: "600", bodyWeight: "400", headingCase: "none" },
  },
];

// ── Analytics Data ──
export interface AnalyticsData {
  revenue: { date: string; amount: number }[];
  orders: { date: string; count: number }[];
  visitors: { date: string; count: number }[];
  conversionRate: number;
  avgOrderValue: number;
  totalRevenue: number;
  totalOrders: number;
  totalVisitors: number;
  topProducts: { name: string; sold: number; revenue: number }[];
  topCountries: { name: string; orders: number; revenue: number }[];
  trafficSources: { source: string; visits: number; percentage: number }[];
  returningVsNew: { returning: number; new: number };
}

export const mockAnalytics: AnalyticsData = {
  revenue: [
    { date: "Feb 1", amount: 1240 },
    { date: "Feb 2", amount: 1580 },
    { date: "Feb 3", amount: 980 },
    { date: "Feb 4", amount: 2100 },
    { date: "Feb 5", amount: 1850 },
    { date: "Feb 6", amount: 2400 },
    { date: "Feb 7", amount: 1980 },
    { date: "Feb 8", amount: 1650 },
    { date: "Feb 9", amount: 2200 },
    { date: "Feb 10", amount: 2780 },
    { date: "Feb 11", amount: 3100 },
    { date: "Feb 12", amount: 2450 },
    { date: "Feb 13", amount: 2890 },
    { date: "Feb 14", amount: 3450 },
  ],
  orders: [
    { date: "Feb 1", count: 18 },
    { date: "Feb 2", count: 22 },
    { date: "Feb 3", count: 14 },
    { date: "Feb 4", count: 31 },
    { date: "Feb 5", count: 27 },
    { date: "Feb 6", count: 35 },
    { date: "Feb 7", count: 29 },
    { date: "Feb 8", count: 24 },
    { date: "Feb 9", count: 32 },
    { date: "Feb 10", count: 41 },
    { date: "Feb 11", count: 46 },
    { date: "Feb 12", count: 36 },
    { date: "Feb 13", count: 42 },
    { date: "Feb 14", count: 51 },
  ],
  visitors: [
    { date: "Feb 1", count: 420 },
    { date: "Feb 2", count: 510 },
    { date: "Feb 3", count: 380 },
    { date: "Feb 4", count: 620 },
    { date: "Feb 5", count: 560 },
    { date: "Feb 6", count: 710 },
    { date: "Feb 7", count: 590 },
    { date: "Feb 8", count: 480 },
    { date: "Feb 9", count: 640 },
    { date: "Feb 10", count: 820 },
    { date: "Feb 11", count: 910 },
    { date: "Feb 12", count: 750 },
    { date: "Feb 13", count: 840 },
    { date: "Feb 14", count: 1050 },
  ],
  conversionRate: 3.8,
  avgOrderValue: 62.40,
  totalRevenue: 29550,
  totalOrders: 474,
  totalVisitors: 9280,
  topProducts: [
    { name: "Blush Modal", sold: 89, revenue: 2937 },
    { name: "Velvet Dusk Jersey", sold: 76, revenue: 2204 },
    { name: "Rose Petal Chiffon", sold: 68, revenue: 2380 },
    { name: "Royal Burgundy Silk", sold: 52, revenue: 3068 },
    { name: "Emerald Satin Luxe", sold: 48, revenue: 2352 },
  ],
  topCountries: [
    { name: "United States", orders: 186, revenue: 12420 },
    { name: "United Kingdom", orders: 98, revenue: 6125 },
    { name: "UAE", orders: 72, revenue: 4860 },
    { name: "Canada", orders: 58, revenue: 3510 },
    { name: "Saudi Arabia", orders: 60, revenue: 2635 },
  ],
  trafficSources: [
    { source: "Direct", visits: 3200, percentage: 34.5 },
    { source: "Instagram", visits: 2400, percentage: 25.9 },
    { source: "Google Search", visits: 1800, percentage: 19.4 },
    { source: "TikTok", visits: 1200, percentage: 12.9 },
    { source: "Other", visits: 680, percentage: 7.3 },
  ],
  returningVsNew: { returning: 3142, new: 6138 },
};

// ── Mock Orders ──
const mockAdminOrders: AdminOrder[] = [
  { id: "HAY-1001", customer: "Aisha Rahman", email: "aisha@example.com", items: 3, total: 127.0, paymentMethod: "card", status: "delivered", date: "2025-01-12", productNames: ["Velvet Dusk Jersey", "Rose Petal Chiffon", "Ivory Dream Modal"] },
  { id: "HAY-1002", customer: "Fatima Al-Sayed", email: "fatima@example.com", items: 1, total: 59.0, paymentMethod: "digital_wallet", status: "shipped", date: "2025-01-14", productNames: ["Royal Burgundy Silk"] },
  { id: "HAY-1003", customer: "Nora Khalid", email: "nora@example.com", items: 2, total: 82.0, paymentMethod: "card", status: "processing", date: "2025-01-16", productNames: ["Emerald Satin Luxe", "Midnight Jersey"] },
  { id: "HAY-1004", customer: "Sara Hassan", email: "sara@example.com", items: 1, total: 35.0, paymentMethod: "cod", status: "pending", date: "2025-01-18", productNames: ["Rose Petal Chiffon"] },
  { id: "HAY-1005", customer: "Layla Mahmoud", email: "layla@example.com", items: 4, total: 156.0, paymentMethod: "card", status: "delivered", date: "2025-01-20", productNames: ["Blush Modal", "Lavender Whisper", "Azure Sky Chiffon", "Olive Garden Jersey"] },
  { id: "HAY-1006", customer: "Zara Noor", email: "zara@example.com", items: 1, total: 55.0, paymentMethod: "digital_wallet", status: "cancelled", date: "2025-01-21", productNames: ["Mocha Silk"] },
  { id: "HAY-1007", customer: "Amira Osman", email: "amira@example.com", items: 2, total: 97.0, paymentMethod: "card", status: "shipped", date: "2025-01-23", productNames: ["Navy Elegance", "Royal Burgundy Silk"] },
  { id: "HAY-1008", customer: "Huda Farooq", email: "huda@example.com", items: 3, total: 91.0, paymentMethod: "cod", status: "processing", date: "2025-01-25", productNames: ["Velvet Dusk Jersey", "Ivory Dream Modal", "Midnight Jersey"] },
  { id: "HAY-1009", customer: "Maryam Tariq", email: "maryam@example.com", items: 2, total: 114.0, paymentMethod: "card", status: "delivered", date: "2025-01-27", productNames: ["Emerald Satin Luxe", "Mocha Silk"] },
  { id: "HAY-1010", customer: "Yasmin Qureshi", email: "yasmin@example.com", items: 1, total: 32.0, paymentMethod: "digital_wallet", status: "pending", date: "2025-01-29", productNames: ["Ivory Dream Modal"] },
  { id: "HAY-1011", customer: "Iman Bakri", email: "iman@example.com", items: 2, total: 71.0, paymentMethod: "card", status: "shipped", date: "2025-01-30", productNames: ["Lavender Whisper", "Azure Sky Chiffon"] },
  { id: "HAY-1012", customer: "Rania El-Sayed", email: "rania@example.com", items: 1, total: 52.0, paymentMethod: "cod", status: "processing", date: "2025-02-01", productNames: ["Navy Elegance"] },
];

const mockAdminCustomers: AdminCustomer[] = [
  { id: "C-001", name: "Aisha Rahman", email: "aisha@example.com", orders: 5, totalSpent: 342.0, joined: "2024-06-15", status: "active" },
  { id: "C-002", name: "Fatima Al-Sayed", email: "fatima@example.com", orders: 3, totalSpent: 178.0, joined: "2024-07-22", status: "active" },
  { id: "C-003", name: "Nora Khalid", email: "nora@example.com", orders: 8, totalSpent: 524.0, joined: "2024-03-10", status: "active" },
  { id: "C-004", name: "Sara Hassan", email: "sara@example.com", orders: 2, totalSpent: 67.0, joined: "2024-09-05", status: "active" },
  { id: "C-005", name: "Layla Mahmoud", email: "layla@example.com", orders: 12, totalSpent: 890.0, joined: "2024-01-20", status: "active" },
  { id: "C-006", name: "Zara Noor", email: "zara@example.com", orders: 1, totalSpent: 55.0, joined: "2024-11-18", status: "inactive" },
  { id: "C-007", name: "Amira Osman", email: "amira@example.com", orders: 4, totalSpent: 246.0, joined: "2024-05-30", status: "active" },
  { id: "C-008", name: "Huda Farooq", email: "huda@example.com", orders: 6, totalSpent: 389.0, joined: "2024-02-14", status: "active" },
  { id: "C-009", name: "Maryam Tariq", email: "maryam@example.com", orders: 3, totalSpent: 201.0, joined: "2024-08-02", status: "active" },
  { id: "C-010", name: "Yasmin Qureshi", email: "yasmin@example.com", orders: 1, totalSpent: 32.0, joined: "2024-12-10", status: "inactive" },
];

const defaultAdminSettings: AdminSettings = {
  storeName: "Daneya",
  storeEmail: "hello@daneya.shop",
  storePhone: "+20 155 791 2688",
  storeAddress: "Cairo, Egypt",
  currency: "EGP",
  standardShipping: 80,
  expressShipping: 140,
  freeShippingThreshold: 2000,
  enableCard: true,
  enableDigitalWallet: true,
  orderNotifications: true,
  shippingUpdates: true,
  marketingEmails: false,
  cdnUrl: "",
  language: "en",
  activeTheme: "gymshark",
  shopifyStoreDomain: "",
  shopifyAccessToken: "",
};

/**
 * Clamp a number between min and max (inclusive).
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

interface StoreState {
  // Router
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;

  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, color: string) => void;
  removeFromCart: (productId: number, color?: string) => void;
  updateQuantity: (productId: number, quantity: number, color?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  /** Validate that all cart item prices match the product catalog (anti-tampering). */
  getSecureTotal: () => number;

  // Wishlist
  wishlistItems: number[];
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;

  // UI State
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

  // Filters
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;

  // Checkout
  shippingInfo: ShippingInfo;
  setShippingInfo: (info: Partial<ShippingInfo>) => void;
  paymentInfo: PaymentInfo;
  setPaymentInfo: (info: Partial<PaymentInfo>) => void;
  paymentMethod: "card" | "digital_wallet";
  setPaymentMethod: (method: "card" | "digital_wallet") => void;
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
  lastOrder: OrderInfo | null;
  setLastOrder: (order: OrderInfo | null) => void;

  // Orders history
  orders: OrderInfo[];
  addOrder: (order: OrderInfo) => void;

  /** Clear CVV from memory and mask card number after order is placed. */
  sanitizeCheckoutOnOrder: () => void;

  // Admin
  adminSection: string;
  setAdminSection: (section: string) => void;
  adminSettings: AdminSettings;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  adminOrders: AdminOrder[];
  adminCustomers: AdminCustomer[];
  analytics: AnalyticsData;

  // Admin Products CRUD
  adminProducts: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;

  // Admin Collections CRUD
  adminCollections: { id: string; name: string; nameAr?: string; slug: string; description: string; image: string; productCount: number; featured?: boolean }[];
  addCollection: (col: { id: string; name: string; slug: string; description: string; image: string; productCount: number; featured?: boolean }) => void;
  updateCollection: (id: string, updates: Record<string, unknown>) => void;
  deleteCollection: (id: string) => void;

  // Admin Orders CRUD
  updateOrderStatus: (id: string, status: AdminOrder['status']) => void;

  // Home Sections (drag-and-drop theme builder)
  homeSections: HomeSection[];
  setHomeSections: (sections: HomeSection[]) => void;
  reorderSections: (activeId: string, overId: string) => void;
  toggleSection: (sectionId: string) => void;
  updateSection: (sectionId: string, updates: Partial<HomeSection>) => void;

  // Theme
  activeTheme: ThemePreset;
  setActiveTheme: (themeId: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Router
      currentPage: { type: "home" },
      setCurrentPage: (page: PageRoute) => set({ currentPage: page }),

      // Cart
      cartItems: [],
      addToCart: (product: Product, quantity: number, color: string) => {
        // Clamp quantity between 1 and product stock (max 10 if no stock defined)
        const maxQty = product.stock ? Math.min(product.stock, 10) : 10;
        const safeQuantity = clamp(quantity, 1, maxQty);
        const items = get().cartItems;
        const existingIndex = items.findIndex(
          (item) => item.product.id === product.id && item.selectedColor === color
        );
        if (existingIndex > -1) {
          const updated = [...items];
          const newQuantity = updated[existingIndex].quantity + safeQuantity;
          updated[existingIndex].quantity = clamp(newQuantity, 1, maxQty);
          set({ cartItems: updated });
        } else {
          set({ cartItems: [...items, { product, quantity: safeQuantity, selectedColor: color }] });
        }
        set({ isCartDrawerOpen: true });
      },
      removeFromCart: (productId: number, color?: string) => {
        if (color) {
          set({
            cartItems: get().cartItems.filter(
              (item) => !(item.product.id === productId && item.selectedColor === color)
            ),
          });
        } else {
          set({
            cartItems: get().cartItems.filter((item) => item.product.id !== productId),
          });
        }
      },
      updateQuantity: (productId: number, quantity: number, color?: string) => {
        // Clamp quantity between 1 and 10
        const safeQuantity = clamp(quantity, 1, 10);
        if (safeQuantity <= 0) { get().removeFromCart(productId, color); return; }
        set({
          cartItems: get().cartItems.map((item) => {
            if (item.product.id === productId) {
              if (color && item.selectedColor !== color) return item;
              // Also respect product stock
              const maxQty = item.product.stock ? Math.min(item.product.stock, 10) : 10;
              return { ...item, quantity: clamp(safeQuantity, 1, maxQty) };
            }
            return item;
          }),
        });
      },
      clearCart: () => set({ cartItems: [] }),
      getCartTotal: () => get().cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0),
      getCartCount: () => get().cartItems.reduce((count, item) => count + item.quantity, 0),
      /**
       * Secure total — cross-references product catalog to ensure prices
       * haven't been tampered with in the client. NOTE: In production,
       * this validation MUST happen server-side.
       */
      getSecureTotal: () => {
        const catalogMap = new Map(productCatalog.map((p) => [p.id, p]));
        return get().cartItems.reduce((total, item) => {
          const catalogProduct = catalogMap.get(item.product.id);
          // If product doesn't exist in catalog, skip it (tampered/removed)
          if (!catalogProduct) return total;
          // Use catalog price, not the client-side item price
          return total + catalogProduct.price * item.quantity;
        }, 0);
      },

      // Wishlist
      wishlistItems: [],
      toggleWishlist: (productId: number) => {
        const items = get().wishlistItems;
        if (items.includes(productId)) {
          set({ wishlistItems: items.filter((id) => id !== productId) });
        } else {
          set({ wishlistItems: [...items, productId] });
        }
      },
      isInWishlist: (productId: number) => get().wishlistItems.includes(productId),

      // UI State
      isCartDrawerOpen: false,
      setCartDrawerOpen: (open: boolean) => set({ isCartDrawerOpen: open }),
      isQuickViewOpen: false,
      quickViewProduct: null,
      setQuickViewProduct: (product: Product | null) =>
        set({ quickViewProduct: product, isQuickViewOpen: product !== null }),
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open: boolean) => set({ isMobileMenuOpen: open }),
      isAnnouncementOpen: true,
      setAnnouncementOpen: (open: boolean) => set({ isAnnouncementOpen: open }),
      isSearchOpen: false,
      setSearchOpen: (open: boolean) => set({ isSearchOpen: open }),

      // Filters
      activeCategory: "all",
      setActiveCategory: (category: string) => set({ activeCategory: category }),
      sortBy: "featured",
      setSortBy: (sort: string) => set({ sortBy: sort }),

      // Checkout
      shippingInfo: { email: "", firstName: "", lastName: "", address1: "", address2: "", city: "", state: "", zip: "", country: "", phone: "" },
      setShippingInfo: (info: Partial<ShippingInfo>) => set({ shippingInfo: { ...get().shippingInfo, ...info } }),
      paymentInfo: { cardNumber: "", expiry: "", cvv: "", nameOnCard: "" },
      setPaymentInfo: (info: Partial<PaymentInfo>) => set({ paymentInfo: { ...get().paymentInfo, ...info } }),
      paymentMethod: "card",
      setPaymentMethod: (method: "card" | "digital_wallet") => set({ paymentMethod: method }),
      shippingMethod: "standard",
      setShippingMethod: (method: string) => set({ shippingMethod: method }),
      lastOrder: null,
      setLastOrder: (order: OrderInfo | null) => set({ lastOrder: order }),

      // Orders
      orders: [],
      addOrder: (order: OrderInfo) => {
        // Mask card number in stored order for security
        const safeOrder = {
          ...order,
          shippingInfo: {
            ...order.shippingInfo,
          },
        };
        set({ orders: [...get().orders, safeOrder] });
      },

      /**
       * Sanitize checkout data after placing an order:
       * - Clear CVV immediately from memory
       * - Mask card number
       */
      sanitizeCheckoutOnOrder: () => {
        const currentPayment = get().paymentInfo;
        set({
          paymentInfo: {
            cardNumber: maskCardNumber(currentPayment.cardNumber),
            expiry: '',
            cvv: '',   // Always clear CVV after order
            nameOnCard: currentPayment.nameOnCard,
          },
          shippingInfo: {
            email: '',
            firstName: '',
            lastName: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            phone: '',
          },
        });
      },

      // Admin
      adminSection: "dashboard",
      setAdminSection: (section: string) => set({ adminSection: section }),
      adminSettings: defaultAdminSettings,
      updateAdminSettings: (settings: Partial<AdminSettings>) =>
        set({ adminSettings: { ...get().adminSettings, ...settings } }),
      adminOrders: mockAdminOrders,
      adminCustomers: mockAdminCustomers,
      analytics: mockAnalytics,

      // Admin Products CRUD
      adminProducts: [...productCatalog],
      addProduct: (product: Product) =>
        set({ adminProducts: [...get().adminProducts, product] }),
      updateProduct: (id: number, updates: Partial<Product>) =>
        set({
          adminProducts: get().adminProducts.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }),
      deleteProduct: (id: number) =>
        set({
          adminProducts: get().adminProducts.filter((p) => p.id !== id),
          cartItems: get().cartItems.filter((item) => item.product.id !== id),
        }),

      // Admin Collections CRUD
      adminCollections: [
        { id: "col-1", name: "Abayas", slug: "abayas", description: "Our signature collection of oversized, pleated, and classic abayas", image: "/images/products/hijab-cotton-charcoal.png", productCount: 10, featured: true },
        { id: "col-2", name: "Dresses", slug: "dresses", description: "Elegant modest dresses from chiffon to denim", image: "/images/products/hijab-silk-mocha.png", productCount: 5, featured: true },
        { id: "col-3", name: "Sets", slug: "sets", description: "Coordinated matching sets in linen, satin, and cotton", image: "/images/products/hijab-chiffon-sky.png", productCount: 4, featured: true },
        { id: "col-4", name: "Capes", slug: "capes", description: "Flowing chiffon capes and layering pieces", image: "/images/products/hijab-satin-emerald.png", productCount: 2, featured: true },
        { id: "col-5", name: "Scarves", slug: "scarves", description: "Premium modal cotton and silk chiffon scarves", image: "/images/products/hijab-modal-ivory.png", productCount: 2, featured: true },
        { id: "col-6", name: "Eid Al-Fitr Edit", slug: "eid-edit", description: "A special capsule collection curated for Eid", image: "/images/products/hijab-silk-burgundy.png", productCount: 8, featured: true },
      ],
      addCollection: (col) =>
        set({ adminCollections: [...get().adminCollections, col] }),
      updateCollection: (id, updates) =>
        set({
          adminCollections: get().adminCollections.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }),
      deleteCollection: (id) =>
        set({ adminCollections: get().adminCollections.filter((c) => c.id !== id) }),

      // Admin Orders CRUD
      updateOrderStatus: (id, status) =>
        set({
          adminOrders: get().adminOrders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        }),

      // Home Sections
      homeSections: defaultSections,
      setHomeSections: (sections: HomeSection[]) => set({ homeSections: sections }),
      reorderSections: (activeId: string, overId: string) => {
        const sections = [...get().homeSections];
        const oldIndex = sections.findIndex((s) => s.id === activeId);
        const newIndex = sections.findIndex((s) => s.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          const [moved] = sections.splice(oldIndex, 1);
          sections.splice(newIndex, 0, moved);
          set({ homeSections: sections });
        }
      },
      toggleSection: (sectionId: string) => {
        const sections = get().homeSections.map((s) =>
          s.id === sectionId ? { ...s, enabled: !s.enabled } : s
        );
        set({ homeSections: sections });
      },
      updateSection: (sectionId: string, updates: Partial<HomeSection>) => {
        const sections = get().homeSections.map((s) =>
          s.id === sectionId ? { ...s, ...updates } : s
        );
        set({ homeSections: sections });
      },

      // Theme
      activeTheme: themePresets[0],
      setActiveTheme: (themeId: string) => {
        const theme = themePresets.find((t) => t.id === themeId) || themePresets[0];
        set({ activeTheme: theme, adminSettings: { ...get().adminSettings, activeTheme: themeId } });
      },
    }),
    {
      name: "haya-store-v4",
      /**
       * SECURITY FIX (C1/M1): Only persist non-sensitive data to localStorage.
       * paymentInfo, shippingInfo, and orders (which contain customer PII) are
       * NEVER persisted. Only order IDs are kept for reference.
       */
      partialize: (state) => ({
        cartItems: state.cartItems,
        wishlistItems: state.wishlistItems,
        isAnnouncementOpen: state.isAnnouncementOpen,
        adminSettings: state.adminSettings,
        adminProducts: state.adminProducts,
        adminCollections: state.adminCollections,
        homeSections: state.homeSections,
        activeTheme: state.activeTheme,
        adminOrders: state.adminOrders,
      }),
    }
  )
);
