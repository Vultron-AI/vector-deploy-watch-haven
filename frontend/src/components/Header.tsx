/**
 * Header Component
 *
 * Main navigation header with logo and cart icon.
 */

import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

export function Header() {
  const { cart } = useCart()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-surface)]/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <svg
              className="h-8 w-8 text-[var(--color-accent)] transition-transform group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xl font-bold text-[var(--color-fg)]">
              Chrono<span className="text-[var(--color-accent)]">Lux</span>
            </span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
          >
            <ShoppingCart className="h-6 w-6" />
            {cart && cart.item_count > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[var(--color-accent)] text-white text-xs font-medium flex items-center justify-center">
                {cart.item_count > 99 ? '99+' : cart.item_count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
