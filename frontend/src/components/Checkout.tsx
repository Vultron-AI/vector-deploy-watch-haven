/**
 * Checkout Component
 *
 * Main checkout flow component with shipping and payment forms.
 */

import { useState } from 'react'
import { Button, Card, CardContent } from '@/components/ui'
import { ShippingForm } from './ShippingForm'
import { PaymentForm } from './PaymentForm'
import { cartApi } from '@/services/cartApi'
import type { CheckoutData, Cart, Order } from '@/types'

interface CheckoutProps {
  cart: Cart | null
  onComplete: (order: Order) => void
  onBack?: () => void
}

type CheckoutErrors = Partial<Record<keyof CheckoutData, string>>

export function Checkout({ cart, onComplete, onBack }: CheckoutProps) {
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [data, setData] = useState<Partial<CheckoutData>>({
    shipping_country: 'United States',
  })

  const handleChange = (field: keyof CheckoutData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
    // Clear error when field changes
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateShipping = (): boolean => {
    const newErrors: CheckoutErrors = {}

    if (!data.customer_first_name?.trim()) {
      newErrors.customer_first_name = 'First name is required'
    }
    if (!data.customer_last_name?.trim()) {
      newErrors.customer_last_name = 'Last name is required'
    }
    if (!data.customer_email?.trim()) {
      newErrors.customer_email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer_email)) {
      newErrors.customer_email = 'Invalid email address'
    }
    if (!data.shipping_address_line1?.trim()) {
      newErrors.shipping_address_line1 = 'Address is required'
    }
    if (!data.shipping_city?.trim()) {
      newErrors.shipping_city = 'City is required'
    }
    if (!data.shipping_state?.trim()) {
      newErrors.shipping_state = 'State is required'
    }
    if (!data.shipping_postal_code?.trim()) {
      newErrors.shipping_postal_code = 'Postal code is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePayment = (): boolean => {
    const newErrors: CheckoutErrors = {}

    if (!data.card_number?.trim()) {
      newErrors.card_number = 'Card number is required'
    } else if (data.card_number.replace(/\s/g, '').length < 16) {
      newErrors.card_number = 'Invalid card number'
    }
    if (!data.card_expiry?.trim()) {
      newErrors.card_expiry = 'Expiry date is required'
    } else if (!/^\d{2}\/\d{4}$/.test(data.card_expiry)) {
      newErrors.card_expiry = 'Invalid format (MM/YYYY)'
    }
    if (!data.card_cvc?.trim()) {
      newErrors.card_cvc = 'CVC is required'
    } else if (data.card_cvc.length < 3) {
      newErrors.card_cvc = 'Invalid CVC'
    }

    setErrors((prev) => ({ ...prev, ...newErrors }))
    return Object.keys(newErrors).length === 0
  }

  const handleContinueToPayment = () => {
    if (validateShipping()) {
      setStep('payment')
    }
  }

  const handleSubmit = async () => {
    if (!validatePayment()) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const order = await cartApi.checkout(data as CheckoutData)
      onComplete(order)
    } catch (err) {
      setSubmitError('Failed to process your order. Please try again.')
      console.error('Checkout error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-muted)] mb-4">Your cart is empty</p>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Continue Shopping
          </Button>
        )}
      </div>
    )
  }

  const subtotal = parseFloat(cart.subtotal)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'shipping'
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-success)] text-white'
            }`}
          >
            {step === 'payment' ? '✓' : '1'}
          </div>
          <span className="ml-2 text-sm font-medium text-[var(--color-fg)]">Shipping</span>
        </div>
        <div className="w-12 h-px bg-[var(--color-border)] mx-4" />
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'payment'
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-muted)] border border-[var(--color-border)]'
            }`}
          >
            2
          </div>
          <span
            className={`ml-2 text-sm font-medium ${
              step === 'payment' ? 'text-[var(--color-fg)]' : 'text-[var(--color-muted)]'
            }`}
          >
            Payment
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          {onBack && (
            <Button variant="ghost" className="mb-4" onClick={onBack}>
              ← Back to Cart
            </Button>
          )}

          <Card>
            <CardContent className="p-6">
              {step === 'shipping' ? (
                <>
                  <ShippingForm data={data} errors={errors} onChange={handleChange} />
                  <Button
                    className="w-full mt-6"
                    onClick={handleContinueToPayment}
                  >
                    Continue to Payment
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="mb-4"
                    onClick={() => setStep('shipping')}
                  >
                    ← Back to Shipping
                  </Button>
                  <PaymentForm data={data} errors={errors} onChange={handleChange} />
                  {submitError && (
                    <p className="text-[var(--color-error)] text-sm mt-4">{submitError}</p>
                  )}
                  <Button
                    className="w-full mt-6"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      `Pay ${formatCurrency(total)}`
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h2 className="font-semibold text-[var(--color-fg)] mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => (
                  <div key={item.product_id} className="flex gap-3">
                    <div className="w-12 h-12 flex-shrink-0 rounded bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-muted)]">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-fg)] truncate">{item.product.name}</p>
                      <p className="text-xs text-[var(--color-muted)]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatCurrency(parseFloat(item.line_total))}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--color-border)] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">Shipping</span>
                  <span className="text-[var(--color-success)]">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">Tax (8%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-[var(--color-border)]">
                  <span>Total</span>
                  <span className="text-[var(--color-accent)]">{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
