import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
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
    <header className={cn('sticky top-0 z-40 border-b bg-white/85 backdrop-blur-lg transition-all', scrolled ? 'border-ink/8 shadow-[0_10px_30px_-20px_rgb(0_0_0/0.25)]' : 'border-transparent')}>
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Link to="/" aria-label="Seleste home">
          <Logo />
        </Link>
        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn('rounded-lg px-4 py-2 text-[15px] font-medium transition-colors hover:text-brand', isActive && !item.to.includes('#') ? 'text-brand' : 'text-ink/75')
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <ButtonLink to="/app" variant="dark">Dashboard</ButtonLink>
          ) : (
            <>
              <ButtonLink to="/login" variant="ghost">Sign in</ButtonLink>
              <ButtonLink to="/quote" variant="primary">Get a quote</ButtonLink>
            </>
          )}
        </div>
        <button className="-mr-2 rounded-lg p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav" aria-label="Toggle menu">
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>
      {open && (
        <div id="mobile-nav" className="border-t border-ink/8 bg-white px-4 pt-2 pb-6 md:hidden">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="block rounded-lg px-3 py-3 text-lg font-medium hover:bg-mist">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-3">
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
