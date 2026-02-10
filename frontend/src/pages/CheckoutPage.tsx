/**
 * CheckoutPage Component
 *
 * Handles the checkout flow.
 */

import { useNavigate } from 'react-router-dom'
import { Checkout } from '@/components/Checkout'
import { useCart } from '@/hooks/useCart'
import type { Order } from '@/types'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, refreshCart } = useCart()

  const handleComplete = async (order: Order) => {
    await refreshCart()
    navigate(`/confirmation/${order.id}`)
  }

  const handleBack = () => {
    navigate('/cart')
  }

  return (
    <Checkout
      cart={cart}
      onComplete={handleComplete}
      onBack={handleBack}
    />
  )
}
