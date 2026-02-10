/**
 * ProductDetail Component
 *
 * Displays detailed information about a single product.
 */

import { useState } from 'react'
import { Button, Badge, Loading, Card, CardContent } from '@/components/ui'
import { Minus, Plus, ShoppingCart, Check } from 'lucide-react'
import type { ProductDetail as ProductDetailType } from '@/types'

interface ProductDetailProps {
  product: ProductDetailType | null
  isLoading?: boolean
  onAddToCart?: (productId: string, quantity: number) => Promise<void>
  onBack?: () => void
}

export function ProductDetail({
  product,
  isLoading = false,
  onAddToCart,
  onBack,
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  if (isLoading) {
    return <Loading text="Loading product details..." />
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-muted)]">Product not found</p>
        {onBack && (
          <Button variant="outline" className="mt-4" onClick={onBack}>
            Back to Products
          </Button>
        )}
      </div>
    )
  }

  const handleAddToCart = async () => {
    if (!onAddToCart) return

    setIsAdding(true)
    try {
      await onAddToCart(product.id, quantity)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    } finally {
      setIsAdding(false)
    }
  }

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(q => q + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1)
    }
  }

  const price = parseFloat(product.price)
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)

  const totalPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price * quantity)

  return (
    <div className="max-w-6xl mx-auto">
      {onBack && (
        <Button variant="ghost" className="mb-6" onClick={onBack}>
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </Button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)]">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[var(--color-muted)]">
              <svg
                className="h-24 w-24"
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
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              {product.brand && (
                <p className="text-sm text-[var(--color-muted)] uppercase tracking-wider mb-1">
                  {product.brand}
                </p>
              )}
              <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-fg)]">
                {product.name}
              </h1>
            </div>
            <div className="flex gap-2">
              {product.is_featured && (
                <Badge variant="accent">Featured</Badge>
              )}
              {!product.is_in_stock && (
                <Badge variant="error">Out of Stock</Badge>
              )}
            </div>
          </div>

          <p className="text-3xl font-bold text-[var(--color-accent)] mb-6">
            {formattedPrice}
          </p>

          {product.description && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-[var(--color-muted)] uppercase mb-2">
                Description
              </h2>
              <p className="text-[var(--color-fg)] leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          <Card className="mb-6">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-muted)]">Category</span>
                <span className="text-[var(--color-fg)] font-medium">
                  {product.category.name}
                </span>
              </div>
              {product.sku && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-muted)]">SKU</span>
                  <span className="text-[var(--color-fg)] font-medium">
                    {product.sku}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-muted)]">Availability</span>
                <span className={product.is_in_stock ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}>
                  {product.is_in_stock
                    ? `In Stock (${product.stock_quantity} available)`
                    : 'Out of Stock'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quantity Selector */}
          {product.is_in_stock && (
            <div className="mb-6">
              <label className="text-sm font-semibold text-[var(--color-muted)] uppercase mb-2 block">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[var(--color-border)] rounded-[var(--radius-md)]">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-[var(--color-surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-3 font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock_quantity}
                    className="p-3 hover:bg-[var(--color-surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {quantity > 1 && (
                  <span className="text-sm text-[var(--color-muted)]">
                    Total: {totalPrice}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={!product.is_in_stock || isAdding || !onAddToCart}
          >
            {isAdding ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Adding to Cart...
              </>
            ) : addedToCart ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.is_in_stock ? 'Add to Cart' : 'Out of Stock'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
