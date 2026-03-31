'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Minus, Plus, Star, ChevronRight, Truck, RotateCcw, Shield, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { navigate } from '@/lib/router';
import { getProductById, products } from '@/data/products';
import { cn } from '@/lib/utils';

interface ProductPageProps {
  productId: number;
}

function renderStars(rating: number, reviews: number) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
            strokeWidth={1.5}
            className={star <= Math.round(rating) ? 'star-filled fill-camel' : 'star-empty'}
          />
        ))}
      </div>
      <span className="text-[11px] text-muted-foreground font-light font-sans">({reviews} reviews)</span>
    </div>
  );
}

export default function ProductPage({ productId }: ProductPageProps) {
  const product = useMemo(() => getProductById(productId), [productId]);
  const addToCart = useStore((s) => s.addToCart);
  const isInWishlist = useStore((s) => product ? s.isInWishlist(product.id) : false);
  const toggleWishlist = useStore((s) => s.toggleWishlist);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize(product.sizes[0] || '');
      setQuantity(1);
      setAddedToCart(false);
    }
  }, [product]);

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  const handleAddToBag = () => {
    if (!product) return;
    addToCart(product, quantity, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-serif-heading text-xl text-warm-text">Product not found</p>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-warm-bg">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto pt-6 sm:pt-8">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-light font-sans">
          <button onClick={() => navigate({ type: 'home' })} className="hover:text-warm-text transition-colors">Home</button>
          <ChevronRight size={10} strokeWidth={1.5} />
          <button onClick={() => navigate({ type: 'shop', category: product.category })} className="hover:text-warm-text transition-colors capitalize">
            {product.category}
          </button>
          <ChevronRight size={10} strokeWidth={1.5} />
          <span className="text-warm-text font-medium truncate">{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto mt-6 sm:mt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-4">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className={cn(
                    product.badge.toLowerCase() === 'sale' ? 'badge-sale' :
                    product.badge.toLowerCase() === 'best seller' ? 'badge-bestseller' :
                    product.badge.toLowerCase() === 'trending' ? 'badge-trending' :
                    'badge-new'
                  )}>
                    {product.badge.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'w-16 h-20 sm:w-20 sm:h-24 bg-secondary overflow-hidden transition-all duration-300 border-2',
                      selectedImage === i ? 'border-warm-text' : 'border-transparent hover:border-warm-border'
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      width={80}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            {/* Material tag */}
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-camel mb-2 font-sans">
              {product.material}
            </p>

            {/* Name */}
            <h1 className="font-serif-heading text-2xl sm:text-3xl font-medium text-warm-text leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-2.5">
              {renderStars(product.rating, product.reviews)}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-xl font-medium text-warm-text font-sans">
                EGP {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-muted-foreground line-through font-light">
                    EGP {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-wider text-sale font-sans">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mt-5">
              <p className={cn(
                'text-xs text-warm-text/70 font-light leading-relaxed font-sans',
                !expandedDesc && 'line-clamp-2'
              )}>
                {product.description}
              </p>
              {product.description.length > 100 && (
                <button
                  onClick={() => setExpandedDesc(!expandedDesc)}
                  className="text-[10px] font-medium uppercase tracking-[0.1em] text-camel mt-1 hover:text-warm-text transition-colors font-sans"
                >
                  {expandedDesc ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div className="mt-6">
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3 font-sans">
                  Color — <span className="text-warm-text">{selectedColor}</span>
                </p>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        'w-7 h-7 rounded-full transition-all duration-200',
                        selectedColor === color.name
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
            {product.sizes.length > 0 && (
              <div className="mt-5">
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3 font-sans">
                  Size {product.sizes[0] !== 'One Size' ? '' : ''}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'px-4 py-2 text-[10px] uppercase tracking-wider font-medium transition-all duration-200 border font-sans',
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
            <div className="mt-6">
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3 font-sans">
                Quantity
              </p>
              <div className="inline-flex items-center border border-warm-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-warm-text hover:text-camel transition-colors"
                >
                  <Minus size={13} strokeWidth={1.5} />
                </button>
                <span className="w-12 text-center text-sm font-medium text-warm-text font-sans">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-warm-text hover:text-camel transition-colors"
                >
                  <Plus size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Add to Bag */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToBag}
              className={cn(
                'w-full mt-8 py-4 text-[10px] font-medium uppercase tracking-[0.12em] flex items-center justify-center gap-2 transition-all duration-300 font-sans',
                addedToCart
                  ? 'bg-olive text-white border border-olive'
                  : 'bg-warm-text text-warm-bg hover:bg-camel border border-warm-text'
              )}
            >
              {addedToCart ? (
                <>
                  <Check size={14} strokeWidth={2} />
                  Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag size={14} strokeWidth={1.5} />
                  Add to Bag
                </>
              )}
            </motion.button>

            {/* Wishlist */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="mt-2.5 w-full flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground hover:text-warm-text py-3 border border-warm-border hover:border-warm-text transition-all duration-300 font-sans"
            >
              <Heart size={13} strokeWidth={1.5} className={isInWishlist ? 'fill-sale text-sale' : ''} />
              {isInWishlist ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Details */}
            <div className="mt-8 pt-6 border-t border-warm-border grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center">
                <Truck size={18} strokeWidth={1.5} className="text-camel mb-1.5" />
                <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-warm-text font-sans">Free Shipping</p>
                <p className="text-[8px] text-muted-foreground font-light font-sans mt-0.5">Orders over EGP 2,000</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw size={18} strokeWidth={1.5} className="text-camel mb-1.5" />
                <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-warm-text font-sans">30-Day Returns</p>
                <p className="text-[8px] text-muted-foreground font-light font-sans mt-0.5">Hassle-free</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield size={18} strokeWidth={1.5} className="text-camel mb-1.5" />
                <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-warm-text font-sans">Secure Checkout</p>
                <p className="text-[8px] text-muted-foreground font-light font-sans mt-0.5">Encrypted payment</p>
              </div>
            </div>

            {/* Product details */}
            <div className="mt-6 pt-5 border-t border-warm-border space-y-2.5">
              <div className="flex items-center gap-3 text-[11px] font-light font-sans">
                <span className="text-muted-foreground uppercase tracking-wider text-[9px] font-medium w-16">SKU</span>
                <span className="text-warm-text">{product.sku}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-light font-sans">
                <span className="text-muted-foreground uppercase tracking-wider text-[9px] font-medium w-16">Material</span>
                <span className="text-warm-text">{product.material}</span>
              </div>
              {product.stock !== undefined && (
                <div className="flex items-center gap-3 text-[11px] font-light font-sans">
                  <span className="text-muted-foreground uppercase tracking-wider text-[9px] font-medium w-16">Stock</span>
                  <span className={product.stock > 10 ? 'text-olive' : product.stock > 0 ? 'text-camel' : 'text-sale'}>
                    {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Sold Out'}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-warm-border">
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-camel mb-2 font-sans">
                  You May Also Like
                </p>
                <h2 className="section-heading text-xl sm:text-2xl text-warm-text">
                  Related Products
                </h2>
              </div>
              <button
                onClick={() => navigate({ type: 'shop', category: product.category })}
                className="hidden sm:flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-warm-text hover:text-camel transition-colors font-sans"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
