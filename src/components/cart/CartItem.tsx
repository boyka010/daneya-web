'use client';

import Image from 'next/image';
import { navigate } from '@/lib/router';
import { useStore } from '@/store/useStore';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  mode?: 'full' | 'compact';
  productId: number;
  color: string;
}

export default function CartItem({ mode = 'full', productId, color }: CartItemProps) {
  const cartItems = useStore((s) => s.cartItems);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const updateQuantity = useStore((s) => s.updateQuantity);

  const item = cartItems.find(
    (i) => i.product.id === productId && i.selectedColor === color
  );

  if (!item) return null;

  const { product, quantity } = item;

  if (mode === 'compact') {
    return (
      <div className="flex items-center gap-3.5 py-4">
        {/* Image */}
        <div className="w-16 h-20 relative bg-secondary flex-shrink-0 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-serif-heading text-xs font-medium text-warm-text truncate leading-snug">
            {product.name}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="w-3 h-3 rounded-full border border-warm-border inline-block flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-[10px] text-muted-foreground font-light">
              {color} &middot; Qty: {quantity}
            </span>
          </div>
          <p className="text-xs font-medium text-warm-text mt-1 font-sans">
            EGP {(product.price * quantity).toLocaleString()}
          </p>
        </div>

        {/* Remove */}
        <button
          onClick={() => removeFromCart(product.id, color)}
          className="p-1.5 text-muted-foreground hover:text-sale transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={13} strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  // Full mode
  return (
    <div className="py-5 flex items-start gap-5 border-b border-warm-border last:border-0">
      {/* Image */}
      <div
        className="w-24 h-32 relative bg-secondary flex-shrink-0 cursor-pointer overflow-hidden"
        onClick={() => navigate({ type: 'product', id: product.id })}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-700"
          sizes="96px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <button
              onClick={() => navigate({ type: 'product', id: product.id })}
              className="font-serif-heading text-sm font-medium text-warm-text hover:text-camel transition-colors leading-snug"
            >
              {product.name}
            </button>
            <p className="text-[10px] text-muted-foreground mt-1 font-light font-sans">{product.material}</p>
            {product.badge && (
              <span className="inline-block mt-1.5 badge-new">{product.badge.toUpperCase()}</span>
            )}
          </div>
          <p className="text-sm font-medium text-warm-text ml-4 font-sans">
            EGP {(product.price * quantity).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Color */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-muted-foreground font-sans">Color:</span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-4 h-4 rounded-full border border-warm-border"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] text-muted-foreground font-light">{color}</span>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center border border-warm-border">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1, color)}
              className="w-7 h-7 flex items-center justify-center text-warm-text hover:text-camel transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={11} strokeWidth={1.5} />
            </button>
            <span className="w-8 text-center text-[11px] font-medium text-warm-text font-sans">{quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1, color)}
              className="w-7 h-7 flex items-center justify-center text-warm-text hover:text-camel transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={11} strokeWidth={1.5} />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeFromCart(product.id, color)}
            className="p-1.5 text-muted-foreground hover:text-sale transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={13} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
