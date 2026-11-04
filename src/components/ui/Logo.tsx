import { cn } from '@/lib/cn'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('size-8', className)} aria-hidden>
      <defs>
        <linearGradient id="seleste-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f78da7" />
          <stop offset="1" stopColor="#dd1d26" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="#141b22" />
      <path d="M16 6 25 11v10l-9 5-9-5V11z M7 11l9 5 9-5 M16 16v10" fill="none" stroke="url(#seleste-g)" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  )
}

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className={cn('text-[22px] font-bold tracking-tight', inverted ? 'text-white' : 'text-ink')}>seleste</span>
    </span>
  )
}
