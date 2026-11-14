import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { StatusBadge } from '@/components/ui/misc'
import { useOrders } from '@/hooks/queries'
import { cn } from '@/lib/cn'
import { relativeTime } from '@/lib/format'

const SEEN_KEY = 'seleste:notifications-seen'

/** Bell + popover listing status changes on the user's own orders. */
export function Notifications({ className }: { className?: string }) {
  const orders = useOrders()
  const [open, setOpen] = useState(false)
  const [seen, setSeen] = useState(() => localStorage.getItem(SEEN_KEY) ?? '')
  const ref = useRef<HTMLDivElement>(null)

  const items = useMemo(
    () =>
      (orders.data ?? [])
        // The first event is the customer placing the order: not news to them.
        .flatMap((o) => o.events.slice(1).map((e) => ({ ...e, order: o })))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 8),
    [orders.data],
  )
  const unread = items.filter((i) => i.createdAt > seen).length

  useEffect(() => {
    if (!open) return
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  const markRead = () => {
    const now = new Date().toISOString()
    localStorage.setItem(SEEN_KEY, now)
    setSeen(now)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-expanded={open}
        className={cn('relative rounded-xl p-2.5 transition-colors', className)}
      >
        <Bell className="size-5" />
        {unread > 0 && <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-brand ring-2 ring-white" aria-hidden />}
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-[min(88vw,360px)] overflow-hidden rounded-2xl border border-ink/8 bg-white text-ink shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)]">
          <div className="flex items-center justify-between border-b border-ink/8 px-4 py-3">
            <p className="font-semibold">Notifications</p>
            {unread > 0 && (
              <button onClick={markRead} className="text-xs font-semibold text-ink/50 hover:text-brand">
                Mark all read
              </button>
            )}
          </div>
          {items.length ? (
            <ul className="max-h-[60vh] divide-y divide-ink/6 overflow-y-auto overscroll-contain">
              {items.map((i) => (
                <li key={i.id}>
                  <Link to={`/app/orders/${i.order.id}`} onClick={() => setOpen(false)} className="flex gap-3 px-4 py-3 text-sm hover:bg-mist/70">
                    <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', i.createdAt > seen ? 'bg-brand' : 'bg-transparent')} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{i.order.number}</span>
                        <StatusBadge status={i.status} />
                      </span>
                      <span className="mt-0.5 block truncate text-ink/55">{i.note || i.order.fileName}</span>
                      <span className="mt-0.5 block text-xs text-ink/35">{relativeTime(i.createdAt)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-10 text-center text-sm text-ink/45">You're all caught up.</p>
          )}
        </div>
      )}
    </div>
  )
}
