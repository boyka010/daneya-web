'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Minus, Plus, X, ShoppingBag, Star } from 'lucide-react';
import { navigate } from '@/lib/router';
import { useStore } from '@/store/useStore';
import type { Product } from '@/data/products';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          strokeWidth={1.5}
          className={star <= Math.round(rating) ? 'star-filled fill-camel' : 'star-empty'}
        />
      ))}
    </div>
  );
}

export default function ProductQuickView() {
  const isOpen = useStore((s) => s.isQuickViewOpen);
  const product = useStore((s) => s.quickViewProduct);
  const setOpen = useStore((s) => s.setQuickViewProduct);
  const addToCart = useStore((s) => s.addToCart);
  const isInWishlist = useStore((s) => product ? s.isInWishlist(product.id) : false);
  const toggleWishlist = useStore((s) => s.toggleWishlist);

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize(product.sizes[0] || '');
      setQuantity(1);
    }
  }, [product]);

  const handleClose = () => setOpen(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };

  const handleAddToBag = () => {
    if (!product) return;
    addToCart(product, quantity, selectedColor);
    handleClose();
  };

  if (!product) return null;

  const effectiveColor = selectedColor;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl p-0 bg-white gap-0 overflow-hidden [&>button]:hidden border-warm-border">
        <DialogTitle className="sr-only">{product.name} Quick View</DialogTitle>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
          aria-label="Close"
        >
          <X size={16} strokeWidth={1.5} className="text-warm-text" />
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="aspect-[3/4] bg-secondary relative">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="50vw"
            />
            {product.badge && (
              <div className="absolute top-4 left-4">
                <span className={cn(
                  product.badge.toLowerCase() === 'sale' ? 'badge-sale' : 'badge-new'
                )}>
                  {product.badge.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground font-sans">
              {product.material}
            </span>
            <h2 className="font-serif-heading text-xl font-medium text-warm-text mt-2 leading-snug">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              {renderStars(product.rating)}
              <span className="text-[10px] text-muted-foreground font-light">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <span className="text-lg font-medium text-warm-text font-sans">
                EGP {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through font-light">
                  EGP {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mt-4 line-clamp-3 font-light">
              {product.description}
            </p>

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div className="mt-5">
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-2.5 font-sans">
                  Color — {effectiveColor}
                </p>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        'w-6 h-6 rounded-full transition-all duration-200',
                        effectiveColor === color.name
                          ? 'ring-2 ring-camel ring-offset-2'
                          : 'ring-1 ring-warm-border hover:ring-muted-foreground'
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes.length > 0 && product.sizes[0] !== 'One Size' && (
              <div className="mt-4">
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-2.5 font-sans">
                  Size
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium transition-all duration-200 border font-sans',
                        selectedSize === size
                          ? 'bg-warm-text text-white border-warm-text'
                          : 'bg-transparent text-warm-text border-warm-border hover:border-warm-text'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-5 flex items-center gap-3">
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground font-sans">Qty</p>
              <div className="inline-flex items-center border border-warm-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-warm-text hover:text-camel transition-colors"
                >
                  <Minus size={12} strokeWidth={1.5} />
                </button>
                <span className="w-8 text-center text-xs font-medium text-warm-text font-sans">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-warm-text hover:text-camel transition-colors"
                >
                  <Plus size={12} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Add to Bag */}
            <button
              onClick={handleAddToBag}
              className="w-full mt-6 bg-warm-text text-warm-bg py-3.5 text-[10px] font-medium uppercase tracking-[0.12em] hover:bg-camel transition-colors duration-300 flex items-center justify-center gap-2 font-sans"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              Add to Bag
            </button>

            {/* Wishlist */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="mt-2.5 flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground hover:text-warm-text py-3 border border-warm-border hover:border-warm-text transition-all duration-300 font-sans"
            >
              <Heart size={13} strokeWidth={1.5} className={isInWishlist ? 'fill-sale text-sale' : ''} />
              {isInWishlist ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Full details link */}
            <button
              onClick={() => { handleClose(); navigate({ type: 'product', id: product.id }); }}
              className="mt-3 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground hover:text-camel self-center transition-colors duration-300 font-sans"
            >
              View Full Details &rarr;
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
