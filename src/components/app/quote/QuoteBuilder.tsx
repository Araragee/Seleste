import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, FileBox, Lock, Ruler, Trash2, Triangle, Box } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Field, Select, Textarea } from '@/components/ui/Field'
import { Card, Spinner } from '@/components/ui/misc'
import { AddressFields } from '@/components/app/AddressFields'
import { useCreateOrder, useProfile } from '@/hooks/queries'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/cn'
import { SHIPPING, getMaterial, type ShippingMethod } from '@/lib/catalog'
import { saveDraft, takeDraft } from '@/lib/draft'
import { formatBytes, formatMoney, formatNumber } from '@/lib/format'
import { calculatePrice, defaultConfig, validateQuote, type QuoteConfig } from '@/lib/pricing'
import { computeMetrics, parseSTL, StlParseError, type Units } from '@/lib/stl'
import { addressSchema, validate, type FieldErrors } from '@/lib/validation'
import { EMPTY_ADDRESS, type Address } from '@/lib/backend/types'
import { ConfigPanel } from './ConfigPanel'
import { Dropzone, SamplePicker } from './Dropzone'
import { PriceSummary } from './PriceSummary'

const ModelViewer = lazy(() => import('../ModelViewer'))

interface LoadedModel {
  file: File
  positions: Float32Array
}

async function readModel(file: File): Promise<LoadedModel> {
  if (!/\.stl$/i.test(file.name)) throw new StlParseError('Please upload an .stl file.')
  const positions = parseSTL(await file.arrayBuffer())
  return { file, positions }
}

