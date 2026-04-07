'use client';

import { use } from 'react';
import ProductPage from '@/views/ProductPage';

export default function ProductRoute({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = use(params);
  return <ProductPage productHandle={resolvedParams.handle} />;
}
