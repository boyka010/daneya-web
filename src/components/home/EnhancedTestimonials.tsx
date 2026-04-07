'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Quote, Star } from 'lucide-react';
import Image from 'next/image';
import { testimonials } from '@/data/testimonials';
import { useNavigate } from '@/hooks/useNavigate';

export default function EnhancedTestimonialsSection({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#FAF7F4]">
      <div className="px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
        {/* Header with stats */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 sm:mb-14">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C4748C] mb-2 font-sans">
              Customer Love
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] text-[#1C1614] font-serif">
              {title}
            </h2>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-8 mt-6 md:mt-0">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} fill="#C9A97A" stroke="#C9A97A" />
                ))}
              </div>
              <p className="text-xl font-serif text-[#1C1614]">4.9</p>
              <p className="text-[10px] text-[#6B6560]">Average Rating</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-serif text-[#1C1614]">2,500+</p>
              <p className="text-[10px] text-[#6B6560]">Happy Customers</p>
            </div>
          </div>
        </div>

        {/* Testimonials Grid - Larger cards with more detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-6 sm:p-7 border border-[#E8E4DF] hover:shadow-lg hover:border-[#C4748C]/30 transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote size={20} strokeWidth={1} className="text-[#C4748C]/30 mb-4" />
              
              {/* Rating */}
              <div className="flex items-center gap-0.5 mb-3">
                {[1,2,3,4,5].map((star) => (
                  <Star 
                    key={star} 
                    size={12} 
                    fill={star <= testimonial.rating ? "#C9A97A" : "none"} 
                    stroke={star <= testimonial.rating ? "#C9A97A" : "#D4CFC8"}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              
              {/* Review Text */}
              <p className="text-xs text-[#1C1614]/80 font-light leading-relaxed mb-5 font-serif italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              
              {/* Customer Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F5F2EE] overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#1C1614]">{testimonial.name}</p>
                  <p className="text-[10px] text-[#6B6560]">{testimonial.location}</p>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="mt-4 pt-4 border-t border-[#E8E4DF]">
                <p className="text-[9px] text-[#6B6560] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                  Verified Purchase
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate({ type: 'shop' })}
            className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#1C1614] hover:text-[#C4748C] transition-colors font-sans group"
          >
            View All Reviews
            <ArrowRight size={12} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}