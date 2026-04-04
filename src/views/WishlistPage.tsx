'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowLeft, Trash2, Move } from 'lucide-react';
import { navigate } from '@/lib/router';
import { useStore } from '@/store/useStore';
import { useStore as useShopifyStore } from '@/store/shopifyStore';
import { useShopifyCart } from '@/hooks/useShopifyCart';
import ProductCard from '@/components/product/ProductCard';
import SEO from '@/components/SEO';

export default function WishlistPage() {
  const wishlistItems = useStore((s) => s.wishlistItems);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const storeProducts = useStore((s) => s.adminProducts);
  const { addItem } = useShopifyCart();
  const shopifyProducts = useShopifyStore((s) => s.cart);

  const products = shopifyProducts.length > 0 ? [] : storeProducts;

  const wishlisted = useMemo(() => {
    if (products.length > 0) {
      return products.filter((p: any) => wishlistItems.includes(p.id));
    }
    return [];
  }, [wishlistItems, products]);

  const handleAddToCart = (product: any) => {
    const color = product.colors?.[0]?.name || 'Default';
    addItem(product, 1, color, product.variants?.[0]?.id);
  };

  return (
    <>
      <SEO title="My Wishlist | DANEYA" description="Your saved items at DANEYA - Premium Modest Fashion Egypt" />
      <div className="bg-[#FAF7F4] min-h-screen pt-20 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Breadcrumb */}
          <div className="mb-6">
            <button 
              onClick={() => navigate({ type: 'home' })} 
              className="text-[10px] font-medium text-[#6B6560] hover:text-[#1C1614] transition-colors uppercase tracking-wider"
            >
              Home
            </button>
            <span className="text-[10px] text-[#6B6560] mx-2">/</span>
            <span className="text-[10px] font-medium text-[#1C1614] uppercase tracking-wider">Wishlist</span>
          </div>

          {/* Title */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#1C1614]">
                My Wishlist
                {wishlisted.length > 0 && (
                  <span className="ml-3 inline-flex items-center justify-center px-3 py-1 bg-[#C4748C]/10 text-[#C4748C] text-sm font-medium rounded-full align-middle">
                    {wishlisted.length} {wishlisted.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </h1>
            </div>
            {wishlisted.length > 0 && (
              <button
                onClick={() => navigate({ type: 'shop' })}
                className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#1C1614] hover:text-[#C4748C] transition-colors hidden sm:block"
              >
                + Add More
              </button>
            )}
          </div>

          {wishlisted.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#F5F2EE]">
                <Heart size={40} strokeWidth={1} className="text-[#6B6560]" />
              </div>
              <h2 className="text-xl font-serif text-[#1C1614] mb-3">Your wishlist is empty</h2>
              <p className="text-sm text-[#6B6560] mb-8 max-w-md mx-auto">
                Save your favorite pieces to revisit later. Click the heart icon on any product to add it here.
              </p>
              <button
                onClick={() => navigate({ type: 'shop' })}
                className="px-8 py-4 bg-[#1C1614] text-white text-[10px] font-medium uppercase tracking-[0.15em] hover:bg-[#C4748C] transition-colors"
              >
                Explore Collection
              </button>
            </motion.div>
          ) : (
            <>
              {/* Quick Actions Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-white border border-[#E8E4DF] px-6 py-4 mb-8"
              >
                <p className="text-xs text-[#6B6560]">
                  <span className="font-medium text-[#1C1614]">{wishlisted.length}</span> items saved
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      wishlisted.forEach((item: any) => {
                        const color = item.colors?.[0]?.name || 'Default';
                        addItem(item, 1, color, item.variants?.[0]?.id);
                      });
                    }}
                    className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#1C1614] hover:text-[#C4748C] transition-colors"
                  >
                    Add All to Bag
                  </button>
                  <button
                    onClick={() => {
                      wishlistItems.forEach(id => toggleWishlist(id));
                    }}
                    className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6B6560] hover:text-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </motion.div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {wishlisted.map((product: any, i: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative group"
                  >
                    <ProductCard product={product} index={i} />
                    
                    {/* Quick Actions Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex gap-2"
                    >
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-[#C4748C] hover:text-white transition-all"
                        title="Add to bag"
                      >
                        <ShoppingBag size={16} />
                      </button>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}