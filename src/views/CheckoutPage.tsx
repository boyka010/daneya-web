'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, CreditCard, Truck, Wallet, ChevronRight, Shield, Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { navigate } from '@/lib/router';
import { sanitizeInput, sanitizeEmail, sanitizePhone, sanitizeZip, validateRequired } from '@/lib/security';

export default function CheckoutPage() {
  const cartItems = useStore((s) => s.cartItems);
  const getCartTotal = useStore((s) => s.getCartTotal);
  const shippingInfo = useStore((s) => s.shippingInfo);
  const setShippingInfo = useStore((s) => s.setShippingInfo);
  const paymentInfo = useStore((s) => s.paymentInfo);
  const setPaymentInfo = useStore((s) => s.setPaymentInfo);
  const paymentMethod = useStore((s) => s.paymentMethod);
  const setPaymentMethod = useStore((s) => s.setPaymentMethod);
  const shippingMethod = useStore((s) => s.shippingMethod);
  const setShippingMethod = useStore((s) => s.setShippingMethod);
  const addOrder = useStore((s) => s.addOrder);
  const setLastOrder = useStore((s) => s.setLastOrder);
  const clearCart = useStore((s) => s.clearCart);
  const sanitizeCheckoutOnOrder = useStore((s) => s.sanitizeCheckoutOnOrder);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getCartTotal();
  const shippingCost = shippingMethod === 'express' ? 140 : subtotal >= 2000 ? 0 : 80;
  const total = subtotal + shippingCost;

  const updateField = (field: string, value: string) => {
    setShippingInfo({ [field]: value });
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!validateRequired(shippingInfo.email) || !sanitizeEmail(shippingInfo.email)) newErrors.email = 'Valid email required';
    if (!validateRequired(shippingInfo.firstName)) newErrors.firstName = 'Required';
    if (!validateRequired(shippingInfo.lastName)) newErrors.lastName = 'Required';
    if (!validateRequired(shippingInfo.address1)) newErrors.address1 = 'Required';
    if (!validateRequired(shippingInfo.city)) newErrors.city = 'Required';
    if (!validateRequired(shippingInfo.state)) newErrors.state = 'Required';
    if (!validateRequired(shippingInfo.zip)) newErrors.zip = 'Required';
    if (!validateRequired(shippingInfo.country)) newErrors.country = 'Required';
    if (!validateRequired(shippingInfo.phone)) newErrors.phone = 'Required';

    if (paymentMethod === 'card') {
      if (!validateRequired(paymentInfo.cardNumber) || paymentInfo.cardNumber.replace(/\s/g, '').length < 13) newErrors.cardNumber = 'Valid card number required';
      if (!validateRequired(paymentInfo.expiry)) newErrors.expiry = 'Required';
      if (!validateRequired(paymentInfo.cvv)) newErrors.cvv = 'Required';
      if (!validateRequired(paymentInfo.nameOnCard)) newErrors.nameOnCard = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const orderId = `HAY-${Date.now().toString(36).toUpperCase()}`;
    const order = {
      id: orderId,
      items: [...cartItems],
      subtotal,
      shipping: shippingCost,
      total,
      shippingInfo: { ...shippingInfo },
      shippingMethod,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
    setLastOrder(order);
    clearCart();
    sanitizeCheckoutOnOrder();
    setOrderPlaced(true);
    setIsSubmitting(false);
  };

  if (cartItems.length === 0 && !orderPlaced) {
    navigate({ type: 'cart' });
    return null;
  }

  // Order confirmation
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-warm-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-olive">
            <Check size={28} strokeWidth={1.5} className="text-olive" />
          </div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-medium text-warm-text mb-3">
            Order Confirmed
          </h1>
          <p className="text-xs text-muted-foreground font-light leading-relaxed font-sans mb-8">
            Thank you for your order. You&apos;ll receive a confirmation email shortly with your order details and tracking information.
          </p>
          <button
            onClick={() => navigate({ type: 'home' })}
            className="text-[10px] font-medium uppercase tracking-[0.12em] text-warm-text border border-warm-border px-8 py-3 hover:bg-warm-text hover:text-warm-bg transition-all duration-300 font-sans"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full px-3 py-2.5 text-xs bg-transparent text-warm-text placeholder:text-muted-foreground border font-light font-sans transition-colors ${
      errors[field] ? 'border-sale' : 'border-warm-border focus:border-camel'
    }`;

  return (
    <div className="min-h-screen bg-warm-bg">
      <div className="px-4 sm:px-6 lg:px-10 max-w-[1280px] mx-auto pt-8 sm:pt-12 pb-16 sm:pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-light font-sans mb-6">
          <button onClick={() => navigate({ type: 'home' })} className="hover:text-warm-text transition-colors">Home</button>
          <ChevronRight size={8} strokeWidth={1.5} />
          <button onClick={() => navigate({ type: 'cart' })} className="hover:text-warm-text transition-colors">Bag</button>
          <ChevronRight size={8} strokeWidth={1.5} />
          <span className="text-warm-text font-medium">Checkout</span>
        </div>

        <div className="flex items-center gap-3 mb-8 sm:mb-10">
          <button onClick={() => navigate({ type: 'cart' })} className="text-muted-foreground hover:text-warm-text transition-colors">
            <ArrowLeft size={16} strokeWidth={1.5} />
          </button>
          <h1 className="section-heading text-2xl sm:text-3xl text-warm-text">Checkout</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4 sm:gap-6 mb-10 pb-8 border-b border-warm-border">
          {[
            { label: 'Information', step: 1 },
            { label: 'Shipping', step: 2 },
            { label: 'Payment', step: 3 },
          ].map(({ label, step }) => (
            <div key={step} className="flex items-center gap-2">
              <span className={`w-6 h-6 flex items-center justify-center text-[10px] font-medium font-sans ${
                step === 1 ? 'bg-warm-text text-warm-bg' : 'border border-warm-border text-muted-foreground'
              }`}>
                {step}
              </span>
              <span className={`text-[10px] font-medium uppercase tracking-[0.1em] font-sans ${
                step === 1 ? 'text-warm-text' : 'text-muted-foreground'
              }`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            {/* Left: Forms */}
            <div className="lg:col-span-2 space-y-10">
              {/* Contact Information */}
              <div>
                <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-warm-text mb-5 font-sans">
                  Contact Information
                </h2>
                <input
                  type="email"
                  placeholder="Email address"
                  value={shippingInfo.email}
                  onChange={(e) => updateField('email', sanitizeInput(e.target.value))}
                  className={inputClass('email')}
                />
                {errors.email && <p className="text-[9px] text-sale mt-1 font-sans">{errors.email}</p>}
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-warm-text mb-5 font-sans">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="First name"
                    value={shippingInfo.firstName}
                    onChange={(e) => updateField('firstName', sanitizeInput(e.target.value))}
                    className={inputClass('firstName')}
                  />
                  <input
                    placeholder="Last name"
                    value={shippingInfo.lastName}
                    onChange={(e) => updateField('lastName', sanitizeInput(e.target.value))}
                    className={inputClass('lastName')}
                  />
                </div>
                {errors.firstName && <p className="text-[9px] text-sale mt-1 font-sans">{errors.firstName}</p>}
                <input
                  placeholder="Address"
                  value={shippingInfo.address1}
                  onChange={(e) => updateField('address1', sanitizeInput(e.target.value))}
                  className={`${inputClass('address1')} mt-3`}
                />
                <input
                  placeholder="Apartment, suite, etc. (optional)"
                  value={shippingInfo.address2}
                  onChange={(e) => updateField('address2', sanitizeInput(e.target.value))}
                  className={`${inputClass('address2')} mt-3`}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  <input
                    placeholder="City"
                    value={shippingInfo.city}
                    onChange={(e) => updateField('city', sanitizeInput(e.target.value))}
                    className={inputClass('city')}
                  />
                  <input
                    placeholder="State"
                    value={shippingInfo.state}
                    onChange={(e) => updateField('state', sanitizeInput(e.target.value))}
                    className={inputClass('state')}
                  />
                  <input
                    placeholder="ZIP code"
                    value={shippingInfo.zip}
                    onChange={(e) => updateField('zip', sanitizeZip(e.target.value))}
                    className={inputClass('zip')}
                  />
                </div>
                {(errors.city || errors.state || errors.zip) && (
                  <p className="text-[9px] text-sale mt-1 font-sans">{errors.city || errors.state || errors.zip}</p>
                )}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <input
                    placeholder="Country"
                    value={shippingInfo.country}
                    onChange={(e) => updateField('country', sanitizeInput(e.target.value))}
                    className={inputClass('country')}
                  />
                  <input
                    placeholder="Phone"
                    value={shippingInfo.phone}
                    onChange={(e) => updateField('phone', sanitizePhone(e.target.value))}
                    className={inputClass('phone')}
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <div>
                <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-warm-text mb-5 font-sans">
                  Shipping Method
                </h2>
                <div className="space-y-2.5">
                  {[
                    { id: 'standard', label: 'Standard Shipping', desc: '5-7 business days', price: subtotal >= 2000 ? 'Free' : `EGP ${80}`, icon: Truck },
                    { id: 'express', label: 'Express Shipping', desc: '2-3 business days', price: 'EGP 140', icon: Truck },
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setShippingMethod(method.id)}
                      className={`w-full flex items-center justify-between p-4 border transition-all duration-200 ${
                        shippingMethod === method.id
                          ? 'border-warm-text bg-secondary/30'
                          : 'border-warm-border hover:border-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <method.icon size={16} strokeWidth={1.5} className={shippingMethod === method.id ? 'text-camel' : 'text-muted-foreground'} />
                        <div className="text-left">
                          <p className="text-[11px] font-medium text-warm-text font-sans">{method.label}</p>
                          <p className="text-[9px] text-muted-foreground font-light font-sans">{method.desc}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium font-sans ${method.price === 'Free' ? 'text-olive' : 'text-warm-text'}`}>
                        {method.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-warm-text mb-5 font-sans">
                  Payment Method
                </h2>
                <div className="space-y-2.5 mb-6">
                  {[
                    { id: 'card' as const, label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'digital_wallet' as const, label: 'Apple Pay / Google Pay', icon: Wallet },
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center justify-between p-4 border transition-all duration-200 ${
                        paymentMethod === method.id
                          ? 'border-warm-text bg-secondary/30'
                          : 'border-warm-border hover:border-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <method.icon size={16} strokeWidth={1.5} className={paymentMethod === method.id ? 'text-camel' : 'text-muted-foreground'} />
                        <span className="text-[11px] font-medium text-warm-text font-sans">{method.label}</span>
                      </div>
                      <div className={`w-4 h-4 border-2 flex items-center justify-center ${
                        paymentMethod === method.id ? 'border-warm-text' : 'border-warm-border'
                      }`}>
                        {paymentMethod === method.id && <div className="w-2 h-2 bg-warm-text" />}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Card fields */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 pl-0">
                    <input
                      placeholder="Card number"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({ cardNumber: e.target.value.replace(/[^\d\s]/g, '').slice(0, 19) })}
                      className={inputClass('cardNumber')}
                    />
                    {errors.cardNumber && <p className="text-[9px] text-sale mt-0 font-sans">{errors.cardNumber}</p>}
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        placeholder="Expiry (MM/YY)"
                        value={paymentInfo.expiry}
                        onChange={(e) => setPaymentInfo({ expiry: e.target.value.replace(/[^\d/]/g, '').slice(0, 5) })}
                        className={inputClass('expiry')}
                      />
                      <input
                        placeholder="CVV"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({ cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        className={inputClass('cvv')}
                        type="password"
                      />
                    </div>
                    {(errors.expiry || errors.cvv) && (
                      <p className="text-[9px] text-sale font-sans">{errors.expiry || errors.cvv}</p>
                    )}
                    <input
                      placeholder="Name on card"
                      value={paymentInfo.nameOnCard}
                      onChange={(e) => setPaymentInfo({ nameOnCard: sanitizeInput(e.target.value) })}
                      className={inputClass('nameOnCard')}
                    />
                    {errors.nameOnCard && <p className="text-[9px] text-sale mt-0 font-sans">{errors.nameOnCard}</p>}
                  </div>
                )}



                {paymentMethod === 'digital_wallet' && (
                  <p className="text-xs text-muted-foreground font-light font-sans leading-relaxed">
                    You&apos;ll be redirected to Apple Pay or Google Pay to complete your purchase.
                  </p>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-warm-border p-6 bg-white sticky top-24">
                <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-warm-text mb-5 font-sans">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto custom-scroll mb-5">
                  {cartItems.map((item) => (
                    <div key={`${item.product.id}-${item.selectedColor}`} className="flex items-center gap-3">
                      <div className="w-12 h-16 bg-secondary flex-shrink-0 overflow-hidden relative">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-warm-text truncate font-sans">{item.product.name}</p>
                        <p className="text-[9px] text-muted-foreground font-light font-sans">
                          {item.selectedColor} &middot; Qty {item.quantity}
                        </p>
                      </div>
                      <span className="text-[10px] font-medium text-warm-text font-sans">
                        EGP {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-warm-border pt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-light font-sans">Subtotal</span>
                    <span className="text-warm-text font-medium font-sans">EGP {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-light font-sans">Shipping</span>
                    <span className={shippingCost === 0 ? 'text-olive font-medium font-sans' : 'text-warm-text font-medium font-sans'}>
                      {shippingCost === 0 ? 'Free' : `EGP ${shippingCost}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-warm-border my-4 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-warm-text font-sans">Total</span>
                    <span className="text-lg font-medium text-warm-text font-sans">EGP {total.toLocaleString()}</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-warm-text text-warm-bg text-[10px] font-medium uppercase tracking-[0.12em] hover:bg-camel transition-colors duration-300 font-sans flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <Lock size={12} strokeWidth={1.5} />
                      Place Order
                    </>
                  )}
                </motion.button>

                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <Shield size={10} strokeWidth={1.5} className="text-muted-foreground" />
                  <p className="text-[9px] text-muted-foreground font-light font-sans">
                    Your information is encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
