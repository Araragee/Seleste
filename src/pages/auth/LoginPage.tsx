import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { useAuth } from '@/hooks/useAuth'
import { useDemoLogin } from '@/hooks/useDemoLogin'
import { signInSchema, validate, type FieldErrors } from '@/lib/validation'
import { AuthShell, safeNext } from './AuthShell'

export default function LoginPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const demo = useDemoLogin(next)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<FieldErrors<typeof form>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={next} replace />

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = validate(signInSchema, form)
    if (result.errors) return setErrors(result.errors)
    setErrors({})
    setServerError('')
    setLoading(true)
    try {
      await signIn(result.data.email, result.data.password)
      navigate(next, { replace: true })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle={
        <>
          New to Seleste?{' '}
          <Link to={`/signup${params.toString() ? `?${params}` : ''}`} className="font-semibold text-brand hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {demo && (
        <>
          <Button variant="dark" size="lg" className="h-auto min-h-14 w-full py-3 whitespace-normal" onClick={demo}>
            <PlayCircle className="size-5" /> Continue with demo account
          </Button>
          <div className="my-6 flex items-center gap-3 text-xs text-ink/40">
            <span className="h-px flex-1 bg-ink/10" /> or sign in with email <span className="h-px flex-1 bg-ink/10" />
          </div>
        </>
      )}
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email" error={errors.email}>
          {(id, d) => <Input id={id} type="email" autoComplete="email" aria-describedby={d} aria-invalid={!!errors.email} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />}
        </Field>
        <Field label="Password" error={errors.password}>
          {(id, d) => <Input id={id} type="password" autoComplete="current-password" aria-describedby={d} aria-invalid={!!errors.password} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />}
        </Field>
        {serverError && <p role="alert" className="rounded-lg bg-blush px-3 py-2 text-sm text-brand">{serverError}</p>}
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Sign in
        </Button>
      </form>
    </AuthShell>
  )
}
