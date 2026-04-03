'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { navigate } from '@/lib/router';
import CartItem from '@/components/cart/CartItem';

export default function CartPage() {
  const cartItems = useStore((s) => s.cartItems);
  const getCartTotal = useStore((s) => s.getCartTotal);
  const clearCart = useStore((s) => s.clearCart);
  const setCartDrawerOpen = useStore((s) => s.setCartDrawerOpen);

  const subtotal = getCartTotal();
  const shipping = subtotal >= 2000 ? 0 : 80;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center border border-[#E8E4DF]">
            <ShoppingBag size={26} strokeWidth={1} className="text-[#6B6560]" />
          </div>
          <h1 className="font-serif-heading text-2xl font-medium text-[#1C1614] mb-2">
            Your bag is empty
          </h1>
          <p className="text-xs text-[#6B6560] font-light mb-6 font-sans">
            Looks like you haven&apos;t added anything yet.
          </p>
          <button
            onClick={() => navigate({ type: 'shop' })}
            className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#1C1614] border border-[#E8E4DF] px-8 py-3 hover:bg-[#1C1614] hover:text-[#FAF7F4] transition-all duration-300 font-sans"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      <div className="px-4 sm:px-6 lg:px-10 max-w-[1280px] mx-auto pt-8 sm:pt-12 pb-16 sm:pb-20">
        {/* Header */}
        <div className="flex items-center gap-2 text-[10px] text-[#6B6560] font-light font-sans mb-6">
          <button onClick={() => navigate({ type: 'home' })} className="hover:text-[#1C1614] transition-colors">Home</button>
          <ArrowRight size={8} strokeWidth={1.5} />
          <span className="text-[#1C1614] font-medium">Bag</span>
        </div>

        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <h1 className="section-heading text-2xl sm:text-3xl text-[#1C1614]">Your Bag</h1>
          <button
            onClick={() => navigate({ type: 'shop' })}
            className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6B6560] hover:text-[#1C1614] transition-colors font-sans hidden sm:block"
          >
            <span className="flex items-center gap-1.5">
              <ArrowLeft size={11} strokeWidth={1.5} />
              Continue Shopping
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="border-b border-[#E8E4DF] pb-2 mb-2">
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-[#6B6560] font-sans">Product</span>
                <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-[#6B6560] font-sans">Total</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {cartItems.map((item) => (
                <CartItem
                  key={`${item.product.id}-${item.selectedColor}`}
                  mode="full"
                  productId={item.product.id}
                  color={item.selectedColor}
                />
              ))}
            </motion.div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={clearCart}
                className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6B6560] hover:text-[#C8102E] transition-colors font-sans"
              >
                Clear Bag
              </button>
              <button
                onClick={() => navigate({ type: 'shop' })}
                className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6B6560] hover:text-[#1C1614] transition-colors font-sans sm:hidden"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-[#E8E4DF] p-6 sm:p-8 bg-white sticky top-24">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#1C1614] mb-6 font-sans">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B6560] font-light font-sans">Subtotal</span>
                  <span className="text-[#1C1614] font-medium font-sans">EGP {subtotal.toLocaleString('en-US')}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B6560] font-light font-sans">Shipping</span>
                  <span className={shipping === 0 ? 'text-[#6B7F3B] font-medium font-sans' : 'text-[#1C1614] font-medium font-sans'}>
                    {shipping === 0 ? 'Free' : `EGP ${shipping}`}
                  </span>
                </div>
                {subtotal < 2000 && (
                  <p className="text-[9px] text-[#6B6560] font-light font-sans">
                    Add EGP {(2000 - subtotal).toLocaleString('en-US')} more for free shipping
                  </p>
                )}
              </div>

              <div className="border-t border-[#E8E4DF] my-5 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#1C1614] font-sans">Total</span>
                  <span className="text-lg font-medium text-[#1C1614] font-sans">EGP {total.toLocaleString('en-US')}</span>
                </div>
              </div>

              {/* Discount code */}
              <div className="flex items-center border border-warm-border mb-6">
                <input
                  type="text"
                  placeholder="Discount code"
                  className="flex-1 px-3 py-2.5 text-[11px] bg-transparent text-warm-text placeholder:text-muted-foreground focus:outline-none font-light font-sans"
                />
                <button className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.1em] text-warm-text border-l border-warm-border hover:text-camel transition-colors font-sans">
                  Apply
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate({ type: 'checkout' })}
                className="w-full py-4 bg-warm-text text-warm-bg text-[10px] font-medium uppercase tracking-[0.12em] hover:bg-camel transition-colors duration-300 font-sans"
              >
                Proceed to Checkout
              </motion.button>

              <p className="text-[9px] text-muted-foreground text-center mt-3 font-light font-sans">
                Your information is encrypted and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
