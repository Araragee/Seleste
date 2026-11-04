import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { StatusBadge } from '@/components/ui/misc'
import type { Order } from '@/lib/backend/types'
import { getMaterial } from '@/lib/catalog'
import { formatDate, formatMoney } from '@/lib/format'

export function OrderTable({ orders, showCustomer }: { orders: Order[]; showCustomer?: boolean }) {
  return (
    <>
      {/* Mobile cards */}
      <ul className="divide-y divide-ink/8 md:hidden">
        {orders.map((o) => (
          <li key={o.id}>
            <Link to={`/app/orders/${o.id}`} className="flex items-center gap-3 px-4 py-4 hover:bg-mist">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{o.number}</span>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-1 truncate text-sm text-ink/55">
                  {o.fileName} · {getMaterial(o.config.materialId).name} × {o.config.quantity}
                </p>
              </div>
              <span className="font-semibold tabular-nums">{formatMoney(o.pricing.totalCents)}</span>
              <ChevronRight className="size-4 text-ink/30" />
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="border-b border-ink/8 text-xs tracking-wider text-ink/45 uppercase">
          <tr>
            <th scope="col" className="px-5 py-3 font-semibold">Order</th>
            {showCustomer && <th scope="col" className="px-5 py-3 font-semibold">Customer</th>}
            <th scope="col" className="px-5 py-3 font-semibold">Part</th>
            <th scope="col" className="px-5 py-3 font-semibold">Material</th>
            <th scope="col" className="px-5 py-3 font-semibold">Status</th>
            <th scope="col" className="px-5 py-3 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/6">
          {orders.map((o) => (
            <tr key={o.id} className="group relative hover:bg-mist/70">
              <td className="px-5 py-4">
                <Link to={`/app/orders/${o.id}`} className="font-semibold after:absolute after:inset-0 group-hover:text-brand">
                  {o.number}
                </Link>
                <p className="text-xs text-ink/45">{formatDate(o.createdAt)}</p>
              </td>
              {showCustomer && (
                <td className="px-5 py-4">
                  <p className="font-medium">{o.customerName}</p>
                  <p className="text-xs text-ink/45">{o.customerEmail}</p>
                </td>
              )}
              <td className="max-w-[220px] truncate px-5 py-4 text-ink/70">{o.fileName}</td>
              <td className="px-5 py-4 text-ink/70">
                {getMaterial(o.config.materialId).name} <span className="text-ink/40">× {o.config.quantity}</span>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={o.status} />
              </td>
              <td className="px-5 py-4 text-right font-semibold tabular-nums">{formatMoney(o.pricing.totalCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
