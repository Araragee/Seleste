import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowRight, BadgeCheck, Check, Gauge, PackageCheck, PlayCircle, ScanSearch, Sparkles, Star } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/misc'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/cn'
import { HeroJourney } from './HeroJourney'
import { SAMPLES } from '@/lib/backend/seed'
import { MATERIALS } from '@/lib/catalog'
import { formatMoney } from '@/lib/format'
import { calculatePrice, defaultConfig } from '@/lib/pricing'

const MARQUEE = ['Instant quotes in under a second', '7 materials from PLA to sterling silver', 'Free shipping over $75', 'Every file reviewed by an engineer', 'Track every part in real time']

export function Marquee() {
  const items = [...MARQUEE, ...MARQUEE]
  return (
    <div className="group overflow-hidden bg-sunset py-2.5 text-white select-none" aria-label="Highlights">
      <div className="flex w-max animate-marquee gap-12 group-hover:[animation-play-state:paused]">
        {items.map((text, i) => (
          <span key={i} className="flex items-center gap-12 text-sm font-semibold tracking-[0.18em] whitespace-nowrap uppercase" aria-hidden={i >= MARQUEE.length}>
            {text}
            <Sparkles className="size-4 opacity-70" />
          </span>
        ))}
      </div>
    </div>
  )
}

const HERO_LINES = [
  { words: ['Upload', 'a', 'model.'], accent: false },
  { words: ['Get', 'a', 'price.'], accent: true },
  { words: ['Get', 'your', 'part.'], accent: false },
]

