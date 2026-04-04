'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Zap } from 'lucide-react';
import { navigate } from '@/lib/router';

interface TrendingBadgeProps {
  type?: 'hot' | 'new' | 'bestseller';
}

export default function TrendingBadge({ type = 'hot' }: TrendingBadgeProps) {
  const configs = {
    hot: {
      icon: Zap,
      bg: 'bg-gradient-to-r from-orange-500 to-red-500',
      text: 'Hot Trending',
    },
    new: {
      icon: Star,
      bg: 'bg-gradient-to-r from-[#C4748C] to-pink-500',
      text: 'Just Dropped',
    },
    bestseller: {
      icon: Users,
      bg: 'bg-gradient-to-r from-[#C9A97A] to-amber-600',
      text: 'Best Seller',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 ${config.bg} text-white text-[9px] font-medium uppercase tracking-wider`}
    >
      <Icon size={10} strokeWidth={2} />
      {config.text}
    </motion.div>
  );
}

// Collection card with enhanced hover
export function EnhancedCollectionCard({ 
  name, 
  image, 
  productCount, 
  onClick 
}: { 
  name: string; 
  image: string; 
  productCount: number; 
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative"
    >
      <div className="relative aspect-square rounded-full overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1614]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="mt-3 text-center">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#1C1614] group-hover:text-[#C4748C] transition-colors">
          {name}
        </h3>
        <p className="text-[9px] text-[#6B6560] mt-1">{productCount} products</p>
      </div>
    </motion.button>
  );
}

// Quick Add Button with animation
export function QuickAddButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white text-[#1C1614] px-4 py-2 text-[9px] font-medium uppercase tracking-wider shadow-lg hover:bg-[#C4748C] hover:text-white transition-colors flex items-center gap-2"
    >
      <span>Quick Add</span>
      <ArrowRight size={10} />
    </motion.button>
  );
}

// Stock indicator with animation
export function StockIndicator({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <motion.span
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-[8px] font-medium uppercase tracking-wider px-2 py-1 bg-gray-100 text-gray-500"
      >
        Sold Out
      </motion.span>
    );
  }

  if (stock <= 5) {
    return (
      <motion.span
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-[8px] font-medium uppercase tracking-wider px-2 py-1 bg-red-50 text-red-600 animate-pulse"
      >
        Only {stock} left
      </motion.span>
    );
  }

  return null;
}

// Color swatch selector
export function ColorSwatches({ 
  colors, 
  selected, 
  onChange 
}: { 
  colors: { name: string; hex: string }[]; 
  selected: string; 
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {colors.map((color) => (
        <motion.button
          key={color.name}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(color.name)}
          className={`w-5 h-5 rounded-full border-2 transition-all ${
            selected === color.name 
              ? 'border-[#1C1614] scale-110' 
              : 'border-transparent hover:border-[#1C1614]/50'
          }`}
          style={{ backgroundColor: color.hex }}
          title={color.name}
        />
      ))}
    </div>
  );
}