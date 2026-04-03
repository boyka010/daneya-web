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
      <DialogContent className="max-w-3xl p-0 bg-white gap-0 overflow-hidden [&>button]:hidden border-[#E8E4DF] 
        lg:rounded-lg max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:max-w-none max-lg:rounded-t-xl max-lg:max-h-[90vh] max-lg:overflow-y-auto">
        <DialogTitle className="sr-only">{product.name} Quick View</DialogTitle>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center hover:bg-[#F5F2EE] transition-colors"
          aria-label="Close"
        >
          <X size={16} strokeWidth={1.5} className="text-[#1C1614]" />
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="aspect-[3/4] bg-[#F5F2EE] relative max-lg:aspect-[4/3]">
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
          <div className="p-5 sm:p-8 flex flex-col justify-center max-lg:pb-24">
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#6B6560] font-sans">
              {product.material}
            </span>
            <h2 className="font-serif-heading text-lg sm:text-xl font-medium text-[#1C1614] mt-2 leading-snug">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              {renderStars(product.rating)}
              <span className="text-[10px] text-[#6B6560] font-light">({product.reviews})</span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <span className="text-lg font-medium text-[#1C1614] font-sans">
                EGP {product.price.toLocaleString('en-US')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#6B6560] line-through font-light">
                  EGP {product.originalPrice.toLocaleString('en-US')}
                </span>
              )}
            </div>

            <p className="text-xs text-[#6B6560] leading-relaxed mt-4 line-clamp-3 font-light">
              {product.description}
            </p>

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div className="mt-4">
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#6B6560] mb-2.5 font-sans">
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
                          ? 'ring-2 ring-[#8B6F47] ring-offset-2'
                          : 'ring-1 ring-[#E8E4DF] hover:ring-[#6B6560]'
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
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#6B6560] mb-2.5 font-sans">
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
                          ? 'bg-[#1C1614] text-white border-[#1C1614]'
                          : 'bg-transparent text-[#1C1614] border-[#E8E4DF] hover:border-[#1C1614]'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-4 flex items-center gap-3">
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#6B6560] font-sans">Qty</p>
              <div className="inline-flex items-center border border-[#E8E4DF]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#1C1614] hover:text-[#8B6F47] transition-colors"
                >
                  <Minus size={12} strokeWidth={1.5} />
                </button>
                <span className="w-8 text-center text-xs font-medium text-[#1C1614] font-sans">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#1C1614] hover:text-[#8B6F47] transition-colors"
                >
                  <Plus size={12} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Add to Bag - Fixed on mobile bottom */}
            <div className="max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:bg-white max-lg:border-t max-lg:border-[#E8E4DF] max-lg:p-4 max-lg:flex max-lg:flex-col max-lg:gap-2">
              <button
                onClick={handleAddToBag}
                className="w-full bg-[#1C1614] text-white py-3.5 text-[10px] font-medium uppercase tracking-[0.12em] hover:bg-[#8B6F47] transition-colors duration-300 flex items-center justify-center gap-2 font-sans"
              >
                <ShoppingBag size={14} strokeWidth={1.5} />
                Add to Bag
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="max-lg:hidden flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6B6560] hover:text-[#1C1614] py-3 border border-[#E8E4DF] hover:border-[#1C1614] transition-all duration-300 font-sans"
              >
                <Heart size={13} strokeWidth={1.5} className={isInWishlist ? 'fill-sale text-sale' : ''} />
                {isInWishlist ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Full details link */}
            <button
              onClick={() => { handleClose(); navigate({ type: 'product', id: product.id }); }}
              className="mt-3 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6B6560] hover:text-[#8B6F47] self-center transition-colors duration-300 font-sans"
            >
              View Full Details &rarr;
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
