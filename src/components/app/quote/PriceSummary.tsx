import type { ReactNode } from 'react'
import { AlertTriangle, CalendarDays, Clock, Scale, XCircle } from 'lucide-react'
import { PLANS, type PlanId } from '@/lib/catalog'
import { addBusinessDays, formatMoney, formatNumber } from '@/lib/format'
import type { PriceBreakdown, QuoteIssue } from '@/lib/pricing'

function Row({ label, value, muted, accent }: { label: ReactNode; value: ReactNode; muted?: boolean; accent?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 text-sm ${muted ? 'text-ink/50' : 'text-ink/75'}`}>
      <dt>{label}</dt>
      <dd className={`tabular-nums ${accent ? 'font-semibold text-mint' : ''}`}>{value}</dd>
    </div>
  )
}

interface PriceSummaryProps {
  price: PriceBreakdown
  quantity: number
  plan: PlanId
  issues: QuoteIssue[]
  shippingLabel?: string
  children?: ReactNode
}

export function PriceSummary({ price, quantity, plan, issues, shippingLabel = 'Shipping (standard)', children }: PriceSummaryProps) {
  const arrival = addBusinessDays(new Date(), price.leadTimeDays)
  const minimumTopUp = price.unitCents - price.materialCents - price.machineCents - price.finishCents
  return (
    <div className="rounded-2xl bg-ink p-6 text-white shadow-xl">
      <p className="text-sm text-white/55">Total</p>
      <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums" data-testid="quote-total">
        {formatMoney(price.totalCents)}
      </p>
      <p className="mt-1 text-sm text-white/55">
        {formatMoney(price.unitCents)} per part × {quantity}
      </p>

      <dl className="mt-6 space-y-2.5 rounded-xl bg-white p-4 text-ink">
        <Row label="Parts subtotal" value={formatMoney(price.subtotalCents)} />
        {price.quantityDiscountCents > 0 && <Row label="Volume discount" value={`−${formatMoney(price.quantityDiscountCents)}`} accent />}
        {price.planDiscountCents > 0 && <Row label={`${PLANS[plan].name} plan discount`} value={`−${formatMoney(price.planDiscountCents)}`} accent />}
        <Row label="Order setup" value={formatMoney(price.setupCents)} />
        <Row label={shippingLabel} value={price.shippingCents === 0 ? 'Free' : formatMoney(price.shippingCents)} />
        <div className="space-y-1.5 border-t border-ink/8 pt-2.5">
          <Row label="Material / part" value={formatMoney(price.materialCents)} muted />
          <Row label="Machine time / part" value={formatMoney(price.machineCents)} muted />
          {price.finishCents > 0 && <Row label="Finishing / part" value={formatMoney(price.finishCents)} muted />}
          {minimumTopUp > 0 && <Row label="Minimum part charge" value={`+${formatMoney(minimumTopUp)}`} muted />}
        </div>
      </dl>

      <ul className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-white/60">
        <li className="rounded-xl bg-white/5 p-2.5">
          <CalendarDays className="mx-auto mb-1 size-4 text-peach" />
          <span className="block font-semibold text-white">{arrival.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          Est. delivery
        </li>
        <li className="rounded-xl bg-white/5 p-2.5">
          <Clock className="mx-auto mb-1 size-4 text-peach" />
          <span className="block font-semibold text-white tabular-nums">{formatNumber(price.printHours, 1)} h</span>
          Print / part
        </li>
        <li className="rounded-xl bg-white/5 p-2.5">
          <Scale className="mx-auto mb-1 size-4 text-peach" />
          <span className="block font-semibold text-white tabular-nums">{formatNumber(price.weightGrams, 0)} g</span>
          Weight / part
        </li>
      </ul>

      {issues.length > 0 && (
        <ul className="mt-5 space-y-2">
          {issues.map((issue) => (
            <li key={issue.message} className={`flex gap-2 rounded-xl p-3 text-sm ${issue.level === 'error' ? 'bg-brand/20 text-white' : 'bg-star/15 text-star'}`}>
              {issue.level === 'error' ? <XCircle className="mt-0.5 size-4 shrink-0" /> : <AlertTriangle className="mt-0.5 size-4 shrink-0" />}
              {issue.message}
            </li>
          ))}
        </ul>
      )}

      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
