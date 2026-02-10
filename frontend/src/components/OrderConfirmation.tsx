/**
 * OrderConfirmation Component
 *
 * Displays order confirmation after successful checkout.
 */

import { Button, Card, CardContent, Badge } from '@/components/ui'
import { CheckCircle } from 'lucide-react'
import type { Order } from '@/types'

interface OrderConfirmationProps {
  order: Order
  onContinueShopping?: () => void
}

export function OrderConfirmation({ order, onContinueShopping }: OrderConfirmationProps) {
  const formatCurrency = (value: string) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(value))

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] mb-4">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-fg)] mb-2">
          Order Confirmed!
        </h1>
        <p className="text-[var(--color-muted)]">
          Thank you for your purchase. We've sent a confirmation to {order.customer_email}
        </p>
      </div>

      {/* Order Details */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Order Number</p>
              <p className="font-mono font-medium">{order.id.substring(0, 8).toUpperCase()}</p>
            </div>
            <Badge variant="success">
              {order.order_status === 'confirmed' ? 'Confirmed' : order.order_status}
            </Badge>
          </div>
          <div className="text-sm text-[var(--color-muted)]">
            <p>Placed on {formatDate(order.created_at)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="font-semibold text-[var(--color-fg)] mb-4">Order Summary</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="text-[var(--color-fg)]">{item.product_name}</p>
                  <p className="text-sm text-[var(--color-muted)]">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">{formatCurrency(item.line_total)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--color-border)] mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-muted)]">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-muted)]">Shipping</span>
              <span className="text-[var(--color-success)]">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-muted)]">Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2">
              <span>Total</span>
              <span className="text-[var(--color-accent)]">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="font-semibold text-[var(--color-fg)] mb-4">Shipping Address</h2>
          <p className="text-[var(--color-fg)]">{order.customer_full_name}</p>
          <p className="text-[var(--color-muted)] whitespace-pre-line">
            {order.shipping_address}
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      {onContinueShopping && (
        <div className="text-center">
          <Button onClick={onContinueShopping}>
            Continue Shopping
          </Button>
        </div>
      )}
    </div>
  )
}
