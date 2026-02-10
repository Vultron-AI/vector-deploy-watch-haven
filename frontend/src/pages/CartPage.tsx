/**
 * CartPage Component
 *
 * Displays the shopping cart.
 */

import { useNavigate } from 'react-router-dom'
import { Cart } from '@/components/Cart'
import { useCart } from '@/hooks/useCart'

export function CartPage() {
  const navigate = useNavigate()
  const { cart, isLoading, error, updateItem, removeItem } = useCart()

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    await updateItem(productId, quantity)
  }

  const handleRemove = async (productId: string) => {
    await removeItem(productId)
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  const handleContinueShopping = () => {
    navigate('/')
  }

  return (
    <Cart
      cart={cart}
      isLoading={isLoading}
      error={error}
      onUpdateQuantity={handleUpdateQuantity}
      onRemove={handleRemove}
      onCheckout={handleCheckout}
      onContinueShopping={handleContinueShopping}
    />
  )
}
