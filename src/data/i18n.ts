export interface Translations {
  [key: string]: string;
}

export interface Language {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
  translations: Translations;
}

const en: Translations = {
  // Nav
  'nav.shop': 'Shop',
  'nav.new': 'New Arrivals',
  'nav.about': 'About',
  'nav.wishlist': 'Wishlist',
  'nav.bag': 'Bag',
  'nav.search': 'Search',
  'nav.account': 'Account',

  // Home
  'home.hero.title': 'Redefine Your Style',
  'home.hero.subtitle': 'Premium modest fashion crafted for the modern woman',
  'home.hero.cta': 'Shop Now',
  'home.collections.title': 'Shop by Collection',
  'home.collections.subtitle': 'Curated collections for every occasion',
  'home.bestsellers.title': 'Best Sellers',
  'home.bestsellers.subtitle': 'Most loved by our community',
  'home.new.title': 'New Arrivals',
  'home.new.subtitle': 'Fresh drops you need to see',
  'home.testimonials.title': 'What Our Customers Say',
  'home.newsletter.title': 'Join the DANEYA Family',
  'home.newsletter.subtitle': 'Get 15% off your first order + early access to new drops',
  'home.newsletter.placeholder': 'Enter your email',
  'home.newsletter.button': 'Subscribe',
  'home.free_shipping': 'Free Shipping on Orders Over $75',

  // Shop
  'shop.title': 'All Products',
  'shop.filter': 'Filter',
  'shop.sort': 'Sort By',
  'shop.no_results': 'No products found',
  'shop.featured': 'Featured',
  'shop.newest': 'Newest',
  'shop.price_low': 'Price: Low to High',
  'shop.price_high': 'Price: High to Low',
  'shop.all': 'All',
  'shop.add_to_bag': 'Add to Bag',
  'shop.quick_view': 'Quick View',

  // Product
  'product.add_to_bag': 'Add to Bag',
  'product.wishlist': 'Add to Wishlist',
  'product.wishlisted': 'Saved to Wishlist',
  'product.color': 'Color',
  'product.size': 'Size',
  'product.quantity': 'Quantity',
  'product.details': 'Details',
  'product.shipping': 'Shipping',
  'product.returns': 'Returns',
  'product.free_shipping': 'Free Shipping on Orders Over $75',
  'product.returns_30': '7-Day Returns',
  'product.secure': 'Secure Checkout',

  // Cart
  'cart.title': 'Your Bag',
  'cart.empty': 'Your bag is empty',
  'cart.subtotal': 'Subtotal',
  'cart.shipping': 'Shipping',
  'cart.total': 'Total',
  'cart.checkout': 'Checkout',
  'cart.continue_shopping': 'Continue Shopping',
  'cart.free_shipping': 'Add {amount} more for free shipping',
  'cart.free_shipping_achieved': 'You earned free shipping!',
  'cart.secure_checkout': 'Secure checkout',

  // Checkout
  'checkout.title': 'Checkout',
  'checkout.contact': 'Contact Information',
  'checkout.shipping_address': 'Shipping Address',
  'checkout.shipping_method': 'Shipping Method',
  'checkout.payment': 'Payment Method',
  'checkout.card': 'Credit / Debit Card',
  'checkout.cod': 'Cash on Delivery',
  'checkout.wallet': 'Apple Pay / Google Pay',
  'checkout.place_order': 'Place Order',
  'checkout.order_summary': 'Order Summary',
  'checkout.discount_code': 'Discount code',
  'checkout.apply': 'Apply',
  'checkout.back': 'Back to Bag',
  'checkout.confirmed': 'Order Confirmed!',
  'checkout.confirmed_msg': 'Thank you for your order',
  'checkout.continue': 'Continue Shopping',
  'checkout.secure': 'Your information is encrypted and secure',
  'checkout.standard': 'Standard Shipping',
  'checkout.express': 'Express Shipping',
  'checkout.free': 'Free',
  'checkout.card_details': 'Card Details',
  'checkout.card_number': 'Card Number',
  'checkout.expiry': 'Expiry Date',
  'checkout.cvv': 'CVV',
  'checkout.name_on_card': 'Name on Card',
  'checkout.cod_message': 'Pay with cash when your order is delivered to your doorstep.',
  'checkout.wallet_message': "You'll be redirected to Apple Pay or Google Pay to complete your purchase.",

  // Wishlist
  'wishlist.title': 'Wishlist',
  'wishlist.empty': 'Your wishlist is empty',
  'wishlist.explore': 'Explore Collection',

  // About
  'about.hero_title': 'The Art of Quiet Elegance',
  'about.founded': 'Founded 2022',
  'about.story_title': 'Where Modesty Meets Modernity',
  'about.values_title': 'Our Values',
  'about.countries': 'Countries',
  'about.customers': 'Customers',
  'about.premium': 'Premium',

  // Footer
  'footer.shop': 'Shop',
  'footer.support': 'Support',
  'footer.company': 'Company',
  'footer.connect': 'Connect',
  'footer.rights': '© 2025 DANEYA. All rights reserved.',
};

const ar: Translations = {
  'nav.shop': 'تسوق',
  'nav.new': 'وصل حديثاً',
  'nav.about': 'عن المتجر',
  'nav.wishlist': 'المفضلة',
  'nav.bag': 'الحقيبة',
  'nav.search': 'بحث',
  'nav.account': 'حسابي',
  'home.hero.title': 'أعيدي تعريف أسلوبك',
  'home.hero.subtitle': 'أزياء محتشمة فاخرة مصممة للمرأة العصرية',
  'home.hero.cta': 'تسوقي الآن',
  'home.collections.title': 'تسوقي حسب المجموعة',
  'home.collections.subtitle': 'مجموعات منتقاة لكل مناسبة',
  'home.bestsellers.title': 'الأكثر مبيعاً',
  'home.bestsellers.subtitle': 'الأكثر حباً في مجتمعنا',
  'home.new.title': 'وصل حديثاً',
  'home.new.subtitle': 'منتجات جديدة يجب أن تراها',
  'home.testimonials.title': 'ماذا تقول عملاؤنا',
  'home.newsletter.title': 'انضمي لعائلة هيا',
  'home.newsletter.subtitle': 'احصلي على خصم 15% على طلبك الأول',
  'home.newsletter.placeholder': 'أدخل بريدك الإلكتروني',
  'home.newsletter.button': 'اشتركي',
  'home.free_shipping': 'توصيل مجاني للطلبات فوق 75$',
  'shop.title': 'جميع المنتجات',
  'shop.add_to_bag': 'أضيفي للحقيبة',
  'product.add_to_bag': 'أضيفي للحقيبة',
  'product.wishlist': 'أضيفي للمفضلة',
  'cart.title': 'حقيبتك',
  'cart.checkout': 'الدفع',
  'checkout.title': 'الدفع',
  'checkout.place_order': 'تأكيد الطلب',
  'checkout.cod': 'الدفع عند الاستلام',
  'footer.rights': '© 2025 هيا. جميع الحقوق محفوظة.',
};

export const languages: Language[] = [
  { code: 'en', name: 'English', direction: 'ltr', translations: en },
  { code: 'ar', name: 'العربية', direction: 'rtl', translations: ar },
];

export function t(key: string, lang: string = 'en'): string {
  const language = languages.find((l) => l.code === lang);
  if (!language) return key;
  return language.translations[key] || key;
}
