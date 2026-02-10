/**
 * Cart Component
 *
 * Displays the shopping cart with items and summary.
 */

import { Button, Loading, EmptyState } from '@/components/ui'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { ShoppingCart } from 'lucide-react'
import type { Cart as CartType } from '@/types'

interface CartProps {
  cart: CartType | null
  isLoading?: boolean
  error?: string | null
  onUpdateQuantity: (productId: string, quantity: number) => Promise<void>
  onRemove: (productId: string) => Promise<void>
  onCheckout?: () => void
  onContinueShopping?: () => void
}

export function Cart({
  cart,
  isLoading = false,
  error,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  onContinueShopping,
}: CartProps) {
  if (isLoading) {
    return <Loading text="Loading your cart..." />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-error)] mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart />}
        title="Your cart is empty"
        description="Looks like you haven't added any watches to your cart yet. Start browsing our collection!"
        action={
          onContinueShopping && (
            <Button onClick={onContinueShopping}>
              Continue Shopping
            </Button>
          )
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--color-fg)]">
            Shopping Cart ({cart.item_count} {cart.item_count === 1 ? 'item' : 'items'})
          </h2>
          {onContinueShopping && (
            <Button variant="ghost" onClick={onContinueShopping}>
              Continue Shopping
            </Button>
          )}
        </div>

        <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
          {cart.items.map((item) => (
            <CartItem
              key={item.product_id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-4">
          <CartSummary
            cart={cart}
            onCheckout={onCheckout}
          />
        </div>
      </div>
    </div>
  )
}
