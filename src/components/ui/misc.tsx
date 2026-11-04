import type { HTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { STATUS_LABEL, type OrderStatus } from '@/lib/backend/types'

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-ink/8 bg-white', className)} {...rest} />
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('inline-flex items-center rounded-full bg-mint/10 px-4 py-1.5 text-xs font-bold tracking-[0.14em] text-mint uppercase', className)}>
      {children}
    </p>
  )
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending_review: 'bg-amber-50 text-amber-700 ring-amber-600/15',
  in_production: 'bg-lilac text-indigo ring-indigo/15',
  quality_check: 'bg-sky-50 text-sky-700 ring-sky-600/15',
  shipped: 'bg-mint-soft text-mint ring-mint/20',
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  cancelled: 'bg-mist text-ink/50 ring-ink/10',
}

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset', STATUS_STYLE[status], className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  )
}

export function Spinner({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return (
    <div role="status" className={cn('flex items-center justify-center gap-2 text-ink/50', className)}>
      <Loader2 className="size-5 animate-spin" aria-hidden />
      <span className="text-sm">{label}…</span>
    </div>
  )
}

export function EmptyState({ icon, title, children, action }: { icon: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-mist text-ink/60">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {children && <p className="mt-1 max-w-sm text-ink/55">{children}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border border-brand/20 bg-blush/60 p-6 text-center">
      <p className="font-semibold text-brand">Something went wrong</p>
      <p className="mt-1 text-sm text-ink/60">{error instanceof Error ? error.message : 'Please try again.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 text-sm font-semibold text-ink underline underline-offset-4">
          Retry
        </button>
      )}
    </div>
  )
}

export function Stat({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between text-sm text-ink/55">
        <span>{label}</span>
        {icon && <span className="text-ink/35">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-sm text-ink/50">{hint}</p>}
    </Card>
  )
}
