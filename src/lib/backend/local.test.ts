// @vitest-environment node
import { beforeEach, describe, expect, it } from 'vitest'
import { defaultConfig } from '../pricing'
import { computeMetrics, writeBinarySTL } from '../stl'
import { boxPositions } from '../../test/fixtures'
import { createLocalBackend, DEMO_EMAIL, DEMO_PASSWORD, type FileStore } from './local'
import type { Address, Backend } from './types'

class MemoryStorage implements Storage {
  private map = new Map<string, string>()
  get length() {
    return this.map.size
  }
  clear() {
    this.map.clear()
  }
  getItem(k: string) {
    return this.map.get(k) ?? null
  }
  key(i: number) {
    return [...this.map.keys()][i] ?? null
  }
  removeItem(k: string) {
    this.map.delete(k)
  }
  setItem(k: string, v: string) {
    this.map.set(k, v)
  }
}

const memoryFiles = (): FileStore => {
  const m = new Map<string, ArrayBuffer>()
  return { get: async (k) => m.get(k), set: async (k, v) => void m.set(k, v) }
}

const address: Address = { name: 'Sam Doe', line1: '1 Main St', city: 'Boston', region: 'MA', postalCode: '02101', country: 'United States' }

function stlFile() {
  const positions = boxPositions(20, 20, 20)
  return { file: new File([writeBinarySTL(positions)], 'cube.stl'), metrics: computeMetrics(positions) }
}

let backend: Backend

beforeEach(() => {
  backend = createLocalBackend({ storage: new MemoryStorage(), files: memoryFiles(), latencyMs: 0 })
})

describe('local backend', () => {
  it('seeds a demo account that can sign in', async () => {
    const user = await backend.signIn(DEMO_EMAIL, DEMO_PASSWORD)
    expect(user.email).toBe(DEMO_EMAIL)
    const profile = await backend.getProfile()
    expect(profile.role).toBe('admin')
    expect((await backend.listOrders()).length).toBeGreaterThan(0)
  })

  it('rejects bad credentials and duplicate signups', async () => {
    await expect(backend.signIn(DEMO_EMAIL, 'wrong')).rejects.toThrow(/Invalid/)
    await expect(backend.signUp(DEMO_EMAIL, 'whatever1', 'X')).rejects.toThrow(/already exists/)
  })

  it('runs the full order lifecycle', async () => {
    await backend.signUp('new@example.com', 'secret123', 'New User')
    expect(await backend.listOrders()).toEqual([])
    await expect(backend.adminListOrders()).rejects.toThrow(/Admins only/)

    const { file, metrics } = stlFile()
    const order = await backend.createOrder({ file, metrics, config: defaultConfig('pla'), shippingMethod: 'standard', address, notes: '' })
    expect(order.status).toBe('pending_review')
    expect(order.number).toBe('SL-10434')
    expect(order.pricing.totalCents).toBeGreaterThan(0)
    expect(await backend.getModelFile(order)).toBeInstanceOf(ArrayBuffer)
    expect((await backend.getProfile()).address).toEqual(address)

    // Admin moves it through production.
    await backend.signOut()
    await backend.signIn(DEMO_EMAIL, DEMO_PASSWORD)
    await expect(backend.adminUpdateOrder(order.id, { status: 'shipped' })).rejects.toThrow(/Cannot move/)
    await backend.adminUpdateOrder(order.id, { status: 'in_production' })
    await backend.adminUpdateOrder(order.id, { status: 'quality_check' })
    await expect(backend.adminUpdateOrder(order.id, { status: 'shipped' })).rejects.toThrow(/tracking/)
    const shipped = await backend.adminUpdateOrder(order.id, { status: 'shipped', trackingNumber: 'TRACK1' })
    expect(shipped.trackingNumber).toBe('TRACK1')
    expect(shipped.events.map((e) => e.status)).toEqual(['pending_review', 'in_production', 'quality_check', 'shipped'])
  })

  it('only lets customers cancel orders in review, and only their own', async () => {
    await backend.signUp('a@example.com', 'secret123', 'A')
    const { file, metrics } = stlFile()
    const order = await backend.createOrder({ file, metrics, config: defaultConfig('pla'), shippingMethod: 'standard', address, notes: '' })

    await backend.signUp('b@example.com', 'secret123', 'B')
    await expect(backend.getOrder(order.id)).rejects.toThrow(/not found/)
    await expect(backend.cancelOrder(order.id)).rejects.toThrow(/not found/)

    await backend.signIn('a@example.com', 'secret123')
    const cancelled = await backend.cancelOrder(order.id)
    expect(cancelled.status).toBe('cancelled')
    await expect(backend.cancelOrder(order.id)).rejects.toThrow(/in review/)
  })

  it('prices orders with the customer plan, ignoring client input', async () => {
    await backend.signIn(DEMO_EMAIL, DEMO_PASSWORD) // demo is on Pro
    const { file, metrics } = stlFile()
    const order = await backend.createOrder({ file, metrics, config: defaultConfig('pla'), shippingMethod: 'standard', address, notes: '' })
    expect(order.pricing.planDiscountCents).toBeGreaterThan(0)
    expect(order.pricing.shippingCents).toBe(0)
  })

  it('rejects invalid quotes', async () => {
    await backend.signIn(DEMO_EMAIL, DEMO_PASSWORD)
    const { file, metrics } = stlFile()
    await expect(
      backend.createOrder({ file, metrics, config: { ...defaultConfig('pla'), quantity: 0 }, shippingMethod: 'standard', address, notes: '' }),
    ).rejects.toThrow(/Quantity/)
  })
})
