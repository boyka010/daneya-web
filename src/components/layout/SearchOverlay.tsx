'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { navigate } from '@/lib/router';
import { searchProducts } from '@/data/products';
import { Button } from '@/components/ui/button';

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof searchProducts>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      const timer = setTimeout(() => {
        const products = searchProducts(searchQuery);
        setResults(products);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    },
    []
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleSelect = (productName: string) => {
    const updated = [productName, ...recentSearches.filter((s) => s !== productName)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    onOpenChange(false);
  };

  const suggestedCategories = [
    { label: 'Abayas', query: 'abaya' },
    { label: 'Capes', query: 'cape' },
    { label: 'Dresses', query: 'dress' },
    { label: 'Sets', query: 'set' },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#1C1614]/60 backdrop-blur-sm animate-in fade-in" />
        <Dialog.Content className="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F4] border-b border-[#E8E4DF] animate-in slide-in-from-top duration-300">
          <div className="max-w-3xl mx-auto">
            {/* Search Input */}
            <div className="relative px-4 py-4 border-b border-[#E8E4DF]">
              <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#6B6560]" strokeWidth={1.5} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search our collection..."
                className="w-full pl-12 pr-12 py-3 bg-transparent text-lg font-light text-[#1C1614] placeholder:text-[#6B6560] outline-none"
                autoFocus
              />
              {isLoading ? (
                <Loader2 size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#6B6560] animate-spin" />
              ) : (
                <Dialog.Close className="absolute right-6 top-1/2 -translate-y-1/2 text-[#6B6560] hover:text-[#1C1614] transition-colors">
                  <X size={18} strokeWidth={2} />
                </Dialog.Close>
              )}
            </div>

            {/* Results */}
            <div className="max-h-[70vh] overflow-y-auto custom-scroll">
              {query.length === 0 && recentSearches.length > 0 && (
                <div className="px-4 py-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#6B6560] mb-3">Recent Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => setQuery(search)}
                        className="px-3 py-1.5 bg-[#F5F2EE] text-sm text-[#1C1614] hover:bg-[#E8E4DF] transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.length === 0 && (
                <div className="px-4 py-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#6B6560] mb-3">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedCategories.map((cat) => (
                      <button
                        key={cat.query}
                        onClick={() => setQuery(cat.query)}
                        className="px-4 py-2 border border-[#1C1614] text-sm text-[#1C1614] hover:bg-[#1C1614] hover:text-white transition-colors"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.length > 1 && results.length > 0 && (
                <div className="px-4 py-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#6B6560] mb-3">
                    Products ({results.length})
                  </p>
                  <div className="space-y-2">
                    {results.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          handleSelect(product.name);
                          navigate({ type: 'product', id: product.id });
                        }}
                        className="flex items-center gap-4 w-full p-3 hover:bg-[#F5F2EE] transition-colors text-left group"
                      >
                        <div className="w-14 h-20 bg-[#F5F2EE] flex-shrink-0 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif-heading text-sm font-medium text-[#1C1614] truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-[#6B6560] mt-1">EGP {product.price.toLocaleString()}</p>
                        </div>
                        <ArrowRight size={16} className="text-[#6B6560] group-hover:text-[#1C1614] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.length > 1 && results.length === 0 && !isLoading && (
                <div className="px-4 py-12 text-center">
                  <p className="text-[#6B6560]">No products found for "{query}"</p>
                  <p className="text-sm text-[#6B6560] mt-2">Try different keywords</p>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
