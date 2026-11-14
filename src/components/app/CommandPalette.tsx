import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CornerDownLeft, Factory, LayoutDashboard, LogOut, Package, PlusCircle, Search, Settings, type LucideIcon } from 'lucide-react'
import { StatusBadge } from '@/components/ui/misc'
import { useAdminOrders, useOrders, useProfile } from '@/hooks/queries'
import { useAuth } from '@/hooks/useAuth'
import type { Order } from '@/lib/backend/types'
import { getMaterial } from '@/lib/catalog'
import { cn } from '@/lib/cn'

interface Item {
  id: string
  label: string
  hint?: string
  icon: LucideIcon
  order?: Order
  run: () => void
}

/** ⌘K launcher: jump to pages and search orders. */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const profile = useProfile()
  const isAdmin = profile.data?.role === 'admin'
  const mine = useOrders()
  const all = useAdminOrders(isAdmin)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) {
      setQuery('')
      setActive(0)
      el.showModal?.()
    }
    if (!open && el.open) el.close?.()
  }, [open])

  const items = useMemo<Item[]>(() => {
    const go = (to: string) => () => navigate(to)
    const pages: Item[] = [
      { id: 'p-dash', label: 'Dashboard', icon: LayoutDashboard, run: go('/app') },
      { id: 'p-quote', label: 'New quote', hint: 'Upload an STL', icon: PlusCircle, run: go('/app/quote') },
      { id: 'p-orders', label: 'Orders', icon: Package, run: go('/app/orders') },
      ...(isAdmin ? [{ id: 'p-admin', label: 'Production', hint: 'Queue and insights', icon: Factory, run: go('/app/admin') }] : []),
      { id: 'p-settings', label: 'Settings', hint: 'Profile, address, plan', icon: Settings, run: go('/app/settings') },
      { id: 'a-signout', label: 'Sign out', icon: LogOut, run: () => void signOut() },
    ]
    const byId = new Map<string, Order>()
    for (const o of [...(mine.data ?? []), ...(all.data ?? [])]) byId.set(o.id, o)
    const orders = [...byId.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const q = query.trim().toLowerCase()
    const matchOrder = (o: Order) =>
      [o.number, o.fileName, o.customerName, getMaterial(o.config.materialId).name].some((s) => s.toLowerCase().includes(q))
    const orderItems = (q ? orders.filter(matchOrder) : orders).slice(0, q ? 7 : 4).map<Item>((o) => ({
      id: o.id,
      label: o.number,
      hint: `${o.fileName} · ${isAdmin ? o.customerName : getMaterial(o.config.materialId).name}`,
      icon: Package,
      order: o,
      run: go(`/app/orders/${o.id}`),
    }))
    return [...(q ? pages.filter((p) => p.label.toLowerCase().includes(q)) : pages), ...orderItems]
  }, [query, mine.data, all.data, isAdmin, navigate, signOut])

  const choose = (item?: Item) => {
    if (!item) return
    onClose()
    item.run()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const n = items.length || 1
      setActive((i) => (i + (e.key === 'ArrowDown' ? 1 : -1) + n) % n)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(items[Math.min(active, items.length - 1)])
    }
  }

  const firstOrder = items.findIndex((i) => i.order)

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label="Search"
      className="mx-auto mt-[12vh] mb-auto w-[min(92vw,560px)] overflow-hidden rounded-2xl bg-white p-0 text-ink shadow-2xl backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div onKeyDown={onKeyDown}>
          <div className="flex items-center gap-3 border-b border-ink/8 px-4">
            <Search className="size-5 shrink-0 text-ink/40" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActive(0)
              }}
              placeholder="Search orders, files, pages…"
              aria-label="Search"
              className="h-14 w-full bg-transparent text-base outline-none placeholder:text-ink/35"
            />
            <kbd className="rounded-md bg-mist px-1.5 py-0.5 text-xs font-semibold text-ink/45">esc</kbd>
          </div>
          <ul role="listbox" aria-label="Results" className="max-h-[52vh] overflow-y-auto overscroll-contain p-2">
            {items.length === 0 && <li className="px-3 py-10 text-center text-sm text-ink/45">Nothing matches “{query}”.</li>}
            {items.map((item, i) => (
              <li key={item.id} role="option" aria-selected={i === active}>
                {i === 0 && !item.order && <p className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wider text-ink/35 uppercase">Go to</p>}
                {i === firstOrder && <p className="px-3 pt-3 pb-1 text-xs font-semibold tracking-wider text-ink/35 uppercase">Orders</p>}
                <button
                  onClick={() => choose(item)}
                  onMouseMove={() => setActive(i)}
                  className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm', i === active && 'bg-mist')}
                >
                  <item.icon className="size-4 shrink-0 text-ink/45" />
                  <span className="font-semibold">{item.label}</span>
                  {item.hint && <span className="min-w-0 flex-1 truncate text-ink/45">{item.hint}</span>}
                  {item.order ? <StatusBadge status={item.order.status} className="ml-auto shrink-0" /> : i === active && <CornerDownLeft className="ml-auto size-3.5 shrink-0 text-ink/30" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </dialog>
  )
}
