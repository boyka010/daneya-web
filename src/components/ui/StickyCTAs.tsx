'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ShoppingBag } from 'lucide-react';
import { useStore as useShopifyStore } from '@/store/shopifyStore';

export default function StickyCTAs() {
  const [mounted, setMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const cartCount = useShopifyStore((s) => s.getCartCount());

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-4 z-40 w-10 h-10 bg-[#1C1614] text-white flex items-center justify-center shadow-lg hover:bg-[#C9A97A] transition-colors lg:bottom-8 lg:right-8"
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} strokeWidth={1.5} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mounted && cartCount > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => useShopifyStore.getState().setCartDrawerOpen(true)}
            className="fixed bottom-24 left-4 z-40 flex items-center gap-2 px-4 py-2.5 bg-[#C4748C] text-white shadow-lg hover:bg-[#C9A97A] transition-colors lg:hidden"
          >
            <div className="relative">
              <ShoppingBag size={16} />
              <span suppressHydrationWarning className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-[#1C1614] text-[8px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider">Bag</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}