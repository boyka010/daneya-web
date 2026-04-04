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

    let cart;
    
    if (!cartId || !variantId) {
      console.log('Creating new cart, variantId:', variantId);
      // Create new cart if none exists
      cart = await createCart(variantId || 'gid://shopify/ProductVariant/1', quantity);
      console.log('Created cart:', cart);
      if (cart?.id) {
        await setCartIdCookie(cart.id)
      }
    } else {
      // Add to existing cart
      cart = await addToCart(cartId, variantId, quantity)
    }
    
    console.log('Cart result:', cart);
    console.log('Checkout URL:', cart?.checkoutUrl);
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

    const cart = await removeFromCart(cartId, lineIds)
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
