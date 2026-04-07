'use client';

import { useState, useEffect } from 'react';
import { Home, Search, Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from '@/hooks/useNavigate';
import { useStore } from '@/store/useStore';
import { useStore as useShopifyStore } from '@/store/shopifyStore';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const cartCount = useShopifyStore((s) => s.getCartCount());
  const wishCount = useStore((s) => s.wishlistItems.length);
  const setCartDrawerOpen = useShopifyStore((s) => s.setCartDrawerOpen);
  const setSearchOpen = useStore((s) => s.setSearchOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBagClick = () => {
    setCartDrawerOpen(true);
  };

  const navItems = [
    { icon: Home, label: 'Home', action: () => navigate({ type: 'home' }) },
    { icon: Search, label: 'Search', action: () => setSearchOpen(true) },
    { icon: Heart, label: 'Wishlist', action: () => navigate({ type: 'wishlist' }, true), count: mounted ? wishCount : 0 },
    { icon: ShoppingBag, label: 'Bag', action: handleBagClick, count: mounted ? cartCount : 0 },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-[#FAF7F4] border-t border-[#E8E4DF] safe-area-bottom"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="relative flex flex-col items-center justify-center w-16 h-12 min-w-[64px] touch-target"
            aria-label={item.label}
          >
            <item.icon size={20} strokeWidth={1.5} className="text-[#1C1614]" />
            <span className="text-[9px] font-medium uppercase tracking-wider mt-1 text-[#1C1614]">
              {item.label}
            </span>
            {item.count !== undefined && item.count > 0 && (
              <span suppressHydrationWarning className="absolute -top-0.5 right-6 w-4 h-4 flex items-center justify-center text-[8px] bg-[#C4748C] text-white font-medium rounded-full">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </motion.nav>
  );
}