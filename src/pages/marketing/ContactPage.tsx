import { useState } from 'react'
import { CheckCircle2, Clock, MessageSquare, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Field, Input, Textarea } from '@/components/ui/Field'
import { Card, Eyebrow } from '@/components/ui/misc'
import { useBackend } from '@/lib/backend/context'
import { contactSchema, validate, type FieldErrors } from '@/lib/validation'
import type { ContactMessage } from '@/lib/backend/types'

const EMPTY: ContactMessage = { name: '', email: '', company: '', message: '' }

export default function ContactPage() {
  const backend = useBackend()
  const [form, setForm] = useState<ContactMessage>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors<ContactMessage>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = validate(contactSchema, form)
    if (result.errors) return setErrors(result.errors)
    setErrors({})
    setStatus('sending')
    try {
      await backend.submitContact(result.data)
      setStatus('sent')
      setForm(EMPTY)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Please try again.')
      setStatus('error')
    }
  }

  const input = (key: keyof ContactMessage, label: string, type = 'text', autoComplete?: string) => (
    <Field label={label} error={errors[key]}>
      {(id, describedBy) => (
        <Input id={id} type={type} autoComplete={autoComplete} aria-describedby={describedBy} aria-invalid={!!errors[key]} value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
      )}
    </Field>
  )

  return (
    <div className="mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1fr_1.1fr] lg:px-8">
      <div>
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">Talk to an engineer</h1>
        <p className="mt-5 max-w-md text-lg text-ink/55">Questions about materials, tolerances or production runs? Send us a message and a real person will reply.</p>
        <ul className="mt-10 space-y-6">
          {[
            { icon: Clock, title: 'Fast replies', text: 'We answer within one business day.' },
            { icon: Wrench, title: 'Design-for-print help', text: 'Share your constraints and we will suggest the best process.' },
            { icon: MessageSquare, title: 'Volume orders', text: 'Need 500+ parts? We will put together a custom quote.' },
          ].map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blush text-brand">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-ink/55">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Card className="p-6 shadow-[0_30px_60px_-40px_rgb(0_0_0/0.3)] sm:p-10">
        {status === 'sent' ? (
          <div className="flex h-full flex-col items-center justify-center py-12 text-center" role="status">
            <CheckCircle2 className="size-14 text-mint" />
            <h2 className="mt-4 text-2xl font-bold">Message sent</h2>
            <p className="mt-2 text-ink/55">Thanks for reaching out — we will be in touch soon.</p>
            <Button variant="outline" className="mt-8" onClick={() => setStatus('idle')}>
              Send another
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              {input('name', 'Name', 'text', 'name')}
              {input('email', 'Email', 'email', 'email')}
            </div>
            {input('company', 'Company (optional)', 'text', 'organization')}
            <Field label="How can we help?" error={errors.message}>
              {(id, describedBy) => (
                <Textarea id={id} rows={6} aria-describedby={describedBy} aria-invalid={!!errors.message} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              )}
            </Field>
            {status === 'error' && <p role="alert" className="text-sm text-brand">{serverError}</p>}
            <Button type="submit" size="lg" className="w-full" loading={status === 'sending'}>
              Send message
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}
