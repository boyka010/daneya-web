'use client';

import { useStore } from '@/store/useStore';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import CartDrawer from '@/components/cart/CartDrawer';
import ProductQuickView from '@/components/product/ProductQuickView';
import ExitIntentPopup from '@/components/ui/ExitIntentPopup';
import StickyCTAs from '@/components/ui/StickyCTAs';

export default function Layout({ children }: { children: React.ReactNode }) {
  const currentPage = useStore((s) => s.currentPage);

  if (currentPage.type === 'admin') {
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
