'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Star, Send, Quote, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { navigate } from '@/lib/router';
import { newArrivals, bestSellers, saleItems, trendingItems } from '@/data/products';
import { collections } from '@/data/collections';
import { testimonials } from '@/data/testimonials';
import ProductCard from '@/components/product/ProductCard';
import type { HomeSection } from '@/store/useStore';
import { getShopifyProducts, getShopifyCollections, getCollectionProducts } from '@/lib/shopify-queries';
import type { Product } from '@/data/products';
import BrandManifesto from '@/components/home/BrandManifesto';
import EnhancedTestimonials from '@/components/home/EnhancedTestimonials';
import InstagramFeed from '@/components/home/InstagramFeed';
import ProductSlider from '@/components/home/ProductSlider';

/* ─── Section Header Component ─── */
function SectionHeader({ title, subtitle, actionLabel, onAction }: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-end justify-between mb-12 sm:mb-16">
      <div>
        {subtitle && (
          <p className="text-caption text-[#C9A97A] mb-3">
            {subtitle}
          </p>
        )}
        <h2 className="text-title lg:text-3xl text-[#1C1614]">
          {title}
        </h2>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="hidden sm:flex items-center gap-3 text-caption text-[#1C1614] hover:text-[#C9A97A] transition-colors group"
        >
          {actionLabel}
          <ArrowRight size={14} strokeWidth={1} className="transition-transform group-hover:translate-x-1" />
        </button>
      )}
    </div>
  );
}

