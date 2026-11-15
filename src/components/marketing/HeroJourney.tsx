import { useEffect, useState } from 'react'
import { Check, FileBox, Loader2, Printer, Truck } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface JourneyStep {
  key: string
  label: string
  title: string
  detail: string
}

const ICONS = { upload: FileBox, quote: Check, print: Printer, ship: Truck } as const

/**
 * One card that tells the product story: a file goes from upload to doorstep.
 * Auto-advances; pauses on hover/focus and when the user prefers reduced motion.
 */
export function HeroJourney({ steps, interval = 2600 }: { steps: JourneyStep[]; interval?: number }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setActive((i) => (i + 1) % steps.length), interval)
    return () => window.clearInterval(id)
  }, [paused, steps.length, interval])

  const step = steps[active]
  const Icon = ICONS[step.key as keyof typeof ICONS] ?? FileBox

  return (
    <div
      className="w-[300px] rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_30px_60px_-25px_rgb(20_27_34/0.35)] backdrop-blur-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-center gap-3">
        <span key={step.key} className="flex size-10 shrink-0 animate-[pop_.45s_ease-out] items-center justify-center rounded-2xl bg-ink text-white">
          {step.key === 'upload' ? <Loader2 className="size-5 animate-spin" /> : <Icon className="size-5" />}
        </span>
        <div className="min-w-0" aria-live="polite">
          <p className="text-xs font-semibold tracking-wider text-ink/40 uppercase">{step.label}</p>
          <p key={step.title} className="animate-[rise_.45s_ease-out] truncate font-semibold">
            {step.title}
          </p>
        </div>
      </div>
      <p key={step.detail} className="mt-3 animate-[rise_.5s_ease-out] text-sm text-ink/55">
        {step.detail}
      </p>
      <ol className="mt-4 grid grid-cols-4 gap-1.5" aria-label="Order journey">
        {steps.map((s, i) => (
          <li key={s.key}>
            <button
              onClick={() => setActive(i)}
              aria-label={s.label}
              aria-current={i === active ? 'step' : undefined}
              className="block w-full py-1.5"
            >
              <span className="block h-1.5 overflow-hidden rounded-full bg-ink/10">
                <span
                  className={cn(
                    'block h-full rounded-full bg-sunset',
                    i < active ? 'w-full' : i === active ? (paused ? 'w-full' : 'w-0 animate-[fill_var(--dur)_linear_forwards]') : 'w-0',
                  )}
                  style={{ ['--dur' as string]: `${interval}ms` }}
                />
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
