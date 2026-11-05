import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Check } from 'lucide-react'
import { AddressFields } from '@/components/app/AddressFields'
import { PageHeader } from '@/components/app/PageHeader'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { Card, ErrorState, Spinner } from '@/components/ui/misc'
import { useChangePlan, useProfile, useUpdateProfile } from '@/hooks/queries'
import { useAuth } from '@/hooks/useAuth'
import { useBackend } from '@/lib/backend/context'
import { EMPTY_ADDRESS, type Address } from '@/lib/backend/types'
import { PLANS, type PlanId } from '@/lib/catalog'
import { cn } from '@/lib/cn'
import { addressSchema, validate, type FieldErrors } from '@/lib/validation'

export default function Settings() {
  const backend = useBackend()
  const { signOut } = useAuth()
  const profile = useProfile()
  const updateProfile = useUpdateProfile()
  const changePlan = useChangePlan()
  const [params] = useSearchParams()
  const suggested = params.get('plan') as PlanId | null

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS)
  const [addressErrors, setAddressErrors] = useState<FieldErrors<Address>>({})

  useEffect(() => {
    if (!profile.data) return
    setName(profile.data.fullName)
    setCompany(profile.data.company)
    setAddress(profile.data.address ?? { ...EMPTY_ADDRESS, name: profile.data.fullName })
  }, [profile.data])

  useEffect(() => {
    if (suggested || window.location.hash === '#plan') {
      document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [suggested, profile.isSuccess])

  if (profile.isPending) return <Spinner className="py-32" />
  if (profile.isError) return <ErrorState error={profile.error} onRetry={() => profile.refetch()} />

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) return toast.error('Enter your name')
    await updateProfile.mutateAsync({ fullName: name.trim(), company: company.trim() })
    toast.success('Profile saved')
  }

  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = validate(addressSchema, address)
    if (result.errors) return setAddressErrors(result.errors)
    setAddressErrors({})
    await updateProfile.mutateAsync({ address: result.data })
    toast.success('Default address saved')
  }

  const switchPlan = async (plan: PlanId) => {
    try {
      await changePlan.mutateAsync(plan)
      toast.success(`You're on ${PLANS[plan].name}`, { description: plan === 'starter' ? undefined : 'Discounts apply to your next order.' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not change plan')
    }
  }

  const resetDemo = () => {
    try {
      localStorage.removeItem('seleste:db')
      localStorage.removeItem('seleste:session')
    } catch {
      /* storage unavailable: the in-memory demo resets on reload anyway */
    }
    if (import.meta.env.VITE_ROUTER === 'hash') {
      window.location.hash = '#/'
      window.location.reload()
    } else {
      window.location.assign(import.meta.env.BASE_URL)
    }
  }

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile, shipping details and plan." />
      <div className="space-y-6">
        <Card className="p-6">
          <form onSubmit={saveProfile}>
            <h2 className="text-lg font-semibold">Profile</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name">{(id) => <Input id={id} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />}</Field>
              <Field label="Company">{(id) => <Input id={id} value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" />}</Field>
              <Field label="Email" hint="Used to sign in." className="sm:col-span-2">
                {(id, d) => <Input id={id} value={profile.data.email} disabled aria-describedby={d} />}
              </Field>
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit" variant="dark" loading={updateProfile.isPending}>
                Save profile
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <form onSubmit={saveAddress} noValidate>
            <h2 className="text-lg font-semibold">Default shipping address</h2>
            <p className="mt-1 text-sm text-ink/55">Pre-filled at checkout.</p>
            <div className="mt-5">
              <AddressFields value={address} onChange={setAddress} errors={addressErrors} />
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit" variant="dark" loading={updateProfile.isPending}>
                Save address
              </Button>
            </div>
          </form>
        </Card>

        <Card id="plan" className="scroll-mt-24 p-6">
          <h2 className="text-lg font-semibold">Plan</h2>
          <p className="mt-1 text-sm text-ink/55">
            {backend.mode === 'demo'
              ? 'Demo mode: switching is instant and free.'
              : 'Billing is not connected in this MVP — plan changes apply immediately.'}
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {(Object.keys(PLANS) as PlanId[]).map((id) => {
              const plan = PLANS[id]
              const current = profile.data.plan === id
              return (
                <div key={id} className={cn('flex flex-col rounded-2xl border p-5', current ? 'border-ink ring-1 ring-ink' : suggested === id ? 'border-brand ring-1 ring-brand' : 'border-ink/10')}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{plan.name}</h3>
                    {current && <span className="rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-white">Current</span>}
                  </div>
                  <p className="mt-2 text-3xl font-bold">
                    ${plan.monthly}
                    <span className="text-sm font-medium text-ink/45"> /mo</span>
                  </p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm text-ink/65">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-mint" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-5 w-full"
                    variant={current ? 'outline' : suggested === id ? 'primary' : 'dark'}
                    disabled={current}
                    loading={changePlan.isPending && changePlan.variables === id}
                    onClick={() => switchPlan(id)}
                  >
                    {current ? 'Current plan' : `Switch to ${plan.name}`}
                  </Button>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Session</h2>
            <p className="text-sm text-ink/55">
              Signed in as {profile.data.email}
              {profile.data.role === 'admin' && ' · Admin'}
            </p>
          </div>
          <div className="flex gap-2">
            {backend.mode === 'demo' && (
              <Button variant="danger" onClick={resetDemo}>
                Reset demo data
              </Button>
            )}
            <Button variant="outline" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}
