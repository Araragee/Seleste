import { Link } from 'react-router-dom'
import { ArrowRight, Boxes, CircleDollarSign, Package, PlusCircle, Timer, Zap } from 'lucide-react'
import { BarChart, Breakdown } from '@/components/app/charts'
import { PageHeader } from '@/components/app/PageHeader'
import { OrderTable } from '@/components/app/OrderTable'
import { ButtonLink } from '@/components/ui/Button'
import { Card, EmptyState, ErrorState, Spinner, Stat, StatusBadge } from '@/components/ui/misc'
import { useOrders, useProfile } from '@/hooks/queries'
import { groupTotals, monthlyTotals } from '@/lib/analytics'
import { isActive } from '@/lib/backend/types'
import { PLANS, getMaterial } from '@/lib/catalog'
import { formatMoney, relativeTime } from '@/lib/format'

export default function Dashboard() {
  const profile = useProfile()
  const orders = useOrders()
  const firstName = profile.data?.fullName.split(' ')[0]

  const list = orders.data ?? []
  const placed = list.filter((o) => o.status !== 'cancelled')
  const active = list.filter((o) => isActive(o.status))
  const spent = placed.reduce((sum, o) => sum + o.pricing.totalCents, 0)
  const parts = placed.reduce((sum, o) => sum + o.config.quantity, 0)
  const plan = profile.data ? PLANS[profile.data.plan] : null
  const months = monthlyTotals(list)
  const thisMonth = months[months.length - 1]
  const lastMonth = months[months.length - 2]
  const materials = groupTotals(list, (o) => getMaterial(o.config.materialId).name).slice(0, 5)
  const activity = list
    .flatMap((o) => o.events.map((e) => ({ ...e, order: o })))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6)
  const money0 = (c: number) => formatMoney(Math.round(c / 100) * 100).replace(/\.00$/, '')

  return (
    <>
      <PageHeader
        title={firstName ? `Hi, ${firstName}` : 'Dashboard'}
        description="Here's what's happening with your parts."
        actions={
          <ButtonLink to="/app/quote">
            <PlusCircle className="size-4" /> New quote
          </ButtonLink>
        }
      />

      {orders.isPending ? (
        <Spinner className="py-20" />
      ) : orders.isError ? (
        <ErrorState error={orders.error} onRetry={() => orders.refetch()} />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Active orders" value={active.length} icon={<Timer className="size-4" />} hint={active.length ? `${active.filter((o) => o.status === 'in_production').length} printing now` : 'Nothing in progress'} />
            <Stat label="Parts ordered" value={parts} icon={<Boxes className="size-4" />} hint={`Across ${placed.length} orders`} />
            <Stat label="Total spent" value={formatMoney(spent)} icon={<CircleDollarSign className="size-4" />} hint="Excludes cancelled" />
            <Stat
              label="Saved with plan"
              value={formatMoney(placed.reduce((s, o) => s + o.pricing.planDiscountCents + o.pricing.quantityDiscountCents, 0))}
              icon={<Zap className="size-4" />}
              hint="Plan + volume discounts"
            />
          </div>

          {placed.length > 0 && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <Card className="p-6">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <h2 className="font-semibold">Spend</h2>
                    <p className="text-sm text-ink/50">Last 6 months</p>
                  </div>
                  <p className="text-sm text-ink/55">
                    <span className="text-xl font-bold text-ink tabular-nums">{formatMoney(thisMonth.cents)}</span> this month
                    {lastMonth.cents > 0 && (
                      <span className={thisMonth.cents >= lastMonth.cents ? 'ml-2 font-semibold text-mint' : 'ml-2 font-semibold text-ink/45'}>
                        {thisMonth.cents >= lastMonth.cents ? '+' : '−'}
                        {Math.abs(Math.round((thisMonth.cents / lastMonth.cents - 1) * 100))}% vs {lastMonth.label}
                      </span>
                    )}
                  </p>
                </div>
                <BarChart className="mt-6" format={money0} data={months.map((m) => ({ label: m.label, value: m.cents, hint: `${m.count} order${m.count === 1 ? '' : 's'}` }))} />
              </Card>
              <Card className="p-6">
                <h2 className="font-semibold">Spend by material</h2>
                <p className="mb-5 text-sm text-ink/50">All time</p>
                <Breakdown format={money0} data={materials.map((m) => ({ label: m.label, value: m.cents, hint: `${m.count}×` }))} />
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <Card>
              <div className="flex items-center justify-between border-b border-ink/8 px-5 py-4">
                <h2 className="font-semibold">Recent orders</h2>
                <Link to="/app/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-ink/60 hover:text-brand">
                  View all <ArrowRight className="size-3.5" />
                </Link>
              </div>
              {list.length ? (
                <OrderTable orders={list.slice(0, 5)} />
              ) : (
                <EmptyState
                  icon={<Package className="size-6" />}
                  title="No orders yet"
                  action={<ButtonLink to="/app/quote">Get your first quote</ButtonLink>}
                >
                  Upload an STL to see prices for every material in seconds.
                </EmptyState>
              )}
            </Card>

            <div className="grid content-start gap-6 md:grid-cols-2 xl:grid-cols-1">
              <Card className="overflow-hidden bg-ink text-white">
                <div className="p-6">
                  <p className="text-sm text-white/50">Current plan</p>
                  <p className="mt-1 text-2xl font-bold">{plan?.name ?? '…'}</p>
                  <p className="mt-2 text-sm text-white/60">
                    {plan && plan.discount > 0
                      ? `${Math.round(plan.discount * 100)}% off every order and ${plan.leadTimeReduction} day${plan.leadTimeReduction > 1 ? 's' : ''} faster production.`
                      : 'Upgrade to Pro for 10% off every order and free shipping.'}
                  </p>
                  <ButtonLink to="/app/settings#plan" variant={plan?.id === 'starter' ? 'primary' : 'light'} size="sm" className="mt-5">
                    {plan?.id === 'starter' ? 'Upgrade' : 'Manage plan'}
                  </ButtonLink>
                </div>
              </Card>
              <Card className="p-6">
                <h2 className="font-semibold">Recent activity</h2>
                {activity.length ? (
                  <ol className="mt-4 space-y-4">
                    {activity.map((e) => (
                      <li key={e.id} className="text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <Link to={`/app/orders/${e.order.id}`} className="font-semibold hover:text-brand">
                            {e.order.number}
                          </Link>
                          <StatusBadge status={e.status} />
                        </div>
                        <p className="mt-0.5 text-ink/50">
                          {e.note || e.order.fileName} · {relativeTime(e.createdAt)}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-4 text-sm text-ink/50">Order updates will show up here.</p>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
