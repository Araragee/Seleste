import { describe, expect, it } from 'vitest'
import { groupTotals, monthlyTotals } from './analytics'
import type { Order } from './backend/types'

const order = (createdAt: string, totalCents: number, status = 'delivered', customerName = 'A') =>
  ({ createdAt, status, customerName, pricing: { totalCents } }) as unknown as Order

describe('analytics', () => {
  const now = new Date(2026, 1, 15) // Feb 2026
  const orders = [
    order(new Date(2026, 1, 2).toISOString(), 1000),
    order(new Date(2026, 0, 20).toISOString(), 500, 'delivered', 'B'),
    order(new Date(2025, 11, 31).toISOString(), 700, 'delivered', 'B'), // crosses year boundary
    order(new Date(2026, 1, 3).toISOString(), 9999, 'cancelled'),
    order(new Date(2025, 5, 1).toISOString(), 4242), // outside window
  ]

  it('buckets by month across a year boundary and skips cancelled', () => {
    const m = monthlyTotals(orders, 3, now)
    expect(m.map((b) => b.label)).toEqual(['Dec', 'Jan', 'Feb'])
    expect(m.map((b) => b.cents)).toEqual([700, 500, 1000])
    expect(m.map((b) => b.count)).toEqual([1, 1, 1])
  })

  it('groups and sorts by revenue', () => {
    expect(groupTotals(orders, (o) => o.customerName).map((b) => [b.label, b.cents])).toEqual([
      ['A', 5242],
      ['B', 1200],
    ])
  })
})
