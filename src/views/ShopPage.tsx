'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, Grid2X2, X, ChevronDown } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { products, getProductsByCategory } from '@/data/products';
import { categories } from '@/data/categories';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';

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

  // Set category from URL param
  useMemo(() => {
    if (categoryParam && categoryParam !== activeCategory) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam, activeCategory, setActiveCategory]);

  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Get filtered products
  const filteredProducts = useMemo(() => {
    let items = activeCategory === 'all'
      ? [...products]
      : getProductsByCategory(activeCategory);

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

    // Filter by price
    items = items.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by color
    if (selectedColors.length > 0) {
      items = items.filter(p =>
        p.colors.some(c => selectedColors.includes(c.name.toLowerCase()))
      );
    }

    return items;
  }, [activeCategory, sortBy, priceRange, selectedColors]);

  const currentSort = sortOptions.find(o => o.value === sortBy);

  const clearFilters = () => {
    setSelectedColors([]);
    setPriceRange([0, 10000]);
    setActiveCategory('all');
  };

  const hasFilters = activeCategory !== 'all' || selectedColors.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000;

  return (
    <div className="min-h-screen bg-warm-bg">
      {/* Page Header */}
      <div className="pt-8 pb-6 sm:pt-12 sm:pb-8 px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-light font-sans mb-4">
          <button onClick={() => setActiveCategory('all')} className="hover:text-warm-text transition-colors">Home</button>
          <span>/</span>
          <span className="text-warm-text font-medium">{activeCategory === 'all' ? 'All Products' : categories.find(c => c.slug === activeCategory)?.name || activeCategory}</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <h1 className="section-heading text-2xl sm:text-3xl lg:text-[2rem] text-warm-text">
              {activeCategory === 'all' ? 'All Products' : categories.find(c => c.slug === activeCategory)?.name || activeCategory}
            </h1>
            <p className="text-[11px] text-muted-foreground font-light mt-1.5 font-sans">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-warm-border text-[10px] font-medium uppercase tracking-[0.1em] text-warm-text hover:border-warm-text transition-colors font-sans"
            >
              <SlidersHorizontal size={13} strokeWidth={1.5} />
              Filter
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-1.5 px-3 py-2 border border-warm-border text-[10px] font-medium uppercase tracking-[0.1em] text-warm-text hover:border-warm-text transition-colors font-sans"
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
                    className="absolute right-0 top-full mt-1 w-44 bg-white border border-warm-border shadow-sm z-20 py-1"
                  >
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => { setSortBy(option.value); setShowSortDropdown(false); }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-[11px] font-light font-sans transition-colors',
                          sortBy === option.value
                            ? 'text-camel bg-secondary/30'
                            : 'text-warm-text hover:text-camel hover:bg-secondary/20'
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
            <div className="hidden lg:flex items-center border border-warm-border">
              <button
                onClick={() => setGridCols(3)}
                className={cn(
                  'p-2 transition-colors',
                  gridCols === 3 ? 'text-warm-text bg-secondary/30' : 'text-muted-foreground hover:text-warm-text'
                )}
              >
                <Grid2X2 size={14} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={cn(
                  'p-2 transition-colors',
                  gridCols === 4 ? 'text-warm-text bg-secondary/30' : 'text-muted-foreground hover:text-warm-text'
                )}
              >
                <Grid3X3 size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories bar */}
      <div className="border-b border-warm-border px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1440px] mx-auto flex items-center gap-6 overflow-x-auto no-scrollbar py-0">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'flex-shrink-0 py-3 text-[10px] font-medium uppercase tracking-[0.12em] border-b-2 transition-colors font-sans',
              activeCategory === 'all'
                ? 'text-warm-text border-warm-text'
                : 'text-muted-foreground border-transparent hover:text-warm-text'
            )}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                'flex-shrink-0 py-3 text-[10px] font-medium uppercase tracking-[0.12em] border-b-2 transition-colors font-sans',
                activeCategory === cat.slug
                  ? 'text-warm-text border-warm-text'
                  : 'text-muted-foreground border-transparent hover:text-warm-text'
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
              <h3 className="text-[10px] font-medium uppercase tracking-[0.15em] text-warm-text font-sans">Filters</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-[9px] text-muted-foreground hover:text-camel transition-colors font-sans">
                  Clear All
                </button>
              )}
            </div>

            {/* Price Range */}
            <div className="mb-6 pb-6 border-b border-warm-border">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-3 font-sans">
                Price Range
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0] || ''}
                  onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                  className="w-full px-2 py-1.5 text-[10px] border border-warm-border bg-transparent text-warm-text font-sans focus:border-camel"
                />
                <span className="text-muted-foreground text-[10px]">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1] === 10000 ? '' : priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000])}
                  className="w-full px-2 py-1.5 text-[10px] border border-warm-border bg-transparent text-warm-text font-sans focus:border-camel"
                />
              </div>
            </div>

            {/* Material */}
            <div className="mb-6 pb-6 border-b border-warm-border">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-3 font-sans">
                Material
              </h4>
              <div className="space-y-2">
                {['Premium Crepe', 'Chiffon', 'Satin', 'Linen', 'Knitted Cotton', 'Modal Cotton'].map(material => (
                  <label key={material} className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-3.5 h-3.5 border border-warm-border group-hover:border-camel transition-colors flex items-center justify-center">
                      <input type="checkbox" className="sr-only" />
                    </div>
                    <span className="text-[11px] text-warm-text/70 font-light font-sans">{material}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif-heading text-xl text-warm-text mb-2">No products found</p>
              <p className="text-xs text-muted-foreground font-light font-sans">Try adjusting your filters</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-[10px] font-medium uppercase tracking-[0.12em] text-camel hover:text-warm-text transition-colors font-sans"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={cn(
              'grid gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10',
              gridCols === 3 ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            )}>
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFiltersOpen && (
        <>
          <div className="fixed inset-0 z-[55] bg-warm-text/20" onClick={() => setIsFiltersOpen(false)} />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 bottom-0 z-[56] w-[300px] bg-white flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-warm-border">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.15em] text-warm-text font-sans">Filters</h3>
              <button onClick={() => setIsFiltersOpen(false)}>
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scroll px-5 py-5">
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-3 font-sans">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0] || ''}
                    onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                    className="w-full px-2 py-1.5 text-[10px] border border-warm-border bg-transparent text-warm-text font-sans"
                  />
                  <span className="text-muted-foreground text-[10px]">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1] === 10000 ? '' : priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000])}
                    className="w-full px-2 py-1.5 text-[10px] border border-warm-border bg-transparent text-warm-text font-sans"
                  />
                </div>
              </div>
            </div>
            {hasFilters && (
              <div className="px-5 py-4 border-t border-warm-border">
                <button onClick={() => { clearFilters(); setIsFiltersOpen(false); }} className="w-full py-2.5 text-[10px] font-medium uppercase tracking-[0.12em] text-warm-text border border-warm-border hover:bg-warm-text hover:text-warm-bg transition-all font-sans">
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
