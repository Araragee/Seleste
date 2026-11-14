import type { Order } from './backend/types'

export interface Bucket {
  label: string
  cents: number
  count: number
}

/** Revenue per calendar month for the last `months` months, oldest first. Cancelled orders are ignored. */
export function monthlyTotals(orders: Order[], months = 6, now = new Date()): Bucket[] {
  const keyOf = (d: Date) => d.getFullYear() * 12 + d.getMonth()
  const current = keyOf(now)
  const buckets: Bucket[] = Array.from({ length: months }, (_, i) => ({
    label: new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1).toLocaleDateString('en-US', { month: 'short' }),
    cents: 0,
    count: 0,
  }))
  for (const o of orders) {
    if (o.status === 'cancelled') continue
    const i = months - 1 - (current - keyOf(new Date(o.createdAt)))
    if (i < 0 || i >= months) continue
    buckets[i].cents += o.pricing.totalCents
    buckets[i].count++
  }
  return buckets
}

/** Revenue grouped by an arbitrary label, biggest first. Cancelled orders are ignored. */
export function groupTotals(orders: Order[], labelOf: (o: Order) => string): Bucket[] {
  const map = new Map<string, Bucket>()
  for (const o of orders) {
    if (o.status === 'cancelled') continue
    const label = labelOf(o)
    const b = map.get(label) ?? { label, cents: 0, count: 0 }
    b.cents += o.pricing.totalCents
    b.count++
    map.set(label, b)
  }
  return [...map.values()].sort((a, b) => b.cents - a.cents)
}
