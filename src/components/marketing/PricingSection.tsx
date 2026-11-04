import { Check } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/misc'
import { useReveal } from '@/hooks/useReveal'
import { PLANS, QUANTITY_BREAKS, type PlanId } from '@/lib/catalog'
import { cn } from '@/lib/cn'

export function PricingSection({ heading = 'h2' }: { heading?: 'h1' | 'h2' }) {
  const ref = useReveal<HTMLElement>({ stagger: 0.12 })
  const Heading = heading
  const plans: PlanId[] = ['starter', 'pro', 'business']
  return (
    <section ref={ref} id="pricing" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div data-reveal>
            <Eyebrow>Plans</Eyebrow>
          </div>
          <Heading data-reveal className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Pay per part. Save with a plan.
          </Heading>
          <p data-reveal className="mt-5 text-lg text-ink/55">
            Quoting is always free. Plans add discounts, a faster queue and free shipping for teams that print every week.
          </p>
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((id) => {
            const plan = PLANS[id]
            const featured = id === 'pro'
            return (
              <div
                key={id}
                data-reveal
                className={cn(
                  'relative flex flex-col rounded-3xl border p-8 transition duration-300 hover:-translate-y-1.5',
                  featured ? 'border-ink bg-ink text-white shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)]' : 'border-ink/10 bg-white',
                )}
              >
                {featured && (
                  <span className="absolute top-7 right-7 rounded-full bg-sunset px-3 py-1 text-[11px] font-bold tracking-wider text-white uppercase">Popular</span>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className={cn('mt-1 text-sm', featured ? 'text-white/55' : 'text-ink/55')}>{plan.blurb}</p>
                <p className="mt-6 text-5xl font-black tabular-nums">
                  ${plan.monthly}
                  <span className={cn('text-lg font-medium', featured ? 'text-white/50' : 'text-ink/45')}> /month</span>
                </p>
                <ul className="mt-8 flex-1 space-y-3.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className={cn('mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full', featured ? 'bg-mint/20 text-mint' : 'bg-mint-soft text-mint')}>
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                      <span className={featured ? 'text-white/85' : 'text-ink/75'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <ButtonLink to={id === 'starter' ? '/signup' : `/signup?plan=${id}`} variant={featured ? 'primary' : 'outline'} size="lg" className="mt-10 w-full">
                  {id === 'starter' ? 'Start free' : `Choose ${plan.name}`}
                </ButtonLink>
              </div>
            )
          })}
        </div>
        <p data-reveal className="mt-10 text-center text-sm text-ink/50">
          Volume discounts on every plan:{' '}
          {[...QUANTITY_BREAKS].reverse().map((b, i) => (
            <span key={b.min}>
              {i > 0 && ' · '}
              {b.min}+ parts {Math.round(b.discount * 100)}% off
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
