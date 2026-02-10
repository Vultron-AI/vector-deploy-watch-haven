/**
 * CartSummary Component
 *
 * Displays cart totals and checkout button.
 */

import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import type { Cart } from '@/types'

interface CartSummaryProps {
  cart: Cart
  onCheckout?: () => void
  isCheckoutDisabled?: boolean
}

export function CartSummary({
  cart,
  onCheckout,
  isCheckoutDisabled = false,
}: CartSummaryProps) {
  const subtotal = parseFloat(cart.subtotal)
  const tax = subtotal * 0.08 // 8% tax
  const shipping = subtotal > 0 ? 0 : 0 // Free shipping
  const total = subtotal + tax + shipping

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-muted)]">Subtotal ({cart.item_count} items)</span>
            <span className="text-[var(--color-fg)]">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-muted)]">Shipping</span>
            <span className="text-[var(--color-success)]">
              {shipping === 0 ? 'Free' : formatCurrency(shipping)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-muted)]">Tax (8%)</span>
            <span className="text-[var(--color-fg)]">{formatCurrency(tax)}</span>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[var(--color-fg)]">Total</span>
            <span className="text-xl font-bold text-[var(--color-accent)]">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {onCheckout && (
          <Button
            className="w-full"
            size="lg"
            onClick={onCheckout}
            disabled={isCheckoutDisabled || cart.item_count === 0}
          >
            Proceed to Checkout
          </Button>
        )}

        <p className="text-xs text-center text-[var(--color-muted)]">
          Free shipping on all orders
        </p>
      </CardContent>
    </Card>
  )
}
