/**
 * PaymentForm Component
 *
 * Form for collecting payment information.
 * This is a UI-only placeholder - real payment processing would use Stripe, etc.
 */

import { Input, Card, CardContent } from '@/components/ui'
import { CreditCard, Lock } from 'lucide-react'
import type { CheckoutData } from '@/types'

interface PaymentFormProps {
  data: Partial<CheckoutData>
  errors: Partial<Record<keyof CheckoutData, string>>
  onChange: (field: keyof CheckoutData, value: string) => void
}

export function PaymentForm({ data, errors, onChange }: PaymentFormProps) {
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim()
    return formatted.substring(0, 19)
  }

  // Format expiry date
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 6)
    }
    return cleaned
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[var(--color-fg)]">
        Payment Information
      </h2>

      <Card className="bg-gradient-to-br from-[var(--color-fg)] to-gray-700">
        <CardContent className="p-6 text-white">
          <div className="flex justify-between items-start mb-8">
            <CreditCard className="h-10 w-10" />
            <div className="text-right text-sm opacity-80">
              <Lock className="h-4 w-4 inline mr-1" />
              Secure
            </div>
          </div>
          <div className="space-y-2 mb-6">
            <p className="text-lg tracking-wider font-mono">
              {data.card_number || '**** **** **** ****'}
            </p>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <p className="opacity-60 text-xs uppercase">Expires</p>
              <p>{data.card_expiry || 'MM/YYYY'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Input
        label="Card Number"
        placeholder="1234 5678 9012 3456"
        value={data.card_number || ''}
        onChange={(e) => onChange('card_number', formatCardNumber(e.target.value))}
        error={errors.card_number}
        maxLength={19}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Expiry Date"
          placeholder="MM/YYYY"
          value={data.card_expiry || ''}
          onChange={(e) => onChange('card_expiry', formatExpiry(e.target.value))}
          error={errors.card_expiry}
          maxLength={7}
          required
        />
        <Input
          label="CVC"
          placeholder="123"
          value={data.card_cvc || ''}
          onChange={(e) => onChange('card_cvc', e.target.value.replace(/\D/g, '').substring(0, 4))}
          error={errors.card_cvc}
          maxLength={4}
          type="password"
          required
        />
      </div>

      <p className="text-xs text-[var(--color-muted)] flex items-center">
        <Lock className="h-3 w-3 mr-1" />
        Your payment information is securely encrypted
      </p>
    </div>
  )
}
