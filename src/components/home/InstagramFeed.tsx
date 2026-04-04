'use client';

import { motion } from 'framer-motion';
import { Instagram, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { navigate } from '@/lib/router';

// Simulated Instagram feed - in production, connect to Instagram API
const instagramPosts = [
  { id: 1, image: '/images/hero/hero-1.png', likes: 234 },
  { id: 2, image: '/images/hero/hero-2.png', likes: 189 },
  { id: 3, image: '/images/hero/hero-3.png', likes: 312 },
  { id: 4, image: '/images/hero/hero-4.png', likes: 156 },
];

export default function InstagramFeed() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#FAF7F4]">
      <div className="px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <Instagram size={16} className="text-[#C4748C]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C4748C]">
                @DANEYA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] text-[#1C1614] font-serif">
              Shop the Look
            </h2>
            <p className="text-xs text-[#6B6560] mt-2">
              See how our community styles DANEYA pieces
            </p>
          </div>
          
          <a 
            href="https://instagram.com/daneya"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#1C1614] hover:text-[#C4748C] transition-colors mt-4 sm:mt-0"
          >
            Follow Us
            <ArrowRight size={12} />
          </a>
        </div>

        {/* Instagram Grid - 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {instagramPosts.map((post, i) => (
            <motion.a
              key={post.id}
              href="https://instagram.com/daneya"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative aspect-square overflow-hidden"
            >
              <Image
                src={post.image}
                alt="Instagram post"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-[#1C1614]/0 group-hover:bg-[#1C1614]/40 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                  <span className="text-lg">❤️</span>
                  <p className="text-xs mt-1">{post.likes}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Community Stats */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {[
            { number: '15K+', label: 'Instagram Followers' },
            { number: '50K+', label: 'TikTok Views' },
            { number: '5K+', label: 'User Photos' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-lg font-serif text-[#1C1614]">{stat.number}</p>
              <p className="text-[10px] text-[#6B6560] uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}