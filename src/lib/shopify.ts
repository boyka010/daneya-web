const SHOPIFY_STOREFRONT_API_VERSION = '2026-04';

export interface ShopifyConfig {
  storeDomain: string;
  accessToken: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: {
      node: {
        id: string;
        url: string;
        altText: string | null;
      };
    }[];
  };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice: {
          amount: string;
          currencyCode: string;
        } | null;
        selectedOptions: {
          name: string;
          value: string;
        }[];
      };
    }[];
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  products: {
    edges: {
      node: ShopifyProduct;
    }[];
  };
}

async function shopifyFetch<T>({
  query,
  variables,
  config,
}: {
  query: string;
  variables?: Record<string, unknown>;
  config: ShopifyConfig;
}): Promise<T> {
  const { storeDomain, accessToken } = config;

  const url = `https://${storeDomain}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;

  try {
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const body = await result.json();

    if (body.errors) {
      throw new Error(body.errors[0].message);
    }

    return body.data;
  } catch (error) {
    console.error('Shopify Fetch Error:', error);
    throw error;
  }
}

export async function getAllProducts(config: ShopifyConfig, first: number = 50) {
  const query = `
    query GetAllProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            vendor
            productType
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] };
  }>({
    query,
    variables: { first },
    config,
  });

  return data.products.edges.map((edge) => edge.node);
}

export async function getProductByHandle(
  config: ShopifyConfig,
  handle: string
) {
  const query = `
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        vendor
        productType
        tags
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    product: ShopifyProduct | null;
  }>({
    query,
    variables: { handle },
    config,
  });

  return data.product;
}

export async function getAllCollections(config: ShopifyConfig) {
  const query = `
    query GetAllCollections {
      collections(first: 20) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    collections: { edges: { node: Omit<ShopifyCollection, 'products'> }[] };
  }>({
    query,
    config,
  });

  return data.collections.edges.map((edge) => edge.node);
}

export async function getCollectionByHandle(
  config: ShopifyConfig,
  handle: string,
  productCount: number = 20
) {
  const query = `
    query GetCollectionByHandle($handle: String!, $productCount: Int!) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        image {
          url
          altText
        }
        products(first: $productCount) {
          edges {
            node {
              id
              title
              handle
              description
              vendor
              productType
              tags
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 5) {
                edges {
                  node {
                    id
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    collection: ShopifyCollection | null;
  }>({
    query,
    variables: { handle, productCount },
    config,
  });

  return data.collection;
}

export async function createCheckout(
  config: ShopifyConfig,
  lineItems: { variantId: string; quantity: number }[]
) {
  const query = `
    mutation CreateCheckout($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    checkoutCreate: {
      checkout: {
        id: string;
        webUrl: string;
      };
      checkoutUserErrors: {
        code: string;
        field: string[];
        message: string;
      }[];
    };
  }>({
    query,
    variables: {
      input: {
        lineItems: lineItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      },
    },
    config,
  });

  if (data.checkoutCreate.checkoutUserErrors.length > 0) {
    throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
  }

  return data.checkoutCreate.checkout;
}

export function transformShopifyProduct(product: ShopifyProduct) {
  const images = product.images.edges.map((edge) => edge.node.url);
  const variants = product.variants.edges.map((edge) => {
    const variant = edge.node;
    return {
      id: variant.id,
      title: variant.title,
      available: variant.availableForSale,
      price: parseFloat(variant.price.amount),
      compareAtPrice: variant.compareAtPrice
        ? parseFloat(variant.compareAtPrice.amount)
        : null,
      options: variant.selectedOptions.reduce(
        (acc, opt) => ({ ...acc, [opt.name]: opt.value }),
        {} as Record<string, string>
      ),
    };
  });

  const colors = [...new Set(variants.map((v) => v.options.Color || v.options.color || 'Default'))].filter(Boolean);
  const sizes = [...new Set(variants.map((v) => v.options.Size || v.options.size || 'One Size'))].filter(Boolean);

  return {
    id: parseInt(product.id.replace('gid://shopify/Product/', '')),
    name: product.title,
    nameAr: undefined,
    category: product.productType.toLowerCase() || 'other',
    price: parseFloat(product.priceRange.minVariantPrice.amount),
    originalPrice: product.compareAtPriceRange.minVariantPrice.amount !==
      product.priceRange.minVariantPrice.amount
      ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
      : undefined,
    image: images[0] || '/images/products/placeholder.png',
    images,
    colors: colors.map((name) => ({ name, hex: '#000000' })),
    sizes,
    badge: '',
    rating: 4.5,
    reviews: 0,
    material: product.vendor || '',
    description: product.description,
    stock: variants.some((v) => v.available) ? 10 : 0,
    sku: product.handle,
    tags: product.tags,
    shopifyId: product.id,
  };
}
