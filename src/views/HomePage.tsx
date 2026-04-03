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
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-camel mb-2 font-sans">
            {subtitle}
          </p>
        )}
        <h2 className="section-heading text-xl sm:text-2xl lg:text-[1.75rem] text-warm-text">
          {title}
        </h2>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="hidden sm:flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-warm-text hover:text-camel transition-colors font-sans group"
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
    <section className="py-8 bg-secondary/30 border-y border-warm-border">
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
      title: 'Eid Al-Fitr Edit',
      subtitle: 'Premium modest fashion crafted for the modern woman',
      cta: 'Shop Collection',
    },
    {
      image: '/images/hero/hero-2.png',
      title: 'New Arrivals',
      subtitle: 'Discover our latest collection of timeless essentials',
      cta: 'Explore Now',
    },
    {
      image: '/images/hero/hero-3.png',
      title: 'The Art of Simplicity',
      subtitle: 'Where modesty meets contemporary elegance',
      cta: 'Shop Now',
    },
  ];

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const interval = (config.interval as number) || 7;
  const autoplay = config.autoplay !== false;

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const goNext = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);
  const goPrev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length]);

  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(goNext, interval * 1000);
      return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
    }
  }, [autoplay, goNext, interval]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-[85vh] sm:h-[90vh] overflow-hidden bg-warm-text">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
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

      {/* Overlay */}
      <div className="hero-grad absolute inset-0" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
            {slide.subtitle && (
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-white/60 mb-3 sm:mb-4 font-sans">
                {slide.subtitle}
              </p>
            )}
            <h1 className="font-serif-heading text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-wide leading-tight">
              {slide.title}
            </h1>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate({ type: 'shop' })}
              className="mt-6 sm:mt-8 bg-white text-warm-text px-8 sm:px-10 py-3.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-camel hover:text-white transition-all duration-500 font-sans"
            >
              {slide.cta}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <div className="absolute bottom-1/2 left-4 sm:left-8 -translate-y-1/2 z-10">
        <button
          onClick={goPrev}
          className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white/60 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
      </div>
      <div className="absolute bottom-1/2 right-4 sm:right-8 -translate-y-1/2 z-10">
        <button
          onClick={goNext}
          className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white/60 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-500 ${
              i === current
                ? 'w-6 h-[2px] bg-white'
                : 'w-[2px] h-[2px] bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── Collections Section ─── */
function CollectionsSection({ title, collections: collectionData }: { title: string; collections?: { id: string; name: string; slug: string; description: string; image: string; productCount: number; featured?: boolean }[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const featured = (collectionData || collections).filter(c => c.featured);

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
      <SectionHeader title={title} subtitle="Curated Collections" />
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-2"
      >
        {featured.map((collection, i) => (
          <motion.button
            key={collection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => navigate({ type: 'shop', category: collection.slug })}
            className="flex-shrink-0 w-[160px] sm:w-[200px] lg:w-[220px] group"
          >
            <div className="aspect-[3/4] bg-secondary overflow-hidden mb-3 relative">
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="220px"
              />
            </div>
            <h3 className="font-serif-heading text-sm sm:text-base font-medium text-warm-text group-hover:text-camel transition-colors duration-300">
              {collection.name}
            </h3>
            <p className="text-[10px] text-muted-foreground font-light mt-1 font-sans">
              {collection.productCount} pieces
            </p>
          </motion.button>
        ))}
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
            Welcome to the HAYA family.
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
      <OffersSection />
      {homeSections
        .filter((section) => section.enabled)
        .map((section) => renderSection(section))}
      <TrustBadges />
    </div>
  );
}
