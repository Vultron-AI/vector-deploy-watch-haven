/**
 * ShippingForm Component
 *
 * Form for collecting shipping address information.
 */

import { Input } from '@/components/ui'
import type { CheckoutData } from '@/types'

interface ShippingFormProps {
  data: Partial<CheckoutData>
  errors: Partial<Record<keyof CheckoutData, string>>
  onChange: (field: keyof CheckoutData, value: string) => void
}

export function ShippingForm({ data, errors, onChange }: ShippingFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[var(--color-fg)]">
        Shipping Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="John"
          value={data.customer_first_name || ''}
          onChange={(e) => onChange('customer_first_name', e.target.value)}
          error={errors.customer_first_name}
          required
        />
        <Input
          label="Last Name"
          placeholder="Doe"
          value={data.customer_last_name || ''}
          onChange={(e) => onChange('customer_last_name', e.target.value)}
          error={errors.customer_last_name}
          required
        />
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        value={data.customer_email || ''}
        onChange={(e) => onChange('customer_email', e.target.value)}
        error={errors.customer_email}
        required
      />

      <Input
        label="Phone (optional)"
        type="tel"
        placeholder="(555) 123-4567"
        value={data.customer_phone || ''}
        onChange={(e) => onChange('customer_phone', e.target.value)}
        error={errors.customer_phone}
      />

      <Input
        label="Address Line 1"
        placeholder="123 Main Street"
        value={data.shipping_address_line1 || ''}
        onChange={(e) => onChange('shipping_address_line1', e.target.value)}
        error={errors.shipping_address_line1}
        required
      />

      <Input
        label="Address Line 2 (optional)"
        placeholder="Apt, Suite, Building"
        value={data.shipping_address_line2 || ''}
        onChange={(e) => onChange('shipping_address_line2', e.target.value)}
        error={errors.shipping_address_line2}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Input
          label="City"
          placeholder="New York"
          value={data.shipping_city || ''}
          onChange={(e) => onChange('shipping_city', e.target.value)}
          error={errors.shipping_city}
          required
        />
        <Input
          label="State"
          placeholder="NY"
          value={data.shipping_state || ''}
          onChange={(e) => onChange('shipping_state', e.target.value)}
          error={errors.shipping_state}
          required
        />
        <Input
          label="Postal Code"
          placeholder="10001"
          value={data.shipping_postal_code || ''}
          onChange={(e) => onChange('shipping_postal_code', e.target.value)}
          error={errors.shipping_postal_code}
          required
          className="sm:col-span-1 col-span-2"
        />
      </div>

      <Input
        label="Country"
        value={data.shipping_country || 'United States'}
        onChange={(e) => onChange('shipping_country', e.target.value)}
        error={errors.shipping_country}
        required
      />
    </div>
  )
}
