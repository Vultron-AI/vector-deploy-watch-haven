/**
 * useCart Hook
 *
 * Provides cart state and operations throughout the app.
 */

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'
import { cartApi } from '@/services/cartApi'
import type { Cart } from '@/types'

interface CartContextValue {
  cart: Cart | null
  isLoading: boolean
  error: string | null
  addItem: (productId: string, quantity?: number) => Promise<void>
  updateItem: (productId: string, quantity: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshCart = useCallback(async () => {
    try {
      setError(null)
      const cartData = await cartApi.getCart()
      setCart(cartData)
    } catch (err) {
      setError('Failed to load cart')
      console.error('Error loading cart:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addItem = useCallback(async (productId: string, quantity = 1) => {
    try {
      setError(null)
      await cartApi.addItem(productId, quantity)
      // Refresh cart to get updated items
      await refreshCart()
    } catch (err) {
      setError('Failed to add item to cart')
      throw err
    }
  }, [refreshCart])

  const updateItem = useCallback(async (productId: string, quantity: number) => {
    try {
      setError(null)
      await cartApi.updateItem(productId, quantity)
      await refreshCart()
    } catch (err) {
      setError('Failed to update cart')
      throw err
    }
  }, [refreshCart])

  const removeItem = useCallback(async (productId: string) => {
    try {
      setError(null)
      await cartApi.removeItem(productId)
      await refreshCart()
    } catch (err) {
      setError('Failed to remove item')
      throw err
    }
  }, [refreshCart])

  const clearCart = useCallback(async () => {
    try {
      setError(null)
      await cartApi.clearCart()
      setCart({ items: [], subtotal: '0.00', item_count: 0 })
    } catch (err) {
      setError('Failed to clear cart')
      throw err
    }
  }, [])

  const value: CartContextValue = {
    cart,
    isLoading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refreshCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
