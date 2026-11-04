import {
  FINISHES,
  PLANS,
  QUALITIES,
  QUANTITY_BREAKS,
  SETUP_FEE,
  SHIPPING,
  getMaterial,
  type FinishId,
  type PlanId,
  type QualityId,
  type ShippingMethod,
} from './catalog'
import type { MeshMetrics, Units } from './stl'

export interface QuoteConfig {
  materialId: string
  colorId: string
  quality: QualityId
  /** 0.1 – 1.0, only used by FDM materials. */
  infill: number
  finish: FinishId
  quantity: number
  units: Units
}

export interface PriceBreakdown {
  /** All money values are in USD cents. */
  materialCents: number
  machineCents: number
  finishCents: number
  unitCents: number
  subtotalCents: number
  quantityDiscountCents: number
  planDiscountCents: number
  setupCents: number
  shippingCents: number
  totalCents: number
  /** Material weight per part, grams. */
  weightGrams: number
  /** Machine time per part, hours. */
  printHours: number
  leadTimeDays: number
}

export interface QuoteIssue {
  level: 'error' | 'warning'
  message: string
}

const SHELL_THICKNESS_CM = 0.12
const SUPPORT_FACTOR: Record<string, number> = { FDM: 1.12, SLA: 1.15, SLS: 1, DMLS: 1.2, CAST: 1.1 }
const MACHINES_PER_MATERIAL = 4

const cents = (usd: number) => Math.round(usd * 100)

export function quantityDiscount(quantity: number): number {
  return QUANTITY_BREAKS.find((b) => quantity >= b.min)?.discount ?? 0
}

/** Material volume that actually gets printed, accounting for infill on FDM parts. */
export function effectiveVolumeCm3(metrics: MeshMetrics, infill: number, supportsInfill: boolean): number {
  const volume = metrics.volumeMm3 / 1000
  if (!supportsInfill || volume === 0) return volume
  const area = metrics.surfaceAreaMm2 / 100
  const shellRatio = Math.min(1, Math.max(0.15, (area * SHELL_THICKNESS_CM) / volume))
  const fill = Math.min(1, Math.max(0.1, infill))
  return volume * (shellRatio + (1 - shellRatio) * fill)
}

export function validateQuote(metrics: MeshMetrics, config: QuoteConfig): QuoteIssue[] {
  const material = getMaterial(config.materialId)
  const issues: QuoteIssue[] = []
  const dims = [metrics.bbox.x, metrics.bbox.y, metrics.bbox.z].sort((a, b) => b - a)
  const build = [...material.buildVolume].sort((a, b) => b - a)
  if (dims.some((d, i) => d > build[i])) {
    issues.push({
      level: 'error',
      message: `Part is too large for ${material.name} (max ${material.buildVolume.join(' × ')} mm). Try another material or check the units.`,
    })
  }
  if (dims[2] < material.minFeature) {
    issues.push({
      level: 'warning',
      message: `Thinnest dimension is ${dims[2].toFixed(2)} mm — below the ${material.minFeature} mm minimum for ${material.name}. Did you export in the right units?`,
    })
  }
  if (metrics.volumeMm3 < 1) {
    issues.push({ level: 'error', message: 'The model has no measurable volume. Make sure it is a closed, watertight mesh.' })
  }
  if (!material.qualities.includes(config.quality)) {
    issues.push({ level: 'error', message: `${QUALITIES[config.quality].name} quality is not available for ${material.name}.` })
  }
  if (!material.finishes.includes(config.finish)) {
    issues.push({ level: 'error', message: `${FINISHES[config.finish].name} finish is not available for ${material.name}.` })
  }
  if (!material.colors.some((c) => c.id === config.colorId)) {
    issues.push({ level: 'error', message: 'Pick a color for this material.' })
  }
  if (!Number.isInteger(config.quantity) || config.quantity < 1 || config.quantity > 1000) {
    issues.push({ level: 'error', message: 'Quantity must be between 1 and 1000.' })
  }
  return issues
}

export function calculatePrice(
  metrics: MeshMetrics,
  config: QuoteConfig,
  plan: PlanId = 'starter',
  shipping: ShippingMethod = 'standard',
): PriceBreakdown {
  const material = getMaterial(config.materialId)
  const quality = QUALITIES[config.quality]
  const finish = FINISHES[config.finish]
  const planInfo = PLANS[plan]
  const quantity = Math.max(1, Math.floor(config.quantity))
  const support = SUPPORT_FACTOR[material.process] ?? 1

  const printedVolume = effectiveVolumeCm3(metrics, config.infill, material.supportsInfill) * support
  const printHours = (printedVolume / material.buildRate) * quality.timeMultiplier
  const areaCm2 = metrics.surfaceAreaMm2 / 100

  const materialUsd = printedVolume * material.pricePerCm3
  const machineUsd = printHours * material.machineRate
  const finishUsd = finish.flat + finish.perCm2 * areaCm2
  const unitUsd = Math.max(material.minUnitPrice, materialUsd + machineUsd + finishUsd)

  const unitCents = cents(unitUsd)
  const subtotalCents = unitCents * quantity
  const quantityDiscountCents = Math.round(subtotalCents * quantityDiscount(quantity))
  const afterQuantity = subtotalCents - quantityDiscountCents
  const planDiscountCents = Math.round(afterQuantity * planInfo.discount)
  const setupCents = cents(SETUP_FEE)
  const merchandise = afterQuantity - planDiscountCents

  const ship = SHIPPING[shipping]
  const freeShipping = shipping === 'standard' && (planInfo.freeShipping || merchandise >= cents(ship.freeOver))
  const shippingCents = freeShipping ? 0 : cents(ship.price)

  const productionDays = Math.ceil((printHours * quantity) / (24 * MACHINES_PER_MATERIAL))
  const leadTimeDays = Math.max(
    1,
    material.baseLeadDays + quality.extraDays + finish.extraDays + Math.max(0, productionDays - 1) - planInfo.leadTimeReduction,
  ) + ship.days

  return {
    materialCents: cents(materialUsd),
    machineCents: cents(machineUsd),
    finishCents: cents(finishUsd),
    unitCents,
    subtotalCents,
    quantityDiscountCents,
    planDiscountCents,
    setupCents,
    shippingCents,
    totalCents: merchandise + setupCents + shippingCents,
    weightGrams: (printedVolume / support) * material.density,
    printHours,
    leadTimeDays,
  }
}

export function defaultConfig(materialId = 'pla'): QuoteConfig {
  const material = getMaterial(materialId)
  return {
    materialId,
    colorId: material.colors[0].id,
    quality: material.qualities.includes('standard') ? 'standard' : material.qualities[0],
    infill: 0.2,
    finish: 'raw',
    quantity: 1,
    units: 'mm',
  }
}

/** Snap a config to options valid for its material (used when switching materials). */
export function normalizeConfig(config: QuoteConfig): QuoteConfig {
  const material = getMaterial(config.materialId)
  return {
    ...config,
    colorId: material.colors.some((c) => c.id === config.colorId) ? config.colorId : material.colors[0].id,
    quality: material.qualities.includes(config.quality)
      ? config.quality
      : material.qualities.includes('standard')
        ? 'standard'
        : material.qualities[0],
    finish: material.finishes.includes(config.finish) ? config.finish : 'raw',
  }
}
