'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, Grid2X2, X, ChevronDown, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { products as localProducts } from '@/data/products';
import { categories } from '@/data/categories';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';
import { getShopifyProducts } from '@/lib/shopify-queries';
import type { Product } from '@/data/products';

const ITEMS_PER_PAGE = 12;

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ShopPage() {
  const currentPage = useStore((s) => s.currentPage);
  const activeCategory = useStore((s) => s.activeCategory);
  const setActiveCategory = useStore((s) => s.setActiveCategory);
  const sortBy = useStore((s) => s.sortBy);
  const setSortBy = useStore((s) => s.setSortBy);

  const categoryParam = currentPage.type === 'shop' ? currentPage.category : undefined;

  // Sync category from URL when navigating
  useEffect(() => {
    if (categoryParam !== undefined && categoryParam !== activeCategory) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam, activeCategory, setActiveCategory]);

  // Reset to "all" when visiting shop without category
  useEffect(() => {
    if (currentPage.type === 'shop' && !categoryParam && activeCategory !== 'all') {
      setActiveCategory('all');
    }
  }, [currentPage, categoryParam, activeCategory, setActiveCategory]);

  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [shopifyProducts, setShopifyProducts] = useState<Product[]>([]);
  const [isLoadingShopify, setIsLoadingShopify] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch products from Shopify
  useEffect(() => {
    async function loadShopifyProducts() {
      try {
        console.log('Fetching Shopify products...');
        const products = await getShopifyProducts();
        console.log('Shopify products response:', products);
        setShopifyProducts(products);
      } catch (error) {
        console.error('Failed to load Shopify products:', error);
      } finally {
        setIsLoadingShopify(false);
      }
    }
    loadShopifyProducts();
  }, []);

  // Use Shopify products if available, otherwise fallback to local
  const products = shopifyProducts.length > 0 ? shopifyProducts : localProducts;
  console.log('Using products, shopify count:', shopifyProducts.length, 'local count:', localProducts.length);

  // Force re-render when category changes
  const categoryKey = `${activeCategory}-${sortBy}-${priceRange[0]}-${priceRange[1]}-${selectedColors.join(',')}`;

  const filteredProducts = useMemo(() => {
    let items = activeCategory === 'all'
      ? [...products]
      : products.filter(p => p.category === activeCategory);

    // Also filter by selected colors from sidebar
    if (selectedColors.length > 0) {
      items = items.filter(p =>
        p.colors.some(c => selectedColors.includes(c.name.toLowerCase()))
      );
    }

    // Filter by price
    items = items.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'newest':
        items.sort((a, b) => b.id - a.id);
        break;
      case 'price_asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return items;
  }, [activeCategory, sortBy, priceRange, selectedColors, categoryKey]);

  const visibleProducts = useMemo(() => 
    filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length));
      setIsLoadingMore(false);
    }, 500);
  }, [hasMore, isLoadingMore, filteredProducts.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, handleLoadMore]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeCategory, sortBy, priceRange, selectedColors]);

  const currentSort = sortOptions.find(o => o.value === sortBy);

  const clearFilters = () => {
    setSelectedColors([]);
    setPriceRange([0, 10000]);
    setActiveCategory('all');
  };

  const hasFilters = activeCategory !== 'all' || selectedColors.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000;

  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      {/* Page Header */}
      <div className="pt-8 pb-6 sm:pt-12 sm:pb-8 px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-2 text-[10px] text-[#6B6560] font-light font-sans mb-4">
          <button onClick={() => setActiveCategory('all')} className="hover:text-[#1C1614] transition-colors">Home</button>
          <span>/</span>
          <span className="text-[#1C1614] font-medium">{activeCategory === 'all' ? 'All Products' : categories.find(c => c.slug === activeCategory)?.name || activeCategory}</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <h1 className="section-heading text-2xl sm:text-3xl lg:text-[2rem] text-[#1C1614]">
              {activeCategory === 'all' ? 'All Products' : categories.find(c => c.slug === activeCategory)?.name || activeCategory}
            </h1>
            <p className="text-[11px] text-[#6B6560] font-light mt-1.5 font-sans">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-[#E8E4DF] text-[10px] font-medium uppercase tracking-[0.1em] text-[#1C1614] hover:border-[#1C1614] transition-colors font-sans"
            >
              <SlidersHorizontal size={13} strokeWidth={1.5} />
              Filter
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-1.5 px-3 py-2 border border-[#E8E4DF] text-[10px] font-medium uppercase tracking-[0.1em] text-[#1C1614] hover:border-[#1C1614] transition-colors font-sans"
              >
                Sort
                <ChevronDown size={11} strokeWidth={1.5} className={cn('transition-transform', showSortDropdown && 'rotate-180')} />
              </button>
              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#E8E4DF] shadow-sm z-20 py-1"
                  >
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => { setSortBy(option.value); setShowSortDropdown(false); }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-[11px] font-light font-sans transition-colors',
                          sortBy === option.value
                            ? 'text-[#8B6F47] bg-[#F5F2EE]/30'
                            : 'text-[#1C1614] hover:text-[#8B6F47] hover:bg-[#F5F2EE]/20'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>

            {/* Grid toggle — desktop */}
            <div className="hidden lg:flex items-center border border-[#E8E4DF]">
              <button
                onClick={() => setGridCols(3)}
                className={cn(
                  'p-2 transition-colors',
                  gridCols === 3 ? 'text-[#1C1614] bg-[#F5F2EE]/30' : 'text-[#6B6560] hover:text-[#1C1614]'
                )}
              >
                <Grid2X2 size={14} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={cn(
                  'p-2 transition-colors',
                  gridCols === 4 ? 'text-[#1C1614] bg-[#F5F2EE]/30' : 'text-[#6B6560] hover:text-[#1C1614]'
                )}
              >
                <Grid3X3 size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories bar - horizontal scroll with touch swipe */}
      <div className="border-b border-[#E8E4DF] px-4 sm:px-6 lg:px-10">
        <div 
          className="max-w-[1440px] mx-auto flex items-center gap-4 overflow-x-auto no-scrollbar py-0 snap-x snap-mandatory touch-pan-x"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={cn(
              'flex-shrink-0 py-3 px-2 text-[11px] font-medium uppercase tracking-[0.12em] border-b-2 transition-colors font-sans snap-start',
              activeCategory === 'all'
                ? 'text-[#1C1614] border-[#1C1614]'
                : 'text-[#6B6560] border-transparent hover:text-[#1C1614]'
            )}
          >
            All
          </button>
          {categories.map(cat => (
          <button
            type="button"
            onClick={() => setActiveCategory(cat.slug)}
            className={cn(
                'flex-shrink-0 py-3 px-2 text-[11px] font-medium uppercase tracking-[0.12em] border-b-2 transition-colors font-sans snap-start',
                activeCategory === cat.slug
                  ? 'text-[#1C1614] border-[#1C1614]'
                  : 'text-[#6B6560] border-transparent hover:text-[#1C1614]'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-8 px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto mt-8 pb-16">
        {/* Sidebar Filters — Desktop */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#1C1614] font-sans">Filters</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-[9px] text-[#6B6560] hover:text-[#8B6F47] transition-colors font-sans">
                  Clear All
                </button>
              )}
            </div>

            {/* Price Range */}
            <div className="mb-6 pb-6 border-b border-[#E8E4DF]">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6B6560] mb-3 font-sans">
                Price Range
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0] || ''}
                  onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                  className="w-full px-2 py-1.5 text-[10px] border border-[#E8E4DF] bg-transparent text-[#1C1614] font-sans focus:border-[#8B6F47]"
                />
                <span className="text-[#6B6560] text-[10px]">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1] === 10000 ? '' : priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000])}
                  className="w-full px-2 py-1.5 text-[10px] border border-[#E8E4DF] bg-transparent text-[#1C1614] font-sans focus:border-[#8B6F47]"
                />
              </div>
            </div>

            {/* Color Filter */}
            <div className="mb-6 pb-6 border-b border-[#E8E4DF]">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6B6560] mb-3 font-sans">
                Color
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Black', 'White', 'Navy', 'Beige', 'Rose', 'Sage'].map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColors(prev => 
                        prev.includes(color.toLowerCase())
                          ? prev.filter(c => c !== color.toLowerCase())
                          : [...prev, color.toLowerCase()]
                      );
                    }}
                    className={cn(
                      'px-3 py-1 text-[10px] border transition-colors font-sans',
                      selectedColors.includes(color.toLowerCase())
                        ? 'border-[#8B6F47] bg-[#8B6F47] text-white'
                        : 'border-[#E8E4DF] text-[#1C1614] hover:border-[#8B6F47]'
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="mb-6 pb-6 border-b border-[#E8E4DF]">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6B6560] mb-3 font-sans">
                Material
              </h4>
              <div className="space-y-2">
                {['Premium Crepe', 'Chiffon', 'Satin', 'Linen', 'Knitted Cotton', 'Modal Cotton'].map(material => (
                  <label key={material} className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-3.5 h-3.5 border border-[#E8E4DF] group-hover:border-[#8B6F47] transition-colors flex items-center justify-center">
                      <input type="checkbox" className="sr-only" />
                    </div>
                    <span className="text-[11px] text-[#1C1614]/70 font-light font-sans">{material}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoadingShopify ? (
            <div className="py-20 text-center">
              <Loader2 size={32} className="animate-spin mx-auto text-[#8B6F47] mb-4" />
              <p className="text-xs text-[#6B6560] font-light font-sans">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif-heading text-xl text-[#1C1614] mb-2">No products found</p>
              <p className="text-xs text-[#6B6560] font-light font-sans">Try adjusting your filters</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-[10px] font-medium uppercase tracking-[0.12em] text-[#8B6F47] hover:text-[#1C1614] transition-colors font-sans"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className={cn(
                'grid gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10',
                gridCols === 3 ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              )}>
                {visibleProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} priority={i < 4} />
                ))}
              </div>

              {/* Infinite scroll trigger */}
              {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-12">
                  {isLoadingMore ? (
                    <div className="flex items-center gap-2 text-[#6B6560]">
                      <Loader2 size={20} className="animate-spin" />
                      <span className="text-sm font-light">Loading more...</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleLoadMore}
                      className="px-6 py-3 text-[10px] font-medium uppercase tracking-[0.12em] text-[#1C1614] border border-[#1C1614] hover:bg-[#1C1614] hover:text-white transition-all duration-300 font-sans"
                    >
                      Load More
                    </button>
                  )}
                </div>
              )}

              {!hasMore && filteredProducts.length > ITEMS_PER_PAGE && (
                <p className="text-center py-8 text-[10px] text-[#6B6560] font-light uppercase tracking-wider">
                  You've seen all {filteredProducts.length} products
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFiltersOpen && (
        <>
          <div className="fixed inset-0 z-[55] bg-[#1C1614]/20" onClick={() => setIsFiltersOpen(false)} />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 bottom-0 z-[56] w-[300px] bg-white flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E4DF]">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#1C1614] font-sans">Filters</h3>
              <button onClick={() => setIsFiltersOpen(false)}>
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scroll px-5 py-5">
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6B6560] mb-3 font-sans">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0] || ''}
                    onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                    className="w-full px-2 py-1.5 text-[10px] border border-[#E8E4DF] bg-transparent text-[#1C1614] font-sans"
                  />
                  <span className="text-[#6B6560] text-[10px]">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1] === 10000 ? '' : priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000])}
                    className="w-full px-2 py-1.5 text-[10px] border border-[#E8E4DF] bg-transparent text-[#1C1614] font-sans"
                  />
                </div>
              </div>
            </div>
            {hasFilters && (
              <div className="px-5 py-4 border-t border-[#E8E4DF]">
                <button onClick={() => { clearFilters(); setIsFiltersOpen(false); }} className="w-full py-2.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#1C1614] border border-[#E8E4DF] hover:bg-[#1C1614] hover:text-[#FAF7F4] transition-all font-sans">
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
