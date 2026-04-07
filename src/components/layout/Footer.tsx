'use client';

import { useState } from 'react';
import { Instagram, Facebook, ChevronDown } from 'lucide-react';
import { useNavigate } from '@/hooks/useNavigate';

export default function Footer() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <footer className="bg-[#1C1614] text-white/80">
      <div className="px-6 py-6 max-w-[1400px] mx-auto">
        {/* Main Menu - collapsible */}
        <div className="border-b border-white/10">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-between w-full py-3 md:py-4"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Menu</span>
            <ChevronDown size={14} className="text-white/30 transition-transform duration-300" style={{ transform: menuOpen ? 'rotate(180deg)' : '' }} />
          </button>
          <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: menuOpen ? '400px' : '0' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-4">
              <div>
                <h5 className="text-[9px] uppercase tracking-wider text-white/30 mb-2">Shop</h5>
                <ul className="space-y-1.5">
                  {['New Arrivals', 'Abayas', 'Dresses', 'Sets'].map((item) => (
                    <li key={item}>
                      <button onClick={() => navigate({ type: 'shop' })} className="text-xs text-white/50 hover:text-white transition-colors">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-[9px] uppercase tracking-wider text-white/30 mb-2">Help</h5>
                <ul className="space-y-1.5">
                  {['Shipping', 'Returns', 'Size Guide', 'FAQ'].map((item) => (
                    <li key={item}>
                      <button onClick={() => navigate({ type: item.toLowerCase() as any })} className="text-xs text-white/50 hover:text-white transition-colors">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-[9px] uppercase tracking-wider text-white/30 mb-2">Company</h5>
                <ul className="space-y-1.5">
                  {['About Us', 'Contact'].map((item) => (
                    <li key={item}>
                      <button onClick={() => navigate({ type: item.toLowerCase().replace(' ', '-') as any })} className="text-xs text-white/50 hover:text-white transition-colors">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:hidden">
                <h5 className="text-[9px] uppercase tracking-wider text-white/30 mb-2">Follow Us</h5>
                <div className="flex items-center gap-3">
                  <a href="https://instagram.com/daneya" className="w-8 h-8 flex items-center justify-center border border-white/20 hover:border-[#C9A97A] transition-colors">
                    <Instagram size={14} />
                  </a>
                  <a href="https://facebook.com/daneya" className="w-8 h-8 flex items-center justify-center border border-white/20 hover:border-[#C9A97A] transition-colors">
                    <Facebook size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info - collapsible */}
        <div className="border-b border-white/10">
          <button
            onClick={() => setInfoOpen(!infoOpen)}
            className="flex items-center justify-between w-full py-3 md:py-4"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Info</span>
            <ChevronDown size={14} className="text-white/30 transition-transform duration-300" style={{ transform: infoOpen ? 'rotate(180deg)' : '' }} />
          </button>
          <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: infoOpen ? '200px' : '0' }}>
            <div className="pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-xs text-white/50">
                <p>+20 155 791 2688</p>
                <p>hello@daneya.shop</p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <a href="https://instagram.com/daneya" className="w-8 h-8 flex items-center justify-center border border-white/20 hover:border-[#C9A97A] transition-colors">
                  <Instagram size={14} />
                </a>
                <a href="https://facebook.com/daneya" className="w-8 h-8 flex items-center justify-center border border-white/20 hover:border-[#C9A97A] transition-colors">
                  <Facebook size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-white/30">© 2026 DANEYA</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate({ type: 'shipping' })} className="text-[10px] text-white/30 hover:text-white/50 transition-colors">Shipping</button>
            <button onClick={() => navigate({ type: 'returns' })} className="text-[10px] text-white/30 hover:text-white/50 transition-colors">Returns</button>
            <button onClick={() => navigate({ type: 'faq' })} className="text-[10px] text-white/30 hover:text-white/50 transition-colors">FAQ</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
