import { asset } from './asset'

export type ProcessId = 'FDM' | 'SLA' | 'SLS' | 'DMLS' | 'CAST'
export type QualityId = 'draft' | 'standard' | 'fine'
export type FinishId = 'raw' | 'sanded' | 'primed' | 'painted' | 'polished'
export type PlanId = 'starter' | 'pro' | 'business'
export type ShippingMethod = 'standard' | 'express'

export interface Color {
  id: string
  name: string
  hex: string
}

export interface Material {
  id: string
  name: string
  process: ProcessId
  tagline: string
  description: string
  image?: string
  /** g/cm³ */
  density: number
  /** Raw material cost incl. waste, USD per cm³. */
  pricePerCm3: number
  /** Machine time cost, USD per hour. */
  machineRate: number
  /** Deposition / build rate at standard quality, cm³ per hour. */
  buildRate: number
  /** Minimum price per part, USD. */
  minUnitPrice: number
  /** Max part size in mm (any orientation). */
  buildVolume: [number, number, number]
  /** Smallest recommended feature in mm. */
  minFeature: number
  baseLeadDays: number
  qualities: QualityId[]
  finishes: FinishId[]
  supportsInfill: boolean
  colors: Color[]
  /** 1–5 scores for the comparison table. */
  scores: { strength: number; detail: number; flexibility: number; heat: number }
}

const BASIC_COLORS: Color[] = [
  { id: 'white', name: 'White', hex: '#f4f4f5' },
  { id: 'black', name: 'Black', hex: '#27272a' },
  { id: 'red', name: 'Signal Red', hex: '#dd1d26' },
  { id: 'teal', name: 'Teal', hex: '#11b196' },
  { id: 'blue', name: 'Cobalt', hex: '#2563eb' },
  { id: 'orange', name: 'Orange', hex: '#f97316' },
]

export const MATERIALS: Material[] = [
  {
    id: 'pla',
    name: 'PLA',
    process: 'FDM',
    tagline: 'Fast, affordable prototypes',
    description: 'The go-to plastic for concept models and fit checks. Rigid, crisp and available in many colors.',
    image: asset('img/material-pla.png'),
    density: 1.24,
    pricePerCm3: 0.07,
    machineRate: 4,
    buildRate: 14,
    minUnitPrice: 4,
    buildVolume: [300, 300, 300],
    minFeature: 0.8,
    baseLeadDays: 2,
    qualities: ['draft', 'standard', 'fine'],
    finishes: ['raw', 'sanded', 'primed', 'painted'],
    supportsInfill: true,
    colors: BASIC_COLORS,
    scores: { strength: 2, detail: 3, flexibility: 1, heat: 1 },
  },
  {
    id: 'petg',
    name: 'PETG',
    process: 'FDM',
    tagline: 'Tough functional parts',
    description: 'Impact resistant and food-contact friendly. Good for brackets, enclosures and outdoor use.',
    density: 1.27,
    pricePerCm3: 0.09,
    machineRate: 4.5,
    buildRate: 11,
    minUnitPrice: 5,
    buildVolume: [300, 300, 300],
    minFeature: 0.8,
    baseLeadDays: 3,
    qualities: ['draft', 'standard', 'fine'],
    finishes: ['raw', 'sanded'],
    supportsInfill: true,
    colors: [BASIC_COLORS[0], BASIC_COLORS[1], { id: 'clear', name: 'Clear', hex: '#d4e7f0' }, BASIC_COLORS[4]],
    scores: { strength: 3, detail: 3, flexibility: 2, heat: 2 },
  },
  {
    id: 'tpu',
    name: 'TPU 95A',
    process: 'FDM',
    tagline: 'Flexible, rubber-like',
    description: 'Shore 95A elastomer for gaskets, grips, phone cases and lattice cushioning.',
    image: asset('img/material-tpu.jpg'),
    density: 1.21,
    pricePerCm3: 0.16,
    machineRate: 5,
    buildRate: 6,
    minUnitPrice: 8,
    buildVolume: [250, 250, 250],
    minFeature: 1.2,
    baseLeadDays: 4,
    qualities: ['standard', 'fine'],
    finishes: ['raw'],
    supportsInfill: true,
    colors: [BASIC_COLORS[1], BASIC_COLORS[0], BASIC_COLORS[2]],
    scores: { strength: 3, detail: 2, flexibility: 5, heat: 2 },
  },
  {
    id: 'resin',
    name: 'Standard Resin',
    process: 'SLA',
    tagline: 'Smooth, high-detail surfaces',
    description: 'Stereolithography with 50 µm layers. Ideal for miniatures, dental models and visual prototypes.',
    image: asset('img/material-resin.jpg'),
    density: 1.18,
    pricePerCm3: 0.22,
    machineRate: 6,
    buildRate: 18,
    minUnitPrice: 9,
    buildVolume: [145, 145, 175],
    minFeature: 0.3,
    baseLeadDays: 3,
    qualities: ['standard', 'fine'],
    finishes: ['raw', 'sanded', 'primed', 'painted'],
    supportsInfill: false,
    colors: [{ id: 'grey', name: 'Grey', hex: '#9ca3af' }, { id: 'clear', name: 'Clear', hex: '#e0f2fe' }, BASIC_COLORS[0], BASIC_COLORS[1]],
    scores: { strength: 2, detail: 5, flexibility: 1, heat: 2 },
  },
  {
    id: 'pa12',
    name: 'Nylon PA12',
    process: 'SLS',
    tagline: 'Production-grade, no supports',
    description: 'Selective laser sintering for durable end-use parts with complex internal geometry.',
    density: 1.01,
    pricePerCm3: 0.28,
    machineRate: 7,
    buildRate: 30,
    minUnitPrice: 12,
    buildVolume: [340, 340, 600],
    minFeature: 0.7,
    baseLeadDays: 5,
    qualities: ['standard'],
    finishes: ['raw', 'sanded', 'painted'],
    supportsInfill: false,
    colors: [{ id: 'natural', name: 'Natural White', hex: '#ece9e2' }, BASIC_COLORS[1]],
    scores: { strength: 4, detail: 4, flexibility: 3, heat: 3 },
  },
  {
    id: 'alsi10mg',
    name: 'Aluminum AlSi10Mg',
    process: 'DMLS',
    tagline: 'Lightweight metal parts',
    description: 'Direct metal laser sintering for strong, light, heat-resistant components.',
    image: asset('img/material-metal.jpg'),
    density: 2.67,
    pricePerCm3: 1.9,
    machineRate: 38,
    buildRate: 12,
    minUnitPrice: 85,
    buildVolume: [250, 250, 300],
    minFeature: 0.6,
    baseLeadDays: 8,
    qualities: ['standard'],
    finishes: ['raw', 'sanded', 'polished'],
    supportsInfill: false,
    colors: [{ id: 'aluminum', name: 'Bare Aluminum', hex: '#b8bcc2' }],
    scores: { strength: 5, detail: 4, flexibility: 1, heat: 5 },
  },
  {
    id: 'silver',
    name: 'Sterling Silver 925',
    process: 'CAST',
    tagline: 'Jewelry & fine detail',
    description: 'Printed in castable wax, then investment-cast in sterling silver. Hand finished.',
    image: asset('img/material-silver.jpg'),
    density: 10.36,
    pricePerCm3: 9.5,
    machineRate: 20,
    buildRate: 4,
    minUnitPrice: 45,
    buildVolume: [100, 100, 100],
    minFeature: 0.4,
    baseLeadDays: 10,
    qualities: ['standard', 'fine'],
    finishes: ['raw', 'polished'],
    supportsInfill: false,
    colors: [{ id: 'silver', name: 'Silver', hex: '#d7d7db' }],
    scores: { strength: 4, detail: 5, flexibility: 1, heat: 4 },
  },
]

