import { z } from 'zod'

export const addressSchema = z.object({
  name: z.string().trim().min(2, 'Enter the recipient name'),
  line1: z.string().trim().min(3, 'Enter a street address'),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2, 'Enter a city'),
  region: z.string().trim().min(2, 'Enter a state or region'),
  postalCode: z.string().trim().min(3, 'Enter a postal code').max(12, 'Postal code is too long'),
  country: z.string().trim().min(2, 'Enter a country'),
})

export const signInSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
})

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your name'),
  email: z.email('Enter a valid email'),
  password: z.string().min(8, 'Use at least 8 characters'),
})

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name'),
  email: z.email('Enter a valid email'),
  company: z.string().trim().optional(),
  message: z.string().trim().min(10, 'Tell us a bit more (10+ characters)').max(5000),
})

export type FieldErrors<T> = Partial<Record<keyof T, string>>

/** Run a zod schema and flatten issues to one message per field. */
export function validate<T>(schema: z.ZodType<T>, data: unknown): { data: T; errors: null } | { data: null; errors: FieldErrors<T> } {
  const result = schema.safeParse(data)
  if (result.success) return { data: result.data, errors: null }
  const errors: FieldErrors<T> = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof T
    if (key !== undefined && !errors[key]) errors[key] = issue.message
  }
  return { data: null, errors }
}
