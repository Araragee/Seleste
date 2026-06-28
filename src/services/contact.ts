export interface ContactPayload {
  firstName: string
  lastName: string
  subject: string
  message: string
}

export interface ContactResult {
  ok: boolean
  message: string
}

/**
 * Submits the contact form.
 *
 * Posts to the endpoint defined by `VITE_CONTACT_ENDPOINT`. When no endpoint
 * is configured (e.g. local/preview builds) the submission resolves locally so
 * the UI flow stays functional without a backend.
 */
export async function submitContactForm(payload: ContactPayload): Promise<ContactResult> {
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined

  if (!endpoint) {
    // No backend configured — simulate a short round-trip.
    await new Promise((resolve) => setTimeout(resolve, 600))
    console.info('[contact] No VITE_CONTACT_ENDPOINT set; submission handled locally.', payload)
    return { ok: true, message: 'Thanks! Your message has been sent successfully.' }
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return { ok: true, message: 'Thanks! Your message has been sent successfully.' }
}
