'use server'

import { revalidatePath } from 'next/cache'
import { createCart, addToCart, updateCartLine, removeFromCart, getCart, SHOPIFY_CONFIG } from '@/lib/shopify'
import { cookies } from 'next/headers'

const CART_ID_COOKIE = 'daneya_cart_id'

export async function getOrCreateCartId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(CART_ID_COOKIE)?.value || null
}

export async function setCartIdCookie(cartId: string) {
  const cookieStore = await cookies()
  cookieStore.set(CART_ID_COOKIE, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 14, // 14 days
    path: '/',
  })
}

export async function createCartAction(variantId: string, quantity: number = 1) {
  try {
    // Check if Shopify is configured
    if (!SHOPIFY_CONFIG.accessToken || SHOPIFY_CONFIG.accessToken === '') {
      return { success: false, error: 'Shopify not configured', cart: null }
    }

    const cart = await createCart(variantId, quantity)
    
    if (cart?.id) {
      await setCartIdCookie(cart.id)
    }
    
    revalidatePath('/')
    return { success: true, cart }
  } catch (error) {
    console.error('Create cart error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create cart', cart: null }
  }
}

export async function addToCartAction(cartId: string | null, variantId: string, quantity: number = 1) {
  console.log('addToCartAction called with:', { cartId, variantId, quantity });
  try {
    // Check if Shopify is configured
    if (!SHOPIFY_CONFIG.accessToken || SHOPIFY_CONFIG.accessToken === '') {
      console.log('Shopify not configured - no access token');
      return { success: false, error: 'Shopify not configured', cart: null }
    }

    // Don't create cart with invalid/fake variant ID
    if (!variantId || !variantId.startsWith('gid://')) {
      console.log('No valid variantId provided - skipping Shopify cart creation');
      return { success: true, cart: null }
    }

    let cart;
    let isNewCart = false;
    
    if (!cartId) {
      // Create new cart - but FIRST check if there's already a cart ID in cookie
      const cookieCartId = await getOrCreateCartId();
      if (cookieCartId) {
        console.log('Found existing cart in cookie, adding to it:', cookieCartId);
        cart = await addToCart(cookieCartId, variantId, quantity);
      } else {
        console.log('Creating new cart with valid variantId:', variantId);
        cart = await createCart(variantId, quantity);
        isNewCart = true;
      }
    } else {
      // Use existing cart
      console.log('Adding to existing cart:', cartId);
      cart = await addToCart(cartId, variantId, quantity);
    }
    
    // Save cart ID to cookie
    if (cart?.id && isNewCart) {
      await setCartIdCookie(cart.id);
    }
    
    console.log('Cart result:', JSON.stringify(cart));
    console.log('Checkout URL:', cart?.checkoutUrl);
    
    // If checkoutUrl is missing, create one manually
    if (cart && !cart.checkoutUrl && cart.id) {
      const checkoutUrl = `https://${SHOPIFY_CONFIG.storeDomain}/cart/${cart.id.replace('gid://shopify/Cart/', '')}/checkout`;
      console.log('Generated fallback checkoutUrl:', checkoutUrl);
      cart.checkoutUrl = checkoutUrl;
    }
    
    // Fetch the FULL cart to return accurate data
    if (cart?.id) {
      const fullCart = await getCart(cart.id);
      console.log('Full cart from Shopify:', fullCart);
      cart = fullCart;
    }
    
    revalidatePath('/')
    return { success: true, cart }
  } catch (error) {
    console.error('Add to cart error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add item', cart: null }
  }
}

export async function updateCartLineAction(cartId: string, lineId: string, quantity: number) {
  try {
    if (!SHOPIFY_CONFIG.accessToken || SHOPIFY_CONFIG.accessToken === '') {
      return { success: false, error: 'Shopify not configured', cart: null }
    }

    const cart = await updateCartLine(cartId, lineId, quantity)
    revalidatePath('/')
    return { success: true, cart }
  } catch (error) {
    console.error('Update cart error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update item', cart: null }
  }
}

export async function removeFromCartAction(cartId: string, lineIds: string[]) {
  try {
    if (!SHOPIFY_CONFIG.accessToken || SHOPIFY_CONFIG.accessToken === '') {
      return { success: false, error: 'Shopify not configured', cart: null }
    }

    // lineIds could be merchandise IDs - we need to convert them to line IDs
    // First, get the current cart to find the line IDs
    const currentCart = await getCart(cartId);
    if (!currentCart || !currentCart.lines?.edges) {
      return { success: false, error: 'Cart not found', cart: null }
    }
    
    // Find line IDs that match the merchandise IDs
    const actualLineIds = currentCart.lines.edges
      .filter((edge: any) => lineIds.includes(edge.node.merchandise.id))
      .map((edge: any) => edge.node.id);
    
    console.log('Removing with line IDs:', actualLineIds);
    
    if (actualLineIds.length === 0) {
      console.log('No matching line IDs found');
      return { success: true, cart: currentCart }
    }
    
    const cart = await removeFromCart(cartId, actualLineIds)
    revalidatePath('/')
    return { success: true, cart }
  } catch (error) {
    console.error('Remove from cart error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove item', cart: null }
  }
}

export async function getCartAction(cartId: string) {
  try {
    if (!SHOPIFY_CONFIG.accessToken || SHOPIFY_CONFIG.accessToken === '') {
      return { success: false, error: 'Shopify not configured', cart: null }
    }

    const cart = await getCart(cartId)
    return { success: true, cart }
  } catch (error) {
    console.error('Get cart error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get cart', cart: null }
  }
}
