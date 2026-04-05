import { getAllProducts, getAllCollections, getCollectionByHandle, transformShopifyProduct, SHOPIFY_CONFIG } from '@/lib/shopify';

const TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const CACHE_PREFIX = 'daneya_cache_';

function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as { data: T; timestamp: number };
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    console.log(`[Cache HIT] ${key} (${Math.round((Date.now() - entry.timestamp) / 1000)}s old)`);
    return entry.data;
  } catch {
    return null;
  }
}

function setCached<T>(key: string, data: T): void {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, timestamp: Date.now() }));
    console.log(`[Cache SET] ${key}`);
  } catch {
    // localStorage full or unavailable
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<T>((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

export async function getShopifyProducts() {
  const cached = getCached<any[]>('shopify_products');
  if (cached) return cached;

  console.log('[Cache MISS] Fetching Shopify products...');
  try {
    const products = await withTimeout(getAllProducts(SHOPIFY_CONFIG, 50), TIMEOUT_MS);
    const transformed = products.map(transformShopifyProduct);
    setCached('shopify_products', transformed);
    return transformed;
  } catch (error) {
    console.error('Failed to fetch Shopify products:', error);
    return [];
  }
}

export async function getShopifyCollections() {
  const cached = getCached<any[]>('shopify_collections');
  if (cached) return cached;

  console.log('[Cache MISS] Fetching Shopify collections...');
  try {
    const collections = await withTimeout(getAllCollections(SHOPIFY_CONFIG), TIMEOUT_MS);
    setCached('shopify_collections', collections);
    return collections;
  } catch (error) {
    console.error('Failed to fetch Shopify collections:', error);
    return [];
  }
}

export async function getCollectionProducts(handle: string, count: number = 20) {
  const cacheKey = `collection_${handle}_${count}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  console.log(`[Cache MISS] Fetching collection "${handle}"...`);
  try {
    const collection = await withTimeout(getCollectionByHandle(SHOPIFY_CONFIG, handle, count), TIMEOUT_MS);
    if (!collection) return [];
    const products = collection.products?.edges?.map((edge: any) => transformShopifyProduct(edge.node)) || [];
    setCached(cacheKey, products);
    return products;
  } catch (error) {
    console.error(`Failed to fetch collection "${handle}":`, error);
    return [];
  }
}
