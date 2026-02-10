/**
 * CategoryNav Component
 *
 * Displays a navigation bar of watch categories.
 */

import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface CategoryNavProps {
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (categorySlug: string | null) => void
  isLoading?: boolean
}

export function CategoryNav({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading = false,
}: CategoryNavProps) {
  if (isLoading) {
    return (
      <nav className="flex gap-2 overflow-x-auto pb-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-9 w-24 rounded-full bg-[var(--color-surface)] animate-pulse"
          />
        ))}
      </nav>
    )
  }

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
          selectedCategory === null
            ? 'bg-[var(--color-accent)] text-white'
            : 'bg-[var(--color-surface)] text-[var(--color-fg)] hover:bg-[var(--color-border)]'
        )}
      >
        All Watches
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.slug)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
            selectedCategory === category.slug
              ? 'bg-[var(--color-accent)] text-white'
              : 'bg-[var(--color-surface)] text-[var(--color-fg)] hover:bg-[var(--color-border)]'
          )}
        >
          {category.name}
          {category.product_count > 0 && (
            <span className="ml-1 text-xs opacity-70">({category.product_count})</span>
          )}
        </button>
      ))}
    </nav>
  )
}
