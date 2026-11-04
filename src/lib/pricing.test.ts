import { describe, expect, it } from 'vitest'
import { MATERIALS } from './catalog'
import { calculatePrice, defaultConfig, effectiveVolumeCm3, normalizeConfig, quantityDiscount, validateQuote } from './pricing'
import { computeMetrics } from './stl'
import { boxPositions } from '../test/fixtures'

const cube = computeMetrics(boxPositions(40, 40, 40)) // 64 cm³

describe('effectiveVolumeCm3', () => {
  it('uses full volume for solid processes', () => {
    expect(effectiveVolumeCm3(cube, 0.2, false)).toBeCloseTo(64)
  })

  it('scales with infill for FDM', () => {
    const sparse = effectiveVolumeCm3(cube, 0.2, true)
    const dense = effectiveVolumeCm3(cube, 0.8, true)
    expect(sparse).toBeLessThan(dense)
    expect(dense).toBeLessThanOrEqual(64)
    expect(effectiveVolumeCm3(cube, 1, true)).toBeCloseTo(64)
  })
})

describe('quantityDiscount', () => {
  it.each([
    [1, 0],
    [4, 0],
    [5, 0.05],
    [10, 0.1],
    [49, 0.15],
    [50, 0.2],
    [500, 0.2],
  ])('%i parts → %f', (qty, expected) => {
    expect(quantityDiscount(qty)).toBe(expected)
  })
})

describe('calculatePrice', () => {
  it('produces a consistent breakdown in integer cents', () => {
    const p = calculatePrice(cube, { ...defaultConfig('pla'), quantity: 3 })
    for (const v of [p.unitCents, p.subtotalCents, p.totalCents, p.shippingCents]) expect(Number.isInteger(v)).toBe(true)
    expect(p.subtotalCents).toBe(p.unitCents * 3)
    expect(p.totalCents).toBe(p.subtotalCents - p.quantityDiscountCents - p.planDiscountCents + p.setupCents + p.shippingCents)
  })

  it('applies the material minimum price', () => {
    const tiny = computeMetrics(boxPositions(2, 2, 2))
    const p = calculatePrice(tiny, defaultConfig('alsi10mg'))
    expect(p.unitCents).toBe(8500)
  })

  it('charges more for fine quality, finishing and metal', () => {
    const base = calculatePrice(cube, defaultConfig('pla')).unitCents
    expect(calculatePrice(cube, { ...defaultConfig('pla'), quality: 'fine' }).unitCents).toBeGreaterThan(base)
    expect(calculatePrice(cube, { ...defaultConfig('pla'), finish: 'painted' }).unitCents).toBeGreaterThan(base)
    expect(calculatePrice(cube, defaultConfig('alsi10mg')).unitCents).toBeGreaterThan(base * 5)
  })

  it('applies plan discounts and free shipping', () => {
    const config = defaultConfig('pla')
    const starter = calculatePrice(cube, config, 'starter')
    const pro = calculatePrice(cube, config, 'pro')
    expect(starter.planDiscountCents).toBe(0)
    expect(pro.planDiscountCents).toBe(Math.round(pro.subtotalCents * 0.1))
    expect(starter.shippingCents).toBe(699)
    expect(pro.shippingCents).toBe(0)
    expect(pro.leadTimeDays).toBeLessThan(starter.leadTimeDays)
  })

  it('gives free standard shipping over $75 and always charges express', () => {
    const big = calculatePrice(cube, { ...defaultConfig('pla'), quantity: 20 })
    expect(big.shippingCents).toBe(0)
    expect(calculatePrice(cube, { ...defaultConfig('pla'), quantity: 20 }, 'pro', 'express').shippingCents).toBe(2499)
  })

  it('computes part weight from density', () => {
    const p = calculatePrice(cube, defaultConfig('resin'))
    expect(p.weightGrams).toBeCloseTo(64 * 1.18, 1)
  })
})

describe('validateQuote', () => {
  it('accepts a normal part', () => {
    expect(validateQuote(cube, defaultConfig('pla'))).toEqual([])
  })

  it('rejects parts larger than the build volume, allowing rotation', () => {
    const long = computeMetrics(boxPositions(20, 20, 170))
    // 170 mm tall fits resin's 175 mm Z, any orientation.
    expect(validateQuote(long, defaultConfig('resin')).filter((i) => i.level === 'error')).toEqual([])
    const tooLong = computeMetrics(boxPositions(20, 160, 170))
    expect(validateQuote(tooLong, defaultConfig('resin'))[0].message).toMatch(/too large/)
  })

  it('warns about features thinner than the material minimum', () => {
    const sheet = computeMetrics(boxPositions(30, 30, 0.2))
    expect(validateQuote(sheet, defaultConfig('pla')).some((i) => i.level === 'warning')).toBe(true)
  })

  it('rejects options the material does not offer', () => {
    const issues = validateQuote(cube, { ...defaultConfig('pa12'), quality: 'fine', finish: 'polished' })
    expect(issues.filter((i) => i.level === 'error')).toHaveLength(2)
  })
})

describe('normalizeConfig', () => {
  it('snaps every material to valid options', () => {
    for (const m of MATERIALS) {
      const config = normalizeConfig({ ...defaultConfig('pla'), finish: 'painted', quality: 'draft', colorId: 'red', materialId: m.id })
      expect(validateQuote(cube, config).filter((i) => i.level === 'error' && !/too large/.test(i.message))).toEqual([])
    }
  })
})
