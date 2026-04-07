'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { PageRoute } from '@/lib/router';
import { routeToPath } from '@/lib/router';

export function useNavigate() {
  const router = useRouter();

  return useCallback((page: PageRoute) => {
    const path = routeToPath(page);
    router.push(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [router]);
}
