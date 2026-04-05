'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigate } from '@/lib/router';
import { useStore } from '@/store/useStore';
import { useShopifyCart } from '@/hooks/useShopifyCart';
import type { Product } from '@/data/products';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
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
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={11}
          strokeWidth={1}
          className={star <= Math.round(rating) ? 'star-filled' : 'star-empty'}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product, index = 0, priority = false }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [showSizes, setShowSizes] = useState(false);
  
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const isInWishlist = useStore((s) => s.isInWishlist(product.id));
  const setQuickViewProduct = useStore((s) => s.setQuickViewProduct);
  const { addItem, isPending } = useShopifyCart();

  const handleNavigate = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate({ type: 'product', id: product.id });
  }, [product.id]);

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  }, [product, setQuickViewProduct]);

  const handleAddToCart = useCallback((e: React.MouseEvent, size?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const hasSizes = product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'One Size';
    const hasColors = product.colors && product.colors.length > 0;
    const selectedColor = hoveredColor || product.colors[0]?.name || '';
    
    if (hasColors && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    
    if (hasSizes && !size) {
      toast.error('Please select a size');
      return;
    }
    
    const variantId = product.variants?.[0]?.id || undefined;
    addItem(product, 1, selectedColor, size, variantId);
  }, [product, hoveredColor, addItem]);

  const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  }, [product.id, toggleWishlist]);

  const currentImage = hoveredColor && product.images.length > 1
    ? product.images[product.colors.findIndex(c => c.name === hoveredColor) % product.images.length] || product.image
    : product.image;

  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      className="group flex flex-col relative"
      style={{ animationDelay: `${index * 0.06}s` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
      onMouseEnter={() => { setIsHovered(true); setShowSizes(true); }}
      onMouseLeave={() => { setIsHovered(false); setShowSizes(false); }}
    >
      {/* Image Container - CLICK TO NAVIGATE */}
      <div
        className="relative aspect-[3/4] bg-[#FAF7F4] mb-4 overflow-hidden cursor-pointer"
        onClick={handleNavigate}
        role="link"
        aria-label={`View ${product.name} details`}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 bg-[#F5F2EE] animate-pulse" />
        )}

        <Image
          src={currentImage}
          alt={product.name}
          fill
          className={cn(
            'object-cover transition-all duration-700 ease-out',
            imgLoaded ? 'opacity-100' : 'opacity-0',
            isHovered ? 'scale-[1.03]' : 'scale-100'
          )}
          onLoad={() => setImgLoaded(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
        />

        {/* Badge - only show New, Best Seller, Limited */}
        {product.badge && product.badge !== 'Flash Sale' && product.badge !== 'Sale' && (
          <div className="absolute top-3 left-3 z-10">
            <span className={getBadgeClass(product.badge)}>
              {product.badge.toUpperCase()}
            </span>
          </div>
        )}

        {/* Low Stock */}
        {isLowStock && (
          <div className="absolute top-3 right-3 z-10">
            <span className="badge badge-sale">Only {product.stock} left</span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <span className="text-caption text-[#1C1614]">Sold Out</span>
          </div>
        )}

        {/* Wishlist Heart */}
        <motion.button
          onClick={handleToggleWishlist}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 transition-all duration-300 z-20',
            isHovered || isInWishlist ? 'opacity-100' : 'opacity-0'
          )}
          whileTap={{ scale: 0.9 }}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={14}
            strokeWidth={1.5}
            className={isInWishlist ? 'fill-sale text-sale' : 'text-[#1C1614]'}
          />
        </motion.button>

        {/* Hover Overlay with Actions */}
        <AnimatePresence>
          {!isOutOfStock && isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-[#1C1614]/5"
              onClick={handleNavigate}
            >
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleQuickView}
                  className="flex items-center gap-2 bg-white text-[#1C1614] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.12em] hover:bg-[#1C1614] hover:text-white transition-all duration-300 font-sans"
                >
                  <Eye size={13} strokeWidth={1.5} />
                  Quick View
                </button>
                <button
                  onClick={(e) => handleAddToCart(e)}
                  disabled={isPending}
                  className="flex items-center gap-2 bg-[#1C1614] text-white px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.12em] hover:bg-[#C9A97A] transition-all duration-300 font-sans disabled:opacity-50"
                >
                  <ShoppingBag size={13} strokeWidth={1.5} />
                  {isPending ? 'Adding...' : 'Add to Bag'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Add Sizes on Hover */}
        <AnimatePresence>
          {showSizes && !isOutOfStock && product.sizes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 left-3 right-3 z-20"
              onClick={(e) => e.preventDefault()}
            >
              <div className="flex items-center justify-center gap-1 bg-white/95 py-2 px-2">
                {product.sizes.slice(0, 5).map((size) => (
                  <button
                    key={size}
                    onClick={(e) => handleAddToCart(e, size)}
                    className="min-w-[32px] h-7 text-[10px] font-medium text-[#1C1614] hover:bg-[#1C1614] hover:text-white border border-[#E8E4DF] transition-all duration-200 font-sans"
                  >
                    {size}
                  </button>
                ))}
                {product.sizes.length > 5 && (
                  <span className="text-[9px] text-[#6B6560] ml-1">+{product.sizes.length - 5}</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div
        className="cursor-pointer pt-3"
        onClick={handleNavigate}
      >
        <h3 className="text-[11px] font-normal text-[#1C1614] leading-snug tracking-[0.01em] truncate hover:text-[#C9A97A] transition-colors duration-300">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1.5">
          <p className="text-[12px] font-medium text-[#1C1614]">
            EGP {product.price.toLocaleString('en-US')}
          </p>
          {product.originalPrice && (
            <p className="text-[11px] text-[#6B6560] line-through">
              EGP {product.originalPrice.toLocaleString('en-US')}
            </p>
          )}
        </div>
      </div>

      {/* Mobile Add to Bag Button */}
      <button
        onClick={(e) => handleAddToCart(e)}
        disabled={isOutOfStock || isPending}
        className="mt-3 w-full py-2.5 text-caption text-[#1C1614] border border-[#E8E4DF] hover:bg-[#1C1614] hover:text-white hover:border-[#1C1614] transition-all duration-300 lg:hidden disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isOutOfStock ? 'Sold Out' : isPending ? 'Adding...' : 'Add to Bag'}
      </button>
    </motion.div>
  );
}
