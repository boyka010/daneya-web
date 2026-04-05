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
    <section className="py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
      {/* Header - Centered */}
      <div className="text-center mb-8">
        <h2 className="section-heading">
          {title}
        </h2>
      </div>

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

          {/* View All - inline as last item */}
          {actionLabel && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: displayItems.length * 0.05, duration: 0.4 }}
              className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] snap-start flex items-center justify-center"
            >
              <button
                onClick={() => window.location.hash = '#/shop'}
                className="w-full h-[320px] sm:h-[400px] md:h-[480px] lg:h-[560px] border border-[#E8E4DF] flex flex-col items-center justify-center gap-3 hover:bg-[#1C1614] hover:text-[#FAF7F4] transition-all duration-300 group"
              >
                <span className="text-caption">
                  {actionLabel}
                </span>
                <ChevronRight size={16} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}
      </div>
    </section>
  );
}