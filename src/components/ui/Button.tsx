import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'dark' | 'outline' | 'ghost' | 'danger' | 'light'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark shadow-[0_10px_24px_-10px_rgb(221_29_38/0.6)]',
  dark: 'bg-ink text-white hover:bg-ink-3',
  outline: 'border border-ink/15 bg-white text-ink hover:border-ink/40',
  ghost: 'text-ink hover:bg-ink/5',
  danger: 'border border-brand/30 bg-white text-brand hover:bg-blush',
  light: 'bg-white text-ink hover:bg-white/90',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-[15px] gap-2',
  lg: 'h-14 px-7 text-base gap-2.5',
}

function buttonClass(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center rounded-xl font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100',
    variants[variant],
    sizes[size],
    className,
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, loading, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button ref={ref} className={buttonClass(variant, size, className)} disabled={disabled || loading} {...rest}>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
})

interface ButtonLinkProps extends LinkProps {
  variant?: Variant
  size?: Size
}

export function ButtonLink({ variant, size, className, ...rest }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, size, typeof className === 'string' ? className : undefined)} {...rest} />
}
