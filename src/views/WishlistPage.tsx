'use client';

import { useMemo } from 'react';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { navigate } from '@/lib/router';
import { useStore } from '@/store/useStore';
import { products } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';

export default function WishlistPage() {
  const wishlistItems = useStore((s) => s.wishlistItems);
  const addToCart = useStore((s) => s.addToCart);

  const wishlisted = useMemo(() => {
    return products.filter((p) => wishlistItems.includes(p.id));
  }, [wishlistItems]);

  return (
    <div className="bg-white pt-4 sm:pt-8 pb-16 sm:pb-24 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <div className="mb-6 anim-up">
          <button onClick={() => navigate({ type: 'home' })} className="text-xs font-medium text-gray-500 hover:text-black transition-colors">
            Home
          </button>
          <span className="text-xs text-gray-400 mx-2">/</span>
          <span className="text-xs font-bold text-black">Wishlist</span>
        </div>

        {/* Title */}
        <div className="mb-10 anim-up" style={{ animationDelay: '0.05s' }}>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black uppercase">
            WISHLIST
            {wishlisted.length > 0 && (
              <span className="inline-flex items-center justify-center ml-2 px-2.5 py-0.5 bg-gray-100 text-sm font-bold text-black rounded-full align-middle">
                {wishlisted.length}
              </span>
            )}
          </h1>
        </div>

        {wishlisted.length === 0 ? (
          <div className="py-20 text-center anim-up">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-gray-100">
              <Heart size={32} strokeWidth={1.5} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-black text-black uppercase">Your wishlist is empty</h2>
            <p className="text-sm text-gray-500 mt-3">Save your favorite items and come back to them later.</p>
            <button
              onClick={() => navigate({ type: 'shop' })}
              className="mt-8 px-10 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate({ type: 'shop' })}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:text-red transition-colors mb-8"
            >
              <ArrowLeft size={14} strokeWidth={2} />
              Continue Shopping
            </button>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-5 gap-y-8 sm:gap-y-12">
              {wishlisted.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
