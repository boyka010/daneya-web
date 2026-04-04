'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { navigate } from '@/lib/router';

export default function BrandManifesto() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#1C1614] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C9A97A 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles size={16} className="text-[#C9A97A]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#C9A97A]">
              Our Philosophy
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white leading-[1.3] mb-8">
            Fashion that honors <br/>
            <span className="text-[#C4748C]">your values</span> & your <span className="text-[#C9A97A]">voice</span>
          </h2>
          
          <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-10">
            We believe modest fashion isn't about covering up—it's about expressing yourself with intention. 
            Each DANEYA piece is designed to make you feel powerful, elegant, and uniquely yourself.
            No compromises. No trends to follow. Just timeless pieces that speak to your soul.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate({ type: 'about' })}
              className="group inline-flex items-center gap-3 bg-[#C4748C] text-white px-8 py-4"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.15em]">
                Our Story
              </span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate({ type: 'shop' })}
              className="group inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 hover:border-white/40 transition-colors"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.15em]">
                Shop Collection
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}