'use client';

import { useStore } from '@/store/useStore';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import CartDrawer from '@/components/cart/CartDrawer';
import ProductQuickView from '@/components/product/ProductQuickView';

export default function Layout({ children }: { children: React.ReactNode }) {
  const currentPage = useStore((s) => s.currentPage);
  const isSearchOpen = useStore((s) => s.isSearchOpen);
  const setSearchOpen = useStore((s) => s.setSearchOpen);

  if (currentPage.type === 'admin') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <Footer />
      <BottomNav />
      <CartDrawer />
      <ProductQuickView />
    </div>
  );
}
