'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import CartDrawer from '@/components/cart/CartDrawer';
import ProductQuickView from '@/components/product/ProductQuickView';
import ExitIntentPopup from '@/components/ui/ExitIntentPopup';
import StickyCTAs from '@/components/ui/StickyCTAs';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname?.startsWith('/admin');

  // Handle popstate events from browser back/forward and hash changes
  useEffect(() => {
    const handleNavigation = () => {
      const hash = window.location.hash;
      if (hash) {
        window.location.reload();
      } else {
        router.refresh();
      }
    };
    
    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);
    
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, [router]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F4]">
      <Navbar />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <Footer />
      <BottomNav />
      <CartDrawer />
      <ProductQuickView />
      <ExitIntentPopup />
      <StickyCTAs />
    </div>
  );
}
