import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/cn'

const NAV = [
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/materials', label: 'Materials' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
]

function Navbar() {
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname, location.hash])

  return (
    <header className="sticky top-0 z-40 px-3 pt-4 sm:px-5 short:pt-3">
      <nav
        aria-label="Main"
        className={cn(
          'mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 rounded-2xl border px-4 transition-all duration-300 sm:px-5 short:h-14',
          scrolled || open
            ? 'max-w-5xl border-ink/8 bg-white/80 shadow-[0_12px_40px_-18px_rgb(20_27_34/0.35)] backdrop-blur-xl'
            : 'border-transparent bg-transparent',
        )}
      >
        <Link to="/" aria-label="Seleste home" className="shrink-0">
          <Logo />
        </Link>
        <ul className="hidden items-center rounded-full bg-ink/[0.04] p-1 md:flex">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'block rounded-full px-4 py-2 text-[15px] font-medium transition-all',
                    isActive && !item.to.includes('#') ? 'bg-white text-ink shadow-sm' : 'text-ink/60 hover:bg-white/70 hover:text-ink',
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="hidden shrink-0 items-center gap-1.5 md:flex">
          {user ? (
            <ButtonLink to="/app" variant="dark" size="sm" className="h-10 px-4">
              Dashboard <ArrowRight className="size-4" />
            </ButtonLink>
          ) : (
            <>
              <ButtonLink to="/login" variant="ghost" size="sm" className="h-10 px-4">
                Sign in
              </ButtonLink>
              <ButtonLink to="/quote" size="sm" className="h-10 px-4">
                Get a quote
              </ButtonLink>
            </>
          )}
        </div>
        <button className="-mr-2 rounded-lg p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav" aria-label="Toggle menu">
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>
      {open && (
        <div
          id="mobile-nav"
          className="mx-auto mt-2 max-h-[calc(100svh-104px)] max-w-5xl overflow-y-auto overscroll-contain rounded-2xl border border-ink/8 bg-white p-3 shadow-[0_24px_60px_-20px_rgb(20_27_34/0.4)] md:hidden short:max-h-[calc(100svh-80px)]"
        >
          <ul className="space-y-1 short:grid short:grid-cols-2 short:gap-1 short:space-y-0">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="block rounded-xl px-3 py-3 text-lg font-medium hover:bg-mist short:py-2">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-ink/8 pt-3">
            {user ? (
              <ButtonLink to="/app" variant="dark" className="col-span-2">Dashboard</ButtonLink>
            ) : (
              <>
                <ButtonLink to="/login" variant="outline">Sign in</ButtonLink>
                <ButtonLink to="/quote">Get a quote</ButtonLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-xs text-white/55">Upload a 3D model, get an instant price, and track every part from printer to doorstep.</p>
        </div>
        {[
          { title: 'Product', links: [['/quote', 'Instant quote'], ['/materials', 'Materials'], ['/pricing', 'Pricing']] },
          { title: 'Account', links: [['/login', 'Sign in'], ['/signup', 'Create account'], ['/app', 'Dashboard']] },
          { title: 'Company', links: [['/contact', 'Contact'], ['/#faq', 'FAQ']] },
        ].map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold tracking-wider text-white/40 uppercase">{col.title}</h3>
            <ul className="mt-4 space-y-3">
              {col.links.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-white/75 transition-colors hover:text-peach">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-sm text-white/40 sm:px-6 lg:px-8">© {new Date().getFullYear()} Seleste. A portfolio project.</p>
      </div>
    </footer>
  )
}

export function MarketingLayout() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [hash, pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