export interface Quality {
  id: QualityId
  name: string
  layer: string
  timeMultiplier: number
  extraDays: number
}

export const QUALITIES: Record<QualityId, Quality> = {
  draft: { id: 'draft', name: 'Draft', layer: '0.3 mm layers', timeMultiplier: 0.7, extraDays: 0 },
  standard: { id: 'standard', name: 'Standard', layer: '0.2 mm layers', timeMultiplier: 1, extraDays: 0 },
  fine: { id: 'fine', name: 'Fine', layer: '0.1 mm layers', timeMultiplier: 1.8, extraDays: 1 },
}

export interface Finish {
  id: FinishId
  name: string
  description: string
  /** Flat fee per part, USD. */
  flat: number
  /** USD per cm² of surface. */
  perCm2: number
  extraDays: number
}

export const FINISHES: Record<FinishId, Finish> = {
  raw: { id: 'raw', name: 'As printed', description: 'Supports removed, no further finishing.', flat: 0, perCm2: 0, extraDays: 0 },
  sanded: { id: 'sanded', name: 'Sanded', description: 'Layer lines smoothed by hand.', flat: 2, perCm2: 0.02, extraDays: 1 },
  primed: { id: 'primed', name: 'Primed', description: 'Sanded and coated with grey primer, ready to paint.', flat: 4, perCm2: 0.05, extraDays: 1 },
  painted: { id: 'painted', name: 'Painted', description: 'Sanded, primed and spray painted in your color.', flat: 8, perCm2: 0.12, extraDays: 2 },
  polished: { id: 'polished', name: 'Polished', description: 'Mirror polish for metal parts.', flat: 10, perCm2: 0.15, extraDays: 2 },
}

export interface Plan {
  id: PlanId
  name: string
  monthly: number
  discount: number
  leadTimeReduction: number
  freeShipping: boolean
  blurb: string
  features: string[]
}

export const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    monthly: 0,
    discount: 0,
    leadTimeReduction: 0,
    freeShipping: false,
    blurb: 'For makers ordering the occasional part.',
    features: ['Instant quotes for every material', 'Order tracking dashboard', 'Free standard shipping over $75', 'Email support'],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthly: 29,
    discount: 0.1,
    leadTimeReduction: 1,
    freeShipping: true,
    blurb: 'For engineers iterating every week.',
    features: ['10% off every order', 'Priority queue — 1 day faster', 'Free standard shipping on all orders', 'Design-for-print review'],
  },
  business: {
    id: 'business',
    name: 'Business',
    monthly: 99,
    discount: 0.15,
    leadTimeReduction: 2,
    freeShipping: true,
    blurb: 'For teams running production volumes.',
    features: ['15% off every order', 'Fastest queue — 2 days faster', 'Free standard shipping on all orders', 'Dedicated production manager'],
  },
}

export const SHIPPING = {
  standard: { id: 'standard' as const, name: 'Standard', price: 6.99, freeOver: 75, days: 4 },
  express: { id: 'express' as const, name: 'Express', price: 24.99, freeOver: Infinity, days: 1 },
}

export const SETUP_FEE = 4

export const QUANTITY_BREAKS: { min: number; discount: number }[] = [
  { min: 50, discount: 0.2 },
  { min: 25, discount: 0.15 },
  { min: 10, discount: 0.1 },
  { min: 5, discount: 0.05 },
]

export function getMaterial(id: string): Material {
  const m = MATERIALS.find((x) => x.id === id)
  if (!m) throw new Error(`Unknown material: ${id}`)
  return m
}
