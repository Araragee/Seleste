import { useMemo, useState } from 'react'
import { Package, PlusCircle, Search } from 'lucide-react'
import { PageHeader } from '@/components/app/PageHeader'
import { OrderTable } from '@/components/app/OrderTable'
import { ButtonLink } from '@/components/ui/Button'
import { Input } from '@/components/ui/Field'
import { Card, EmptyState, ErrorState, Spinner } from '@/components/ui/misc'
import { useOrders } from '@/hooks/queries'
import { isActive, type Order } from '@/lib/backend/types'
import { cn } from '@/lib/cn'

const FILTERS: { id: string; label: string; test: (o: Order) => boolean }[] = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'active', label: 'In progress', test: (o) => isActive(o.status) },
  { id: 'delivered', label: 'Delivered', test: (o) => o.status === 'delivered' },
  { id: 'cancelled', label: 'Cancelled', test: (o) => o.status === 'cancelled' },
]

export default function Orders() {
  const orders = useOrders()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const f = FILTERS.find((x) => x.id === filter)!
    const q = query.trim().toLowerCase()
    return (orders.data ?? []).filter((o) => f.test(o) && (!q || o.number.toLowerCase().includes(q) || o.fileName.toLowerCase().includes(q)))
  }, [orders.data, filter, query])

  return (
    <>
      <PageHeader
        title="Orders"
        description="Every part you've ordered, newest first."
        actions={
          <ButtonLink to="/app/quote">
            <PlusCircle className="size-4" /> New quote
          </ButtonLink>
        }
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="scrollbar-none -mx-1 flex gap-1 overflow-x-auto px-1" role="tablist" aria-label="Filter orders">
          {FILTERS.map((f) => {
            const count = (orders.data ?? []).filter(f.test).length
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn('rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition', filter === f.id ? 'bg-ink text-white' : 'text-ink/60 hover:bg-white')}
              >
                {f.label} <span className="ml-1 opacity-60">{count}</span>
              </button>
            )
          })}
        </div>
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink/35" />
          <Input placeholder="Search order # or file" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" aria-label="Search orders" />
        </div>
      </div>
      <Card>
        {orders.isPending ? (
          <Spinner className="py-20" />
        ) : orders.isError ? (
          <div className="p-6">
            <ErrorState error={orders.error} onRetry={() => orders.refetch()} />
          </div>
        ) : visible.length ? (
          <OrderTable orders={visible} />
        ) : (
          <EmptyState icon={<Package className="size-6" />} title={orders.data?.length ? 'No matching orders' : 'No orders yet'}>
            {orders.data?.length ? 'Try a different filter or search.' : 'Your orders will show up here once you place one.'}
          </EmptyState>
        )}
      </Card>
    </>
  )
}
