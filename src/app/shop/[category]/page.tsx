'use client';

import { use } from 'react';
import ShopPage from '@/views/ShopPage';

export default function ShopCategoryRoute({ params }: { params: Promise<{ category: string }> }) {
  return <ShopPage />;
}
