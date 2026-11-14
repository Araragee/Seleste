import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { Card, ErrorState, Spinner } from '@/components/ui/misc'
import { useOrder } from '@/hooks/queries'
import { FINISHES, QUALITIES, SHIPPING, getMaterial } from '@/lib/catalog'
import { cn } from '@/lib/cn'
import { formatDate, formatMoney } from '@/lib/format'

export default function Invoice() {
  const { id = '' } = useParams()
  const order = useOrder(id)

  if (order.isPending) return <Spinner className="py-32" />
  if (order.isError) return <ErrorState error={order.error} onRetry={() => order.refetch()} />

  const o = order.data
  const p = o.pricing
  const material = getMaterial(o.config.materialId)
  const color = material.colors.find((c) => c.id === o.config.colorId)
  const voided = o.status === 'cancelled'
  const lines: [string, string][] = [
    ...(p.quantityDiscountCents > 0 ? [['Volume discount', `−${formatMoney(p.quantityDiscountCents)}`] as [string, string]] : []),
    ...(p.planDiscountCents > 0 ? [['Plan discount', `−${formatMoney(p.planDiscountCents)}`] as [string, string]] : []),
    ['Setup', formatMoney(p.setupCents)],
    [`Shipping (${SHIPPING[o.shippingMethod].name})`, p.shippingCents ? formatMoney(p.shippingCents) : 'Free'],
  ]

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
        <Link to={`/app/orders/${o.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/55 hover:text-ink">
          <ArrowLeft className="size-4" /> {o.number}
        </Link>
        <Button variant="dark" onClick={() => window.print()}>
          <Printer className="size-4" /> Print / Save PDF
        </Button>
      </div>

      <Card className="mx-auto max-w-3xl p-6 sm:p-12 print:max-w-none print:border-0 print:p-0">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-ink/55">
              Seleste Manufacturing, Inc.
              <br />
              1 Printer Way, San Francisco, CA 94107
            </p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-black tracking-tight">Invoice</h1>
            <p className="mt-1 font-semibold tabular-nums">INV-{o.number.replace(/\D/g, '')}</p>
            <span className={cn('mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase', voided ? 'bg-mist text-ink/50' : 'bg-mint-soft text-mint')}>
              {voided ? 'Void' : 'Paid'}
            </span>
          </div>
        </div>

        <dl className="mt-10 grid gap-6 border-y border-ink/8 py-6 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold tracking-wider text-ink/40 uppercase">Billed to</dt>
            <dd className="mt-2 leading-relaxed text-ink/65">
              <span className="font-semibold text-ink">{o.address.name}</span>
              <br />
              {o.address.line1}
              {o.address.line2 && `, ${o.address.line2}`}
              <br />
              {o.address.city}, {o.address.region} {o.address.postalCode}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wider text-ink/40 uppercase">Issued</dt>
            <dd className="mt-2 font-medium">{formatDate(o.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wider text-ink/40 uppercase">Order</dt>
            <dd className="mt-2 font-medium">{o.number}</dd>
          </div>
        </dl>

        <table className="mt-8 w-full text-left text-sm">
          <thead className="text-xs tracking-wider text-ink/40 uppercase">
            <tr>
              <th scope="col" className="pb-3 font-semibold">Item</th>
              <th scope="col" className="pb-3 text-right font-semibold">Qty</th>
              <th scope="col" className="pb-3 text-right font-semibold">Unit</th>
              <th scope="col" className="pb-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-y border-ink/8 align-top">
              <td className="py-4 pr-4">
                <p className="font-semibold">{o.fileName}</p>
                <p className="mt-0.5 text-ink/55">
                  {material.name} ({material.process}) · {color?.name} · {QUALITIES[o.config.quality].name} · {FINISHES[o.config.finish].name}
                </p>
              </td>
              <td className="py-4 text-right tabular-nums">{o.config.quantity}</td>
              <td className="py-4 text-right tabular-nums">{formatMoney(p.unitCents)}</td>
              <td className="py-4 text-right font-medium tabular-nums">{formatMoney(p.subtotalCents)}</td>
            </tr>
          </tbody>
        </table>

        <dl className="mt-6 ml-auto max-w-xs space-y-2 text-sm">
          {lines.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-ink/50">{label}</dt>
              <dd className="tabular-nums">{value}</dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-4 border-t border-ink/10 pt-3">
            <dt className="font-semibold">Total</dt>
            <dd className={cn('text-2xl font-bold tabular-nums', voided && 'text-ink/40 line-through')}>{formatMoney(p.totalCents)}</dd>
          </div>
        </dl>

        <p className="mt-12 border-t border-ink/8 pt-6 text-xs leading-relaxed text-ink/40">
          Demo invoice generated by Seleste. No payment was taken and this is not a tax document.
        </p>
      </Card>
    </>
  )
}
