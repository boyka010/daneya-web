'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useStore as useShopifyStore } from '@/store/shopifyStore';
import { getShopifyProducts } from '@/lib/shopify-queries';

interface CartRecommendationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='100' viewBox='0 0 80 100'%3E%3Crect width='80' height='100' fill='%23FAF7F4'/%3E%3Crect x='25' y='35' width='30' height='30' rx='15' fill='%23E8E4DF'/%3E%3C/svg%3E";

export default function CartRecommendations({ isOpen, onClose }: CartRecommendationsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useShopifyStore((s) => s.addToCart);

  useEffect(() => {
    async function loadProducts() {
      try {
        const items = await getShopifyProducts();
        setProducts(items.slice(0, 4));
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    }
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  const handleAddItem = (product: any) => {
    const variantId = product.variants?.[0]?.id || undefined;
    addItem(product, 1, product.colors?.[0]?.name || 'Default', variantId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[90vw] max-w-md bg-white border border-[#E8E4DF] shadow-2xl z-[60]"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E4DF]">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[#C4748C]" />
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#1C1614] font-sans">
            You might also like
          </span>
        </div>
        <button onClick={onClose} className="text-[#6B6560] hover:text-[#1C1614] transition-colors">
          <X size={14} />
        </button>
      </div>

      {isLoading ? (
        <div className="p-4 text-center">
          <div className="w-5 h-5 border-2 border-[#C9A97A] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="flex gap-3 p-3 overflow-x-auto no-scrollbar">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => handleAddItem(product)}
              className="flex-shrink-0 w-20 group text-left"
            >
              <div className="relative aspect-[3/4] bg-[#FAF7F4] mb-2 overflow-hidden">
                <img
                  src={product.image && typeof product.image === 'string' && product.image.trim() ? product.image : fallbackImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-[9px] text-[#1C1614] truncate font-sans">{product.name}</p>
              <p className="text-[9px] text-[#6B6560] font-sans">EGP {product.price?.toLocaleString()}</p>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}