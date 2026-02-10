/**
 * ProductGrid Component
 *
 * Displays a grid of products with loading and empty states.
 */

import { Loading, EmptyState } from '@/components/ui'
import { ProductCard } from './ProductCard'
import type { ProductListItem } from '@/types'

interface ProductGridProps {
  products: ProductListItem[]
  isLoading?: boolean
  onProductClick?: (product: ProductListItem) => void
}

export function ProductGrid({
  products,
  isLoading = false,
  onProductClick,
}: ProductGridProps) {
  if (isLoading) {
    return <Loading text="Loading watches..." />
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={
          <svg
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        title="No watches found"
        description="Try selecting a different category or check back later for new arrivals."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick?.(product)}
        />
      ))}
    </div>
  )
}
