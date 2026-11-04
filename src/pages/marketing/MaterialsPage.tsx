import { ButtonLink } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/misc'
import { useReveal } from '@/hooks/useReveal'
import { SAMPLES } from '@/lib/backend/seed'
import { FINISHES, MATERIALS, QUALITIES } from '@/lib/catalog'
import { cn } from '@/lib/cn'
import { formatMoney } from '@/lib/format'
import { calculatePrice, defaultConfig } from '@/lib/pricing'

function Meter({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${label}: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={cn('h-1.5 w-4 rounded-full', n <= value ? 'bg-sunset' : 'bg-ink/10')} />
      ))}
    </div>
  )
}

export default function MaterialsPage() {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.06 })
  const cube = SAMPLES[0].metrics
  return (
    <div ref={ref} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="max-w-2xl">
        <div data-reveal>
          <Eyebrow>Materials</Eyebrow>
        </div>
        <h1 data-reveal className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
          Choose the right material
        </h1>
        <p data-reveal className="mt-5 text-lg text-ink/55">
          Seven materials across five processes. Prices below are for a 20 mm cube at standard quality — upload your own model for an exact quote.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MATERIALS.map((m) => (
          <article key={m.id} data-reveal className="flex flex-col overflow-hidden rounded-3xl border border-ink/8 bg-white">
            <div className="aspect-[16/10] bg-mist">
              {m.image ? (
                <img src={m.image} alt={`${m.name} printed part`} loading="lazy" className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center gap-3">
                  {m.colors.map((c) => (
                    <span key={c.id} className="size-10 rounded-full ring-1 ring-ink/10" style={{ background: c.hex }} title={c.name} />
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-bold">{m.name}</h2>
                <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-semibold text-ink/60">{m.process}</span>
              </div>
              <p className="mt-2 text-ink/60">{m.description}</p>
              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                {(['strength', 'detail', 'flexibility', 'heat'] as const).map((k) => (
                  <div key={k}>
                    <dt className="mb-1 text-ink/45 capitalize">{k === 'heat' ? 'Heat resistance' : k}</dt>
                    <dd>
                      <Meter value={m.scores[k]} label={k} />
                    </dd>
                  </div>
                ))}
              </dl>
              <dl className="mt-5 space-y-1.5 border-t border-ink/8 pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-ink/50">Max size</dt><dd className="tabular-nums">{m.buildVolume.join(' × ')} mm</dd></div>
                <div className="flex justify-between"><dt className="text-ink/50">Min feature</dt><dd className="tabular-nums">{m.minFeature} mm</dd></div>
                <div className="flex justify-between"><dt className="text-ink/50">Quality</dt><dd>{m.qualities.map((q) => QUALITIES[q].name).join(', ')}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink/50">Finishes</dt><dd className="text-right">{m.finishes.map((f) => FINISHES[f].name).join(', ')}</dd></div>
              </dl>
              <div className="mt-auto flex items-center justify-between pt-6">
                <p className="text-sm text-ink/50">
                  From <span className="text-lg font-bold text-ink">{formatMoney(calculatePrice(cube, defaultConfig(m.id)).unitCents)}</span>
                </p>
                <ButtonLink to="/quote" size="sm" variant="dark">Quote</ButtonLink>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
