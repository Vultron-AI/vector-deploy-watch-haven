/**
 * ConfirmationPage Component
 *
 * Displays order confirmation after successful checkout.
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { OrderConfirmation } from '@/components/OrderConfirmation'
import { Loading } from '@/components/ui'
import { cartApi } from '@/services/cartApi'
import type { Order } from '@/types'

export function ConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return

      setIsLoading(true)
      try {
        const data = await cartApi.getOrder(orderId)
        setOrder(data)
      } catch (err) {
        setError('Order not found')
        console.error('Failed to load order:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadOrder()
  }, [orderId])

  const handleContinueShopping = () => {
    navigate('/')
  }

  if (isLoading) {
    return <Loading text="Loading order details..." />
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-error)] mb-4">{error || 'Order not found'}</p>
        <button
          onClick={handleContinueShopping}
          className="text-[var(--color-accent)] hover:underline"
        >
          Return to Shop
        </button>
      </div>
    )
  }

  return (
    <OrderConfirmation
      order={order}
      onContinueShopping={handleContinueShopping}
    />
  )
}
