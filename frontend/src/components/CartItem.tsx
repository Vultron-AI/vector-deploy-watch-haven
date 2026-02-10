/**
 * CartItem Component
 *
 * Displays a single item in the shopping cart.
 */

import { useState } from 'react'
import { Button } from '@/components/ui'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (productId: string, quantity: number) => Promise<void>
  onRemove: (productId: string) => Promise<void>
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const price = parseFloat(item.product.price)
  const lineTotal = parseFloat(item.line_total)

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)

  const formattedLineTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(lineTotal)

  const handleIncrement = async () => {
    setIsUpdating(true)
    try {
      await onUpdateQuantity(item.product_id, item.quantity + 1)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDecrement = async () => {
    if (item.quantity <= 1) {
      await handleRemove()
      return
    }
    setIsUpdating(true)
    try {
      await onUpdateQuantity(item.product_id, item.quantity - 1)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      await onRemove(item.product_id)
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className={`flex gap-4 py-4 border-b border-[var(--color-border)] last:border-0 ${isRemoving ? 'opacity-50' : ''}`}>
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0 rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)]">
        {item.product.image ? (
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-muted)]">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-[var(--color-fg)] truncate">
          {item.product.name}
        </h3>
        {item.product.brand && (
          <p className="text-sm text-[var(--color-muted)]">{item.product.brand}</p>
        )}
        <p className="text-sm text-[var(--color-muted)] mt-1">{formattedPrice} each</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center border border-[var(--color-border)] rounded-[var(--radius-md)]">
          <button
            onClick={handleDecrement}
            disabled={isUpdating}
            className="p-2 hover:bg-[var(--color-surface)] disabled:opacity-50 transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="px-3 py-1 font-medium min-w-[40px] text-center text-sm">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={isUpdating}
            className="p-2 hover:bg-[var(--color-surface)] disabled:opacity-50 transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
        <p className="font-semibold text-[var(--color-fg)]">{formattedLineTotal}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-[var(--color-error)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 -mr-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
