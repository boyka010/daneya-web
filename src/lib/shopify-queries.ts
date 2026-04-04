import { getAllProducts, getAllCollections, transformShopifyProduct, SHOPIFY_CONFIG } from '@/lib/shopify';

export async function getShopifyProducts() {
  console.log('SHOPIFY_CONFIG:', SHOPIFY_CONFIG);
  try {
    const products = await getAllProducts(SHOPIFY_CONFIG, 50);
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
    const collections = await getAllCollections(SHOPIFY_CONFIG);
    console.log('Raw Shopify collections:', collections);
    return collections;
  } catch (error) {
    console.error('Failed to fetch Shopify collections:', error);
    return [];
  }
}
