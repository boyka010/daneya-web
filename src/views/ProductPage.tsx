'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Heart, ShoppingBag, Minus, Plus, Star, ChevronRight, Truck, RotateCcw, Shield, Check, ArrowUp } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useStore as useShopifyStore } from '@/store/shopifyStore';
import { navigate } from '@/lib/router';
import { products as localProducts, getProductById } from '@/data/products';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { getShopifyProducts } from '@/lib/shopify-queries';
import { useShopifyCart } from '@/hooks/useShopifyCart';
import type { Product } from '@/data/products';

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
      <span className="text-[11px] text-[#6B6560] font-light font-sans">({reviews} reviews)</span>
    </div>
  );
}

export default function ProductPage({ productId }: ProductPageProps) {
  const [shopifyProducts, setShopifyProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addItem } = useShopifyCart();
  
  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await getShopifyProducts();
        setShopifyProducts(products);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const product = useMemo(() => {
    // First try local products
    const local = getProductById(productId);
    if (local) return local;
    // Then try Shopify products
    return shopifyProducts.find(p => p.id === productId);
  }, [productId, shopifyProducts]);
  
  const isInWishlist = useStore((s) => product ? s.isInWishlist(product.id) : false);
  const toggleWishlist = useStore((s) => s.toggleWishlist);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showStickyATC, setShowStickyATC] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const stickyATCOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize(product.sizes[0] || '');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    const handleScroll = () => {
      const mainATC = document.getElementById('main-atc');
      if (mainATC) {
        const rect = mainATC.getBoundingClientRect();
        setShowStickyATC(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const allProducts = shopifyProducts.length > 0 ? shopifyProducts : localProducts;
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, shopifyProducts]);

  const handleAddToBag = async () => {
    if (!product) return;
    setIsAddingToCart(true);
    console.log('Adding to cart:', product.name, 'ID:', product.id, 'Shopify ID:', product.shopifyId);
    
    // Use Shopify cart
    addItem(product, quantity, selectedColor || product.colors[0]?.name || '');
    
    setIsAddingToCart(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#6B6560]">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="font-serif-heading text-xl text-[#1C1614]">Product not found</p>
        <p className="text-sm text-[#6B6560]">ID: {productId}</p>
        <button onClick={() => navigate({ type: 'shop' })} className="text-[#8B6F47]">Go to Shop</button>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.image];
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAF7F4] pb-24 lg:pb-16">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto pt-6 sm:pt-8">
        <div className="flex items-center gap-2 text-[10px] text-[#6B6560] font-light font-sans">
          <button onClick={() => navigate({ type: 'home' })} className="hover:text-[#1C1614] transition-colors">Home</button>
          <ChevronRight size={10} strokeWidth={1.5} />
          <button onClick={() => navigate({ type: 'shop', category: product.category })} className="hover:text-[#1C1614] transition-colors capitalize">
            {product.category}
          </button>
          <ChevronRight size={10} strokeWidth={1.5} />
          <span className="text-[#1C1614] font-medium truncate">{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto mt-6 sm:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Masonry Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Main Image - Masonry style */}
            <div className="relative aspect-[3/4] bg-[#F5F2EE] overflow-hidden mb-4">
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
              {isLowStock && (
                <div className="absolute top-4 right-4">
                  <span className="text-[8px] font-medium uppercase tracking-wider px-2 py-1 bg-[#C8102E] text-white">
                    Only {product.stock} left
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails - snap scroll on mobile */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 bg-[#F5F2EE] overflow-hidden transition-all duration-300 border-2 snap-start',
                      selectedImage === i ? 'border-[#1C1614]' : 'border-transparent hover:border-[#E8E4DF]'
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

          {/* Product Info - Sticky */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            {/* Material tag */}
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8B6F47] mb-2 font-sans">
              {product.material}
            </p>

            {/* Name */}
            <h1 className="font-serif-heading text-2xl sm:text-3xl font-medium text-[#1C1614] leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-2.5">
              {renderStars(product.rating, product.reviews)}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-xl font-medium text-[#1C1614] font-sans">
                EGP {product.price.toLocaleString('en-US')}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-[#6B6560] line-through font-light">
                    EGP {product.originalPrice.toLocaleString('en-US')}
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
                'text-xs text-[#1C1614]/70 font-light leading-relaxed font-sans',
                !expandedDesc && 'line-clamp-2'
              )}>
                {product.description}
              </p>
              {product.description.length > 100 && (
                <button
                  onClick={() => setExpandedDesc(!expandedDesc)}
                  className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#8B6F47] mt-1 hover:text-[#1C1614] transition-colors font-sans"
                >
                  {expandedDesc ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div className="mt-6">
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#6B6560] mb-3 font-sans">
                  Color — <span className="text-[#1C1614]">{selectedColor}</span>
                </p>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        'w-7 h-7 rounded-full transition-all duration-200',
                        selectedColor === color.name
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
            {product.sizes.length > 0 && (
              <div className="mt-5">
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#6B6560] mb-3 font-sans">
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
            <div className="mt-6">
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#6B6560] mb-3 font-sans">
                Quantity
              </p>
              <div className="inline-flex items-center border border-[#E8E4DF]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#1C1614] hover:text-[#8B6F47] transition-colors"
                >
                  <Minus size={13} strokeWidth={1.5} />
                </button>
                <span className="w-12 text-center text-sm font-medium text-[#1C1614] font-sans">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#1C1614] hover:text-[#8B6F47] transition-colors"
                >
                  <Plus size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Add to Bag - Main ATC */}
            <motion.button
              id="main-atc"
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToBag}
              disabled={isAddingToCart || product.stock === 0}
              className={cn(
                'w-full mt-8 py-4 text-[10px] font-medium uppercase tracking-[0.12em] flex items-center justify-center gap-2 transition-all duration-300 font-sans disabled:opacity-50',
                product.stock === 0
                  ? 'bg-[#E8E4DF] text-[#6B6560] cursor-not-allowed'
                  : 'bg-[#1C1614] text-white hover:bg-[#8B6F47] border border-[#1C1614] hover:border-[#8B6F47]'
              )}
            >
              {isAddingToCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : product.stock === 0 ? (
                'Sold Out'
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
              className="w-full mt-3 py-3 text-[10px] font-medium uppercase tracking-[0.12em] border border-[#E8E4DF] text-[#1C1614] hover:bg-[#1C1614] hover:text-white hover:border-[#1C1614] transition-all duration-300 font-sans flex items-center justify-center gap-2"
            >
              <Heart size={14} strokeWidth={1.5} className={isInWishlist ? 'fill-sale text-sale' : ''} />
              {isInWishlist ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Trust badges */}
            <div className="mt-8 pt-6 border-t border-[#E8E4DF] space-y-3">
              <div className="flex items-center gap-3 text-[#6B6560]">
                <Truck size={16} strokeWidth={1.5} />
                <span className="text-[10px] font-light font-sans">Free shipping on orders over EGP 2,000</span>
              </div>
              <div className="flex items-center gap-3 text-[#6B6560]">
                <RotateCcw size={16} strokeWidth={1.5} />
                <span className="text-[10px] font-light font-sans">30-day returns</span>
              </div>
              <div className="flex items-center gap-3 text-[#6B6560]">
                <Shield size={16} strokeWidth={1.5} />
                <span className="text-[10px] font-light font-sans">Secure checkout</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Shop the Look - Cross-sell */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 pb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-heading text-lg sm:text-xl text-[#1C1614]">
                Complete the Look
              </h2>
              <button
                onClick={() => navigate({ type: 'shop', category: product.category })}
                className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#8B6F47] hover:text-[#1C1614] transition-colors font-sans flex items-center gap-1"
              >
                View All
                <ArrowUp size={12} className="rotate-45" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Sticky ATC Bar */}
      <AnimatePresence>
        {showStickyATC && product.stock > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E4DF] shadow-lg lg:hidden safe-area-bottom"
          >
            <div className="flex items-center justify-between px-4 py-3 max-w-[1440px] mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-14 h-16 bg-[#F5F2EE] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={56}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1C1614] font-sans truncate max-w-[150px]">{product.name}</p>
                  <p className="text-sm text-[#6B6560] font-sans">EGP {product.price.toLocaleString('en-US')}</p>
                </div>
              </div>
              <Button
                variant="elegant"
                size="sm"
                onClick={handleAddToBag}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? 'Adding...' : 'Add to Bag'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}