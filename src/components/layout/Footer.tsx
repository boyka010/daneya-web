'use client';

import { Instagram, Facebook, Mail, Phone, MapPin, MessageCircle, Youtube } from 'lucide-react';
import { navigate } from '@/lib/router';

const footerLinks = {
  shop: [
    { label: 'New Arrivals', action: () => navigate({ type: 'shop' }) },
    { label: 'Best Sellers', action: () => navigate({ type: 'shop', category: 'best-sellers' }) },
    { label: 'Abayas', action: () => navigate({ type: 'shop', category: 'abayas' }) },
    { label: 'Sets', action: () => navigate({ type: 'shop', category: 'sets' }) },
  ],
  help: [
    { label: 'Shipping', action: () => navigate({ type: 'shipping' }) },
    { label: 'Returns', action: () => navigate({ type: 'returns' }) },
    { label: 'Size Guide', action: () => navigate({ type: 'size-guide' }) },
    { label: 'FAQ', action: () => navigate({ type: 'faq' }) },
  ],
  company: [
    { label: 'About Us', action: () => navigate({ type: 'about' }) },
    { label: 'Contact', action: () => navigate({ type: 'contact' }) },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#1C1614] text-white/80">
      <div className="px-6 py-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-serif text-white mb-4">DANEYA</h3>
            <p className="text-xs text-white/40 mb-4 leading-relaxed">
              Premium modest fashion from Egypt.
            </p>
            <div className="space-y-2 text-xs text-white/50">
              <a href="https://wa.me/201XXXXXXXXX" className="flex items-center gap-2 hover:text-white">
                <MessageCircle size={14} /> +20 1XX XXX XXXX
              </a>
              <a href="mailto:hello@daneya.com" className="flex items-center gap-2 hover:text-white">
                <Mail size={14} /> hello@daneya.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin size={14} /> Cairo, Egypt
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-white/40 mb-3">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((item) => (
                <li key={item.label}>
                  <button onClick={item.action} className="text-xs text-white/50 hover:text-white transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-white/40 mb-3">Help</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((item) => (
                <li key={item.label}>
                  <button onClick={item.action} className="text-xs text-white/50 hover:text-white transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social & Bottom */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="https://instagram.com/daneya" className="w-8 h-8 flex items-center justify-center border border-white/20 hover:border-[#C9A97A] transition-colors">
              <Instagram size={14} />
            </a>
            <a href="https://facebook.com/daneya" className="w-8 h-8 flex items-center justify-center border border-white/20 hover:border-[#C9A97A] transition-colors">
              <Facebook size={14} />
            </a>
          </div>
          <p className="text-[10px] text-white/30">© 2026 DANEYA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}