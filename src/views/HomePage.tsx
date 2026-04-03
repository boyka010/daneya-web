'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Star, Send, Quote } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { navigate } from '@/lib/router';
import { newArrivals, bestSellers, saleItems, trendingItems } from '@/data/products';
import { collections } from '@/data/collections';
import { testimonials } from '@/data/testimonials';
import ProductCard from '@/components/product/ProductCard';
import type { HomeSection } from '@/store/useStore';

/* ─── Section Header Component ─── */
function SectionHeader({ title, subtitle, actionLabel, onAction }: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-end justify-between mb-8 sm:mb-10">
      <div>
        {subtitle && (
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8B6F47] mb-2 font-sans">
            {subtitle}
          </p>
        )}
        <h2 className="section-heading text-xl sm:text-2xl lg:text-[1.75rem] text-[#1C1614]">
          {title}
        </h2>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="hidden sm:flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#1C1614] hover:text-[#8B6F47] transition-colors font-sans group"
        >
          {actionLabel}
          <ArrowRight size={12} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
        </button>
      )}
    </div>
  );
}

/* ─── Trust Badges ─── */
function TrustBadges() {
  return (
    <section className="py-8 bg-[#F5F2EE] border-y border-[#E8E4DF]">
      <div className="px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On orders over EGP 2,000' },
            { icon: '🛡️', title: 'Secure Payment', desc: '100% Secure checkout' },
            { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
            { icon: '💬', title: 'WhatsApp Support', desc: 'Quick responses' },
          ].map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <p className="text-[11px] font-semibold text-warm-text">{badge.title}</p>
                <p className="text-[9px] text-muted-foreground font-light">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Offers Section - 3 Offers ─── */
function OffersSection() {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            title: 'Buy 1 Get 1',
            subtitle: 'Free abaya on all sets',
            bg: 'bg-gradient-to-r from-rose-500 to-pink-500',
            icon: '🎁',
          },
          {
            title: 'Flash Sale',
            subtitle: 'Up to 70% OFF',
            bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
            icon: '⚡',
          },
          {
            title: 'Free Shipping',
            subtitle: 'Orders over EGP 2,000',
            bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
            icon: '🚚',
          },
        ].map((offer, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate({ type: 'shop' })}
            className={`${offer.bg} p-6 rounded-xl cursor-pointer hover:opacity-90 transition-opacity group`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{offer.icon}</span>
              <div>
                <h3 className="text-white font-semibold text-lg">{offer.title}</h3>
                <p className="text-white/80 text-sm">{offer.subtitle}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Hero Section ─── */
function HeroSection({ config }: { config: Record<string, string | number | boolean> }) {
  const slides = [
    {
      image: '/images/hero/hero-1.png',
      overline: 'NEW COLLECTION',
      title: 'Eid Al-Fitr Edit',
      subtitle: 'Discover the new modest luxury collection',
      cta: 'Shop Collection',
      link: 'shop',
    },
    {
      image: '/images/hero/hero-2.png',
      overline: 'JUST ARRIVED',
      title: 'The Art of Simplicity',
      subtitle: 'Where contemporary elegance meets timeless modesty',
      cta: 'Explore Now',
      link: 'shop',
    },
    {
      image: '/images/hero/hero-3.png',
      overline: 'EXCLUSIVE',
      title: 'Quiet Luxury',
      subtitle: 'Crafted for the modern woman who values distinction',
      cta: 'Discover',
      link: 'shop',
    },
  ];

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const interval = (config.interval as number) || 6;
  const autoplay = config.autoplay !== false;
  const [progress, setProgress] = useState(0);

  const goTo = useCallback((index: number) => {
    if (isTransitioning || index === current) return;
    setIsTransitioning(true);
    setProgress(0);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isTransitioning, current]);

  const goNext = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);
  const goPrev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length]);

  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(goNext, interval * 1000);
      return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
    }
  }, [autoplay, goNext, interval]);

  useEffect(() => {
    if (autoplay && !isTransitioning) {
      const timer = setInterval(() => {
        setProgress(p => p >= 100 ? 0 : p + (100 / (interval * 10)));
      }, 100);
      return () => clearInterval(timer);
    }
  }, [autoplay, isTransitioning, interval]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[85vh] overflow-hidden bg-[#1C1614]">
      {/* Background Image with Ken Burns Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Elegant Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1614]/80 via-[#1C1614]/30 to-transparent" />
      <div className="absolute inset-0 bg-[#1C1614]/20" />

      {/* Animated Side Lines */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="group flex items-center gap-2"
          >
            <span className={`w-8 h-[1px] transition-all duration-500 ${i === current ? 'bg-[#C9A97A] w-12' : 'bg-white/30 group-hover:bg-white/60'}`} />
            <span className={`text-[9px] uppercase tracking-[0.2em] transition-colors ${i === current ? 'text-[#C9A97A]' : 'text-white/40'}`}>
              0{i + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Content - Left Aligned */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl"
            >
              {/* Overline */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="overflow-hidden mb-4"
              >
                <span className="inline-block text-[#C9A97A] text-[10px] font-medium uppercase tracking-[0.35em] border-b border-[#C9A97A] pb-2">
                  {slide.overline}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal text-white leading-[1.1] tracking-[0.02em]"
              >
                {slide.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="mt-6 text-white/70 text-sm sm:text-base font-light leading-relaxed max-w-md"
              >
                {slide.subtitle}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate({ type: slide.link as any })}
                  className="group mt-8 sm:mt-10 relative overflow-hidden bg-[#C9A97A] text-[#1C1614] px-10 py-4"
                >
                  <span className="relative z-10 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] flex items-center gap-3">
                    {slide.cta}
                    <ArrowRight size={14} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-[#1C1614] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {slide.cta}
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrows */}
      <div className="absolute bottom-8 left-auto right-8 flex items-center gap-3 z-10">
        <button
          onClick={goPrev}
          className="w-12 h-12 flex items-center justify-center border border-white/20 hover:border-[#C9A97A] hover:bg-[#C9A97A]/10 text-white/60 hover:text-[#C9A97A] transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>
        <button
          onClick={goNext}
          className="w-12 h-12 flex items-center justify-center border border-white/20 hover:border-[#C9A97A] hover:bg-[#C9A97A]/10 text-white/60 hover:text-[#C9A97A] transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        <motion.div
          className="h-full bg-[#C9A97A]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[8px] uppercase tracking-[0.2em] text-white/40">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-[1px] h-8 bg-gradient-to-b from-[#C9A97A] to-transparent"
        />
      </motion.div>
    </section>
  );
}

/* ─── Collections Section ─── */
function CollectionsSection({ title, collections: collectionData }: { title: string; collections?: { id: string; name: string; slug: string; description: string; image: string; productCount: number; featured?: boolean }[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const featured = (collectionData || collections).filter(c => c.featured);

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-0 max-w-[1600px] mx-auto">
      {/* Bigger Circular Collection Cards - Horizontal Scroll */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 lg:gap-10 overflow-x-auto no-scrollbar pb-6 px-4 sm:px-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {featured.map((collection, i) => (
          <motion.button
            key={collection.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => navigate({ type: 'shop', category: collection.slug })}
            className="flex-shrink-0 group flex flex-col items-center"
          >
            {/* Circle Image - Much Bigger */}
            <div className="relative w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] lg:w-[280px] lg:h-[280px]">
              {/* Outer Ring - Gold on hover */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-[#C9A97A] transition-all duration-500" />
              
              {/* Image Container */}
              <div className="absolute inset-[4px] rounded-full overflow-hidden bg-[#F5F2EE]">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-115"
                  sizes="280px"
                  priority={i < 3}
                />
                {/* Hover Overlay with Name */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1614]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-white text-xs font-medium uppercase tracking-[0.15em]">
                    Shop Now
                  </span>
                </div>
              </div>
            </div>
            {/* Collection Name */}
            <span className="mt-4 text-[11px] font-medium uppercase tracking-[0.15em] text-[#1C1614] group-hover:text-[#C9A97A] transition-colors font-sans">
              {collection.name}
            </span>
          </motion.button>
        ))}
        
        {/* View All Circle */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: featured.length * 0.1, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => navigate({ type: 'shop' })}
          className="flex-shrink-0 group flex flex-col items-center"
        >
          <div className="relative w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] lg:w-[280px] lg:h-[280px]">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#E8E4DF] group-hover:border-[#C9A97A] transition-all duration-500" />
            <div className="absolute inset-[4px] rounded-full bg-[#F5F2EE] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#C9A97A]/10 flex items-center justify-center mb-3 group-hover:bg-[#C9A97A]/20 transition-colors">
                <ArrowRight size={24} strokeWidth={1.5} className="text-[#C9A97A] rotate-90 lg:rotate-0" />
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#1C1614]">
                View All
              </span>
            </div>
          </div>
        </motion.button>
      </div>
    </section>
  );
}

/* ─── Product Grid Section ─── */
function ProductGridSection({
  title,
  subtitle,
  items,
  actionLabel,
  count = 8,
}: {
  title: string;
  subtitle?: string;
  items: { id: number; name: string; category: string; price: number; originalPrice?: number; image: string; images: string[]; colors: { name: string; hex: string }[]; sizes: string[]; badge: string; rating: number; reviews: number; material: string; description: string; stock?: number; sku: string; tags: string[] }[];
  actionLabel?: string;
  count?: number;
}) {
  const displayItems = items.slice(0, count);

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        actionLabel={actionLabel}
        onAction={() => navigate({ type: 'shop' })}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
        {displayItems.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
      {/* Mobile action */}
      {actionLabel && (
        <div className="mt-8 text-center sm:hidden">
          <button
            onClick={() => navigate({ type: 'shop' })}
            className="text-[10px] font-medium uppercase tracking-[0.12em] text-warm-text border border-warm-border px-6 py-2.5 hover:bg-warm-text hover:text-warm-bg transition-all duration-300 font-sans"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </section>
  );
}

/* ─── Banner Section ─── */
function BannerSection({ title, config }: { title: string; config: Record<string, string | number | boolean> }) {
  const image = (config.image as string) || '/images/hero/hero-2.png';
  const isDark = config.dark !== false;

  return (
    <section className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className={`absolute inset-0 ${isDark ? 'hero-grad' : 'bg-gradient-to-t from-black/20 to-transparent'}`} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h2 className="font-serif-heading text-2xl sm:text-4xl lg:text-5xl font-normal text-white tracking-wide">
          {title}
        </h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate({ type: 'shop' })}
          className="mt-6 sm:mt-8 bg-white text-warm-text px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.15em] hover:bg-camel hover:text-white transition-all duration-500 font-sans"
        >
          Shop Now
        </motion.button>
      </div>
    </section>
  );
}

/* ─── Testimonials Section ─── */
function TestimonialsSection({ title }: { title: string }) {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-secondary/40">
      <div className="px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
        <div className="text-center mb-12 sm:mb-14">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-camel mb-2 font-sans">
            Testimonials
          </p>
          <h2 className="section-heading text-xl sm:text-2xl lg:text-[1.75rem] text-warm-text">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-6 sm:p-7 border border-warm-border"
            >
              <Quote size={16} strokeWidth={1} className="text-camel/30 mb-4" />
              <p className="text-xs text-warm-text/80 font-light leading-relaxed mb-5 italic font-serif-heading">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-warm-text font-sans">{testimonial.name}</p>
                  <p className="text-[9px] text-muted-foreground font-light font-sans">{testimonial.location}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={10}
                    strokeWidth={1.5}
                    className={star <= testimonial.rating ? 'star-filled fill-camel' : 'star-empty'}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Newsletter Section ─── */
function NewsletterSection({ title, subtitle }: { title: string; subtitle?: string }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-camel mb-2 font-sans">
          Newsletter
        </p>
        <h2 className="section-heading text-xl sm:text-2xl lg:text-[1.75rem] text-warm-text mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground font-light leading-relaxed mb-8 font-sans">
            {subtitle}
          </p>
        )}

        {submitted ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif-heading text-lg text-warm-text"
          >
            Welcome to the DANEYA family.
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center border border-warm-border overflow-hidden">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3.5 bg-transparent text-xs text-warm-text placeholder:text-muted-foreground focus:outline-none font-light font-sans"
              required
            />
            <button
              type="submit"
              className="px-5 py-3.5 bg-warm-text text-warm-bg hover:bg-camel transition-colors duration-300"
              aria-label="Subscribe"
            >
              <Send size={14} strokeWidth={1.5} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ─── Main HomePage ─── */
export default function HomePage() {
  const homeSections = useStore((s) => s.homeSections);
  const storeProducts = useStore((s) => s.adminProducts);
  const storeCollections = useStore((s) => s.adminCollections);

  const renderSection = (section: HomeSection) => {
    switch (section.type) {
      case 'hero':
        return <HeroSection key={section.id} config={section.config} />;
      case 'collections':
        return <CollectionsSection key={section.id} title={section.title} collections={storeCollections} />;
      case 'featured_products':
        return (
          <ProductGridSection
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            items={bestSellers.length > 0 ? bestSellers : storeProducts.slice(0, 8)}
            actionLabel="View All"
            count={(section.config.count as number) || 8}
          />
        );
      case 'new_arrivals':
        return (
          <ProductGridSection
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            items={storeProducts.slice(0, 4)}
            actionLabel="View All"
            count={(section.config.count as number) || 4}
          />
        );
      case 'banner':
        return <BannerSection key={section.id} title={section.title} config={section.config} />;
      case 'testimonials':
        return <TestimonialsSection key={section.id} title={section.title} />;
      case 'newsletter':
        return <NewsletterSection key={section.id} title={section.title} subtitle={section.subtitle} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {homeSections
        .filter((section) => section.enabled)
        .map((section) => renderSection(section))}
      <TrustBadges />
    </div>
  );
}
