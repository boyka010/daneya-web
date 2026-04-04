import { getAllProducts, getAllCollections, transformShopifyProduct, SHOPIFY_CONFIG } from '@/lib/shopify';

const TIMEOUT_MS = 8000;

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<T>((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

export async function getShopifyProducts() {
  console.log('SHOPIFY_CONFIG:', SHOPIFY_CONFIG);
  try {
    const products = await withTimeout(getAllProducts(SHOPIFY_CONFIG, 50), TIMEOUT_MS);
    console.log('Raw Shopify products:', products);
    return products.map(transformShopifyProduct);
  } catch (error) {
    console.error('Failed to fetch Shopify products:', error);
    return [];
  }
}

export async function getShopifyCollections() {
  console.log('SHOPIFY_CONFIG:', SHOPIFY_CONFIG);
  try {
    const collections = await withTimeout(getAllCollections(SHOPIFY_CONFIG), TIMEOUT_MS);
    console.log('Raw Shopify collections:', collections);
    return collections;
  } catch (error) {
    console.error('Failed to fetch Shopify collections:', error);
    return [];
  }
}