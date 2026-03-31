'use client';

import { useEffect, useState } from 'react';
import { Search, Heart, ShoppingBag, X, Menu, Instagram, Facebook } from 'lucide-react';
import { navigate } from '@/lib/router';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { searchProducts } from '@/data/products';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchProducts>>([]);
  const [showResults, setShowResults] = useState(false);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setSearchResults(searchProducts(searchQuery).slice(0, 6));
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const navLinks = [
    { label: 'Shop', action: () => { setMobileMenuOpen(false); navigate({ type: 'shop' }); } },
    { label: 'New Arrivals', action: () => { setMobileMenuOpen(false); navigate({ type: 'shop' }); } },
    { label: 'About', action: () => { setMobileMenuOpen(false); navigate({ type: 'about' }); } },
  ];

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
            className="bg-warm-text overflow-hidden relative z-[60]"
          >
            <div className="h-9 flex items-center justify-center px-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/90 text-center">
                Free Shipping on Orders Over EGP 2,000&nbsp;&nbsp;|&nbsp;&nbsp;Buy 1 Get 1 on Selected Items
              </p>
              <button
                onClick={() => setAnnouncementOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
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
            ? 'bg-white/95 glass border-b border-warm-border'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <nav className="flex items-center justify-between h-16 sm:h-[72px] px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
          {/* Left — Social Icons + Hamburger */}
          <div className="flex items-center gap-4">
            {/* Social icons — hidden on mobile */}
            <div className="hidden lg:flex items-center gap-3">
              <a href="#" className="text-warm-text/50 hover:text-camel transition-colors duration-300" aria-label="Instagram">
                <Instagram size={14} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-warm-text/50 hover:text-camel transition-colors duration-300" aria-label="Facebook">
                <Facebook size={14} strokeWidth={1.5} />
              </a>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 -ml-1.5 text-warm-text hover:text-camel transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>

            {/* Desktop nav links */}
            <div className={cn(
              'hidden lg:flex items-center gap-7 transition-all duration-500',
              isHomePage && !scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
            )}>
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="nav-link text-warm-text"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Center — Logo */}
          <button
            onClick={() => navigate({ type: 'home' })}
            className="absolute left-1/2 -translate-x-1/2 font-serif-heading text-[1.65rem] sm:text-[1.85rem] font-normal tracking-[0.08em] text-warm-text hover:text-camel transition-colors duration-300"
          >
            HAYA
          </button>

          {/* Right — Icons */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              onClick={() => setSearchOpen(!isSearchOpen)}
              className={cn(
                'relative p-2 transition-colors duration-300',
                scrolled || !isHomePage
                  ? 'text-warm-text hover:text-camel'
                  : 'text-warm-text hover:text-camel'
              )}
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => navigate({ type: 'wishlist' })}
              className="relative p-2 text-warm-text hover:text-camel transition-colors duration-300"
              aria-label="Wishlist"
            >
              <Heart size={18} strokeWidth={1.5} />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[8px] bg-camel text-white font-medium font-sans">
                  {wishCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 text-warm-text hover:text-camel transition-colors duration-300"
              aria-label="Bag"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[8px] bg-camel text-white font-medium font-sans">
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
              className="overflow-hidden border-t border-warm-border bg-white"
            >
              <div className="max-w-xl mx-auto px-4 py-5 relative">
                <div className="relative">
                  <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search our collection..."
                    className="w-full pl-6 pr-10 py-2.5 bg-transparent text-sm font-light text-warm-text placeholder:text-muted-foreground border-b border-warm-border focus:border-camel transition-colors"
                    autoFocus
                  />
                  <button
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); setShowResults(false); }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-warm-text transition-colors"
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>

                {/* Search results */}
                {showResults && searchResults.length > 0 && (
                  <div className="mt-4 border-t border-warm-border pt-4 max-h-80 overflow-y-auto custom-scroll">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                          setShowResults(false);
                          navigate({ type: 'product', id: product.id });
                        }}
                        className="flex items-center gap-4 w-full py-2.5 hover:bg-secondary/50 transition-colors text-left"
                      >
                        <div className="w-12 h-16 bg-secondary flex-shrink-0 flex items-center justify-center">
                          <span className="text-[8px] text-muted-foreground font-sans uppercase tracking-wider">IMG</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif-heading text-sm font-medium text-warm-text truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 font-light">EGP {product.price.toLocaleString()}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
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
            className="fixed inset-0 z-[60] bg-warm-bg flex flex-col"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-warm-border">
              <span className="font-serif-heading text-xl tracking-[0.08em] text-warm-text">HAYA</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-muted-foreground hover:text-warm-text transition-colors"
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
                  onClick={link.action}
                  className="font-serif-heading text-2xl sm:text-3xl font-normal tracking-wide text-warm-text hover:text-camel transition-colors duration-300"
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
            <div className="flex items-center justify-center gap-8 pb-10 border-t border-warm-border pt-6 mx-8">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate({ type: 'wishlist' }); }}
                className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground hover:text-warm-text transition-colors"
              >
                Wishlist ({wishCount})
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); setCartDrawerOpen(true); }}
                className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground hover:text-warm-text transition-colors"
              >
                Bag ({cartCount})
              </button>
            </div>
            {/* Social links mobile */}
            <div className="flex items-center justify-center gap-5 pb-8">
              <a href="#" className="text-muted-foreground hover:text-camel transition-colors" aria-label="Instagram">
                <Instagram size={16} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-camel transition-colors" aria-label="Facebook">
                <Facebook size={16} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
