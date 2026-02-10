/**
 * Toast Component
 *
 * A notification toast with multiple variants.
 * Use with ToastProvider for toast management.
 *
 * Usage:
 *   <Toast variant="success" title="Success" description="Item saved!" />
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const toastVariants = cva(
  // Base styles
  'pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-[var(--radius-md)] border p-4 shadow-[var(--shadow-md)] transition-all',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-fg)]',
        success: 'bg-[var(--color-success)]/10 border-[var(--color-success)]/20 text-[var(--color-success)]',
        warning: 'bg-[var(--color-warning)]/10 border-[var(--color-warning)]/20 text-[var(--color-warning)]',
        error: 'bg-[var(--color-error)]/10 border-[var(--color-error)]/20 text-[var(--color-error)]',
        info: 'bg-[var(--color-info)]/10 border-[var(--color-info)]/20 text-[var(--color-info)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  onClose?: () => void
}

function Toast({
  className,
  variant,
  title,
  description,
  onClose,
  children,
  ...props
}: ToastProps) {
  return (
    <div
      className={cn(toastVariants({ variant }), className)}
      role="alert"
      {...props}
    >
      <div className="flex-1">
        {title && (
          <div className="text-sm font-semibold">{title}</div>
        )}
        {description && (
          <div className={cn('text-sm', title && 'mt-1', variant === 'default' && 'text-[var(--color-muted)]')}>
            {description}
          </div>
        )}
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            'inline-flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)]',
            'opacity-70 hover:opacity-100 transition-opacity',
            'focus:outline-none focus:ring-1 focus:ring-[var(--color-focus-ring)]'
          )}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export { Toast, toastVariants }
