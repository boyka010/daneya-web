'use client';

import { useEffect, useState } from 'react';
import { getAllProducts, SHOPIFY_CONFIG } from '@/lib/shopify';

export default function TestShopify() {
  const [status, setStatus] = useState('Testing...');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    async function test() {
      try {
        console.log('Testing with config:', SHOPIFY_CONFIG);
        const products = await getAllProducts(SHOPIFY_CONFIG, 5);
        setStatus('SUCCESS');
        setResult(products);
      } catch (error: any) {
        setStatus('ERROR');
        setResult(error.message);
      }
    }
    test();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h1>Shopify API Test</h1>
      <p>Status: {status}</p>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}