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
  cancelled: 'Cancelled before printing. No charge.',
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
  const steps: OrderStatus[] = seed.status === 'cancelled' ? ['pending_review', 'cancelled'] : STATUS_FLOW.slice(0, STATUS_FLOW.indexOf(seed.status) + 1)
  // Old orders finished within their lead time rather than "just now".
  const elapsed = Math.min(seed.hoursAgo, steps.length * 30) * 3600_000
  const span = elapsed / Math.max(1, steps.length)
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
  const customer = (name: string, email: string, city: string, region: string, postalCode: string, plan: Profile['plan'] = 'starter') => ({
    userId: crypto.randomUUID(),
    customerName: name,
    customerEmail: email,
    plan,
    address: { name, line1: '12 Example Ave', city, region, postalCode, country: 'United States' },
  })
  const maya = customer('Maya Chen', 'maya@example.com', 'Austin', 'TX', '78701', 'business')
  const diego = customer('Diego Alvarez', 'diego@example.com', 'Portland', 'OR', '97205')
  const priya = customer('Priya Nair', 'priya@example.com', 'Seattle', 'WA', '98101', 'pro')
  const tom = customer('Tom Becker', 'tom@example.com', 'Denver', 'CO', '80202', 'pro')
  const lena = customer('Lena Fischer', 'lena@example.com', 'Boston', 'MA', '02108')

  type Cfg = SeedOrder['config']
  const cfg = (materialId: string, colorId: string, quantity: number, rest: Partial<Cfg> = {}): Cfg => ({
    materialId, colorId, quantity, quality: 'standard', infill: 1, finish: 'raw', ...rest,
  })
  const row = (
    who: Pick<SeedOrder, 'userId' | 'customerName' | 'customerEmail' | 'plan' | 'address'>, number: number, file: string, status: OrderStatus, daysAgo: number, config: Cfg,
    extra: Partial<SeedOrder> = {},
  ): SeedOrder => ({ ...who, number, file: `${file}.stl`, status, hoursAgo: daysAgo * 24, shipping: 'standard', config, ...extra })

  // Six months of history so charts and tables have something to show.
  const seeds: SeedOrder[] = [
    row(base, 10184, 'twisted-tower', 'delivered', 165, cfg('pla', 'white', 2, { infill: 0.2 })),
    row(base, 10203, 'spur-gear', 'delivered', 148, cfg('petg', 'black', 20, { infill: 0.5 })),
    row(maya, 10215, 'calibration-cube', 'delivered', 140, cfg('resin', 'grey', 6, { quality: 'fine' })),
    row(base, 10238, 'ring', 'delivered', 121, cfg('silver', 'silver', 2, { quality: 'fine', finish: 'polished' }), { shipping: 'express' }),
    row(tom, 10251, 'spur-gear', 'delivered', 112, cfg('pa12', 'natural', 40)),
    row(base, 10266, 'twisted-tower', 'delivered', 97, cfg('pla', 'blue', 3, { quality: 'fine', infill: 0.2, finish: 'sanded' })),
    row(lena, 10279, 'ring', 'delivered', 90, cfg('silver', 'silver', 1, { quality: 'fine', finish: 'polished' }), { shipping: 'express' }),
    row(base, 10294, 'spur-gear', 'delivered', 76, cfg('pa12', 'black', 30)),
    row(priya, 10310, 'twisted-tower', 'cancelled', 70, cfg('pla', 'red', 1, { infill: 0.2 })),
    row(base, 10322, 'calibration-cube', 'delivered', 61, cfg('alsi10mg', 'aluminum', 4)),
    row(base, 10347, 'spur-gear', 'delivered', 47, cfg('petg', 'clear', 15, { infill: 0.5 }), { shipping: 'express' }),
    row(diego, 10361, 'calibration-cube', 'delivered', 44, cfg('pla', 'orange', 10, { quality: 'draft', infill: 0.2 })),
    row(base, 10378, 'twisted-tower', 'delivered', 33, cfg('resin', 'white', 2, { quality: 'fine', finish: 'primed' })),
    row(tom, 10396, 'spur-gear', 'delivered', 26, cfg('pa12', 'natural', 50)),
    row(base, 10408, 'calibration-cube', 'cancelled', 22, cfg('pla', 'black', 8, { infill: 0.2 })),
    row(base, 10421, 'twisted-tower', 'delivered', 18, cfg('pla', 'teal', 1, { infill: 0.2 })),
    row(base, 10427, 'spur-gear', 'shipped', 6, cfg('petg', 'black', 10, { infill: 0.5 }), {
      notes: 'Please keep bore tolerance tight, it press-fits onto a 10 mm shaft.',
    }),
    row(priya, 10428, 'twisted-tower', 'shipped', 5, cfg('pla', 'white', 4, { infill: 0.2, finish: 'painted' })),
    row(maya, 10429, 'spur-gear', 'quality_check', 4, cfg('pa12', 'natural', 25), { shipping: 'express' }),
    row(lena, 10430, 'ring', 'in_production', 2.5, cfg('silver', 'silver', 2, { quality: 'fine', finish: 'polished' })),
    row(base, 10431, 'ring', 'in_production', 2.1, cfg('silver', 'silver', 1, { quality: 'fine', finish: 'polished' }), { shipping: 'express' }),
    row(diego, 10432, 'twisted-tower', 'pending_review', 0.3, cfg('pla', 'orange', 2, { quality: 'fine', infill: 0.2, finish: 'painted' })),
    row(base, 10433, 'calibration-cube', 'pending_review', 0.125, cfg('resin', 'grey', 4, { quality: 'fine' })),
  ]

  return {
    version: 2,
    users: [{ id: demoId, email: DEMO_EMAIL, salt, passwordHash }],
    profiles: [demo],
    orders: seeds.map((s) => buildOrder(s, now)),
    messages: [],
    orderSeq: 10433,
  }
}
