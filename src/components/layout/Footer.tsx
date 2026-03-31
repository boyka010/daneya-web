'use client';

import { Instagram, Facebook } from 'lucide-react';
import { navigate } from '@/lib/router';

function PaymentIcon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    Visa: (
      <svg viewBox="0 0 48 32" className="w-10 h-6" fill="none">
        <rect width="48" height="32" rx="3" fill="#1A1F71" />
        <path d="M18.5 21h-2.7l1.7-10h2.7L18.5 21zm11.3-9.8c-.5-.2-1.4-.4-2.4-.4-2.7 0-4.5 1.3-4.5 3.2 0 1.4 1.3 2.2 2.3 2.7 1 .5 1.4.8 1.4 1.3 0 .7-.9 1-1.7 1-1.1 0-1.8-.2-2.7-.5l-.4-.2-.4 2.5c.7.3 1.9.5 3.2.5 2.8 0 4.6-1.3 4.6-3.3 0-1.1-.7-2-2.3-2.7-1-.5-1.5-.8-1.5-1.3 0-.5.5-1 1.5-1 .9 0 1.6.2 2.1.4l.3.1.4-2.3zM34 11.2h-2.1c-.7 0-1.2.2-1.5.9l-4.1 9.9h2.8l.6-1.5h3.4l.3 1.5H36l-2-10.8zm-3.3 7l1.4-3.8.8 3.8h-2.2zM15.4 11.2l-2.7 6.8-.3-1.5c-.5-1.7-2.1-3.5-3.9-4.4l2.5 8.9h2.9l4.3-9.9h-2.8z" fill="#FFFFFF" />
        <path d="M10.9 11.2H7.3l-.1.2c2.7.7 4.6 2.4 5.3 4.4l-.8-3.8c-.1-.7-.6-.9-1.2-.9l.2.1z" fill="#F9A533" />
      </svg>
    ),
    Mastercard: (
      <svg viewBox="0 0 48 32" className="w-10 h-6" fill="none">
        <rect width="48" height="32" rx="3" fill="#1A1F71" />
        <circle cx="19" cy="16" r="8" fill="#EB001B" />
        <circle cx="29" cy="16" r="8" fill="#F79E1B" />
        <path d="M24 10.3a8 8 0 010 11.4 8 8 0 000-11.4z" fill="#FF5F00" />
      </svg>
    ),
    Amex: (
      <svg viewBox="0 0 48 32" className="w-10 h-6" fill="none">
        <rect width="48" height="32" rx="3" fill="#006FCF" />
        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">AMEX</text>
      </svg>
    ),
    'Apple Pay': (
      <svg viewBox="0 0 48 32" className="w-10 h-6" fill="none">
        <rect width="48" height="32" rx="3" fill="#000" />
        <text x="24" y="18" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">Pay</text>
        <text x="24" y="24" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold" fontFamily="sans-serif">Apple</text>
      </svg>
    ),
    'Google Pay': (
      <svg viewBox="0 0 48 32" className="w-10 h-6" fill="none">
        <rect width="48" height="32" rx="3" fill="#1A1A1A" />
        <text x="24" y="18" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">Pay</text>
        <text x="24" y="24" textAnchor="middle" fill="#4285F4" fontSize="4" fontWeight="bold" fontFamily="sans-serif">G</text>
      </svg>
    ),
  };
  return icons[name] || null;
}

const footerLinks = {
  shop: [
    { label: 'New Arrivals', action: () => navigate({ type: 'shop' }) },
    { label: 'Abayas', action: () => navigate({ type: 'shop', category: 'abayas' }) },
    { label: 'Dresses', action: () => navigate({ type: 'shop', category: 'dresses' }) },
    { label: 'Sets', action: () => navigate({ type: 'shop', category: 'sets' }) },
    { label: 'Capes', action: () => navigate({ type: 'shop', category: 'capes' }) },
    { label: 'Scarves', action: () => navigate({ type: 'shop', category: 'scarves' }) },
  ],
  about: [
    { label: 'Our Story', action: () => navigate({ type: 'about' }) },
    { label: 'Sustainability', action: () => {} },
    { label: 'Careers', action: () => {} },
  ],
  help: [
    { label: 'Shipping & Delivery', action: () => {} },
    { label: 'Returns & Exchanges', action: () => {} },
    { label: 'Size Guide', action: () => {} },
    { label: 'Contact Us', action: () => {} },
    { label: 'FAQ', action: () => {} },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-warm-text text-white/80">
      {/* Main Footer */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Shop */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40 mb-5 font-sans">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={item.action}
                    className="text-sm font-light text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40 mb-5 font-sans">
              About
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.about.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={item.action}
                    className="text-sm font-light text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40 mb-5 font-sans">
              Help
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.help.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={item.action}
                    className="text-sm font-light text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Social */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40 mb-5 font-sans">
              Stay Connected
            </h4>
            <div className="flex items-center gap-4 mb-6">
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-white/60 hover:bg-white/5 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={14} strokeWidth={1.5} />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-white/60 hover:bg-white/5 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={14} strokeWidth={1.5} />
              </a>
            </div>
            <p className="text-xs font-light text-white/40 leading-relaxed">
              Be the first to know about new collections, exclusive offers, and styling inspiration.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-white/30 tracking-wider font-light">
            &copy; 2025 HAYA. All rights reserved.
          </p>
          <div className="flex items-center gap-2 opacity-40">
            {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay'].map((name) => (
              <PaymentIcon key={name} name={name} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
