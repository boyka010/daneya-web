'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { navigate } from '@/lib/router';
import { useStore } from '@/store/useStore';
import CartItem from './CartItem';
import { useShopifyCart } from '@/hooks/useShopifyCart';

export default function CartDrawer() {
  const isOpen = useStore((s) => s.isCartDrawerOpen);
  const setOpen = useStore((s) => s.setCartDrawerOpen);
  const { cart, addItem } = useShopifyCart();
  
  // Get cart items from either source
  const cartItems = useStore((s) => s.cartItems);
  const getCartTotal = useStore((s) => s.getCartTotal);
  
  const total = cart?.subtotal || getCartTotal();
  const freeShippingThreshold = 2000;
  const itemCount = cart?.lines?.length || cartItems.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[55] bg-[#1C1614]/30"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[56] w-full max-w-[420px] bg-white flex flex-col"
          >
            {/* Header */}
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

            {/* Items */}
            <div className="flex-1 overflow-y-auto custom-scroll px-6 py-2">
              {itemCount === 0 ? (
                <div className="py-20 text-center">
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
                    onClick={() => { setOpen(false); navigate({ type: 'shop' }); }}
                    className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#8B6F47] hover:text-[#1C1614] transition-colors font-sans flex items-center gap-2 mx-auto"
                  >
                    Continue Shopping
                    <ArrowRight size={12} strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#E8E4DF]/60">
                  {cartItems.map((item) => (
                    <CartItem
                      key={`${item.product.id}-${item.selectedColor}`}
                      mode="compact"
                      productId={item.product.id}
                      color={item.selectedColor}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {itemCount > 0 && (
              <div className="px-6 py-5 border-t border-[#E8E4DF] bg-white">
                {/* Free shipping progress */}
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
                          className="h-full bg-[#8B6F47]"
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
                  onClick={() => { setOpen(false); navigate({ type: 'cart' }); }}
                  className="w-full py-3 text-[10px] font-medium uppercase tracking-[0.12em] text-[#1C1614] border border-[#E8E4DF] hover:bg-[#1C1614] hover:text-[#FAF7F4] transition-all duration-300 font-sans"
                >
                  View Bag
                </button>
                <button
                  onClick={() => { 
                    setOpen(false); 
                    const shopifyStore = require('@/store/shopifyStore').useStore;
                    const checkoutUrl = shopifyStore.getState().cart?.checkoutUrl;
                    if (checkoutUrl) {
                      window.location.href = checkoutUrl;
                    } else {
                      navigate({ type: 'checkout' });
                    }
                  }}
                  className="w-full mt-2 py-3.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#FAF7F4] bg-[#1C1614] hover:bg-[#8B6F47] transition-colors duration-300 font-sans"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
