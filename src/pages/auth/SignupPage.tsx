import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { useAuth } from '@/hooks/useAuth'
import { PLANS, type PlanId } from '@/lib/catalog'
import { signUpSchema, validate, type FieldErrors } from '@/lib/validation'
import { AuthShell, safeNext } from './AuthShell'

export default function SignupPage() {
  const { user, signUp } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const plan = params.get('plan') as PlanId | null
  const next = plan && plan in PLANS ? `/app/settings?plan=${plan}` : safeNext(params.get('next'))
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [errors, setErrors] = useState<FieldErrors<typeof form>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user && !loading) return <Navigate to={next} replace />

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = validate(signUpSchema, form)
    if (result.errors) return setErrors(result.errors)
    setErrors({})
    setServerError('')
    setLoading(true)
    try {
      await signUp(result.data.email, result.data.password, result.data.fullName)
      toast.success('Welcome to Seleste!')
      navigate(next, { replace: true })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle={
        <>
          Already have one?{' '}
          <Link to={`/login${params.toString() ? `?${params}` : ''}`} className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Full name" error={errors.fullName}>
          {(id, d) => <Input id={id} autoComplete="name" aria-describedby={d} aria-invalid={!!errors.fullName} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />}
        </Field>
        <Field label="Work email" error={errors.email}>
          {(id, d) => <Input id={id} type="email" autoComplete="email" aria-describedby={d} aria-invalid={!!errors.email} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />}
        </Field>
        <Field label="Password" error={errors.password} hint="At least 8 characters">
          {(id, d) => <Input id={id} type="password" autoComplete="new-password" aria-describedby={d} aria-invalid={!!errors.password} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />}
        </Field>
        {serverError && <p role="alert" className="rounded-lg bg-blush px-3 py-2 text-sm text-brand">{serverError}</p>}
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Create account
        </Button>
        <p className="text-center text-xs text-ink/45">Free forever on Starter. Upgrade any time.</p>
      </form>
    </AuthShell>
  )
}
