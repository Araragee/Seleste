import type { ShippingMethod } from '../catalog'
import { calculatePrice, type QuoteConfig } from '../pricing'
import type { MeshMetrics } from '../stl'
import type { LocalDb } from './local'
import { STATUS_FLOW, type Address, type Order, type OrderEvent, type OrderStatus, type Profile } from './types'

export const DEMO_EMAIL = 'demo@seleste.app'
export const DEMO_PASSWORD = 'demo1234'

export const SAMPLES: { file: string; name: string; size: number; metrics: MeshMetrics }[] = [
  {
    file: 'calibration-cube.stl',
    name: 'Calibration cube',
    size: 684,
    metrics: { triangles: 12, volumeMm3: 8000, surfaceAreaMm2: 2400, bbox: { x: 20, y: 20, z: 20 } },
  },
  {
    file: 'spur-gear.stl',
    name: 'Spur gear',
    size: 76884,
    metrics: { triangles: 1536, volumeMm3: 19671.24, surfaceAreaMm2: 7420.83, bbox: { x: 59.71, y: 59.71, z: 8 } },
  },
  {
    file: 'twisted-tower.stl',
    name: 'Twisted tower',
    size: 470484,
    metrics: { triangles: 9408, volumeMm3: 102145.76, surfaceAreaMm2: 13112.16, bbox: { x: 45, y: 43.13, z: 90 } },
  },
  {
    file: 'ring.stl',
    name: 'Ring',
    size: 144084,
    metrics: { triangles: 2880, volumeMm3: 602.04, surfaceAreaMm2: 717.41, bbox: { x: 22.6, y: 22.6, z: 4.48 } },
  },
]

const sample = (file: string) => SAMPLES.find((s) => s.file === file)!

const NOTES: Partial<Record<OrderStatus, string>> = {
  pending_review: 'Order placed.',
  in_production: 'File approved. Queued on printer.',
  quality_check: 'Print complete, inspecting dimensions.',
  shipped: 'Handed to carrier.',
  delivered: 'Delivered.',
}

interface SeedOrder {
  number: number
  userId: string
  customerName: string
  customerEmail: string
  file: string
  config: Omit<QuoteConfig, 'units'>
  status: OrderStatus
  hoursAgo: number
  shipping: ShippingMethod
  address: Address
  plan: Profile['plan']
  notes?: string
}

function buildOrder(seed: SeedOrder, now: number): Order {
  const s = sample(seed.file)
  const config: QuoteConfig = { ...seed.config, units: 'mm' }
  const created = now - seed.hoursAgo * 3600_000
  const steps = STATUS_FLOW.slice(0, STATUS_FLOW.indexOf(seed.status) + 1)
  const span = (seed.hoursAgo * 3600_000) / Math.max(1, steps.length)
  const events: OrderEvent[] = steps.map((status, i) => ({
    id: `${seed.number}-${i}`,
    status,
    note: NOTES[status] ?? '',
    createdAt: new Date(created + i * span * 0.9).toISOString(),
  }))
  return {
    id: crypto.randomUUID(),
    number: `SL-${seed.number}`,
    userId: seed.userId,
    customerName: seed.customerName,
    customerEmail: seed.customerEmail,
    status: seed.status,
    fileName: s.file,
    fileSize: s.size,
    filePath: `public:/samples/${s.file}`,
    metrics: s.metrics,
    config,
    pricing: calculatePrice(s.metrics, config, seed.plan, seed.shipping),
    shippingMethod: seed.shipping,
    address: seed.address,
    notes: seed.notes ?? '',
    trackingNumber: seed.status === 'shipped' || seed.status === 'delivered' ? `1Z999AA1${seed.number}784` : null,
    createdAt: new Date(created).toISOString(),
    updatedAt: events[events.length - 1].createdAt,
    events,
  }
}

export function buildSeed({ salt, passwordHash }: { salt: string; passwordHash: string }): LocalDb {
  const now = Date.now()
  const demoId = crypto.randomUUID()
  const demoAddress: Address = {
    name: 'Alex Rivera',
    line1: '500 Market Street',
    line2: 'Suite 300',
    city: 'San Francisco',
    region: 'CA',
    postalCode: '94105',
    country: 'United States',
  }
  const demo: Profile = {
    id: demoId,
    email: DEMO_EMAIL,
    fullName: 'Alex Rivera',
    company: 'Demo Robotics',
    plan: 'pro',
    role: 'admin',
    address: demoAddress,
    createdAt: new Date(now - 40 * 86400_000).toISOString(),
  }
  const base = { userId: demoId, customerName: demo.fullName, customerEmail: DEMO_EMAIL, address: demoAddress, plan: 'pro' as const }
  const other = (name: string, email: string, city: string, region: string, postalCode: string) => ({
    userId: crypto.randomUUID(),
    customerName: name,
    customerEmail: email,
    plan: 'starter' as const,
    address: { name, line1: '12 Example Ave', city, region, postalCode, country: 'United States' },
  })

  const seeds: SeedOrder[] = [
    { ...base, number: 10421, file: 'twisted-tower.stl', status: 'delivered', hoursAgo: 24 * 18, shipping: 'standard',
      config: { materialId: 'pla', colorId: 'teal', quality: 'standard', infill: 0.2, finish: 'raw', quantity: 1 } },
    { ...base, number: 10427, file: 'spur-gear.stl', status: 'shipped', hoursAgo: 24 * 6, shipping: 'standard',
      config: { materialId: 'petg', colorId: 'black', quality: 'standard', infill: 0.5, finish: 'raw', quantity: 10 },
      notes: 'Please keep bore tolerance tight, it press-fits onto a 10 mm shaft.' },
    { ...other('Maya Chen', 'maya@example.com', 'Austin', 'TX', '78701'), number: 10429, file: 'spur-gear.stl',
      status: 'quality_check', hoursAgo: 24 * 4, shipping: 'express',
      config: { materialId: 'pa12', colorId: 'natural', quality: 'standard', infill: 1, finish: 'raw', quantity: 25 } },
    { ...base, number: 10431, file: 'ring.stl', status: 'in_production', hoursAgo: 50, shipping: 'express',
      config: { materialId: 'silver', colorId: 'silver', quality: 'fine', infill: 1, finish: 'polished', quantity: 1 } },
    { ...other('Diego Alvarez', 'diego@example.com', 'Portland', 'OR', '97205'), number: 10432, file: 'twisted-tower.stl',
      status: 'pending_review', hoursAgo: 7, shipping: 'standard',
      config: { materialId: 'pla', colorId: 'orange', quality: 'fine', infill: 0.2, finish: 'painted', quantity: 2 } },
    { ...base, number: 10433, file: 'calibration-cube.stl', status: 'pending_review', hoursAgo: 3, shipping: 'standard',
      config: { materialId: 'resin', colorId: 'grey', quality: 'fine', infill: 1, finish: 'raw', quantity: 4 } },
  ]

  return {
    version: 1,
    users: [{ id: demoId, email: DEMO_EMAIL, salt, passwordHash }],
    profiles: [demo],
    orders: seeds.map((s) => buildOrder(s, now)),
    messages: [],
    orderSeq: 10433,
  }
}
