/**
 * Cart API Service
 */

import { api } from './api'
import type { Cart, CartResponse, Order, CheckoutData } from '@/types'

export const cartApi = {
  /**
   * Get current cart contents
   */
  getCart: async (): Promise<Cart> => {
    const response = await api.get<Cart>('/api/cart/')
    return response.data
  },

  /**
   * Add item to cart
   */
  addItem: async (productId: string, quantity: number = 1): Promise<CartResponse> => {
    const response = await api.post<CartResponse>('/api/cart/items/', {
      product_id: productId,
      quantity,
    })
    return response.data
  },

  /**
   * Update item quantity
   */
  updateItem: async (productId: string, quantity: number): Promise<CartResponse> => {
    const response = await api.put<CartResponse>(`/api/cart/items/${productId}/`, {
      quantity,
    })
    return response.data
  },

  /**
   * Remove item from cart
   */
  removeItem: async (productId: string): Promise<CartResponse> => {
    const response = await api.delete<CartResponse>(`/api/cart/items/${productId}/`)
    return response.data
  },

  /**
   * Clear all items from cart
   */
  clearCart: async (): Promise<CartResponse> => {
    const response = await api.delete<CartResponse>('/api/cart/clear/')
    return response.data
  },

  /**
   * Process checkout
   */
  checkout: async (data: CheckoutData): Promise<Order> => {
    const response = await api.post<Order>('/api/checkout/', data)
    return response.data
  },

  /**
   * Get order details
   */
  getOrder: async (orderId: string): Promise<Order> => {
    const response = await api.get<Order>(`/api/orders/${orderId}/`)
    return response.data
  },
}
