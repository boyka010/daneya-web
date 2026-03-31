'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { navigate } from '@/lib/router';
import { useStore } from '@/store/useStore';
import type { Product } from '@/data/products';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

function getBadgeClass(badge: string): string {
  const b = badge.toLowerCase();
  if (b === 'sale') return 'badge-sale';
  if (b === 'best seller') return 'badge-bestseller';
  if (b === 'trending') return 'badge-trending';
  if (b === 'limited') return 'badge-limited';
  if (b === 'luxe') return 'badge-luxe';
  if (b.includes('buy 1') || b.includes('bogo')) return 'badge-bogo';
  return 'badge-new';
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={10}
          strokeWidth={1.5}
          className={star <= Math.round(rating) ? 'star-filled fill-camel' : 'star-empty'}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const isInWishlist = useStore((s) => s.isInWishlist(product.id));
  const addToCart = useStore((s) => s.addToCart);
  const setQuickViewProduct = useStore((s) => s.setQuickViewProduct);

  const handleAddToBag = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.colors[0]?.name || '');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <motion.div
      className="group cursor-pointer"
      style={{ animationDelay: `${index * 0.06}s` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div
        className="relative aspect-[3/4] bg-secondary mb-3.5 overflow-hidden"
        onClick={() => navigate({ type: 'product', id: product.id })}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 bg-secondary animate-pulse" />
        )}

        {/* Main image */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={cn(
            'object-cover transition-all duration-700 ease-out',
            imgLoaded ? 'opacity-100' : 'opacity-0',
            isHovered ? 'scale-[1.03]' : 'scale-100'
          )}
          onLoad={() => setImgLoaded(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={getBadgeClass(product.badge)}>
              {product.badge.toUpperCase()}
            </span>
          </div>
        )}

        {/* Sold out overlay */}
        {product.stock !== undefined && product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-warm-text font-sans">
              Sold Out
            </span>
          </div>
        )}

        {/* Wishlist heart */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 transition-all duration-300 z-10',
            isHovered || isInWishlist ? 'opacity-100' : 'opacity-0'
          )}
          whileTap={{ scale: 0.9 }}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={14}
            strokeWidth={1.5}
            className={isInWishlist ? 'fill-sale text-sale' : 'text-warm-text'}
          />
        </motion.button>

        {/* Hover overlay with Quick View + Add to Bag */}
        <div className="product-overlay z-10">
          <div className="flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
            <button
              onClick={handleQuickView}
              className="flex items-center gap-2 bg-white text-warm-text px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.12em] hover:bg-warm-text hover:text-white transition-all duration-300 font-sans"
            >
              <Eye size={13} strokeWidth={1.5} />
              Quick View
            </button>
            <button
              onClick={handleAddToBag}
              className="flex items-center gap-2 bg-warm-text text-white px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.12em] hover:bg-camel transition-all duration-300 font-sans"
            >
              <ShoppingBag size={13} strokeWidth={1.5} />
              Add to Bag
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div
        className="cursor-pointer"
        onClick={() => navigate({ type: 'product', id: product.id })}
      >
        <h3 className="font-serif-heading text-[0.9375rem] font-medium text-warm-text leading-snug truncate">
          {product.name}
        </h3>

        {/* Color swatches */}
        {product.colors.length > 1 && (
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.slice(0, 5).map((color) => (
              <span
                key={color.name}
                className="w-3 h-3 rounded-full border border-warm-border inline-block"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[9px] text-muted-foreground font-light ml-0.5">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 mt-1.5">
          {renderStars(product.rating)}
          <span className="text-[10px] text-muted-foreground font-light">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1.5">
          <p className="text-sm font-medium text-warm-text font-sans">
            EGP {product.price.toLocaleString()}
          </p>
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through font-light">
              EGP {product.originalPrice.toLocaleString()}
            </p>
          )}
          {product.originalPrice && (
            <span className="text-[9px] font-medium uppercase tracking-wider text-sale font-sans">
              Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>
      </div>

      {/* Mobile add to bag */}
      <button
        onClick={handleAddToBag}
        className="mt-3 w-full py-2.5 text-[10px] font-medium uppercase tracking-[0.12em] text-warm-text border border-warm-border hover:bg-warm-text hover:text-white hover:border-warm-text transition-all duration-300 lg:hidden font-sans"
      >
        Add to Bag
      </button>
    </motion.div>
  );
}
