import { lazy, Suspense, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft, Check, Copy, FileBox, RefreshCw, Truck, XCircle } from 'lucide-react'
import { AdvanceOrder } from '@/components/app/AdvanceOrder'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Card, ErrorState, Spinner, StatusBadge } from '@/components/ui/misc'
import { useCancelOrder, useOrder, useProfile } from '@/hooks/queries'
import { useBackend } from '@/lib/backend/context'
import { STATUS_DESCRIPTION, STATUS_FLOW, STATUS_LABEL, type Order } from '@/lib/backend/types'
import { FINISHES, PLANS, QUALITIES, SHIPPING, getMaterial } from '@/lib/catalog'
import { cn } from '@/lib/cn'
import { saveDraft } from '@/lib/draft'
import { addBusinessDays, formatBytes, formatDate, formatDateTime, formatMoney, formatNumber } from '@/lib/format'
import { parseSTL } from '@/lib/stl'

const ModelViewer = lazy(() => import('@/components/app/ModelViewer'))

function Progress({ order }: { order: Order }) {
  if (order.status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-mist p-5 text-ink/60">
        <XCircle className="size-5" /> This order was cancelled.
      </div>
    )
  }
  const current = STATUS_FLOW.indexOf(order.status)
  return (
    <ol className="grid grid-cols-5 gap-1.5 sm:gap-2" aria-label="Order progress">
      {STATUS_FLOW.map((s, i) => {
        const done = i < current || order.status === 'delivered'
        const now = i === current && order.status !== 'delivered'
        return (
          <li key={s} className="flex flex-col gap-2" aria-current={now ? 'step' : undefined}>
            <span className={cn('h-1.5 rounded-full', done ? 'bg-mint' : now ? 'bg-sunset' : 'bg-ink/10')} />
            <span className={cn('flex items-center gap-1 text-[11px] leading-tight font-semibold sm:text-sm', done || now ? 'text-ink' : 'text-ink/35')}>
              {done && <Check className="hidden size-3.5 text-mint sm:block" />}
              {STATUS_LABEL[s]}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <dt className="text-ink/50">{label}</dt>
      <dd className="text-right font-medium tabular-nums">{children}</dd>
    </div>
  )
}

export default function OrderDetail() {
  const { id = '' } = useParams()
  const backend = useBackend()
  const navigate = useNavigate()
  const profile = useProfile()
  const order = useOrder(id)
  const cancel = useCancelOrder()
  const [confirmCancel, setConfirmCancel] = useState(false)

  const model = useQuery({
    queryKey: ['model', id],
    enabled: !!order.data,
    staleTime: Infinity,
    queryFn: async () => {
      const buffer = await backend.getModelFile(order.data!)
      return buffer ? { buffer, positions: parseSTL(buffer) } : null
    },
  })

  if (order.isPending) return <Spinner className="py-32" />
  if (order.isError) return <ErrorState error={order.error} onRetry={() => order.refetch()} />

  const o = order.data
  const material = getMaterial(o.config.materialId)
  const color = material.colors.find((c) => c.id === o.config.colorId)
  const isOwner = profile.data?.id === o.userId
  const isAdmin = profile.data?.role === 'admin'
  const p = o.pricing

  const reorder = () => {
    if (!model.data) return
    saveDraft({ file: new File([model.data.buffer], o.fileName, { type: 'model/stl' }), config: o.config })
    navigate('/app/quote')
  }

  const doCancel = async () => {
    try {
      await cancel.mutateAsync(o.id)
      toast.success(`Order ${o.number} cancelled`)
      setConfirmCancel(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not cancel')
    }
  }

  return (
    <>
      <Link to={isOwner ? '/app/orders' : '/app/admin'} className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/55 hover:text-ink">
        <ArrowLeft className="size-4" /> {isOwner ? 'All orders' : 'Production queue'}
      </Link>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{o.number}</h1>
            <StatusBadge status={o.status} />
          </div>
          <p className="mt-1 text-ink/55">
            Placed {formatDate(o.createdAt)} · {STATUS_DESCRIPTION[o.status]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdmin && <AdvanceOrder order={o} size="md" />}
          {isOwner && o.status === 'pending_review' && (
            <Button variant="danger" onClick={() => setConfirmCancel(true)}>
              Cancel order
            </Button>
          )}
          {isOwner && (
            <Button variant="outline" onClick={reorder} disabled={!model.data}>
              <RefreshCw className="size-4" /> Reorder
            </Button>
          )}
        </div>
      </div>

      <Card className="mb-6 p-5 sm:p-6">
        <Progress order={o} />
        {o.trackingNumber && (
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-mint-soft/70 px-4 py-3 text-sm">
            <Truck className="size-4 text-mint" />
            <span className="text-ink/60">Tracking</span>
            <code className="font-semibold">{o.trackingNumber}</code>
            <button
              className="text-ink/50 hover:text-ink"
              aria-label="Copy tracking number"
              onClick={() => navigator.clipboard?.writeText(o.trackingNumber!).then(() => toast('Copied'))}
            >
              <Copy className="size-4" />
            </button>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="h-[320px] sm:h-[400px] short:h-[65svh]">
              {model.isPending ? (
                <Spinner className="h-full bg-mist" label="Loading model" />
              ) : model.data ? (
                <Suspense fallback={<Spinner className="h-full bg-mist" />}>
                  <ModelViewer positions={model.data.positions} color={color?.hex ?? '#ccc'} metallic={material.process === 'DMLS' || material.process === 'CAST'} className="h-full rounded-none" />
                </Suspense>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 bg-mist text-ink/45">
                  <FileBox className="size-8" />
                  <p className="text-sm">Model file unavailable on this device.</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-ink/8 px-5 py-4 text-sm">
              <span className="truncate font-semibold">{o.fileName}</span>
              <span className="shrink-0 text-ink/50">
                {formatBytes(o.fileSize)} · {formatNumber(o.metrics.bbox.x)} × {formatNumber(o.metrics.bbox.y)} × {formatNumber(o.metrics.bbox.z)} mm
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold">Specification</h2>
            <dl className="mt-3 grid gap-x-10 divide-y divide-ink/6 sm:grid-cols-2 sm:divide-y-0">
              <Row label="Material">{material.name} ({material.process})</Row>
              <Row label="Color">
                <span className="inline-flex items-center gap-2">
                  <span className="size-3 rounded-full ring-1 ring-ink/15" style={{ background: color?.hex }} />
                  {color?.name}
                </span>
              </Row>
              <Row label="Quality">{QUALITIES[o.config.quality].name}</Row>
              <Row label="Infill">{material.supportsInfill ? `${Math.round(o.config.infill * 100)}%` : 'Solid'}</Row>
              <Row label="Finish">{FINISHES[o.config.finish].name}</Row>
              <Row label="Quantity">{o.config.quantity}</Row>
              <Row label="Volume">{formatNumber(o.metrics.volumeMm3 / 1000, 2)} cm³</Row>
              <Row label="Weight / part">{formatNumber(p.weightGrams, 0)} g</Row>
            </dl>
            {o.notes && (
              <div className="mt-4 rounded-xl bg-mist p-4 text-sm">
                <p className="mb-1 font-semibold">Customer notes</p>
                <p className="whitespace-pre-wrap text-ink/65">{o.notes}</p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold">Timeline</h2>
            <ol className="mt-5 space-y-0">
              {[...o.events].reverse().map((e, i, arr) => (
                <li key={e.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < arr.length - 1 && <span className="absolute top-6 left-[7px] h-full w-px bg-ink/10" aria-hidden />}
                  <span className={cn('relative mt-1 size-[15px] shrink-0 rounded-full border-[3px] border-white ring-1', i === 0 ? 'bg-brand ring-brand/30' : 'bg-ink/25 ring-ink/10')} />
                  <div>
                    <p className="text-sm font-semibold">{STATUS_LABEL[e.status]}</p>
                    {e.note && <p className="text-sm text-ink/60">{e.note}</p>}
                    <p className="mt-0.5 text-xs text-ink/40">{formatDateTime(e.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="grid content-start gap-6 md:grid-cols-2 xl:sticky xl:top-6 xl:grid-cols-1 xl:self-start">
          <Card className="p-6">
            <h2 className="font-semibold">Summary</h2>
            <dl className="mt-3 divide-y divide-ink/6">
              <Row label={`${formatMoney(p.unitCents)} × ${o.config.quantity}`}>{formatMoney(p.subtotalCents)}</Row>
              {p.quantityDiscountCents > 0 && <Row label="Volume discount">−{formatMoney(p.quantityDiscountCents)}</Row>}
              {p.planDiscountCents > 0 && <Row label="Plan discount">−{formatMoney(p.planDiscountCents)}</Row>}
              <Row label="Setup">{formatMoney(p.setupCents)}</Row>
              <Row label={`Shipping (${SHIPPING[o.shippingMethod].name})`}>{p.shippingCents ? formatMoney(p.shippingCents) : 'Free'}</Row>
            </dl>
            <div className="mt-3 flex items-baseline justify-between border-t border-ink/10 pt-4">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold tabular-nums">{formatMoney(p.totalCents)}</span>
            </div>
            {o.status !== 'cancelled' && o.status !== 'delivered' && (
              <p className="mt-4 rounded-xl bg-mist px-3 py-2.5 text-sm text-ink/60">
                Estimated delivery <span className="font-semibold text-ink">{formatDate(addBusinessDays(new Date(o.createdAt), p.leadTimeDays).toISOString())}</span>
              </p>
            )}
          </Card>
          <Card className="p-6">
            <h2 className="font-semibold">Ship to</h2>
            <address className="mt-3 text-sm leading-relaxed text-ink/65 not-italic">
              <span className="font-medium text-ink">{o.address.name}</span>
              <br />
              {o.address.line1}
              {o.address.line2 && <>, {o.address.line2}</>}
              <br />
              {o.address.city}, {o.address.region} {o.address.postalCode}
              <br />
              {o.address.country}
            </address>
            {isAdmin && !isOwner && (
              <p className="mt-4 border-t border-ink/8 pt-4 text-sm text-ink/55">
                Customer: <span className="font-medium text-ink">{o.customerEmail}</span>
              </p>
            )}
          </Card>
          {isOwner && profile.data?.plan === 'starter' && (
            <Card className="bg-blush/60 p-5 text-sm">
              <p className="font-semibold">Save {Math.round(PLANS.pro.discount * 100)}% on your next order</p>
              <p className="mt-1 text-ink/60">Pro adds free shipping and a faster queue.</p>
              <Link to="/app/settings#plan" className="mt-3 inline-block font-semibold text-brand hover:underline">
                See plans →
              </Link>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={confirmCancel} onClose={() => setConfirmCancel(false)} title={`Cancel ${o.number}?`}>
        <p className="text-ink/60">The order hasn't started printing, so you won't be charged. This can't be undone.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmCancel(false)}>
            Keep order
          </Button>
          <Button onClick={doCancel} loading={cancel.isPending}>
            Cancel order
          </Button>
        </div>
      </Dialog>
    </>
  )
}
