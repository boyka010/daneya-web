'use client';

import { Instagram, Facebook, Mail, Phone, MapPin, MessageCircle, Youtube, Twitter } from 'lucide-react';
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
    Mada: (
      <svg viewBox="0 0 48 32" className="w-10 h-6" fill="none">
        <rect width="48" height="32" rx="3" fill="#1A1F71" />
        <text x="24" y="18" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">mada</text>
      </svg>
    ),
    COD: (
      <svg viewBox="0 0 48 32" className="w-10 h-6" fill="none">
        <rect width="48" height="32" rx="3" fill="#2E7D32" />
        <text x="24" y="18" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="sans-serif">CASH</text>
        <text x="24" y="24" textAnchor="middle" fill="white" fontSize="5" fontFamily="sans-serif">on Delivery</text>
      </svg>
    ),
  };
  return icons[name] || null;
}

const footerLinks = {
  shop: [
    { label: 'New Arrivals', action: () => navigate({ type: 'shop' }) },
    { label: 'Best Sellers', action: () => navigate({ type: 'shop', category: 'best-sellers' }) },
    { label: 'Abayas', action: () => navigate({ type: 'shop', category: 'abayas' }) },
    { label: 'Sets', action: () => navigate({ type: 'shop', category: 'sets' }) },
    { label: 'Capes', action: () => navigate({ type: 'shop', category: 'capes' }) },
  ],
  help: [
    { label: 'Shipping & Delivery', action: () => navigate({ type: 'home' }) },
    { label: 'Returns & Exchanges', action: () => navigate({ type: 'home' }) },
    { label: 'Size Guide', action: () => navigate({ type: 'home' }) },
    { label: 'FAQ', action: () => navigate({ type: 'home' }) },
  ],
  company: [
    { label: 'About Us', action: () => navigate({ type: 'about' }) },
    { label: 'Contact Us', action: () => navigate({ type: 'home' }) },
    { label: 'Privacy Policy', action: () => navigate({ type: 'home' }) },
    { label: 'Terms of Service', action: () => navigate({ type: 'home' }) },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#1C1614] text-white/80">
      {/* Trust Badges Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'Orders over EGP 2,000' },
              { icon: '🛡️', title: 'Secure Payment', desc: '100% Secure Checkout' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-Day Return Policy' },
              { icon: '💬', title: 'WhatsApp Support', desc: 'Quick Response' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-xs font-medium text-white">{item.title}</p>
                  <p className="text-[10px] text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="col-span-2">
            <h3 className="text-[14px] font-serif text-white mb-4">DANEYA</h3>
            <p className="text-xs text-white/50 mb-6 max-w-xs">
              Premium modest fashion for the modern woman. Elegant abayas, sets, and accessories crafted with care.
            </p>
            <div className="space-y-3">
              <a 
                href="https://wa.me/201XXXXXXXXX" 
                className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
              >
                <MessageCircle size={14} />
                <span>+20 1XX XXX XXXX</span>
              </a>
              <a 
                href="tel:+201XXXXXXXXX" 
                className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
              >
                <Phone size={14} />
                <span>+20 1XX XXX XXXX</span>
              </a>
              <a 
                href="mailto:hello@daneya.com" 
                className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
              >
                <Mail size={14} />
                <span>hello@daneya.com</span>
              </a>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <MapPin size={14} />
                <span>Cairo, Egypt</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40 mb-5">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={item.action}
                    className="text-xs font-light text-white/60 hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40 mb-5">
              Help
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.help.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={item.action}
                    className="text-xs font-light text-white/60 hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40 mb-5">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={item.action}
                    className="text-xs font-light text-white/60 hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/daneya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-[#C4748C] hover:bg-[#C4748C]/10 transition-all duration-300"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={14} strokeWidth={1.5} />
              </a>
              <a
                href="https://facebook.com/daneya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-[#C4748C] hover:bg-[#C4748C]/10 transition-all duration-300"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={14} strokeWidth={1.5} />
              </a>
              <a
                href="https://tiktok.com/@daneya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-[#C4748C] hover:bg-[#C4748C]/10 transition-all duration-300"
                aria-label="Follow us on TikTok"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com/@daneya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-[#C4748C] hover:bg-[#C4748C]/10 transition-all duration-300"
                aria-label="Subscribe on YouTube"
              >
                <Youtube size={14} strokeWidth={1.5} />
              </a>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-white/40">Secure Payments:</span>
              <div className="flex items-center gap-1.5">
                {['Visa', 'Mastercard', 'Amex', 'Mada', 'COD'].map((name) => (
                  <PaymentIcon key={name} name={name} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-white/30 tracking-wider font-light">
            © 2026 DANEYA. All rights reserved. Made with ❤️ in Egypt
          </p>
          <div className="flex items-center gap-4 text-[10px] text-white/30">
            <span>Egypt's Premium Modest Fashion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}