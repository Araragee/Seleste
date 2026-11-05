import { Link } from 'react-router-dom'
import { ArrowRight, Boxes, CircleDollarSign, Package, PlusCircle, Timer, Zap } from 'lucide-react'
import { PageHeader } from '@/components/app/PageHeader'
import { OrderTable } from '@/components/app/OrderTable'
import { ButtonLink } from '@/components/ui/Button'
import { Card, EmptyState, ErrorState, Spinner, Stat } from '@/components/ui/misc'
import { useOrders, useProfile } from '@/hooks/queries'
import { isActive } from '@/lib/backend/types'
import { PLANS } from '@/lib/catalog'
import { formatMoney } from '@/lib/format'

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
                <h2 className="font-semibold">Quick start</h2>
                <ol className="mt-4 space-y-3 text-sm text-ink/65">
                  <li className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-mist text-xs font-bold">1</span>Export your part as STL</li>
                  <li className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-mist text-xs font-bold">2</span>Compare materials and finishes</li>
                  <li className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-mist text-xs font-bold">3</span>Place the order and track it here</li>
                </ol>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
