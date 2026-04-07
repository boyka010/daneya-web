'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useNavigate } from '@/hooks/useNavigate';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const [email, setEmail] = useState('');

  const values = [
    {
      title: 'QUALITY',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      description: 'Every piece is crafted from premium natural fabrics — silk, chiffon, organic cotton — chosen for their exceptional feel and lasting beauty.',
    },
    {
      title: 'SUSTAINABILITY',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22c4-4 8-7.5 8-12a8 8 0 10-16 0c0 4.5 4 8 8 12z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 13a3 3 0 100-6 3 3 0 000 6z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      description: 'We work with ethical mills and use eco-friendly packaging. Our commitment to the planet is woven into every thread.',
    },
    {
      title: 'COMMUNITY',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      description: 'DANEYA connects women across 50+ countries through a shared love of modest fashion that empowers self-expression.',
    },
  ];

  const stats = [
    { number: '50+', label: 'Countries' },
    { number: '100K+', label: 'Customers' },
    { number: '100%', label: 'Premium' },
  ];

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
        <Image
          src="/images/hero/about-hero.png"
          alt="About DANEYA"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red mb-4">
              Our Story
            </p>
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.9] text-white uppercase">
              THE ART OF
              <br />
              <span className="text-red">QUIET ELEGANCE</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── Brand Story ── */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="anim-up">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red mb-4 block">
                Founded 2022
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black uppercase leading-tight">
                Where Modesty
                <br />
                Meets Modernity
              </h2>
            </div>
            <div className="anim-up" style={{ animationDelay: '0.1s' }}>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                DANEYA was born from a simple belief: that modest fashion deserves the same
                level of artistry, quality, and attention as the world&apos;s finest luxury brands.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-4">
                We source our fabrics from the finest mills across Europe and Asia,
                working directly with artisans who share our passion for exceptional
                craftsmanship. Every hijab in our collection is designed to drape beautifully,
                feel extraordinary against the skin, and last for years to come.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-4">
                Our name, DANEYA, means &ldquo;modesty&rdquo; and &ldquo;life&rdquo; — a duality that
                captures our mission: to bring vitality and joy to modest fashion,
                proving that covering can be just as expressive as any other form of style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values Grid ── */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red mb-2 block">
              What We Stand For
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-black uppercase">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 sm:p-10 border-2 border-gray-200 hover:border-black transition-colors duration-300"
              >
                <div className="text-black mb-4">{value.icon}</div>
                <h3 className="text-lg font-black text-black mb-4 tracking-wider">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats on Dark BG ── */}
      <section className="py-16 sm:py-24 bg-[#0A0A0A]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-none">
                  {stat.number}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mt-2">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter Section ── */}
      <section className="bg-[#0A0A0A] py-16 sm:py-24 border-t border-white/10">
        <div className="max-w-xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase leading-tight">
            JOIN THE DANEYA FAMILY
          </h2>
          <p className="text-sm text-gray-400 mt-3">
            New arrivals, exclusive offers, and the stories behind our collections.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-gray-600 focus:border-red focus:outline-none transition-colors py-3.5 px-4 text-sm font-medium"
            />
            <button
              onClick={() => { if (email) setEmail(''); }}
              className="px-8 py-3.5 bg-red text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
