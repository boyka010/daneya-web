'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Instagram, Facebook } from 'lucide-react';
import SEO from '@/components/SEO';

export default function ContactPage() {
  return (
    <>
      <SEO 
        title="Contact Us | DANEYA Egypt"
        description="Get in touch with DANEYA. Contact us via WhatsApp, phone, or email. We're here to help with any questions about your order or our products."
      />
      <div className="min-h-screen bg-[#FAF7F4] pt-20 pb-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1614] mb-4">
              Contact Us
            </h1>
            <p className="text-[#6B6560] font-light">
              We'd love to hear from you. Get in touch through any of these channels.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* WhatsApp */}
              <a 
                href="https://wa.me/201XXXXXXXXX"
                className="block bg-[#25D366] text-white p-6 hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center gap-4">
                  <MessageCircle size={32} />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm opacity-80">Quick responses</p>
                  </div>
                </div>
              </a>

              {/* Phone */}
              <a 
                href="tel:+201XXXXXXXXX"
                className="block bg-[#1C1614] text-white p-6 hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center gap-4">
                  <Phone size={32} />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-sm opacity-80">+20 1XX XXX XXXX</p>
                  </div>
                </div>
              </a>

              {/* Email */}
              <a 
                href="mailto:hello@daneya.com"
                className="block bg-white border border-[#E8E4DF] text-[#1C1614] p-6 hover:border-[#C4748C] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Mail size={32} className="text-[#C4748C]" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-[#6B6560]">hello@daneya.com</p>
                  </div>
                </div>
              </a>

              {/* Location */}
              <div className="block bg-white border border-[#E8E4DF] text-[#1C1614] p-6">
                <div className="flex items-center gap-4">
                  <MapPin size={32} className="text-[#C4748C]" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-[#6B6560]">Cairo, Egypt</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-[#E8E4DF] p-6"
            >
              <h2 className="text-lg font-serif text-[#1C1614] mb-6">Business Hours</h2>
              <ul className="space-y-3 text-sm text-[#6B6560]">
                <li className="flex justify-between">
                  <span>Saturday - Thursday</span>
                  <span className="font-medium text-[#1C1614]">10:00 AM - 10:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Friday</span>
                  <span className="font-medium text-[#1C1614]">Closed</span>
                </li>
              </ul>

              <h2 className="text-lg font-serif text-[#1C1614] mt-8 mb-6">Follow Us</h2>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com/daneya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-[#E8E4DF] hover:bg-[#C4748C] hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://facebook.com/daneya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-[#E8E4DF] hover:bg-[#C4748C] hover:text-white transition-colors"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Response Time Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center text-sm text-[#6B6560]"
          >
            <p>We typically respond within 24 hours. For urgent inquiries, please WhatsApp us!</p>
          </motion.div>
        </div>
      </div>
    </>
  );
}