/* ─── Trust Badges ─── */
function TrustBadges() {
  return (
    <section className="py-6 sm:py-8 bg-white border-b border-[#E8E4DF]">
      <div className="px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'Orders over EGP 2,000' },
            { icon: '💳', title: 'Secure Payment', desc: 'Visa, Mastercard, Fawry' },
            { icon: '↩️', title: 'Easy Returns', desc: '7-day return policy' },
            { icon: '💬', title: 'WhatsApp Support', desc: 'Quick responses' },
          ].map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-xl">{badge.icon}</span>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#1C1614]">{badge.title}</p>
                <p className="text-[10px] text-[#6B6560] mt-0.5">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Offers Section - Clean, no fake sales ─── */
function OffersSection() {
  return (
    <section className="py-16 sm:py-20 px-6 sm:px-10 lg:px-16 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {[
          {
            title: 'New Season',
            subtitle: 'Explore the latest collection',
            bg: 'bg-[#1C1614]',
            icon: '✨',
          },
          {
            title: 'Free Shipping',
            subtitle: 'On orders over EGP 2,000',
            bg: 'bg-[#C9A97A]',
            icon: '📦',
          },
          {
            title: 'WhatsApp Support',
            subtitle: 'Order directly via WhatsApp',
            bg: 'bg-[#FAF7F4]',
            textDark: true,
            icon: '💬',
          },
        ].map((offer, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            onClick={() => navigate({ type: 'shop' })}
            className={`${offer.bg} p-8 lg:p-10 cursor-pointer group transition-all duration-500 hover:shadow-xl`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{offer.icon}</span>
              <div>
                <h3 className={`${offer.textDark ? 'text-[#1C1614]' : 'text-white'} font-serif-heading text-xl lg:text-2xl`}>{offer.title}</h3>
                <p className={`${offer.textDark ? 'text-[#6B6560]' : 'text-white/70'} text-sm mt-1`}>{offer.subtitle}</p>
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
  const defaultSlides = [
    { image: '/images/hero/hero-1.png', overline: 'NEW COLLECTION', title: 'Eid Al-Fitr Edit', subtitle: 'Discover the new modest luxury collection', cta: 'Shop Collection', link: '/shop' },
    { image: '/images/hero/hero-2.png', overline: 'JUST ARRIVED', title: 'The Art of Simplicity', subtitle: 'Where contemporary elegance meets timeless modesty', cta: 'Explore Now', link: '/shop' },
    { image: '/images/hero/hero-3.png', overline: 'EXCLUSIVE', title: 'Quiet Luxury', subtitle: 'Crafted for the modern woman who values distinction', cta: 'Discover', link: '/shop' },
  ];

  let slides = defaultSlides;
  if (config.slides) {
    try {
      const parsed = JSON.parse(config.slides as string);
      if (Array.isArray(parsed) && parsed.length > 0) {
        slides = parsed;
      }
    } catch {
      // Use default slides if parsing fails
    }
  }

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
    <section className="relative w-full h-[calc(65vh+56px)] sm:h-[calc(80vh+64px)] -mt-14 sm:-mt-16 overflow-hidden bg-[#1C1614]">
      {/* Background Image with Ken Burns Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
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

      {/* Light overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Content - Centered, minimal */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center max-w-[1440px] px-6 sm:px-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Overline */}
              {slide.overline && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mb-4"
                >
                  <span className="text-caption text-white/80">
                    {slide.overline}
                  </span>
                </motion.div>
              )}

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-display"
              >
                {slide.title}
              </motion.h1>

              {/* Subtitle */}
              {slide.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                  className="mt-5 text-white/70 text-base font-light leading-relaxed max-w-lg mx-auto"
                >
                  {slide.subtitle}
                </motion.p>
              )}

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="mt-8"
              >
                {slide.cta && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const link = slide.link || '/shop';
                      if (typeof window !== 'undefined') {
                        window.location.hash = link.startsWith('/') ? `#${link}` : `#/shop`;
                      }
                    }}
                    className="bg-white text-[#1C1614] px-10 py-3.5 text-caption hover:bg-[#C9A97A] hover:text-white transition-all duration-500"
                  >
                    {slide.cta}
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ─── Collections Section ─── */
function CollectionsSection({ title, config }: { title: string; config: Record<string, string | number | boolean> }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Read collections from config
  let manualCollections: { name: string; slug: string; image: string }[] = [];
  if (config.collections) {
    try {
      manualCollections = JSON.parse(config.collections as string);
    } catch {
      // Use empty if parsing fails
    }
  }

  if (manualCollections.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-10 lg:py-12 px-0 max-w-[1600px] mx-auto">
      {/* Centered Title */}
      <div className="text-center px-4 sm:px-6 mb-8">
        <h2 className="section-heading">
          {title}
        </h2>
      </div>
      {/* Bigger Circular Collection Cards - Horizontal Scroll */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 lg:gap-10 overflow-x-auto no-scrollbar pb-6 px-4 sm:px-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {manualCollections.map((collection, i) => (
          <motion.button
            key={collection.slug}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => navigate({ type: 'shop', category: collection.slug })}
            className="flex-shrink-0 group flex flex-col items-center"
          >
            {/* Circle Image */}
            <div className="relative w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] lg:w-[280px] lg:h-[280px]">
              <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-[#C9A97A] transition-all duration-500" />
              <div className="absolute inset-[4px] rounded-full overflow-hidden bg-[#F5F2EE]">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-115"
                  sizes="280px"
                  priority={i < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1614]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-white text-xs font-medium uppercase tracking-[0.15em]">
                    Shop Now
                  </span>
                </div>
              </div>
            </div>
            <span className="mt-4 text-[11px] font-medium uppercase tracking-[0.15em] text-[#1C1614] group-hover:text-[#C9A97A] transition-colors font-sans">
              {collection.name}
            </span>
          </motion.button>
        ))}
        
        {/* View All Circle */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: manualCollections.length * 0.1, ease: [0.22, 1, 0.36, 1] }}
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
function BannerSection({ config }: { title: string; config: Record<string, string | number | boolean> }) {
  const imageDesktop = (config.imageDesktop as string) || '/images/hero/hero-2.png';
  const imageMobile = (config.imageMobile as string) || imageDesktop;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Desktop image - hidden on mobile */}
      <div className="hidden sm:block relative w-full h-[50vh] lg:h-[60vh]">
        <Image
          src={imageDesktop}
          alt=""
          fill
          className="object-cover"
          sizes="1920px"
        />
      </div>
      {/* Mobile image - hidden on desktop */}
      <div className="block sm:hidden relative w-full h-[70vh]">
        <Image
          src={imageMobile}
          alt=""
          fill
          className="object-cover"
          sizes="750px"
        />
      </div>
    </section>
  );
}

/* ─── Testimonials Section ─── */
function TestimonialsSection({ title, config }: { title: string; config: Record<string, string | number | boolean> }) {
  const defaultTestimonials = [
    { id: 1, name: 'Nour E.', location: 'Cairo, Egypt', avatar: '', rating: 5, text: 'The quality is amazing — the fabric feels so premium and the fit is perfect for everyday wear.', product: 'Aura Oversized Abaya Set', verified: true },
    { id: 2, name: 'Menna A.', location: 'Alexandria, Egypt', avatar: '', rating: 5, text: 'Finally found a brand that gets modest fashion right. The Ripple Set is my go-to now.', product: 'Ripple Oversized Set', verified: true },
    { id: 3, name: 'Sara M.', location: 'Giza, Egypt', avatar: '', rating: 5, text: 'I was hesitant to order online but the quality exceeded my expectations.', product: 'Daneya Oversized Abaya', verified: true },
    { id: 4, name: 'Hana K.', location: 'Mansoura, Egypt', avatar: '', rating: 4, text: 'Beautiful pieces and great customer service. The packaging was lovely.', product: 'Essentials Abaya', verified: true },
  ];

  let testimonials = defaultTestimonials;
  if (config.testimonials) {
    try {
      const parsed = JSON.parse(config.testimonials as string);
      if (Array.isArray(parsed) && parsed.length > 0) {
        testimonials = parsed;
      }
    } catch {
      // Use default testimonials if parsing fails
    }
  }

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
          {testimonials.map((testimonial: any, i: number) => (
            <motion.div
              key={testimonial.id || i}
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
                <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden flex items-center justify-center">
                  {testimonial.avatar ? (
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-[10px] font-semibold text-camel">{testimonial.name.charAt(0)}</span>
                  )}
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

/* ─── Size Guide Section ─── */
function SizeGuideSection({ config }: { title: string; config: Record<string, string | number | boolean> }) {
  const image = (config.image as string) || 'https://daneya.shop/cdn/shop/files/Chest_20251118_234817_0000.png?v=1763519409&width=600';

  return (
    <section className="py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
      <div className="text-center mb-8">
        <h2 className="section-heading">Size Guide</h2>
      </div>
      <div className="max-w-2xl mx-auto">
        <Image
          src={image}
          alt="Size Guide"
          width={600}
          height={800}
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}

/* ─── Main HomePage ─── */
export default function HomePage() {
  const homeSections = useStore((s) => s.homeSections);
  const storeProducts = useStore((s) => s.adminProducts);
  const [shopifyProducts, setShopifyProducts] = useState<Product[]>([]);
  const [shopifyCollections, setShopifyCollections] = useState<any[]>([]);
  const [collectionProducts, setCollectionProducts] = useState<Record<string, Product[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    async function loadData() {
      const minLoading = new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const [products, collections] = await Promise.all([
          getShopifyProducts(),
          getShopifyCollections(),
        ]);
        if (!cancelled) {
          setShopifyProducts(products);
          setShopifyCollections(collections || []);

          // Fetch products for each collection_products section
          const collectionSections = homeSections.filter(s => s.type === 'collection_products');
          console.log('Collection sections to fetch:', collectionSections.map(s => ({ title: s.title, handle: s.config.collection })));
          
          const fetchPromises = collectionSections.map(async (section) => {
            const handle = section.config.collection as string;
            const count = (section.config.count as number) || 8;
            if (handle) {
              console.log(`Fetching collection "${handle}" with count ${count}`);
              const prods = await getCollectionProducts(handle, count);
              console.log(`Collection "${handle}" returned ${prods.length} products`);
              return { handle, products: prods };
            }
            return null;
          });
          const results = await Promise.all(fetchPromises);
          if (!cancelled) {
            const map: Record<string, Product[]> = {};
            results.forEach(r => { if (r) map[r.handle] = r.products; });
            console.log('Collection products map:', Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v.length])));
            setCollectionProducts(map);
          }
        }
      } catch (error) {
        console.error('Failed to load Shopify data:', error);
      } finally {
        if (!cancelled) {
          await minLoading;
          setIsLoading(false);
        }
      }
    }
    
    loadData();
    return () => { cancelled = true; };
  }, []);

  const products = shopifyProducts.length > 0 ? shopifyProducts : storeProducts;
  const collections = shopifyCollections.length > 0 
    ? shopifyCollections.map((c: any) => ({
        id: c.id,
        name: c.title,
        slug: c.handle,
        description: c.description || '',
        image: c.image?.url || '',
        productCount: 0,
        featured: true,
      }))
    : [];

  const renderSection = (section: HomeSection) => {
    switch (section.type) {
      case 'hero':
        return <HeroSection key={section.id} config={section.config} />;
      case 'collections':
        return <CollectionsSection key={section.id} title={section.title} config={section.config} />;
      case 'featured_products':
        return (
          <ProductSlider
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            items={products.slice(0, 12)}
            actionLabel="View All"
            count={(section.config.count as number) || 12}
          />
        );
      case 'new_arrivals':
        return (
          <ProductSlider
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            items={products.slice(12, 24)}
            actionLabel="View All"
            count={(section.config.count as number) || 8}
          />
        );
      case 'collection_products': {
        const handle = section.config.collection as string;
        const count = (section.config.count as number) || 8;
        const sectionProducts = collectionProducts[handle] || products.slice(0, count);
        return (
          <ProductSlider
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            items={sectionProducts}
            actionLabel="View All"
            count={count}
          />
        );
      }
      case 'banner':
        return <BannerSection key={section.id} title={section.title} config={section.config} />;
      case 'testimonials':
        return <TestimonialsSection key={section.id} title={section.title} config={section.config} />;
      case 'newsletter':
        return <NewsletterSection key={section.id} title={section.title} subtitle={section.subtitle} />;
      case 'size_guide':
        return <SizeGuideSection key={section.id} title={section.title} config={section.config} />;
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
