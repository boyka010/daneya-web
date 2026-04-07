'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { useStore as useShopifyStore } from '@/store/shopifyStore';
import { products as localProducts } from '@/data/products';
import CartItem from './CartItem';
import CartRecommendations from './CartRecommendations';
import { getCartAction } from '@/app/actions/shopify-cart';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const matches = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return matches ? matches[2] : null;
}

export default function CartDrawer() {
  const router = useRouter();
  const isOpen = useShopifyStore((s) => s.isCartDrawerOpen);
  const setOpen = useShopifyStore((s) => s.setCartDrawerOpen);
  const cart = useShopifyStore((s) => s.cart);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  const items = cart?.lines || [];
  const total = cart?.subtotal || 0;
  const freeShippingThreshold = 2000;
  const itemCount = items.length;

  useEffect(() => {
    if (isOpen && itemCount > 0) {
      const timer = setTimeout(() => setShowRecommendations(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowRecommendations(false);
    }
  }, [isOpen, itemCount]);
  
  const handleCheckout = async () => {
    if (itemCount === 0) return;
    
    setOpen(false);
    
    // Get fresh checkout URL from Shopify
    const cookieCartId = getCookie('daneya_cart_id');
    if (cookieCartId) {
      try {
        const result = await getCartAction(cookieCartId);
        if (result.success && result.cart?.checkoutUrl) {
          window.location.href = result.cart.checkoutUrl;
          return;
        }
      } catch (e) {
        // Fall through
      }
    }
    
    // Fallback - try permalink format
    const shopifyItems = items
      .filter(item => item.variantId && item.variantId.startsWith('gid://'))
      .map(item => {
        const variantToken = item.variantId!.replace('gid://shopify/ProductVariant/', '');
        return `${variantToken}:${item.quantity}`;
      });
    
    if (shopifyItems.length > 0) {
      const cartPath = shopifyItems.join(',');
      const checkoutUrl = `https://daneya.shop/cart/${cartPath}`;
      window.location.href = checkoutUrl;
      return;
    }
    
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[55] bg-[#1C1614]/30"
            onClick={() => setOpen(false)}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[56] w-full max-w-[420px] bg-white flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E4DF]">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#1C1614] font-sans">
                Bag ({itemCount})
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-[#6B6560] hover:text-[#1C1614] transition-colors"
                aria-label="Close cart"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scroll px-6 py-2">
              {itemCount === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center border border-[#E8E4DF]">
                    <ShoppingBag size={22} strokeWidth={1} className="text-[#6B6560]" />
                  </div>
                  <p className="font-serif-heading text-lg font-medium text-[#1C1614] mb-2">
                    Your bag is empty
                  </p>
                  <p className="text-xs text-[#6B6560] font-light mb-6">
                    Discover our latest collection and find your next favorite piece.
                  </p>
                  <button
                    onClick={() => { setOpen(false); router.push('/shop'); }}
                    className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#C9A97A] hover:text-[#1C1614] transition-colors font-sans flex items-center gap-2 mx-auto"
                  >
                    Continue Shopping
                    <ArrowRight size={12} strokeWidth={1.5} />
                  </button>

                  {/* Trending products - never show empty cart */}
                  <div className="mt-8 pt-6 border-t border-[#E8E4DF]">
                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#6B6560] mb-4">Trending Now</p>
                    <div className="space-y-3">
                      {localProducts.slice(0, 3).map((product) => (
                        <button
                          key={product.id}
                          onClick={() => { setOpen(false); router.push(`/product/${(product as any).handle || String(product.id)}`); }}
                          className="flex items-center gap-3 w-full text-left hover:bg-[#FAF7F4] p-2 rounded transition-colors"
                        >
                          <div className="w-12 h-16 bg-[#F5F2EE] overflow-hidden shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-[#1C1614] truncate">{product.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} size={8} className={s <= Math.round(product.rating) ? 'fill-[#C9A97A] text-[#C9A97A]' : 'text-[#E8E4DF]'} />
                              ))}
                              <span className="text-[9px] text-[#6B6560] ml-1">({product.reviews})</span>
                            </div>
                            <p className="text-[11px] text-[#1C1614] mt-0.5">EGP {product.price.toLocaleString('en-US')}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-[#E8E4DF]/60">
                  {items.map((item) => (
                    <CartItem
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                      mode="compact"
                      productId={item.product.id}
                      color={item.selectedColor}
                      size={item.selectedSize}
                    />
                  ))}
                </div>
              )}
            </div>

            {itemCount > 0 && (
              <div className="px-6 py-5 border-t border-[#E8E4DF] bg-white">
                <div className="mb-4">
                  {total >= freeShippingThreshold ? (
                    <p className="text-[10px] font-medium text-[#6B7F3B] uppercase tracking-[0.1em] font-sans">
                      You qualify for FREE SHIPPING
                    </p>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-[1px] bg-[#E8E4DF] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-[#C9A97A]"
                        />
                      </div>
                      <p className="text-[9px] text-[#6B6560] font-light whitespace-nowrap font-sans">
                        EGP {(freeShippingThreshold - total).toLocaleString('en-US')} away from free shipping
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#1C1614] font-sans">Subtotal</span>
                  <span className="text-sm font-medium text-[#1C1614] font-sans">
                    EGP {total.toLocaleString('en-US')}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#FAF7F4] bg-[#1C1614] hover:bg-[#C9A97A] transition-colors duration-300 font-sans"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
          <CartRecommendations 
            isOpen={showRecommendations} 
            onClose={() => setShowRecommendations(false)} 
          />
        </>
      )}
    </AnimatePresence>
  );
}