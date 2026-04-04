'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { parseHash, getPageKey } from '@/lib/router';
import Layout from '@/components/layout/Layout';
import HomePage from '@/views/HomePage';
import ShopPage from '@/views/ShopPage';
import ProductPage from '@/views/ProductPage';
import CartPage from '@/views/CartPage';
import CheckoutPage from '@/views/CheckoutPage';
import WishlistPage from '@/views/WishlistPage';
import AboutPage from '@/views/AboutPage';
import AdminPage from '@/views/AdminPage';
import TestShopify from './test/shopify-test';

function PageRenderer() {
  const currentPage = useStore((s) => s.currentPage);
  const key = getPageKey(currentPage);

  const renderPage = () => {
    switch (currentPage.type) {
      case 'home': return <HomePage />;
      case 'shop': return <ShopPage />;
      case 'product': return <ProductPage productId={currentPage.id} />;
      case 'cart': return <CartPage />;
      case 'checkout': return <CheckoutPage />;
      case 'wishlist': return <WishlistPage />;
      case 'about': return <AboutPage />;
      case 'admin': return <AdminPage />;
      default: return <HomePage />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderPage()}
        {/* TEMP: Shopify Test */}
        <div className="fixed bottom-4 right-4 z-50">
          <TestShopify />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const setCurrentPage = useStore((s) => s.setCurrentPage);

  useEffect(() => {
    const handleHash = () => setCurrentPage(parseHash(window.location.hash));
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setCurrentPage]);

  return (
    <Layout>
      <PageRenderer />
    </Layout>
  );
}
