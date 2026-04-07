'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowRight } from 'lucide-react';
import { useNavigate } from '@/hooks/useNavigate';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown && window.innerWidth > 768) {
        setIsVisible(true);
        setHasShown(true);
        // Store in session storage so doesn't show again
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    const handleScroll = () => {
      // Show after user scrolls 70% of page
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 70 && !hasShown && window.innerWidth > 768) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    // Check if already shown this session
    if (sessionStorage.getItem('exitIntentShown')) {
      setHasShown(true);
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClaim = () => {
    setIsVisible(false);
    // Could navigate to a special offer page or apply discount code
    window.location.hash = '#/shop';
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#1C1614]/80 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Popup */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white max-w-md w-full p-8 text-center overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#6B6560] hover:text-[#1C1614] transition-colors"
          >
            <X size={18} />
          </button>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 bg-[#C4748C]/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Gift size={32} className="text-[#C4748C]" />
          </motion.div>

          {/* Content */}
          <h2 className="text-2xl font-serif text-[#1C1614] mb-3">
            Wait! Don't go yet 🎁
          </h2>
          <p className="text-[#6B6560] mb-6 leading-relaxed">
            Get <span className="font-semibold text-[#C4748C]">15% OFF</span> your first order when you sign up for our newsletter. Plus, be the first to know about new arrivals!
          </p>

          {/* Email Input */}
          <div className="flex gap-2 mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-[#E8E4DF] focus:border-[#C4748C] focus:outline-none transition-colors text-sm"
            />
            <button
              onClick={handleClaim}
              className="px-6 py-3 bg-[#1C1614] text-white text-sm font-medium uppercase tracking-wider hover:bg-[#C4748C] transition-colors"
            >
              Claim
            </button>
          </div>

          {/* No thanks link */}
          <button
            onClick={handleClose}
            className="text-[10px] text-[#6B6560] hover:text-[#1C1614] transition-colors"
          >
            No thanks, I'll pay full price
          </button>

          {/* Decorative */}
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#C4748C]/5 rounded-full" />
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#C9A97A]/5 rounded-full" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}