'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';

interface ProductSliderProps {
  title: string;
  subtitle?: string;
  items: any[];
  actionLabel?: string;
  count?: number;
}

export default function ProductSlider({ title, subtitle, items, actionLabel, count = 8 }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const displayItems = items.slice(0, count);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // approximate card width
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 sm:mb-10">
        <div>
          {subtitle && (
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8B6F47] mb-2 font-sans">
              {subtitle}
            </p>
          )}
          <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] text-[#1C1614] font-serif">
            {title}
          </h2>
        </div>
        {actionLabel && (
          <button
            onClick={() => window.location.hash = '#/shop'}
            className="hidden sm:flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#1C1614] hover:text-[#8B6F47] transition-colors font-sans group"
          >
            {actionLabel}
            <ChevronRight size={12} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>

      {/* Slider Controls - Visible on all screens */}
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white border border-[#E8E4DF] shadow-md flex items-center justify-center hover:border-[#C4748C] hover:shadow-lg transition-all duration-300 hidden md:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} strokeWidth={1.5} className="text-[#1C1614]" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white border border-[#E8E4DF] shadow-md flex items-center justify-center hover:border-[#C4748C] hover:shadow-lg transition-all duration-300 hidden md:flex"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} strokeWidth={1.5} className="text-[#1C1614]" />
        </button>

        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {displayItems.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] snap-start"
            >
              <ProductCard product={product} index={i} priority={i < 4} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile CTA */}
      {actionLabel && (
        <div className="mt-8 text-center sm:hidden">
          <button
            onClick={() => window.location.hash = '#/shop'}
            className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#1C1614] border border-[#E8E4DF] px-6 py-2.5 hover:bg-[#1C1614] hover:text-[#FAF7F4] transition-all duration-300 font-sans"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </section>
  );
}