'use client';

import { motion } from 'framer-motion';
import { RotateCcw, Shield, Check } from 'lucide-react';
import SEO from '@/components/SEO';

export default function ReturnsPage() {
  return (
    <>
      <SEO 
        title="Returns & Exchanges | DANEYA Egypt"
        description="Easy 7-day returns and exchanges. Read our policy for eligible items, conditions, and how to initiate a return."
      />
      <div className="min-h-screen bg-[#FAF7F4] pt-20 pb-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1614] mb-4">
              Returns & Exchanges
            </h1>
            <p className="text-[#6B6560] font-light">
              We want you to love your purchase. Here's our return policy
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Return Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 border border-[#E8E4DF]"
            >
              <div className="flex items-center gap-3 mb-4">
                <RotateCcw className="text-[#C4748C]" size={24} />
                <h2 className="text-lg font-serif text-[#1C1614]">7-Day Return Policy</h2>
              </div>
              <ul className="space-y-2 text-sm text-[#6B6560]">
                <li>• Returns accepted within 7 days of delivery</li>
                <li>• Items must be unworn, unwashed, and with tags attached</li>
                <li>• Original packaging must be included</li>
                <li>• Custom/modified items are final sale</li>
              </ul>
            </motion.div>

            {/* Refund Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 border border-[#E8E4DF]"
            >
              <h2 className="text-lg font-serif text-[#1C1614] mb-4">Refund Process</h2>
              <ol className="space-y-2 text-sm text-[#6B6560]">
                <li>1. Contact us via WhatsApp or email to initiate return</li>
                <li>2. Pack items securely with original packaging</li>
                <li>3. We arrange pickup or provide return address</li>
                <li>4. Refund processed within 5-7 business days after inspection</li>
              </ol>
            </motion.div>

            {/* Exchange */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 border border-[#E8E4DF]"
            >
              <h2 className="text-lg font-serif text-[#1C1614] mb-4">Exchanges</h2>
              <ul className="space-y-2 text-sm text-[#6B6560]">
                <li>• Size exchanges available subject to availability</li>
                <li>• Color exchanges allowed for unworn items</li>
                <li>• Exchange shipping is free for the first exchange</li>
              </ul>
            </motion.div>

            {/* Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 border border-[#E8E4DF]"
            >
              <h2 className="text-lg font-serif text-[#1C1614] mb-4">Return Conditions</h2>
              <ul className="space-y-2 text-sm text-[#6B6560]">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> No stains, odors, or damage
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> Tags attached and not removed
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" /> Original receipt included
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}