import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { Factory, LayoutDashboard, LogOut, Menu, Package, PlusCircle, Settings, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Spinner } from '@/components/ui/misc'
import { useProfile } from '@/hooks/queries'
import { useAuth } from '@/hooks/useAuth'
import { useBackend } from '@/lib/backend/context'
import { PLANS } from '@/lib/catalog'
import { cn } from '@/lib/cn'

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { signOut } = useAuth()
  const profile = useProfile()
  const backend = useBackend()
  const isAdmin = profile.data?.role === 'admin'

  const items = [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/app/quote', label: 'New quote', icon: PlusCircle },
    { to: '/app/orders', label: 'Orders', icon: Package },
    ...(isAdmin ? [{ to: '/app/admin', label: 'Production', icon: Factory }] : []),
    { to: '/app/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="px-3 pt-1 pb-8" onClick={onNavigate}>
        <Logo inverted />
      </Link>
      <nav aria-label="App" className="flex-1">
        <ul className="space-y-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors',
                    isActive ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/5 hover:text-white',
                  )
                }
              >
                <Icon className="size-5" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {backend.mode === 'demo' && (
        <div className="mb-4 rounded-xl bg-white/5 p-3 text-xs text-white/55">
          <p className="font-semibold text-peach">Demo mode</p>
          Data is stored in this browser only.
        </div>
      )}
      <div className="flex items-center gap-3 border-t border-white/10 pt-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sunset text-sm font-bold text-white">
          {(profile.data?.fullName || profile.data?.email || '?').slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{profile.data?.fullName || 'Account'}</p>
          <p className="truncate text-xs text-white/45">{profile.data ? `${PLANS[profile.data.plan].name} plan` : '…'}</p>
        </div>
        <button onClick={() => signOut()} className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white" aria-label="Sign out" title="Sign out">
          <LogOut className="size-4" />
        </button>
      </div>
    </div>
  )
}

export function AppLayout() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  if (loading) return <Spinner className="h-screen" />
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />

  return (
    <div className="min-h-screen bg-mist lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-ink p-4 lg:block">
        <SidebarContent />
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-ink px-4 lg:hidden">
        <Link to="/app">
          <Logo inverted />
        </Link>
        <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-white" aria-label="Open menu">
          <Menu className="size-6" />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-ink p-4">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 rounded-lg p-1.5 text-white/60" aria-label="Close menu">
              <X className="size-5" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <Outlet />
      </main>
    </div>
  )
}
