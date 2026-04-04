'use client';

import { motion } from 'framer-motion';
import { Check, Shield, Truck, RotateCcw, MessageCircle, Mail, Phone } from 'lucide-react';
import SEO from '@/components/SEO';

export default function ShippingPage() {
  return (
    <>
      <SEO 
        title="Shipping & Delivery | DANEYA Egypt"
        description="Free shipping on orders over EGP 2,000. Learn about our delivery times, shipping methods, and international shipping policies."
      />
      <div className="min-h-screen bg-[#FAF7F4] pt-20 pb-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1614] mb-4">
              Shipping & Delivery
            </h1>
            <p className="text-[#6B6560] font-light">
              Everything you need to know about getting your order delivered
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Free Shipping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 border border-[#E8E4DF]"
            >
              <div className="flex items-center gap-3 mb-4">
                <Truck className="text-[#C4748C]" size={24} />
                <h2 className="text-lg font-serif text-[#1C1614]">Free Shipping</h2>
              </div>
              <ul className="space-y-2 text-sm text-[#6B6560]">
                <li>• Free shipping on all orders over EGP 2,000</li>
                <li>• Standard shipping: EGP 80 for orders under EGP 2,000</li>
                <li>• Express shipping: EGP 150 (delivered within 1-2 days)</li>
              </ul>
            </motion.div>

            {/* Delivery Times */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 border border-[#E8E4DF]"
            >
              <h2 className="text-lg font-serif text-[#1C1614] mb-4">Delivery Times</h2>
              <ul className="space-y-2 text-sm text-[#6B6560]">
                <li>• <strong>Cairo & Giza:</strong> 2-4 business days</li>
                <li>• <strong>Other Governorates:</strong> 3-5 business days</li>
                <li>• <strong>Express Delivery:</strong> 1-2 business days (Cairo & Giza only)</li>
              </ul>
            </motion.div>

            {/* Order Processing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 border border-[#E8E4DF]"
            >
              <h2 className="text-lg font-serif text-[#1C1614] mb-4">Order Processing</h2>
              <ul className="space-y-2 text-sm text-[#6B6560]">
                <li>• Orders are processed within 24-48 hours</li>
                <li>• Orders placed after 2 PM will be processed the next day</li>
                <li>• Custom orders may take 5-7 business days</li>
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 border border-[#E8E4DF]"
            >
              <h2 className="text-lg font-serif text-[#1C1614] mb-4">Questions?</h2>
              <p className="text-sm text-[#6B6560] mb-4">
                Contact our team for any shipping inquiries:
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="https://wa.me/201XXXXXXXXX" className="flex items-center gap-2 text-[#C4748C] hover:underline">
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <a href="mailto:hello@daneya.com" className="flex items-center gap-2 text-[#C4748C] hover:underline">
                  <Mail size={16} /> hello@daneya.com
                </a>
                <a href="tel:+201XXXXXXXXX" className="flex items-center gap-2 text-[#C4748C] hover:underline">
                  <Phone size={16} /> +20 1XX XXX XXXX
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}