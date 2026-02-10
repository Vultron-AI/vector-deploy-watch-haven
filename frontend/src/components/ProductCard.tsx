/**
 * ProductCard Component
 *
 * Displays a single product in the product grid.
 */

import { Badge, Card, CardContent } from '@/components/ui'
import type { ProductListItem } from '@/types'

interface ProductCardProps {
  product: ProductListItem
  onClick?: () => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const price = parseFloat(product.price)
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="aspect-square relative overflow-hidden bg-[var(--color-bg)]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[var(--color-muted)]">
            <svg
              className="h-16 w-16"
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
        {product.is_featured && (
          <Badge
            variant="accent"
            className="absolute top-3 left-3"
          >
            Featured
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        {product.brand && (
          <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-1">
            {product.brand}
          </p>
        )}
        <h3 className="font-medium text-[var(--color-fg)] line-clamp-2 mb-2 group-hover:text-[var(--color-accent)] transition-colors">
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-[var(--color-accent)]">
          {formattedPrice}
        </p>
      </CardContent>
    </Card>
  )
}
