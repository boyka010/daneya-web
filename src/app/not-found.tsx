'use client';

import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@/hooks/useNavigate';
import Link from 'next/link';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-8"
        >
          <span className="text-[120px] sm:text-[180px] font-serif text-[#C4748C] leading-none">
            404
          </span>
        </motion.div>

        {/* Message */}
        <h1 className="text-2xl sm:text-3xl font-serif text-[#1C1614] mb-4">
          Page Not Found
        </h1>
        <p className="text-[#6B6560] mb-8 font-light">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate({ type: 'home' })}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1C1614] text-[#FAF7F4] text-sm font-medium uppercase tracking-wider hover:bg-[#C4748C] transition-colors"
          >
            <Home size={18} />
            Back to Home
          </button>
          <button
            onClick={() => navigate({ type: 'shop' })}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-[#1C1614] text-[#1C1614] text-sm font-medium uppercase tracking-wider hover:bg-[#1C1614] hover:text-[#FAF7F4] transition-colors"
          >
            <Search size={18} />
            Browse Shop
          </button>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-[#E8E4DF]">
          <p className="text-sm text-[#6B6560] mb-4">Need help? Contact us:</p>
          <div className="flex justify-center gap-6">
            <a 
              href="https://wa.me/20XXXXXXXXXX" 
              className="text-[#C4748C] hover:text-[#1C1614] transition-colors text-sm"
            >
              WhatsApp
            </a>
            <a 
              href="mailto:hello@daneya.com" 
              className="text-[#C4748C] hover:text-[#1C1614] transition-colors text-sm"
            >
              hello@daneya.com
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}