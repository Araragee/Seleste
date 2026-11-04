import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { FINISHES, MATERIALS, QUALITIES, QUANTITY_BREAKS, getMaterial, type PlanId } from '@/lib/catalog'
import { formatMoney } from '@/lib/format'
import { calculatePrice, normalizeConfig, quantityDiscount, validateQuote, type QuoteConfig } from '@/lib/pricing'
import type { MeshMetrics } from '@/lib/stl'

interface ConfigPanelProps {
  metrics: MeshMetrics
  config: QuoteConfig
  plan: PlanId
  onChange: (config: QuoteConfig) => void
}

function Section({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <fieldset className="border-t border-ink/8 py-5 first:border-t-0 first:pt-0">
      <div className="mb-3 flex items-center justify-between">
        <legend className="text-sm font-semibold tracking-wide text-ink/80 uppercase">{title}</legend>
        {aside}
      </div>
      {children}
    </fieldset>
  )
}

export function ConfigPanel({ metrics, config, plan, onChange }: ConfigPanelProps) {
  const material = getMaterial(config.materialId)
  const set = (patch: Partial<QuoteConfig>) => onChange(normalizeConfig({ ...config, ...patch }))
  const nextBreak = [...QUANTITY_BREAKS].reverse().find((b) => b.min > config.quantity)

  return (
    <div>
      <Section title="Material">
        <div className="grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label="Material">
          {MATERIALS.map((m) => {
            const candidate = normalizeConfig({ ...config, materialId: m.id })
            const fits = !validateQuote(metrics, candidate).some((i) => i.level === 'error' && /too large/.test(i.message))
            const unit = calculatePrice(metrics, candidate, plan).unitCents
            const selected = m.id === config.materialId
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={!fits}
                onClick={() => set({ materialId: m.id })}
                className={cn(
                  'flex items-start justify-between gap-3 rounded-xl border p-3.5 text-left transition',
                  selected ? 'border-ink bg-ink text-white shadow-lg' : 'border-ink/10 bg-white hover:border-ink/30',
                  !fits && 'opacity-45',
                )}
              >
                <span>
                  <span className="block font-semibold">{m.name}</span>
                  <span className={cn('block text-xs', selected ? 'text-white/60' : 'text-ink/50')}>
                    {m.process} · {m.tagline}
                  </span>
                </span>
                <span className={cn('shrink-0 text-sm font-semibold tabular-nums', selected ? 'text-peach' : 'text-ink/70')}>
                  {fits ? formatMoney(unit) : 'Too large'}
                </span>
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Color" aside={<span className="text-sm text-ink/55">{material.colors.find((c) => c.id === config.colorId)?.name}</span>}>
        <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Color">
          {material.colors.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={c.id === config.colorId}
              aria-label={c.name}
              title={c.name}
              onClick={() => set({ colorId: c.id })}
              className={cn(
                'size-9 rounded-full ring-1 ring-ink/15 ring-inset transition',
                c.id === config.colorId ? 'outline-2 outline-offset-2 outline-ink' : 'hover:scale-110',
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </Section>

      <Section title="Quality">
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-mist p-1" role="radiogroup" aria-label="Quality">
          {(['draft', 'standard', 'fine'] as const).map((q) => {
            const available = material.qualities.includes(q)
            const selected = config.quality === q
            return (
              <button
                key={q}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={!available}
                onClick={() => set({ quality: q })}
                className={cn(
                  'rounded-lg px-2 py-2 text-center transition',
                  selected ? 'bg-white shadow-sm' : 'text-ink/60 hover:text-ink',
                  !available && 'opacity-35',
                )}
              >
                <span className="block text-sm font-semibold">{QUALITIES[q].name}</span>
                <span className="block text-[11px] text-ink/45">{QUALITIES[q].layer}</span>
              </button>
            )
          })}
        </div>
      </Section>

      {material.supportsInfill && (
        <Section title="Infill" aside={<span className="text-sm font-semibold tabular-nums">{Math.round(config.infill * 100)}%</span>}>
          <input
            type="range"
            min={10}
            max={100}
            step={10}
            value={Math.round(config.infill * 100)}
            onChange={(e) => set({ infill: Number(e.target.value) / 100 })}
            className="w-full accent-brand"
            aria-label="Infill percentage"
          />
          <div className="mt-1 flex justify-between text-xs text-ink/45">
            <span>Lightweight</span>
            <span>Solid</span>
          </div>
        </Section>
      )}

      <Section title="Finish">
        <div className="space-y-2" role="radiogroup" aria-label="Finish">
          {material.finishes.map((f) => {
            const finish = FINISHES[f]
            const selected = config.finish === f
            return (
              <button
                key={f}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => set({ finish: f })}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition',
                  selected ? 'border-ink ring-1 ring-ink' : 'border-ink/10 hover:border-ink/30',
                )}
              >
                <span className={cn('flex size-4 shrink-0 items-center justify-center rounded-full border-2', selected ? 'border-brand' : 'border-ink/25')}>
                  {selected && <span className="size-1.5 rounded-full bg-brand" />}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{finish.name}</span>
                  <span className="block text-xs text-ink/50">{finish.description}</span>
                </span>
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Quantity">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center rounded-xl border border-ink/12">
            <button type="button" aria-label="Decrease quantity" className="p-3 text-ink/60 hover:text-ink disabled:opacity-30" disabled={config.quantity <= 1} onClick={() => set({ quantity: config.quantity - 1 })}>
              <Minus className="size-4" />
            </button>
            <input
              type="number"
              min={1}
              max={1000}
              value={config.quantity}
              onChange={(e) => set({ quantity: Math.min(1000, Math.max(1, Math.floor(Number(e.target.value) || 1))) })}
              className="w-16 [appearance:textfield] border-x border-ink/12 bg-transparent py-2.5 text-center font-semibold tabular-nums focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Quantity"
            />
            <button type="button" aria-label="Increase quantity" className="p-3 text-ink/60 hover:text-ink disabled:opacity-30" disabled={config.quantity >= 1000} onClick={() => set({ quantity: config.quantity + 1 })}>
              <Plus className="size-4" />
            </button>
          </div>
          <p className="text-sm text-ink/55">
            {quantityDiscount(config.quantity) > 0 && (
              <span className="mr-1 font-semibold text-mint">{Math.round(quantityDiscount(config.quantity) * 100)}% volume discount.</span>
            )}
            {nextBreak && <>Order {nextBreak.min}+ for {Math.round(nextBreak.discount * 100)}% off.</>}
          </p>
        </div>
      </Section>
    </div>
  )
}
