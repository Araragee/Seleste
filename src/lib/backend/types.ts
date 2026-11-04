import type { PlanId, ShippingMethod } from '../catalog'
import type { PriceBreakdown, QuoteConfig } from '../pricing'
import type { MeshMetrics } from '../stl'

export type OrderStatus = 'pending_review' | 'in_production' | 'quality_check' | 'shipped' | 'delivered' | 'cancelled'

export const STATUS_FLOW: OrderStatus[] = ['pending_review', 'in_production', 'quality_check', 'shipped', 'delivered']

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_review: 'In review',
  in_production: 'Printing',
  quality_check: 'Quality check',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const STATUS_DESCRIPTION: Record<OrderStatus, string> = {
  pending_review: 'An engineer is checking your file for printability.',
  in_production: 'Your part is on the printer.',
  quality_check: 'Post-processing and dimensional inspection.',
  shipped: 'On its way to you.',
  delivered: 'Delivered. Enjoy your part!',
  cancelled: 'This order was cancelled.',
}

/** Status transitions an operator may perform. */
export function nextStatuses(status: OrderStatus): OrderStatus[] {
  switch (status) {
    case 'pending_review':
      return ['in_production', 'cancelled']
    case 'in_production':
      return ['quality_check']
    case 'quality_check':
      return ['shipped']
    case 'shipped':
      return ['delivered']
    default:
      return []
  }
}

export const isActive = (s: OrderStatus) => s !== 'delivered' && s !== 'cancelled'

export interface Address {
  name: string
  line1: string
  line2?: string
  city: string
  region: string
  postalCode: string
  country: string
}

export const EMPTY_ADDRESS: Address = { name: '', line1: '', line2: '', city: '', region: '', postalCode: '', country: 'United States' }

export type Role = 'customer' | 'admin'

export interface Profile {
  id: string
  email: string
  fullName: string
  company: string
  plan: PlanId
  role: Role
  address: Address | null
  createdAt: string
}

export interface OrderEvent {
  id: string
  status: OrderStatus
  note: string
  createdAt: string
}

export interface Order {
  id: string
  number: string
  userId: string
  customerName: string
  customerEmail: string
  status: OrderStatus
  fileName: string
  fileSize: number
  /** Storage key for the uploaded model, or `public:/path` for bundled samples. */
  filePath: string | null
  metrics: MeshMetrics
  config: QuoteConfig
  pricing: PriceBreakdown
  shippingMethod: ShippingMethod
  address: Address
  notes: string
  trackingNumber: string | null
  createdAt: string
  updatedAt: string
  events: OrderEvent[]
}

export interface NewOrderInput {
  file: File
  metrics: MeshMetrics
  config: QuoteConfig
  shippingMethod: ShippingMethod
  address: Address
  notes: string
}

export interface AdminUpdate {
  status: OrderStatus
  note?: string
  trackingNumber?: string
}

export interface AuthUser {
  id: string
  email: string
}

export interface ContactMessage {
  name: string
  email: string
  company?: string
  message: string
}

export interface Backend {
  readonly mode: 'demo' | 'supabase'

  getUser(): Promise<AuthUser | null>
  onAuthChange(cb: (user: AuthUser | null) => void): () => void
  signIn(email: string, password: string): Promise<AuthUser>
  signUp(email: string, password: string, fullName: string): Promise<AuthUser>
  signOut(): Promise<void>

  getProfile(): Promise<Profile>
  updateProfile(patch: Partial<Pick<Profile, 'fullName' | 'company' | 'address'>>): Promise<Profile>
  /** Stand-in for a billing provider webhook. */
  changePlan(plan: PlanId): Promise<Profile>

  listOrders(): Promise<Order[]>
  getOrder(id: string): Promise<Order>
  createOrder(input: NewOrderInput): Promise<Order>
  cancelOrder(id: string): Promise<Order>
  getModelFile(order: Order): Promise<ArrayBuffer | null>

  adminListOrders(): Promise<Order[]>
  adminUpdateOrder(id: string, update: AdminUpdate): Promise<Order>

  submitContact(message: ContactMessage): Promise<void>
}

export class BackendError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BackendError'
  }
}
