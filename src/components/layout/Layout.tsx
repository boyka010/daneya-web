'use client';

import { useStore } from '@/store/useStore';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ProductQuickView from '@/components/product/ProductQuickView';

export default function Layout({ children }: { children: React.ReactNode }) {
  const currentPage = useStore((s) => s.currentPage);

  if (currentPage.type === 'admin') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <ProductQuickView />
    </div>
  );
}
