/**
 * Input Component
 *
 * A styled input component with variants and states.
 *
 * Usage:
 *   <Input type="text" placeholder="Enter text..." />
 *   <Input type="email" error="Invalid email" />
 *   <Input disabled />
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--color-fg)] mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            // Base styles
            'flex h-10 w-full rounded-[var(--radius-md)] border px-3 py-2 text-sm',
            // Colors
            'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-fg)]',
            // Placeholder
            'placeholder:text-[var(--color-muted)]',
            // Focus state
            'focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-focus-ring)]',
            // Hover state
            'hover:border-[var(--color-border-hover)]',
            // Disabled state
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-surface)]',
            // Error state
            error && 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]',
            // Transition
            'transition-colors duration-[var(--motion-fast)]',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-[var(--color-error)]"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
