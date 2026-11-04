import { describe, expect, it } from 'vitest'
import { computeMetrics, parseSTL, StlParseError, writeBinarySTL } from './stl'
import { asciiSTL, boxPositions } from '../test/fixtures'

describe('parseSTL', () => {
  it('reads binary STL', () => {
    const positions = boxPositions(10, 20, 30)
    const parsed = parseSTL(writeBinarySTL(positions))
    expect(parsed).toHaveLength(12 * 9)
    expect(Array.from(parsed)).toEqual(Array.from(positions))
  })

  it('reads ASCII STL, including scientific notation', () => {
    const text = asciiSTL(boxPositions(10, 10, 10)).replace('vertex 10 ', 'vertex 1e1 ')
    const parsed = parseSTL(new TextEncoder().encode(text).buffer)
    expect(parsed).toHaveLength(12 * 9)
    expect(computeMetrics(parsed).volumeMm3).toBeCloseTo(1000)
  })

  it('reads binary STL whose header starts with "solid"', () => {
    const buffer = writeBinarySTL(boxPositions(5, 5, 5))
    new Uint8Array(buffer).set(new TextEncoder().encode('solid exported-by-cad'))
    expect(parseSTL(buffer)).toHaveLength(12 * 9)
  })

  it('rejects non-STL data', () => {
    expect(() => parseSTL(new TextEncoder().encode('hello world').buffer)).toThrow(StlParseError)
  })

  it('rejects empty meshes', () => {
    expect(() => parseSTL(writeBinarySTL(new Float32Array()))).toThrow(/no triangles/)
  })
})

describe('computeMetrics', () => {
  it('measures a box', () => {
    const m = computeMetrics(boxPositions(10, 20, 30))
    expect(m.triangles).toBe(12)
    expect(m.volumeMm3).toBeCloseTo(6000)
    expect(m.surfaceAreaMm2).toBeCloseTo(2 * (10 * 20 + 20 * 30 + 10 * 30))
    expect(m.bbox).toEqual({ x: 10, y: 20, z: 30 })
  })

  it('is independent of position in space', () => {
    const m = computeMetrics(boxPositions(10, 10, 10, [500, -200, 75]))
    expect(m.volumeMm3).toBeCloseTo(1000, 1)
  })

  it('converts units', () => {
    const m = computeMetrics(boxPositions(1, 1, 1), 'in')
    expect(m.volumeMm3).toBeCloseTo(25.4 ** 3, 3)
    expect(m.bbox.x).toBeCloseTo(25.4)
  })
})
