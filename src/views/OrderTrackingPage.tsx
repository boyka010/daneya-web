'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, XCircle, Clock, ArrowRight, MessageCircle } from 'lucide-react';
import SEO from '@/components/SEO';

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'not-found' | 'processing' | 'shipped' | 'delivered' | null>(null);

  const handleSearch = () => {
    if (!orderNumber.trim()) return;
    setIsSearching(true);
    
    // Simulate API call - in production, connect to Shopify orders API
    setTimeout(() => {
      // Demo: Accept any order number for now
      if (orderNumber.length > 3) {
        setOrderStatus('processing'); // or 'shipped' or 'delivered'
      } else {
        setOrderStatus('not-found');
      }
      setIsSearching(false);
    }, 1500);
  };

  const getStatusInfo = () => {
    switch (orderStatus) {
      case 'processing':
        return {
          icon: Clock,
          color: 'text-[#C9A97A]',
          bg: 'bg-[#C9A97A]/10',
          title: 'Order Processing',
          description: 'Your order is being prepared and will ship soon.',
          steps: [
            { label: 'Order Placed', complete: true },
            { label: 'Processing', complete: true },
            { label: 'Shipped', complete: false },
            { label: 'Delivered', complete: false },
          ],
        };
      case 'shipped':
        return {
          icon: Truck,
          color: 'text-[#C4748C]',
          bg: 'bg-[#C4748C]/10',
          title: 'On The Way',
          description: 'Your order is on its way to you.',
          steps: [
            { label: 'Order Placed', complete: true },
            { label: 'Processing', complete: true },
            { label: 'Shipped', complete: true },
            { label: 'Delivered', complete: false },
          ],
        };
      case 'delivered':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50',
          title: 'Delivered',
          description: 'Your order has been delivered. Thank you for shopping with us!',
          steps: [
            { label: 'Order Placed', complete: true },
            { label: 'Processing', complete: true },
            { label: 'Shipped', complete: true },
            { label: 'Delivered', complete: true },
          ],
        };
      default:
        return null;
    }
  };

  return (
    <>
      <SEO 
        title="Track Your Order | DANEYA Egypt"
        description="Track your DANEYA order status. Enter your order number to see delivery updates."
      />
      <div className="min-h-screen bg-[#FAF7F4] pt-20 pb-16">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1614] mb-4">
              Track Your Order
            </h1>
            <p className="text-[#6B6560] font-light">
              Enter your order number to check delivery status
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-[#E8E4DF] p-6 mb-8"
          >
            <label className="block text-xs font-medium uppercase tracking-wider text-[#1C1614] mb-3">
              Order Number
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., DANEYA-12345"
                  className="w-full px-4 py-3 border border-[#E8E4DF] focus:border-[#C4748C] focus:outline-none transition-colors text-sm"
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6560]" />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching || !orderNumber.trim()}
                className="px-6 py-3 bg-[#1C1614] text-white text-sm font-medium uppercase tracking-wider hover:bg-[#C4748C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSearching ? 'Searching...' : 'Track'}
              </button>
            </div>
            <p className="text-[10px] text-[#6B6560] mt-3">
              Find your order number in your confirmation email
            </p>
          </motion.div>

          {/* Order Status Result */}
          {orderStatus && orderStatus !== 'not-found' && getStatusInfo() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border p-6 ${getStatusInfo()?.bg}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <getStatusInfo()!.icon size={24} className={getStatusInfo()!.color} />
                <h2 className="text-lg font-serif text-[#1C1614]">{getStatusInfo()?.title}</h2>
              </div>
              <p className="text-sm text-[#6B6560] mb-6">{getStatusInfo()?.description}</p>

              {/* Progress Steps */}
              <div className="flex items-center justify-between">
                {getStatusInfo()?.steps.map((step, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step.complete ? 'bg-[#C4748C] text-white' : 'bg-[#E8E4DF] text-[#6B6560]'
                    }`}>
                      {step.complete ? <CheckCircle size={14} /> : <span className="text-[10px]">{i + 1}</span>}
                    </div>
                    <span className="text-[10px] text-[#6B6560] mt-2">{step.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Not Found */}
          {orderStatus === 'not-found' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-red-200 p-6 text-center"
            >
              <XCircle size={32} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-lg font-serif text-[#1C1614] mb-2">Order Not Found</h2>
              <p className="text-sm text-[#6B6560] mb-4">
                We couldn't find an order with that number. Please check and try again.
              </p>
              <a 
                href="https://wa.me/201XXXXXXXXX"
                className="inline-flex items-center gap-2 text-[#C4748C] text-sm hover:underline"
              >
                <MessageCircle size={16} />
                Contact us for help
              </a>
            </motion.div>
          )}

          {/* Help Section */}
          {orderStatus === null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <p className="text-[#6B6560] text-sm mb-4">Need help with your order?</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a 
                  href="https://wa.me/201XXXXXXXXX"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs font-medium uppercase tracking-wider hover:opacity-90"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
                <a 
                  href="#/contact"
                  onClick={() => navigate({ type: 'contact' })}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#1C1614] text-[#1C1614] text-xs font-medium uppercase tracking-wider hover:bg-[#1C1614] hover:text-white transition-colors"
                >
                  Contact Us
                  <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

function navigate(type: any) {
  // This would be imported from router in real implementation
  window.location.hash = type.type === 'contact' ? '#/contact' : '#/';
}