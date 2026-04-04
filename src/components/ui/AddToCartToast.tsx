'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { navigate } from '@/lib/router';

interface AddToCartToastProps {
  productName: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function AddToCartToast({ productName, isVisible, onClose }: AddToCartToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#1C1614] text-white px-6 py-4 flex items-center gap-4 shadow-2xl max-w-sm"
        >
          {/* Icon */}
          <div className="w-10 h-10 bg-[#C4748C] rounded-full flex items-center justify-center flex-shrink-0">
            <Check size={20} strokeWidth={2} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Added to bag!</p>
            <p className="text-xs text-white/60 truncate">{productName}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                onClose();
                window.location.hash = '#/cart';
              }}
              className="text-xs font-medium uppercase tracking-wider hover:text-[#C4748C] transition-colors"
            >
              View Bag
            </button>
            <button
              onClick={() => {
                onClose();
                window.location.hash = '#/checkout';
              }}
              className="w-8 h-8 bg-[#C4748C] rounded-full flex items-center justify-center hover:bg-[#C9A97A] transition-colors"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to manage the toast state
export function useAddToCartToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [productName, setProductName] = useState('');

  const showToast = (name: string) => {
    setProductName(name);
    setIsVisible(true);
    // Auto hide after 4 seconds
    setTimeout(() => setIsVisible(false), 4000);
  };

  const hideToast = () => setIsVisible(false);

  return { isVisible, productName, showToast, hideToast };
}