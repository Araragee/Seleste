/**
 * Demo backend. Persists everything in the browser (localStorage for
 * records, IndexedDB for model files) so the app is fully usable without
 * any server. It mirrors the rules enforced by the Supabase policies.
 */
import { get as idbGet, set as idbSet } from 'idb-keyval'
import type { PlanId } from '../catalog'
import { calculatePrice, validateQuote } from '../pricing'
import { buildSeed, DEMO_EMAIL, DEMO_PASSWORD } from './seed'
import {
  BackendError,
  nextStatuses,
  type AdminUpdate,
  type AuthUser,
  type Backend,
  type ContactMessage,
  type NewOrderInput,
  type Order,
  type OrderStatus,
  type Profile,
} from './types'

export interface FileStore {
  get(key: string): Promise<ArrayBuffer | undefined>
  set(key: string, value: ArrayBuffer): Promise<void>
}

export interface LocalUser {
  id: string
  email: string
  salt: string
  passwordHash: string
}

export interface LocalDb {
  version: 1
  users: LocalUser[]
  profiles: Profile[]
  orders: Order[]
  messages: (ContactMessage & { createdAt: string })[]
  orderSeq: number
}

const DB_KEY = 'seleste:db'
const SESSION_KEY = 'seleste:session'

export const idbFileStore: FileStore = {
  get: (key) => idbGet<ArrayBuffer>(key),
  set: (key, value) => idbSet(key, value),
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

const uuid = () => crypto.randomUUID()
const now = () => new Date().toISOString()
const clone = <T,>(v: T): T => structuredClone(v)

interface Options {
  storage?: Storage
  files?: FileStore
  latencyMs?: number
  fetchPublic?: (path: string) => Promise<ArrayBuffer | null>
}

export function createLocalBackend(opts: Options = {}): Backend {
  const storage = opts.storage ?? window.localStorage
  const files = opts.files ?? idbFileStore
  const latency = opts.latencyMs ?? 180
  const fetchPublic =
    opts.fetchPublic ??
    (async (path: string) => {
      const res = await fetch(path)
      return res.ok ? res.arrayBuffer() : null
    })
  const listeners = new Set<(u: AuthUser | null) => void>()

  const delay = () => (latency > 0 ? new Promise((r) => setTimeout(r, latency)) : Promise.resolve())

  let seeding: Promise<LocalDb> | null = null
  async function load(): Promise<LocalDb> {
    const raw = storage.getItem(DB_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as LocalDb
        if (parsed.version === 1) return parsed
      } catch {
        /* fall through and reseed */
      }
    }
    seeding ??= (async () => {
      const salt = uuid()
      const db = buildSeed({ salt, passwordHash: await hashPassword(DEMO_PASSWORD, salt) })
      save(db)
      return db
    })()
    return seeding
  }

  function save(db: LocalDb) {
    storage.setItem(DB_KEY, JSON.stringify(db))
  }

  function currentUserId(): string | null {
    return storage.getItem(SESSION_KEY)
  }

  async function requireUser(db: LocalDb): Promise<Profile> {
    const id = currentUserId()
    const profile = id && db.profiles.find((p) => p.id === id)
    if (!profile) throw new BackendError('You need to sign in first.')
    return profile
  }

  async function requireAdmin(db: LocalDb): Promise<Profile> {
    const profile = await requireUser(db)
    if (profile.role !== 'admin') throw new BackendError('Admins only.')
    return profile
  }

  function setSession(user: AuthUser | null) {
    if (user) storage.setItem(SESSION_KEY, user.id)
    else storage.removeItem(SESSION_KEY)
    listeners.forEach((cb) => cb(user))
  }

  function findOrder(db: LocalDb, id: string): Order {
    const order = db.orders.find((o) => o.id === id)
    if (!order) throw new BackendError('Order not found.')
    return order
  }

  function transition(order: Order, status: OrderStatus, note: string) {
    order.status = status
    order.updatedAt = now()
    order.events.push({ id: uuid(), status, note, createdAt: order.updatedAt })
  }

  return {
    mode: 'demo',

    async getUser() {
      const db = await load()
      const id = currentUserId()
      const user = id ? db.users.find((u) => u.id === id) : undefined
      return user ? { id: user.id, email: user.email } : null
    },

    onAuthChange(cb) {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },

    async signIn(email, password) {
      await delay()
      const db = await load()
      const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
      if (!user || (await hashPassword(password, user.salt)) !== user.passwordHash) {
        throw new BackendError('Invalid email or password.')
      }
      const authUser = { id: user.id, email: user.email }
      setSession(authUser)
      return authUser
    },

    async signUp(email, password, fullName) {
      await delay()
      const db = await load()
      const normalized = email.trim().toLowerCase()
      if (db.users.some((u) => u.email.toLowerCase() === normalized)) {
        throw new BackendError('An account with this email already exists.')
      }
      const salt = uuid()
      const user: LocalUser = { id: uuid(), email: normalized, salt, passwordHash: await hashPassword(password, salt) }
      db.users.push(user)
      db.profiles.push({
        id: user.id,
        email: normalized,
        fullName: fullName.trim(),
        company: '',
        plan: 'starter',
        role: 'customer',
        address: null,
        createdAt: now(),
      })
      save(db)
      const authUser = { id: user.id, email: user.email }
      setSession(authUser)
      return authUser
    },

    async signOut() {
      setSession(null)
    },

    async getProfile() {
      const db = await load()
      return clone(await requireUser(db))
    },

    async updateProfile(patch) {
      await delay()
      const db = await load()
      const profile = await requireUser(db)
      Object.assign(profile, patch)
      save(db)
      return clone(profile)
    },

    async changePlan(plan: PlanId) {
      await delay()
      const db = await load()
      const profile = await requireUser(db)
      profile.plan = plan
      save(db)
      return clone(profile)
    },

    async listOrders() {
      await delay()
      const db = await load()
      const profile = await requireUser(db)
      return clone(db.orders.filter((o) => o.userId === profile.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
    },

    async getOrder(id) {
      await delay()
      const db = await load()
      const profile = await requireUser(db)
      const order = findOrder(db, id)
      if (order.userId !== profile.id && profile.role !== 'admin') throw new BackendError('Order not found.')
      return clone(order)
    },

    async createOrder(input: NewOrderInput) {
      await delay()
      const db = await load()
      const profile = await requireUser(db)
      const errors = validateQuote(input.metrics, input.config).filter((i) => i.level === 'error')
      if (errors.length) throw new BackendError(errors[0].message)

      const id = uuid()
      const key = `model:${id}`
      await files.set(key, await input.file.arrayBuffer())

      db.orderSeq += 1
      const createdAt = now()
      const order: Order = {
        id,
        number: `SL-${db.orderSeq}`,
        userId: profile.id,
        customerName: input.address.name || profile.fullName,
        customerEmail: profile.email,
        status: 'pending_review',
        fileName: input.file.name,
        fileSize: input.file.size,
        filePath: key,
        metrics: input.metrics,
        config: input.config,
        pricing: calculatePrice(input.metrics, input.config, profile.plan, input.shippingMethod),
        shippingMethod: input.shippingMethod,
        address: input.address,
        notes: input.notes,
        trackingNumber: null,
        createdAt,
        updatedAt: createdAt,
        events: [{ id: uuid(), status: 'pending_review', note: 'Order placed.', createdAt }],
      }
      db.orders.push(order)
      if (!profile.address) profile.address = input.address
      save(db)
      return clone(order)
    },

    async cancelOrder(id) {
      await delay()
      const db = await load()
      const profile = await requireUser(db)
      const order = findOrder(db, id)
      if (order.userId !== profile.id) throw new BackendError('Order not found.')
      if (order.status !== 'pending_review') throw new BackendError('Only orders still in review can be cancelled.')
      transition(order, 'cancelled', 'Cancelled by customer.')
      save(db)
      return clone(order)
    },

    async getModelFile(order) {
      if (!order.filePath) return null
      if (order.filePath.startsWith('public:')) return fetchPublic(order.filePath.slice('public:'.length))
      return (await files.get(order.filePath)) ?? null
    },

    async adminListOrders() {
      await delay()
      const db = await load()
      await requireAdmin(db)
      return clone([...db.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
    },

    async adminUpdateOrder(id, update: AdminUpdate) {
      await delay()
      const db = await load()
      await requireAdmin(db)
      const order = findOrder(db, id)
      if (!nextStatuses(order.status).includes(update.status)) {
        throw new BackendError(`Cannot move an order from ${order.status} to ${update.status}.`)
      }
      if (update.status === 'shipped') {
        if (!update.trackingNumber?.trim()) throw new BackendError('A tracking number is required to ship.')
        order.trackingNumber = update.trackingNumber.trim()
      }
      transition(order, update.status, update.note?.trim() || '')
      save(db)
      return clone(order)
    },

    async submitContact(message) {
      await delay()
      const db = await load()
      db.messages.push({ ...message, createdAt: now() })
      save(db)
    },
  }
}

export { DEMO_EMAIL, DEMO_PASSWORD }
