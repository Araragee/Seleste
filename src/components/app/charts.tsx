import { cn } from '@/lib/cn'

export interface Datum {
  label: string
  value: number
  hint?: string
}

/** Minimal bar chart. The last bar is highlighted as "current". */
export function BarChart({ data, format, className }: { data: Datum[]; format: (n: number) => string; className?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <ol className={cn('flex h-44 items-stretch gap-2 sm:gap-4', className)}>
      {data.map((d, i) => (
        <li key={d.label} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-2" title={`${d.label}: ${format(d.value)}${d.hint ? ` · ${d.hint}` : ''}`}>
          <span className="text-xs font-semibold tabular-nums text-ink/0 transition-colors group-hover:text-ink/70">{format(d.value)}</span>
          <span
            className={cn(
              'w-full max-w-14 rounded-t-lg rounded-b-sm transition-all duration-500',
              i === data.length - 1 ? 'bg-sunset' : 'bg-ink/10 group-hover:bg-ink/25',
            )}
            style={{ height: `${Math.max(3, (d.value / max) * 100)}%` }}
          />
          <span className="text-xs font-medium text-ink/45">{d.label}</span>
        </li>
      ))}
    </ol>
  )
}

/** Ranked horizontal bars, e.g. spend by material. */
export function Breakdown({ data, format, empty = 'No data yet' }: { data: Datum[]; format: (n: number) => string; empty?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  if (!data.length) return <p className="py-6 text-center text-sm text-ink/40">{empty}</p>
  return (
    <ul className="space-y-3.5">
      {data.map((d) => (
        <li key={d.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium">{d.label}</span>
            <span className="shrink-0 tabular-nums text-ink/55">
              {d.hint && <span className="mr-2 text-xs text-ink/35">{d.hint}</span>}
              {format(d.value)}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/6">
            <div className="h-full rounded-full bg-ink/70" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
