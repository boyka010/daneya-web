import { getAllProducts, getAllCollections, transformShopifyProduct, SHOPIFY_CONFIG } from '@/lib/shopify';

export async function getShopifyProducts() {
  try {
    const products = await getAllProducts(SHOPIFY_CONFIG, 50);
    return products.map(transformShopifyProduct);
  } catch (error) {
    console.error('Failed to fetch Shopify products:', error);
    return [];
  }
}

export async function getShopifyCollections() {
  try {
    const collections = await getAllCollections(SHOPIFY_CONFIG);
    return collections;
  } catch (error) {
    console.error('Failed to fetch Shopify collections:', error);
    return [];
  }
}
