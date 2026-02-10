/**
 * Loading Component
 *
 * A full-screen or inline loading indicator.
 *
 * Usage:
 *   <Loading />
 *   <Loading text="Loading products..." />
 *   <Loading fullScreen />
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from './Spinner'

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
  fullScreen?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

function Loading({
  className,
  text,
  fullScreen = false,
  size = 'md',
  ...props
}: LoadingProps) {
  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullScreen && 'min-h-screen',
        !fullScreen && 'py-12',
        className
      )}
      {...props}
    >
      <Spinner className={cn(sizeClasses[size], 'text-[var(--color-accent)]')} />
      {text && (
        <p className="text-sm text-[var(--color-muted)]">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[var(--color-bg)]/80 z-50 flex items-center justify-center">
        {content}
      </div>
    )
  }

  return content
}

export { Loading }
