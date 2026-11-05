import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Clock, LayoutGrid, List } from 'lucide-react'
import { AdvanceOrder } from '@/components/app/AdvanceOrder'
import { OrderTable } from '@/components/app/OrderTable'
import { PageHeader } from '@/components/app/PageHeader'
import { Card, ErrorState, Spinner, Stat } from '@/components/ui/misc'
import { useAdminOrders, useProfile } from '@/hooks/queries'
import { STATUS_LABEL, type Order, type OrderStatus } from '@/lib/backend/types'
import { getMaterial } from '@/lib/catalog'
import { cn } from '@/lib/cn'
import { addBusinessDays, formatMoney, relativeTime } from '@/lib/format'

const COLUMNS: OrderStatus[] = ['pending_review', 'in_production', 'quality_check', 'shipped']
const COLUMN_ACCENT: Record<string, string> = {
  pending_review: 'bg-amber-400',
  in_production: 'bg-indigo',
  quality_check: 'bg-sky-500',
  shipped: 'bg-mint',
}

function dueDate(o: Order) {
  return addBusinessDays(new Date(o.createdAt), o.pricing.leadTimeDays)
}

function OrderCard({ order }: { order: Order }) {
  const material = getMaterial(order.config.materialId)
  const color = material.colors.find((c) => c.id === order.config.colorId)
  const due = dueDate(order)
  const late = due.getTime() < Date.now()
  return (
    <li className="rounded-xl border border-ink/8 bg-white p-4 shadow-[0_6px_16px_-12px_rgb(0_0_0/0.3)]">
      <div className="flex items-start justify-between gap-2">
        <Link to={`/app/orders/${order.id}`} className="font-semibold hover:text-brand">
          {order.number}
        </Link>
        <span className="text-sm font-semibold tabular-nums">{formatMoney(order.pricing.totalCents)}</span>
      </div>
      <p className="mt-0.5 truncate text-sm text-ink/55">{order.customerName}</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-mist px-2 py-1 font-medium">
          <span className="size-2 rounded-full ring-1 ring-ink/15" style={{ background: color?.hex }} />
          {material.name}
        </span>
        <span className="rounded-md bg-mist px-2 py-1 font-medium">× {order.config.quantity}</span>
        {order.shippingMethod === 'express' && <span className="rounded-md bg-blush px-2 py-1 font-semibold text-brand">Express</span>}
      </div>
      <p className={cn('mt-3 flex items-center gap-1.5 text-xs', late ? 'font-semibold text-brand' : 'text-ink/45')}>
        <Clock className="size-3.5" /> Due {due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · updated {relativeTime(order.updatedAt)}
      </p>
      <div className="mt-4 border-t border-ink/6 pt-3">
        <AdvanceOrder order={order} />
      </div>
    </li>
  )
}

export default function Admin() {
  const profile = useProfile()
  const orders = useAdminOrders()
  const [view, setView] = useState<'board' | 'list'>('board')

  const byStatus = useMemo(() => {
    const map = new Map<OrderStatus, Order[]>()
    for (const o of orders.data ?? []) map.set(o.status, [...(map.get(o.status) ?? []), o])
    for (const list of map.values()) list.sort((a, b) => dueDate(a).getTime() - dueDate(b).getTime())
    return map
  }, [orders.data])

  if (profile.data && profile.data.role !== 'admin') return <Navigate to="/app" replace />

  const all = orders.data ?? []
  const open = all.filter((o) => COLUMNS.includes(o.status))
  const revenue = all.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.pricing.totalCents, 0)

  return (
    <>
      <PageHeader
        title="Production"
        description="Review files, run the printers, and ship orders."
        actions={
          <div className="inline-flex rounded-xl bg-white p-1 ring-1 ring-ink/8" role="tablist" aria-label="View">
            {[
              { id: 'board' as const, icon: LayoutGrid, label: 'Board' },
              { id: 'list' as const, icon: List, label: 'List' },
            ].map(({ id, icon: Icon, label }) => (
              <button key={id} role="tab" aria-selected={view === id} onClick={() => setView(id)} className={cn('inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold', view === id ? 'bg-ink text-white' : 'text-ink/55')}>
                <Icon className="size-4" /> {label}
              </button>
            ))}
          </div>
        }
      />

      {orders.isPending ? (
        <Spinner className="py-20" />
      ) : orders.isError ? (
        <ErrorState error={orders.error} onRetry={() => orders.refetch()} />
      ) : (
        <>
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Open orders" value={open.length} />
            <Stat label="Awaiting review" value={byStatus.get('pending_review')?.length ?? 0} />
            <Stat label="Overdue" value={open.filter((o) => dueDate(o).getTime() < Date.now()).length} />
            <Stat label="Booked revenue" value={formatMoney(revenue)} />
          </div>
          {view === 'board' ? (
            <div className="scrollbar-none -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 xl:mx-0 xl:grid xl:grid-cols-4 xl:overflow-visible xl:px-0">
              {COLUMNS.map((status) => {
                const list = byStatus.get(status) ?? []
                return (
                  <section key={status} className="w-[min(280px,82vw)] shrink-0 snap-start rounded-2xl bg-ink/[0.035] p-3 xl:w-auto" aria-label={STATUS_LABEL[status]}>
                    <h2 className="mb-3 flex items-center gap-2 px-1 text-sm font-semibold">
                      <span className={cn('size-2 rounded-full', COLUMN_ACCENT[status])} />
                      {STATUS_LABEL[status]}
                      <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs text-ink/50">{list.length}</span>
                    </h2>
                    {list.length ? (
                      <ul className="space-y-3">
                        {list.map((o) => (
                          <OrderCard key={o.id} order={o} />
                        ))}
                      </ul>
                    ) : (
                      <p className="rounded-xl border border-dashed border-ink/10 px-3 py-8 text-center text-sm text-ink/40">Nothing here</p>
                    )}
                  </section>
                )
              })}
            </div>
          ) : (
            <Card>
              <OrderTable orders={all} showCustomer />
            </Card>
          )}
        </>
      )}
    </>
  )
}
