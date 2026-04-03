'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { navigate } from '@/lib/router';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Layers,
  Palette,
  Settings,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

const navSections = [
  {
    title: null,
    items: [
      { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
      { id: 'orders', label: 'Orders', icon: ShoppingBag },
      { id: 'products', label: 'Products', icon: Package },
      { id: 'customers', label: 'Customers', icon: Users },
    ],
  },
  {
    title: 'Insights',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Customize',
    items: [
      { id: 'content', label: 'Content', icon: Layers },
      { id: 'themes', label: 'Themes', icon: Palette },
    ],
  },
  {
    title: null,
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const adminSection = useStore((s) => s.adminSection);
  const setAdminSection = useStore((s) => s.setAdminSection);
  const [collapsed, setCollapsed] = useState(false);

  const handleNav = (id: string) => {
    setAdminSection(id);
    navigate({ type: 'admin', section: id });
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={`bg-[#1E293B] flex flex-col shrink-0 transition-all duration-300 ${
          collapsed ? 'w-[68px]' : 'w-[240px]'
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-white flex items-center justify-center shrink-0">
              <span className="text-[#1E293B] text-sm font-black tracking-wider">H</span>
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-white text-lg font-black tracking-wider leading-none">DANEYA</h1>
                <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest">Admin</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="size-7 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          )}
        </div>

        <Separator className="bg-white/10" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          {navSections.map((section, secIdx) => (
            <div key={secIdx}>
              {section.title && !collapsed && (
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 pt-4 pb-2">
                  {section.title}
                </p>
              )}
              {section.title && collapsed && <div className="pt-2 pb-1" />}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = adminSection === item.id;
                  const Icon = item.icon;

                  const button = (
                    <button
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        collapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className={`size-[18px] shrink-0 ${isActive ? 'text-slate-900' : ''}`} />
                      {!collapsed && <span>{item.label}</span>}
                    </button>
                  );

                  if (collapsed) {
                    return (
                      <li key={item.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>{button}</TooltipTrigger>
                          <TooltipContent side="right" sideOffset={8}>
                            <p className="text-xs font-medium">{item.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    );
                  }

                  return <li key={item.id}>{button}</li>;
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Back to Store */}
        <Separator className="bg-white/10" />
        <div className="px-3 py-3">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate({ type: 'home' })}
                  className="w-full flex items-center justify-center py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                >
                  <ArrowLeft className="size-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                <p className="text-xs font-medium">Back to Store</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => navigate({ type: 'home' })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="size-[18px]" />
              Back to Store
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