export function Hero({ onDemo }: { onDemo?: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const gear = SAMPLES[1]
  const gearPrice = calculatePrice(gear.metrics, { ...defaultConfig('petg'), colorId: 'black' })
  const journey = [
    { key: 'upload', label: 'Step 1 · Upload', title: gear.file, detail: `Measuring ${gear.metrics.triangles.toLocaleString()} triangles in your browser. Nothing leaves your machine yet.` },
    { key: 'quote', label: 'Step 2 · Price', title: `${formatMoney(gearPrice.unitCents)} per part`, detail: 'PETG, black, standard quality. Fits the build volume. Compared against 6 other materials.' },
    { key: 'print', label: 'Step 3 · Print', title: 'On printer 4 · 62%', detail: 'An engineer approved the file. Layer 48 of 80, about 40 minutes left.' },
    { key: 'ship', label: 'Step 4 · Deliver', title: 'Shipped · arriving Thu', detail: 'Quality checked and handed to the carrier. Tracking is in your dashboard.' },
  ]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-hero="tag"]', { y: 16, opacity: 0, duration: 0.5, delay: 0.1 })
          .from('[data-hero="word"]', { yPercent: 110, duration: 0.8, stagger: 0.05, ease: 'power4.out' }, '-=0.25')
          .from('[data-hero="sub"]', { y: 16, opacity: 0, duration: 0.6 }, '-=0.5')
          .from('[data-hero="cta"]', { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.4')
          .from('[data-hero="art"]', { y: 40, opacity: 0, scale: 0.96, duration: 1 }, 0.2)
          .from('[data-hero="card"]', { y: 24, opacity: 0, duration: 0.7, stagger: 0.12 }, '-=0.5')

        // Gentle depth on scroll: art drifts slower than the copy.
        gsap.to('[data-hero="art"]', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
        gsap.to('[data-hero="glow"]', { yPercent: 30, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="relative -mt-[88px] overflow-hidden pt-[88px] short:-mt-[68px] short:pt-[68px]">
      <div data-hero="glow" className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 right-[-10%] size-[640px] rounded-full bg-peach/45 blur-[120px]" />
        <div className="absolute top-1/3 -left-40 size-[480px] rounded-full bg-lilac blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(20_27_34/0.07)_1px,transparent_0)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-x-10 gap-y-14 px-4 pt-12 pb-20 sm:px-6 md:pt-16 lg:min-h-[calc(100svh-88px)] lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:pt-8 lg:pb-24 short:min-h-0 short:py-10">
        <div>
          <div data-hero="tag">
            <Eyebrow>3D printing on demand</Eyebrow>
          </div>
          <h1 className="mt-6 text-[2.75rem] leading-[1.02] font-black tracking-[-0.035em] min-[380px]:text-5xl sm:text-6xl xl:text-[5.25rem] short:mt-4">
            {HERO_LINES.map((line, li) => (
              <span key={li} className="block overflow-hidden pb-[0.08em]">
                {line.words.map((w, wi) => (
                  <span key={wi} data-hero="word" className={cn('inline-block', line.accent && 'text-sunset', wi < line.words.length - 1 && 'mr-[0.22em]')}>
                    {w}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p data-hero="sub" className="mt-7 max-w-lg text-lg leading-relaxed text-ink/60 sm:text-xl">
            Drop in an STL and see what it costs in seven materials before you blink. We review it, print it, and you follow it all the way to your door.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <div data-hero="cta">
              <ButtonLink to="/quote" size="lg" className="group">
                Get an instant quote <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
            </div>
            <div data-hero="cta">
              {onDemo ? (
                <button onClick={onDemo} className="group inline-flex h-14 items-center gap-2.5 rounded-xl px-5 font-semibold transition-colors hover:bg-ink/5">
                  <PlayCircle className="size-5 text-brand transition-transform group-hover:scale-110" /> Try the live demo
                </button>
              ) : (
                <ButtonLink to="/pricing" size="lg" variant="ghost">
                  See pricing
                </ButtonLink>
              )}
            </div>
          </div>
          <ul data-hero="cta" className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/8 pt-6 text-sm text-ink/55">
            {['No credit card to quote', 'Files stay private', 'Engineer-reviewed'].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="size-4 text-mint" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[600px]">
          <div data-hero="art">
            <img src="/img/hero.png" alt="Isometric illustration of a 3D printer connected to a laptop" width={760} height={622} className="w-full animate-float" />
          </div>
          <div data-hero="card" className="relative z-10 mx-auto -mt-10 w-fit sm:absolute sm:right-0 sm:-bottom-4 sm:mt-0 xl:-right-6">
            <HeroJourney steps={journey} />
          </div>
          <div data-hero="card" className="absolute top-6 left-0 hidden rounded-2xl bg-ink px-4 py-3 text-white shadow-xl sm:block">
            <p className="text-xs text-white/50">Avg. time to quote</p>
            <p className="text-2xl font-bold tabular-nums">0.4s</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  { img: '/img/step-upload.png', title: 'Upload your 3D file', text: 'Drop an STL. We measure volume, surface area and size right in your browser — nothing is uploaded until you order.' },
  { img: '/img/step-production.png', title: 'Configure & order', text: 'Compare materials side by side with live prices. Pick color, quality, infill and finish, then check out in a minute.' },
  { img: '/img/step-delivery.png', title: 'Track to your door', text: 'An engineer reviews every file. Follow your part through printing, quality check and shipping from your dashboard.' },
]

export function HowItWorks() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} id="how-it-works" className="scroll-mt-20 bg-mist py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div data-reveal>
          <Eyebrow>How it works</Eyebrow>
        </div>
        <h2 data-reveal className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          From file to finished part
        </h2>
        <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title} data-reveal className="group relative rounded-3xl bg-white px-8 pt-10 pb-14 transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_48px_-20px_rgb(0_0_0/0.18)]">
              <img src={step.img} alt="" width={280} height={280} className="mx-auto mb-6 size-48 object-contain transition-transform duration-300 group-hover:scale-105" />
              <h3 className="text-2xl font-bold">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-ink/55">{step.text}</p>
              <span className="absolute -bottom-7 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-white text-xl font-bold text-ink/40 shadow-[0_8px_30px_rgb(0_0_0/0.12)] transition group-hover:scale-110 group-hover:bg-sunset group-hover:text-white">
                {i + 1}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function MaterialsShowcase() {
  const ref = useReveal<HTMLElement>()
  const scroller = useRef<HTMLDivElement>(null)
  const cube = SAMPLES[0].metrics
  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div data-reveal>
              <Eyebrow>Materials</Eyebrow>
            </div>
            <h2 data-reveal className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              Plastics, resins & metals
            </h2>
          </div>
          <Link data-reveal to="/materials" className="inline-flex items-center gap-1.5 font-semibold hover:text-brand">
            Compare all materials <ArrowRight className="size-4" />
          </Link>
        </div>
        <div ref={scroller} className="scrollbar-none -mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6">
          {MATERIALS.map((m) => (
            <Link
              key={m.id}
              data-reveal
              to="/materials"
              className="group w-[270px] shrink-0 snap-start overflow-hidden rounded-3xl border border-ink/8 bg-white transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-20px_rgb(0_0_0/0.25)]"
            >
              <div className="aspect-square overflow-hidden bg-mist">
                {m.image ? (
                  <img src={m.image} alt={`${m.name} printed part`} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex size-full items-center justify-center gap-2">
                    {m.colors.slice(0, 4).map((c) => (
                      <span key={c.id} className="size-12 rounded-full shadow-inner ring-1 ring-ink/10" style={{ background: c.hex }} />
                    ))}
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{m.name}</h3>
                  <span className="rounded-full bg-mist px-2 py-0.5 text-xs font-semibold text-ink/60">{m.process}</span>
                </div>
                <p className="mt-1 text-sm text-ink/55">{m.tagline}</p>
                <p className="mt-3 text-sm">
                  20 mm cube from <span className="font-semibold">{formatMoney(calculatePrice(cube, defaultConfig(m.id)).unitCents)}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

const REASONS = [
  { icon: Gauge, title: 'Instant, transparent pricing', text: 'Every price shows its breakdown: material, machine time, finishing and discounts. No "request a quote" emails.' },
  { icon: ScanSearch, title: 'Printability checks up front', text: 'We flag parts that exceed the build volume or have features too thin for the material before you order.' },
  { icon: PackageCheck, title: 'Status you can actually see', text: 'Review, printing, quality check, shipped. Each step is timestamped in your order timeline.' },
]

export function WhySeleste() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="overflow-hidden pb-24 md:pb-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div data-reveal className="relative min-h-[360px] rounded-[40px] bg-[url('/img/why-bg.jpg')] bg-cover bg-center shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)] sm:min-h-[460px]">
          <img src="/img/why.png" alt="Illustration of a 3D printer and design workstation" loading="lazy" className="absolute top-1/2 left-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl" />
        </div>
        <div>
          <div data-reveal>
            <Eyebrow>Why Seleste</Eyebrow>
          </div>
          <h2 data-reveal className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            Built for people who iterate
          </h2>
          <ul className="mt-10 space-y-4">
            {REASONS.map(({ icon: Icon, title, text }) => (
              <li key={title} data-reveal className="flex gap-5 rounded-2xl border border-transparent p-5 transition hover:border-ink/8 hover:bg-mist">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blush text-brand">
                  <Icon className="size-6" />
                </span>
                <div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink/55">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

const CAPABILITIES = [
  { value: '7', label: 'Materials' },
  { value: '5', label: 'Print processes' },
  { value: '<1s', label: 'To price a part' },
  { value: '600', unit: 'mm', label: 'Max part size' },
]

export function Capabilities() {
  const ref = useReveal<HTMLElement>({ stagger: 0.1 })
  return (
    <section ref={ref} className="bg-[linear-gradient(135deg,rgb(255_206_236/0.18),rgb(152_150_240/0.14))] py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 data-reveal className="text-center text-4xl font-black tracking-tight sm:text-5xl">
          One upload, every option
        </h2>
        <dl className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {CAPABILITIES.map((c) => (
            <div key={c.label} data-reveal className="flex aspect-[4/3] flex-col items-center justify-center rounded-3xl border border-white bg-white/80 shadow-[0_15px_40px_-20px_rgb(0_0_0/0.15)] transition hover:-translate-y-1.5">
              <dd className="text-5xl font-black text-sunset sm:text-7xl">
                {c.value}
                {c.unit && <span className="text-2xl sm:text-4xl">{c.unit}</span>}
              </dd>
              <dt className="mt-2 text-center font-medium text-ink/55">{c.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

// Fictional customers: this is a demo product.
const TESTIMONIALS = [
  { quote: 'We went from emailing STLs back and forth to a price in the time it takes to drag a file. Our prototype loop dropped from a week to two days.', name: 'Maya Chen', role: 'Mechanical lead, Orbit Robotics' },
  { quote: 'The live price while I change material and infill is the feature. I finally understand what I am paying for before I order.', name: 'Tom Becker', role: 'Founder, Becker Bikes' },
  { quote: 'Silver rings, cast and polished, tracked from review to my door. The finish was better than my local caster.', name: 'Lena Fischer', role: 'Jewelry designer' },
]

export function Testimonials() {
  const ref = useReveal<HTMLElement>({ stagger: 0.1 })
  return (
    <section ref={ref} className="py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div data-reveal>
            <Eyebrow>Loved by makers</Eyebrow>
          </div>
          <h2 data-reveal className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            Engineers ship faster with Seleste
          </h2>
        </div>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <li key={t.name} data-reveal className="flex flex-col rounded-3xl border border-ink/6 bg-white p-8 shadow-[0_20px_50px_-30px_rgb(0_0_0/0.25)]">
              <p className="flex gap-0.5 text-star" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-current" aria-hidden />
                ))}
              </p>
              <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-ink/75">“{t.quote}”</blockquote>
              <div className="mt-7 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-sunset font-bold text-white">{t.name.slice(0, 1)}</span>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-ink/50">{t.role}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function CtaBanner() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="px-4 py-24 sm:px-6 lg:px-8">
      <div data-reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-ink px-8 py-16 text-center text-white sm:px-16">
        <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-brand/40 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-indigo/40 blur-3xl" aria-hidden />
        <BadgeCheck className="relative mx-auto size-10 text-peach" />
        <h2 className="relative mt-5 text-4xl font-black tracking-tight sm:text-5xl">Your next part is one upload away</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/60">Quote it now for free. Create an account only when you are ready to order.</p>
        <div className="relative mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/quote" size="lg">
            Get an instant quote
          </ButtonLink>
          <ButtonLink to="/signup" size="lg" variant="light">
            Create free account
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
