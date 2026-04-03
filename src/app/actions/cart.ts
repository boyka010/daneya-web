'use server'

import { revalidateTag } from 'next/cache'
import { createCart, addToCart, updateCartLine, removeFromCart, getCart, SHOPIFY_CONFIG } from '@/lib/shopify'

export async function createCartAction(variantId: string, quantity: number = 1) {
  try {
    const cart = await createCart(variantId, quantity)
    revalidateTag('cart')
    return { success: true, cart }
  } catch (error) {
    console.error('Create cart error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create cart' }
  }
}

export async function addToCartAction(cartId: string, variantId: string, quantity: number = 1) {
  try {
    const cart = await addToCart(cartId, variantId, quantity)
    revalidateTag('cart')
    return { success: true, cart }
  } catch (error) {
    console.error('Add to cart error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add item' }
  }
}

export async function updateCartLineAction(cartId: string, lineId: string, quantity: number) {
  try {
    const cart = await updateCartLine(cartId, lineId, quantity)
    revalidateTag('cart')
    return { success: true, cart }
  } catch (error) {
    console.error('Update cart error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update item' }
  }
}

export async function removeFromCartAction(cartId: string, lineIds: string[]) {
  try {
    const cart = await removeFromCart(cartId, lineIds)
    revalidateTag('cart')
    return { success: true, cart }
  } catch (error) {
    console.error('Remove from cart error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove item' }
  }
}

export async function getCartAction(cartId: string) {
  try {
    const cart = await getCart(cartId)
    return { success: true, cart }
  } catch (error) {
    console.error('Get cart error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get cart' }
  }
}
