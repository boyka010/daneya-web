'use client';

import { useEffect, useState, useRef } from 'react';
import { Search, Heart, ShoppingBag, X, Menu, Instagram, Facebook, Globe, ChevronDown } from 'lucide-react';
import { navigate } from '@/lib/router';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { searchProducts } from '@/data/products';
import { Button } from '@/components/ui/button';

interface NavLink {
  label: string;
  labelAr: string;
  href?: string;
  children?: { label: string; labelAr: string; href: string; image?: string }[];
}

// Helper to extract category from href
function getCategoryFromHref(href?: string): string | undefined {
  if (!href || href === '/shop') return undefined;
  const parts = href.split('/');
  return parts[parts.length - 1] || undefined;
}

const navLinks: NavLink[] = [
  { 
    label: 'Shop All', 
    labelAr: 'تسوقي كل المنتجات',
    children: [
      { label: 'New Arrivals', labelAr: 'وصل حديثاً', href: '/shop', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop' },
      { label: 'Best Sellers', labelAr: 'الأكثر مبيعاً', href: '/shop', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop' },
      { label: 'Sale', labelAr: 'تخفيضات', href: '/shop', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop' },
    ]
  },
  { 
    label: 'Abayas', 
    labelAr: 'عبايات',
    children: [
      { label: 'All Abayas', labelAr: 'كل العبايات', href: '/shop/abayas' },
    ]
  },
  { 
    label: 'Sets', 
    labelAr: 'اطقم',
    children: [
      { label: 'All Sets', labelAr: 'كل الاطقم', href: '/shop/sets' },
    ]
  },
  { 
    label: 'Capes', 
    labelAr: 'أردية',
    children: [
      { label: 'All Capes', labelAr: 'كل الأردية', href: '/shop/capes' },
    ]
  },
  { label: 'About', labelAr: 'عن المتجر', href: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchProducts>>([]);
  const [showResults, setShowResults] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [locale, setLocale] = useState<'en' | 'ar'>('en');
  const megaMenuRef = useRef<HTMLDivElement>(null);

  const isMobileMenuOpen = useStore((s) => s.isMobileMenuOpen);
  const setMobileMenuOpen = useStore((s) => s.setMobileMenuOpen);
  const isSearchOpen = useStore((s) => s.isSearchOpen);
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const isAnnouncementOpen = useStore((s) => s.isAnnouncementOpen);
  const setAnnouncementOpen = useStore((s) => s.setAnnouncementOpen);
  const cartCount = useStore((s) => s.cartItems.reduce((c, i) => c + i.quantity, 0));
  const wishCount = useStore((s) => s.wishlistItems.length);
  const setCartDrawerOpen = useStore((s) => s.setCartDrawerOpen);
  const currentPage = useStore((s) => s.currentPage);
  const isHomePage = currentPage.type === 'home';

  const isRTL = locale === 'ar';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen, isRTL]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setActiveMegaMenu(null);
      }
    };
    if (activeMegaMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMegaMenu]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setSearchResults(searchProducts(searchQuery).slice(0, 6));
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'nav.shop': { en: 'Shop', ar: 'تسوقي' },
      'nav.new': { en: 'New Arrivals', ar: 'وصل حديثاً' },
      'nav.about': { en: 'About', ar: 'عن المتجر' },
      'search.placeholder': { en: 'Search our collection...', ar: 'ابحثي في مجموعتنا...' },
    };
    return translations[key]?.[locale] || key;
  };

  return (
    <>
      {/* ── Announcement Bar ── */}
      <AnimatePresence>
        {isAnnouncementOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 36, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#1C1614] overflow-hidden relative z-[60]"
          >
            <div className="h-9 flex items-center justify-center px-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/90 text-center">
                {locale === 'en' 
                  ? 'Free Shipping on Orders Over EGP 2,000  |  Buy 1 Get 1 on Selected Items'
                  : 'توصيل مجاني للطلبات فوق 2000 جنيه  |  اشتري 1 واحصلي على 1 مجاناً'}
              </p>
              <button
                onClick={() => setAnnouncementOpen(false)}
                className={cn(
                  isRTL ? 'left-4' : 'right-4',
                  'absolute top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors'
                )}
                aria-label="Close announcement"
              >
                <X size={12} strokeWidth={2} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Navbar ── */}
      <header
        className={cn(
          'sticky top-0 inset-x-0 z-50 transition-all duration-500',
          scrolled || !isHomePage
            ? 'bg-[#FAF7F4]/95 glass border-b border-[#E8E4DF]'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <nav className="flex items-center justify-between h-16 sm:h-[72px] px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
          {/* Left — Social Icons + Hamburger */}
          <div className="flex items-center gap-4">
            {/* Social icons — hidden on mobile */}
            <div className="hidden lg:flex items-center gap-3">
              <a href="#" className="text-[#1C1614]/50 hover:text-[#8B6F47] transition-colors duration-300" aria-label="Instagram">
                <Instagram size={14} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-[#1C1614]/50 hover:text-[#8B6F47] transition-colors duration-300" aria-label="Facebook">
                <Facebook size={14} strokeWidth={1.5} />
              </a>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 -ml-1.5 text-[#1C1614] hover:text-[#8B6F47] transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>

            {/* Desktop nav links with Mega Menu */}
            <div 
              className={cn(
                'hidden lg:flex items-center gap-7 transition-all duration-500',
                isHomePage && !scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
              )}
              ref={megaMenuRef}
            >
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.children ? (
                    <button
                      onClick={() => setActiveMegaMenu(activeMegaMenu === link.label ? null : link.label)}
                      onMouseEnter={() => setActiveMegaMenu(link.label)}
                      className={cn(
                        'nav-link flex items-center gap-1 text-[#1C1614]',
                        activeMegaMenu === link.label && 'active'
                      )}
                    >
                      {locale === 'ar' ? link.labelAr : link.label}
                      <ChevronDown 
                        size={12} 
                        strokeWidth={1.5}
                        className={cn(
                          'transition-transform duration-200',
                          activeMegaMenu === link.label && 'rotate-180'
                        )}
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate({ type: link.href?.includes('about') ? 'about' : 'shop' });
                      }}
                      className="nav-link text-[#1C1614]"
                    >
                      {locale === 'ar' ? link.labelAr : link.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Center — Logo */}
          <button
            onClick={() => navigate({ type: 'home' })}
            className="absolute left-1/2 -translate-x-1/2 font-serif-heading text-[1.65rem] sm:text-[1.85rem] font-normal tracking-[0.08em] text-[#1C1614] hover:text-[#8B6F47] transition-colors duration-300"
          >
            DANEYA
          </button>

          {/* Right — Icons */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Language Toggle */}
            <button
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              className="hidden sm:flex items-center gap-1 p-2 text-[#1C1614] hover:text-[#8B6F47] transition-colors duration-300"
              aria-label="Change language"
            >
              <Globe size={16} strokeWidth={1.5} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{locale}</span>
            </button>

            <button
              onClick={() => setSearchOpen(!isSearchOpen)}
              className={cn(
                'relative p-2 transition-colors duration-300',
                scrolled || !isHomePage
                  ? 'text-[#1C1614] hover:text-[#8B6F47]'
                  : 'text-[#1C1614] hover:text-[#8B6F47]'
              )}
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => navigate({ type: 'wishlist' })}
              className="relative p-2 text-[#1C1614] hover:text-[#8B6F47] transition-colors duration-300"
              aria-label="Wishlist"
            >
              <Heart size={18} strokeWidth={1.5} />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[8px] bg-[#8B6F47] text-white font-medium font-sans">
                  {wishCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 text-[#1C1614] hover:text-[#8B6F47] transition-colors duration-300"
              aria-label="Bag"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[8px] bg-[#8B6F47] text-white font-medium font-sans">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* ── Search Bar ── */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-[#E8E4DF] bg-[#FAF7F4]"
            >
              <div className="max-w-xl mx-auto px-4 py-5 relative">
                <div className="relative">
                  <Search size={16} className={cn(
                    'absolute top-1/2 -translate-y-1/2 text-[#6B6560]',
                    isRTL ? 'right-0' : 'left-0'
                  )} strokeWidth={1.5} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('search.placeholder')}
                    className={cn(
                      'w-full py-2.5 bg-transparent text-sm font-light text-[#1C1614] placeholder:text-[#6B6560] border-b border-[#E8E4DF] focus:border-[#8B6F47] transition-colors',
                      isRTL ? 'pr-6 pl-10' : 'pl-6 pr-10'
                    )}
                    autoFocus
                  />
                  <button
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); setShowResults(false); }}
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 text-[#6B6560] hover:text-[#1C1614] transition-colors',
                      isRTL ? 'left-0' : 'right-0'
                    )}
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>

                {/* Search results */}
                {showResults && searchResults.length > 0 && (
                  <div className="mt-4 border-t border-[#E8E4DF] pt-4 max-h-80 overflow-y-auto custom-scroll">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                          setShowResults(false);
                          navigate({ type: 'product', id: product.id });
                        }}
                        className="flex items-center gap-4 w-full py-2.5 hover:bg-[#F5F2EE] transition-colors text-left"
                      >
                        <div className="w-12 h-16 bg-[#F5F2EE] flex-shrink-0 flex items-center justify-center">
                          <span className="text-[8px] text-[#6B6560] font-sans uppercase tracking-wider">IMG</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif-heading text-sm font-medium text-[#1C1614] truncate">{product.name}</p>
                          <p className="text-xs text-[#6B6560] mt-0.5 font-light">EGP {product.price.toLocaleString()}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mega Menu Dropdown ── */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block absolute top-full left-0 right-0 bg-[#FAF7F4] border-b border-[#E8E4DF] shadow-lg"
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <div className="max-w-[1440px] mx-auto px-10 py-8">
                {(() => {
                  const link = navLinks.find(l => l.label === activeMegaMenu);
                  if (!link?.children) return null;
                  return (
                    <div className="grid grid-cols-4 gap-6">
                      {link.children.map((child, i) => (
                        <div key={child.label} className={cn(i === 0 && link.children?.length === 3 && 'col-span-1')}>
                          {child.image && (
                            <div className="mb-4 aspect-[4/5] overflow-hidden bg-[#F5F2EE]">
                              <img 
                                src={child.image} 
                                alt={child.label}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                              />
                            </div>
                          )}
                          <button
                            onClick={() => {
                              setActiveMegaMenu(null);
                              const category = getCategoryFromHref(child.href);
                              navigate({ type: 'shop', category });
                            }}
                            className="text-sm font-medium text-[#1C1614] hover:text-[#8B6F47] transition-colors"
                          >
                            {locale === 'ar' ? child.labelAr : child.label}
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[#FAF7F4] flex flex-col"
          >
            <div className={cn(
              'flex items-center justify-between px-5 h-16 border-b border-[#E8E4DF]',
              isRTL ? 'flex-row-reverse' : ''
            )}>
              <span className="font-serif-heading text-xl tracking-[0.08em] text-[#1C1614]">DANEYA</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#6B6560] hover:text-[#1C1614] transition-colors"
                aria-label="Close menu"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center gap-6 px-8">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate({ type: link.href?.includes('about') ? 'about' : 'shop' });
                  }}
                  className="font-serif-heading text-2xl sm:text-3xl font-normal tracking-wide text-[#1C1614] hover:text-[#8B6F47] transition-colors duration-300"
                >
                  {locale === 'ar' ? link.labelAr : link.label}
                </motion.button>
              ))}
            </div>
            <div className={cn(
              'flex items-center justify-center gap-8 pb-10 border-t border-[#E8E4DF] pt-6 mx-8',
              isRTL ? 'flex-row-reverse' : ''
            )}>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate({ type: 'wishlist' }); }}
                className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#6B6560] hover:text-[#1C1614] transition-colors"
              >
                {locale === 'ar' ? `المفضلة (${wishCount})` : `Wishlist (${wishCount})`}
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); setCartDrawerOpen(true); }}
                className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#6B6560] hover:text-[#1C1614] transition-colors"
              >
                {locale === 'ar' ? `الحقيبة (${cartCount})` : `Bag (${cartCount})`}
              </button>
            </div>
            <div className="flex items-center justify-center gap-5 pb-8">
              <a href="#" className="text-[#6B6560] hover:text-[#8B6F47] transition-colors" aria-label="Instagram">
                <Instagram size={16} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-[#6B6560] hover:text-[#8B6F47] transition-colors" aria-label="Facebook">
                <Facebook size={16} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
