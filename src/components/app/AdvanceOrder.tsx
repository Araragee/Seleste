import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Field, Input, Textarea } from '@/components/ui/Field'
import { useAdminUpdateOrder } from '@/hooks/queries'
import { nextStatuses, STATUS_LABEL, type Order, type OrderStatus } from '@/lib/backend/types'

const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  in_production: 'Approve & print',
  quality_check: 'Send to QC',
  shipped: 'Mark shipped',
  delivered: 'Mark delivered',
  cancelled: 'Reject',
}

/** Operator controls to move an order to its next status. */
export function AdvanceOrder({ order, size = 'sm' }: { order: Order; size?: 'sm' | 'md' }) {
  const update = useAdminUpdateOrder()
  const [target, setTarget] = useState<OrderStatus | null>(null)
  const [note, setNote] = useState('')
  const [tracking, setTracking] = useState('')
  const options = nextStatuses(order.status)
  if (!options.length) return null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!target) return
    try {
      await update.mutateAsync({ id: order.id, update: { status: target, note, trackingNumber: tracking } })
      toast.success(`${order.number} → ${STATUS_LABEL[target]}`)
      setTarget(null)
      setNote('')
      setTracking('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {options.map((s) => (
          <Button key={s} size={size} variant={s === 'cancelled' ? 'danger' : 'dark'} onClick={() => setTarget(s)}>
            {ACTION_LABEL[s]}
          </Button>
        ))}
      </div>
      <Dialog open={!!target} onClose={() => setTarget(null)} title={target ? `${ACTION_LABEL[target]} · ${order.number}` : ''}>
        <form onSubmit={submit} className="space-y-4">
          {target === 'shipped' && (
            <Field label="Tracking number">
              {(id) => <Input id={id} value={tracking} onChange={(e) => setTracking(e.target.value)} required autoFocus />}
            </Field>
          )}
          <Field label={target === 'cancelled' ? 'Reason (shown to customer)' : 'Note for the timeline (optional)'}>
            {(id) => <Textarea id={id} rows={3} value={note} onChange={(e) => setNote(e.target.value)} required={target === 'cancelled'} />}
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" variant={target === 'cancelled' ? 'primary' : 'dark'} loading={update.isPending}>
              Confirm
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  )
}
