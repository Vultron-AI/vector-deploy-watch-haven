/**
 * Footer Component
 *
 * Site footer with links and copyright.
 */

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="h-6 w-6 text-[var(--color-accent)]"
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
              <span className="text-lg font-bold text-[var(--color-fg)]">
                Chrono<span className="text-[var(--color-accent)]">Lux</span>
              </span>
            </div>
            <p className="text-sm text-[var(--color-muted)]">
              Curated collection of premium timepieces for the discerning collector.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-[var(--color-fg)] mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                  All Watches
                </a>
              </li>
              <li>
                <a href="/?featured=true" className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">
                  Featured
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-[var(--color-fg)] mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              <li>support@chronolux.com</li>
              <li>1-800-WATCHES</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] mt-8 pt-8 text-center text-sm text-[var(--color-muted)]">
          <p>&copy; {currentYear} ChronoLux. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
