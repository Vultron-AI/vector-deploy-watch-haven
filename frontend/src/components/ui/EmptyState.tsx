/**
 * EmptyState Component
 *
 * A component to display when there's no data to show.
 *
 * Usage:
 *   <EmptyState
 *     icon={<ShoppingCart />}
 *     title="Your cart is empty"
 *     description="Add some items to your cart to get started."
 *     action={<Button>Start Shopping</Button>}
 *   />
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 text-[var(--color-muted)]">
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                className: cn('h-12 w-12', (icon as React.ReactElement<{ className?: string }>).props?.className),
              })
            : icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--color-fg)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--color-muted)] max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}

export { EmptyState }
