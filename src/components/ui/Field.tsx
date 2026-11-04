import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const control =
  'w-full rounded-xl border border-ink/12 bg-white px-3.5 text-[15px] text-ink placeholder:text-ink/35 transition-colors focus:border-ink/40 focus:outline-none focus-visible:outline-none focus:ring-4 focus:ring-ink/5 disabled:bg-mist aria-[invalid=true]:border-brand/60'

interface FieldProps {
  label: string
  error?: string
  hint?: ReactNode
  className?: string
  children: (id: string, describedBy: string | undefined) => ReactNode
}

export function Field({ label, error, hint, className, children }: FieldProps) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink/80">
        {label}
      </label>
      {children(id, describedBy)}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-brand">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink/50">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={cn(control, 'h-11', className)} {...rest} />
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...rest },
  ref,
) {
  return <textarea ref={ref} className={cn(control, 'min-h-28 py-3', className)} {...rest} />
})

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, ...rest },
  ref,
) {
  return <select ref={ref} className={cn(control, 'h-11 appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23141b22%27 stroke-width=%272.5%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")] bg-[position:right_14px_center] bg-no-repeat pr-10', className)} {...rest} />
})
