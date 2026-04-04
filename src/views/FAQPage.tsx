'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SEO from '@/components/SEO';

const faqs = [
  {
    question: 'What is your shipping policy?',
    answer: 'We offer free shipping on orders over EGP 2,000. Standard shipping costs EGP 80 and takes 2-5 business days. Express shipping (EGP 150) delivers within 1-2 days in Cairo and Giza.'
  },
  {
    question: 'How do I initiate a return?',
    answer: 'Contact us via WhatsApp or email within 30 days of delivery. We\'ll arrange a pickup or provide return instructions. Refunds are processed within 5-7 business days after inspection.'
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently we ship within Egypt only. Contact us for special arrangements for international orders.'
  },
  {
    question: 'How can I track my order?',
    answer: 'You\'ll receive a WhatsApp message with your tracking number once your order ships. You can also contact us for real-time updates.'
  },
  {
    question: 'Are your products true to size?',
    answer: 'Our sizing is standard, but we recommend checking our size guide. If you\'re between sizes, we suggest sizing up for a more relaxed fit.'
  },
  {
    question: 'Do you offer custom sizing?',
    answer: 'Yes! We offer custom alterations for an additional fee. Contact us before placing your order to discuss your requirements.'
  },
  {
    question: 'How do I care for my abaya?',
    answer: 'Most of our abayas are machine washable on gentle cycle. We recommend cold water and air drying. Please check the care label on your specific item for best results.'
  },
  {
    question: 'Can I change my order after placing it?',
    answer: 'You can make changes within 24 hours of placing your order, as long as it hasn\'t been shipped yet. Contact us immediately with your order number and changes.'
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <SEO 
        title="FAQ | DANEYA Egypt"
        description="Frequently asked questions about shipping, returns, sizing, and more. Find answers to common questions about shopping at DANEYA."
      />
      <div className="min-h-screen bg-[#FAF7F4] pt-20 pb-16">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1614] mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-[#6B6560] font-light">
              Find answers to common questions about DANEYA
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-[#E8E4DF] overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[#FAF7F4] transition-colors"
                >
                  <span className="font-medium text-[#1C1614] pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`flex-shrink-0 text-[#6B6560] transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                    size={20}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 text-sm text-[#6B6560] leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-[#6B6560] mb-4">Can't find your answer?</p>
            <a 
              href="https://wa.me/201XXXXXXXXX"
              className="inline-block px-6 py-3 bg-[#C4748C] text-white text-sm font-medium uppercase tracking-wider hover:bg-[#1C1614] transition-colors"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
}