'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { initAdTracking } from '@/lib/ads';

export default function AdTracking() {
  const adminSettings = useStore((s) => s.adminSettings);

  useEffect(() => {
    initAdTracking({
      metaPixelId: adminSettings.metaPixelId,
      googleAdsId: adminSettings.googleAdsId,
      tiktokPixelId: adminSettings.tiktokPixelId,
    });
  }, [adminSettings.metaPixelId, adminSettings.googleAdsId, adminSettings.tiktokPixelId]);

  return null;
}
