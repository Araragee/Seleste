import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import type { PlanId, ShippingMethod } from '../catalog'
import { calculatePrice, validateQuote, type PriceBreakdown, type QuoteConfig } from '../pricing'
import type { MeshMetrics } from '../stl'
import {
  BackendError,
  type Address,
  type AuthUser,
  type Backend,
  type Order,
  type OrderEvent,
  type OrderStatus,
  type Profile,
  type Role,
} from './types'

const BUCKET = 'models'

interface ProfileRow {
  id: string
  email: string
  full_name: string
  company: string
  plan: PlanId
  role: Role
  address: Address | null
  created_at: string
}

interface EventRow {
  id: string
  status: OrderStatus
  note: string
  created_at: string
}

interface OrderRow {
  id: string
  number: string
  user_id: string
  customer_name: string
  customer_email: string
  status: OrderStatus
  file_name: string
  file_size: number
  file_path: string | null
  metrics: MeshMetrics
  config: QuoteConfig
  pricing: PriceBreakdown
  shipping_method: ShippingMethod
  address: Address
  notes: string
  tracking_number: string | null
  created_at: string
  updated_at: string
  order_events?: EventRow[]
}

const ORDER_SELECT = '*, order_events(id, status, note, created_at)'

function toProfile(r: ProfileRow): Profile {
  return {
    id: r.id,
    email: r.email,
    fullName: r.full_name,
    company: r.company,
    plan: r.plan,
    role: r.role,
    address: r.address,
    createdAt: r.created_at,
  }
}

function toEvent(r: EventRow): OrderEvent {
  return { id: r.id, status: r.status, note: r.note, createdAt: r.created_at }
}

function toOrder(r: OrderRow): Order {
  return {
    id: r.id,
    number: r.number,
    userId: r.user_id,
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    status: r.status,
    fileName: r.file_name,
    fileSize: r.file_size,
    filePath: r.file_path,
    metrics: r.metrics,
    config: r.config,
    pricing: r.pricing,
    shippingMethod: r.shipping_method,
    address: r.address,
    notes: r.notes,
    trackingNumber: r.tracking_number,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    events: (r.order_events ?? []).map(toEvent).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  }
}

function fail(error: { message: string } | null): asserts error is null {
  if (error) throw new BackendError(error.message)
}

const toAuthUser = (u: User): AuthUser => ({ id: u.id, email: u.email ?? '' })

export function createSupabaseBackend(url: string, anonKey: string): Backend {
  const sb: SupabaseClient = createClient(url, anonKey)

  async function uid(): Promise<string> {
    const { data } = await sb.auth.getUser()
    if (!data.user) throw new BackendError('You need to sign in first.')
    return data.user.id
  }

  async function fetchProfile(): Promise<Profile> {
    const id = await uid()
    const { data, error } = await sb.from('profiles').select('*').eq('id', id).single()
    fail(error)
    return toProfile(data as ProfileRow)
  }

  async function fetchOrder(id: string): Promise<Order> {
    const { data, error } = await sb.from('orders').select(ORDER_SELECT).eq('id', id).single()
    fail(error)
    return toOrder(data as OrderRow)
  }

  return {
    mode: 'supabase',

    async getUser() {
      const { data } = await sb.auth.getSession()
      return data.session?.user ? toAuthUser(data.session.user) : null
    },

    onAuthChange(cb) {
      const { data } = sb.auth.onAuthStateChange((_event, session) => cb(session?.user ? toAuthUser(session.user) : null))
      return () => data.subscription.unsubscribe()
    },

    async signIn(email, password) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password })
      fail(error)
      return toAuthUser(data.user!)
    },

    async signUp(email, password, fullName) {
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/app` },
      })
      fail(error)
      if (!data.session) {
        throw new BackendError('Check your inbox to confirm your email, then sign in.')
      }
      return toAuthUser(data.user!)
    },

    async signOut() {
      const { error } = await sb.auth.signOut()
      fail(error)
    },

    getProfile: fetchProfile,

    async updateProfile(patch) {
      const id = await uid()
      const row: Partial<ProfileRow> = {}
      if (patch.fullName !== undefined) row.full_name = patch.fullName
      if (patch.company !== undefined) row.company = patch.company
      if (patch.address !== undefined) row.address = patch.address
      const { data, error } = await sb.from('profiles').update(row).eq('id', id).select('*').single()
      fail(error)
      return toProfile(data as ProfileRow)
    },

    async changePlan(plan) {
      const { error } = await sb.rpc('change_plan', { new_plan: plan })
      fail(error)
      return fetchProfile()
    },

    async listOrders() {
      const id = await uid()
      const { data, error } = await sb.from('orders').select(ORDER_SELECT).eq('user_id', id).order('created_at', { ascending: false })
      fail(error)
      return (data as OrderRow[]).map(toOrder)
    },

    getOrder: fetchOrder,

    async createOrder(input) {
      const profile = await fetchProfile()
      const errors = validateQuote(input.metrics, input.config).filter((i) => i.level === 'error')
      if (errors.length) throw new BackendError(errors[0].message)

      const id = crypto.randomUUID()
      const path = `${profile.id}/${id}.stl`
      const upload = await sb.storage.from(BUCKET).upload(path, input.file, { contentType: 'model/stl' })
      fail(upload.error)

      // NOTE: price is computed client-side for the MVP and re-checked by an
      // engineer during review. Move this into an Edge Function before taking payments.
      const { error } = await sb.from('orders').insert({
        id,
        user_id: profile.id,
        customer_name: input.address.name || profile.fullName,
        customer_email: profile.email,
        file_name: input.file.name,
        file_size: input.file.size,
        file_path: path,
        metrics: input.metrics,
        config: input.config,
        pricing: calculatePrice(input.metrics, input.config, profile.plan, input.shippingMethod),
        shipping_method: input.shippingMethod,
        address: input.address,
        notes: input.notes,
      })
      if (error) {
        await sb.storage.from(BUCKET).remove([path])
        throw new BackendError(error.message)
      }
      if (!profile.address) await sb.from('profiles').update({ address: input.address }).eq('id', profile.id)
      return fetchOrder(id)
    },

    async cancelOrder(id) {
      const { error } = await sb.rpc('cancel_order', { order_id: id })
      fail(error)
      return fetchOrder(id)
    },

    async getModelFile(order) {
      if (!order.filePath) return null
      if (order.filePath.startsWith('public:')) {
        const res = await fetch(order.filePath.slice('public:'.length))
        return res.ok ? res.arrayBuffer() : null
      }
      const { data, error } = await sb.storage.from(BUCKET).download(order.filePath)
      if (error) return null
      return data.arrayBuffer()
    },

    async adminListOrders() {
      const { data, error } = await sb.from('orders').select(ORDER_SELECT).order('created_at', { ascending: false })
      fail(error)
      return (data as OrderRow[]).map(toOrder)
    },

    async adminUpdateOrder(id, update) {
      const { error } = await sb.rpc('admin_update_order', {
        order_id: id,
        new_status: update.status,
        note: update.note ?? '',
        tracking: update.trackingNumber ?? null,
      })
      fail(error)
      return fetchOrder(id)
    },

    async submitContact(message) {
      const { error } = await sb.from('contact_messages').insert({
        name: message.name,
        email: message.email,
        company: message.company ?? '',
        message: message.message,
      })
      fail(error)
    },
  }
}
