'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { navigate } from '@/lib/router';
import { useStore } from '@/store/useStore';
import CartItem from './CartItem';

export default function CartDrawer() {
  const isOpen = useStore((s) => s.isCartDrawerOpen);
  const setOpen = useStore((s) => s.setCartDrawerOpen);
  const cartItems = useStore((s) => s.cartItems);
  const getCartTotal = useStore((s) => s.getCartTotal);

  const total = getCartTotal();
  const freeShippingThreshold = 2000;

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
            className="fixed inset-0 z-[55] bg-warm-text/30"
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
            <div className="flex items-center justify-between px-6 py-5 border-b border-warm-border">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-warm-text font-sans">
                Bag ({cartItems.length})
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-muted-foreground hover:text-warm-text transition-colors"
                aria-label="Close cart"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto custom-scroll px-6 py-2">
              {cartItems.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center border border-warm-border">
                    <ShoppingBag size={22} strokeWidth={1} className="text-muted-foreground" />
                  </div>
                  <p className="font-serif-heading text-lg font-medium text-warm-text mb-2">
                    Your bag is empty
                  </p>
                  <p className="text-xs text-muted-foreground font-light mb-6">
                    Discover our latest collection and find your next favorite piece.
                  </p>
                  <button
                    onClick={() => { setOpen(false); navigate({ type: 'shop' }); }}
                    className="text-[10px] font-medium uppercase tracking-[0.12em] text-camel hover:text-warm-text transition-colors font-sans flex items-center gap-2 mx-auto"
                  >
                    Continue Shopping
                    <ArrowRight size={12} strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-warm-border/60">
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
            {cartItems.length > 0 && (
              <div className="px-6 py-5 border-t border-warm-border bg-white">
                {/* Free shipping progress */}
                <div className="mb-4">
                  {total >= freeShippingThreshold ? (
                    <p className="text-[10px] font-medium text-olive uppercase tracking-[0.1em] font-sans">
                      You qualify for FREE SHIPPING
                    </p>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-[1px] bg-warm-border overflow-hidden">
                        <div
                          className="h-full bg-camel transition-all duration-500"
                          style={{ width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-muted-foreground font-light whitespace-nowrap font-sans">
                        EGP {(freeShippingThreshold - total).toLocaleString()} away from free shipping
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-warm-text font-sans">Subtotal</span>
                  <span className="text-sm font-medium text-warm-text font-sans">
                    EGP {total.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => { setOpen(false); navigate({ type: 'cart' }); }}
                  className="w-full py-3 text-[10px] font-medium uppercase tracking-[0.12em] text-warm-text border border-warm-border hover:bg-warm-text hover:text-warm-bg transition-all duration-300 font-sans"
                >
                  View Bag
                </button>
                <button
                  onClick={() => { setOpen(false); navigate({ type: 'checkout' }); }}
                  className="w-full mt-2 py-3.5 text-[10px] font-medium uppercase tracking-[0.12em] text-warm-bg bg-warm-text hover:bg-camel transition-colors duration-300 font-sans"
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
