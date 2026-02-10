/**
 * ToastProvider Component
 *
 * A context provider for managing toast notifications.
 *
 * Usage:
 *   // Wrap your app
 *   <ToastProvider>
 *     <App />
 *   </ToastProvider>
 *
 *   // In components
 *   const { toast } = useToast()
 *   toast({ title: 'Success!', variant: 'success' })
 */

import * as React from 'react'
import { Toast, type ToastProps } from './Toast'
import { cn } from '@/lib/utils'

type ToastType = Omit<ToastProps, 'onClose'> & { id: string }

interface ToastContextValue {
  toast: (props: Omit<ToastProps, 'onClose'>) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
}

export function ToastProvider({
  children,
  duration = 5000,
  position = 'top-right'
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastType[]>([])

  const toast = React.useCallback((props: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...props, id }])

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [duration])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismissAll = React.useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
      {children}
      {toasts.length > 0 && (
        <div
          className={cn(
            'fixed z-50 flex flex-col gap-2 w-full max-w-sm',
            positionClasses[position]
          )}
        >
          {toasts.map((t) => (
            <Toast
              key={t.id}
              variant={t.variant}
              title={t.title}
              description={t.description}
              onClose={() => dismiss(t.id)}
              className="animate-in fade-in slide-in-from-top-2"
            />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}
