import { Field, Input } from '@/components/ui/Field'
import type { Address } from '@/lib/backend/types'
import type { FieldErrors } from '@/lib/validation'

interface Props {
  value: Address
  onChange: (value: Address) => void
  errors?: FieldErrors<Address>
}

export function AddressFields({ value, onChange, errors = {} }: Props) {
  const field = (key: keyof Address, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, className?: string) => (
    <Field label={label} error={errors[key]} className={className}>
      {(id, describedBy) => (
        <Input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={!!errors[key]}
          value={value[key] ?? ''}
          onChange={(e) => onChange({ ...value, [key]: e.target.value })}
          {...props}
        />
      )}
    </Field>
  )
  return (
    <div className="grid gap-4 sm:grid-cols-6">
      {field('name', 'Full name', { autoComplete: 'name' }, 'sm:col-span-6')}
      {field('line1', 'Street address', { autoComplete: 'address-line1' }, 'sm:col-span-4')}
      {field('line2', 'Apt, suite (optional)', { autoComplete: 'address-line2' }, 'sm:col-span-2')}
      {field('city', 'City', { autoComplete: 'address-level2' }, 'sm:col-span-2')}
      {field('region', 'State / region', { autoComplete: 'address-level1' }, 'sm:col-span-2')}
      {field('postalCode', 'Postal code', { autoComplete: 'postal-code' }, 'sm:col-span-2')}
      {field('country', 'Country', { autoComplete: 'country-name' }, 'sm:col-span-6')}
    </div>
  )
}
