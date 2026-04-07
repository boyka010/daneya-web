'use client';

import { createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { PageRoute } from '@/lib/router';
import { routeToPath } from '@/lib/router';

interface NavContextType {
  navigate: (page: PageRoute) => void;
}

const NavContext = createContext<NavContextType | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const navigate = useCallback((page: PageRoute) => {
    const path = routeToPath(page);
    router.push(path);
  }, [router]);

  return (
    <NavContext.Provider value={{ navigate }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNavigate() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNavigate must be used within NavProvider');
  return ctx.navigate;
}
