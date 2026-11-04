import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: ReactNode; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link to="/" aria-label="Seleste home">
          <Logo />
        </Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-ink/55">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-brand/35 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-indigo/35 blur-3xl" aria-hidden />
        <img src="/img/hero.png" alt="" className="relative mx-auto mt-8 w-[85%] max-w-lg animate-float" />
        <div className="relative">
          <p className="text-3xl leading-tight font-bold">From STL to shipped part, all in one dashboard.</p>
          <ul className="mt-6 space-y-2.5 text-white/70">
            {['Instant quotes across 7 materials', 'Engineer review before anything prints', 'Live order tracking with a full timeline'].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <Check className="size-4 text-mint" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/** Only allow same-origin relative redirects. */
// eslint-disable-next-line react-refresh/only-export-components
export function safeNext(next: string | null, fallback = '/app'): string {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback
}
