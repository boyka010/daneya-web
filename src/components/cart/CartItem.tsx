'use client';

import { navigate } from '@/lib/router';
import { useStore as useShopifyStore } from '@/store/shopifyStore';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  mode?: 'full' | 'compact';
  productId: number;
  color: string;
}

export default function CartItem({ mode = 'full', productId, color }: CartItemProps) {
  const shopifyCart = useShopifyStore((s) => s.cart);
  const removeFromCart = useShopifyStore((s) => s.removeFromCart);
  const updateCartItem = useShopifyStore((s) => s.updateCartItem);
  
  if (!shopifyCart?.lines) return null;
  
  const index = shopifyCart.lines.findIndex(
    (i) => i.product.id === productId && i.selectedColor === color
  );
  
  if (index === -1) return null;
  
  const item = shopifyCart.lines[index];
  const { product, quantity } = item;
  
  const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='120' viewBox='0 0 100 120'%3E%3Crect width='100' height='120' fill='%23FAF7F4'/%3E%3Crect x='35' y='40' width='30' height='30' rx='15' fill='%23E8E4DF'/%3E%3C/svg%3E";
  
  const imageUrl = product?.image && typeof product.image === 'string' && product.image.length > 10
    ? product.image 
    : fallbackImage;

  const handleRemove = () => {
    removeFromCart(index);
  };

  const handleUpdateQuantity = (newQty: number) => {
    if (newQty < 1) {
      handleRemove();
      return;
    }
    updateCartItem(index, newQty);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackImage;
  };

  if (mode === 'compact') {
    return (
      <div className="flex items-center gap-3.5 py-4">
        <div className="w-16 h-20 relative bg-[#FAF7F4] flex-shrink-0 overflow-hidden">
          <img
            src={imageUrl}
            alt={product?.name || 'Product'}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-serif-heading text-xs font-normal text-[#1C1614] truncate leading-snug">
            {product?.name || 'Product'}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-3 h-3 rounded-full border border-[#E8E4DF] inline-block flex-shrink-0"
              style={{ backgroundColor: color || '#ccc' }}
            />
            <span className="text-[10px] text-[#6B6560] font-light">
              {color || 'Default'} · Qty: {quantity}
            </span>
          </div>
          <p className="text-xs font-normal text-[#1C1614] mt-1 font-sans">
            EGP {((product?.price || 0) * quantity).toLocaleString()}
          </p>
        </div>

        <button
          onClick={handleRemove}
          className="p-1.5 text-[#6B6560] hover:text-[#C4748C] transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={13} strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  return (
    <div className="py-5 flex items-start gap-5 border-b border-[#E8E4DF] last:border-0">
      <div
        className="w-24 h-32 relative bg-[#FAF7F4] flex-shrink-0 cursor-pointer overflow-hidden"
        onClick={() => navigate({ type: 'product', id: product?.id })}
      >
        <img
          src={imageUrl}
          alt={product?.name || 'Product'}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          onError={handleImageError}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <button
              onClick={() => navigate({ type: 'product', id: product?.id })}
              className="font-serif-heading text-sm font-normal text-[#1C1614] hover:text-[#C9A97A] transition-colors leading-snug"
            >
              {product?.name || 'Product'}
            </button>
            <p className="text-[10px] text-[#6B6560] mt-1 font-light font-sans">{product?.material || ''}</p>
          </div>
          <p className="text-sm font-normal text-[#1C1614] ml-4 font-sans">
            EGP {((product?.price || 0) * quantity).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-[#6B6560] font-sans">Color:</span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-4 h-4 rounded-full border border-[#E8E4DF]"
                style={{ backgroundColor: color || '#ccc' }}
              />
              <span className="text-[10px] text-[#6B6560] font-light">{color || 'Default'}</span>
            </div>
          </div>

          <div className="flex items-center border border-[#E8E4DF]">
            <button
              onClick={() => handleUpdateQuantity(quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-[#1C1614] hover:text-[#C9A97A] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={11} strokeWidth={1.5} />
            </button>
            <span className="w-8 text-center text-[11px] font-medium text-[#1C1614] font-sans">{quantity}</span>
            <button
              onClick={() => handleUpdateQuantity(quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-[#1C1614] hover:text-[#C9A97A] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={11} strokeWidth={1.5} />
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="p-1.5 text-[#6B6560] hover:text-[#C4748C] transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={13} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}