export function QuoteBuilder({ inApp }: { inApp?: boolean }) {
  const { user } = useAuth()
  const profile = useProfile()
  const navigate = useNavigate()
  const createOrder = useCreateOrder()
  const plan = profile.data?.plan ?? 'starter'

  const [model, setModel] = useState<LoadedModel | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [config, setConfig] = useState<QuoteConfig>(defaultConfig())
  const [step, setStep] = useState<'configure' | 'checkout'>('configure')
  const [shipping, setShipping] = useState<ShippingMethod>('standard')
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS)
  const [addressErrors, setAddressErrors] = useState<FieldErrors<Address>>({})
  const [notes, setNotes] = useState('')

  // Resume a quote started before signing up.
  useEffect(() => {
    const draft = takeDraft()
    if (!draft) return
    setLoading(true)
    readModel(draft.file)
      .then((m) => {
        setModel(m)
        setConfig(draft.config)
        if (user) setStep('checkout')
      })
      .catch(() => setLoadError('Could not restore your previous quote.'))
      .finally(() => setLoading(false))
  }, [user])

  // Prefill shipping details from the profile.
  useEffect(() => {
    if (!profile.data) return
    setAddress((current) => (current.line1 ? current : profile.data.address ?? { ...EMPTY_ADDRESS, name: profile.data.fullName }))
  }, [profile.data])

  const metrics = useMemo(() => (model ? computeMetrics(model.positions, config.units) : null), [model, config.units])
  const price = useMemo(() => (metrics ? calculatePrice(metrics, config, plan, shipping) : null), [metrics, config, plan, shipping])
  const issues = useMemo(() => (metrics ? validateQuote(metrics, config) : []), [metrics, config])
  const blocked = issues.some((i) => i.level === 'error')
  const material = getMaterial(config.materialId)
  const color = material.colors.find((c) => c.id === config.colorId)?.hex ?? '#cccccc'

  const loadFile = async (file: File) => {
    setLoadError(null)
    setLoading(true)
    try {
      const loaded = await readModel(file)
      setModel(loaded)
      setStep('configure')
      // Pick the first material the part fits in.
      const m = computeMetrics(loaded.positions, config.units)
      if (validateQuote(m, config).some((i) => /too large/.test(i.message))) {
        const fit = ['pa12', 'pla'].find((id) => !validateQuote(m, defaultConfig(id)).some((i) => /too large/.test(i.message)))
        if (fit) setConfig({ ...defaultConfig(fit), units: config.units })
      }
    } catch (err) {
      setLoadError(err instanceof StlParseError ? err.message : 'We could not read that file.')
    } finally {
      setLoading(false)
    }
  }

  const goToCheckout = () => {
    if (!model) return
    if (!user) {
      saveDraft({ file: model.file, config })
      toast('Create a free account to place your order — your quote is saved.')
      navigate('/signup?next=/app/quote')
      return
    }
    setStep('checkout')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!model || !metrics) return
    const result = validate(addressSchema, address)
    if (result.errors) {
      setAddressErrors(result.errors)
      return
    }
    setAddressErrors({})
    try {
      const order = await createOrder.mutateAsync({
        file: model.file,
        metrics,
        config,
        shippingMethod: shipping,
        address: result.data,
        notes: notes.trim(),
      })
      toast.success(`Order ${order.number} placed`, { description: 'We will review your file within one business day.' })
      navigate(`/app/orders/${order.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not place the order.')
    }
  }

  if (!model || !metrics || !price) {
    return (
      <div className="space-y-8">
        <Dropzone onFile={loadFile} loading={loading} error={loadError} compact={inApp} />
        <SamplePicker onPick={loadFile} disabled={loading} />
      </div>
    )
  }

  const viewer = (
    <Suspense fallback={<div className="flex h-full items-center justify-center rounded-2xl bg-mist"><Spinner label="Loading 3D preview" /></div>}>
      <ModelViewer positions={model.positions} color={color} metallic={material.process === 'DMLS' || material.process === 'CAST'} className="h-full" />
    </Suspense>
  )

  const modelInfo = (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-mist">
            <FileBox className="size-5 text-ink/60" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{model.file.name}</p>
            <p className="text-sm text-ink/50">{formatBytes(model.file.size)}</p>
          </div>
        </div>
        {step === 'configure' && (
          <Button variant="ghost" size="sm" onClick={() => setModel(null)} aria-label="Remove file">
            <Trash2 className="size-4" />
            <span className="hidden sm:inline">Replace</span>
          </Button>
        )}
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div className="rounded-xl bg-mist p-3">
          <dt className="flex items-center gap-1 text-ink/50"><Ruler className="size-3.5" /> Size (mm)</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">
            {formatNumber(metrics.bbox.x)} × {formatNumber(metrics.bbox.y)} × {formatNumber(metrics.bbox.z)}
          </dd>
        </div>
        <div className="rounded-xl bg-mist p-3">
          <dt className="flex items-center gap-1 text-ink/50"><Box className="size-3.5" /> Volume</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{formatNumber(metrics.volumeMm3 / 1000, 2)} cm³</dd>
        </div>
        <div className="rounded-xl bg-mist p-3">
          <dt className="text-ink/50">Surface</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{formatNumber(metrics.surfaceAreaMm2 / 100, 1)} cm²</dd>
        </div>
        <div className="rounded-xl bg-mist p-3">
          <dt className="flex items-center gap-1 text-ink/50"><Triangle className="size-3.5" /> Triangles</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{formatNumber(metrics.triangles, 0)}</dd>
        </div>
      </dl>
      {step === 'configure' && (
        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
          <label htmlFor="units" className="text-ink/60">File units</label>
          <Select
            id="units"
            value={config.units}
            onChange={(e) => setConfig({ ...config, units: e.target.value as Units })}
            className="h-9 w-40 text-sm"
          >
            <option value="mm">Millimetres</option>
            <option value="cm">Centimetres</option>
            <option value="in">Inches</option>
          </Select>
        </div>
      )}
    </Card>
  )

  if (step === 'checkout') {
    return (
      <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-[1fr_380px]" noValidate>
        <div className="space-y-6">
          <button type="button" onClick={() => setStep('configure')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-ink">
            <ArrowLeft className="size-4" /> Back to configuration
          </button>
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Shipping address</h2>
            <div className="mt-5">
              <AddressFields value={address} onChange={setAddress} errors={addressErrors} />
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Delivery speed</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Delivery speed">
              {(Object.keys(SHIPPING) as ShippingMethod[]).map((id) => {
                const option = SHIPPING[id]
                const cost = calculatePrice(metrics, config, plan, id).shippingCents
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={shipping === id}
                    onClick={() => setShipping(id)}
                    className={cn('rounded-xl border p-4 text-left transition', shipping === id ? 'border-ink ring-1 ring-ink' : 'border-ink/10 hover:border-ink/30')}
                  >
                    <span className="flex items-center justify-between font-semibold">
                      {option.name}
                      <span className="tabular-nums">{cost === 0 ? 'Free' : formatMoney(cost)}</span>
                    </span>
                    <span className="mt-0.5 block text-sm text-ink/50">
                      {option.days === 1 ? 'Next business day' : `${option.days} business days`} after production
                    </span>
                  </button>
                )
              })}
            </div>
          </Card>
          <Card className="p-6">
            <Field label="Notes for our engineers (optional)" hint="Tolerances, orientation, assembly context…">
              {(id, describedBy) => <Textarea id={id} aria-describedby={describedBy} value={notes} maxLength={2000} onChange={(e) => setNotes(e.target.value)} />}
            </Field>
          </Card>
        </div>
        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {modelInfo}
          <PriceSummary price={price} quantity={config.quantity} plan={plan} issues={issues} shippingLabel={`Shipping (${SHIPPING[shipping].name.toLowerCase()})`}>
            <Button type="submit" size="lg" className="w-full" loading={createOrder.isPending} disabled={blocked}>
              Place order · {formatMoney(price.totalCents)}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-white/50">
              <Lock className="size-3" /> No charge until an engineer approves your file.
            </p>
          </PriceSummary>
        </div>
      </form>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className="h-[340px] sm:h-[440px]">{viewer}</div>
        {modelInfo}
        <Card className="p-6">
          <ConfigPanel metrics={metrics} config={config} plan={plan} onChange={setConfig} />
        </Card>
      </div>
      <div className="lg:sticky lg:top-6 lg:self-start">
        <PriceSummary price={price} quantity={config.quantity} plan={plan} issues={issues}>
          <Button size="lg" className="w-full" onClick={goToCheckout} disabled={blocked}>
            {user ? 'Continue to checkout' : 'Sign up to order'} <ArrowRight className="size-4" />
          </Button>
          {!user && <p className="mt-3 text-center text-xs text-white/50">Free account · Pro members save 10%</p>}
        </PriceSummary>
      </div>

      {/* Mobile: keep the live total in reach while configuring. */}
      <div className="h-20 lg:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-white/10 bg-ink px-4 py-3 text-white lg:hidden">
        <div>
          <p className="text-xs text-white/50">Total · {config.quantity} part{config.quantity > 1 ? 's' : ''}</p>
          <p className="text-xl font-bold tabular-nums">{formatMoney(price.totalCents)}</p>
        </div>
        <Button onClick={goToCheckout} disabled={blocked}>
          {user ? 'Checkout' : 'Sign up to order'} <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
