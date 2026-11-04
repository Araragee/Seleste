/**
 * Minimal, dependency-free STL reader.
 *
 * Supports binary and ASCII STL. Returns a flat Float32Array of vertex
 * positions (9 floats per triangle) that can be fed straight into a
 * three.js BufferGeometry, plus helpers to measure the mesh.
 */

export const MAX_STL_BYTES = 50 * 1024 * 1024

export type Units = 'mm' | 'cm' | 'in'

export const UNIT_SCALE: Record<Units, number> = { mm: 1, cm: 10, in: 25.4 }

export interface MeshMetrics {
  triangles: number
  /** Enclosed volume in mm³. */
  volumeMm3: number
  /** Total surface area in mm². */
  surfaceAreaMm2: number
  /** Axis-aligned bounding box size in mm. */
  bbox: { x: number; y: number; z: number }
}

export class StlParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StlParseError'
  }
}

function isBinary(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 84) return false
  const view = new DataView(buffer)
  const count = view.getUint32(80, true)
  // A binary STL is exactly header + count + 50 bytes per facet. Some
  // exporters pad the end, so allow a little slack.
  const expected = 84 + count * 50
  return expected === buffer.byteLength || (expected < buffer.byteLength && buffer.byteLength - expected < 64 && count > 0)
}

function parseBinary(buffer: ArrayBuffer): Float32Array {
  const view = new DataView(buffer)
  const count = view.getUint32(80, true)
  const out = new Float32Array(count * 9)
  let offset = 84
  for (let i = 0; i < count; i++) {
    offset += 12 // skip normal
    for (let v = 0; v < 9; v++) {
      out[i * 9 + v] = view.getFloat32(offset, true)
      offset += 4
    }
    offset += 2 // attribute byte count
  }
  return out
}

function parseAscii(buffer: ArrayBuffer): Float32Array {
  const text = new TextDecoder().decode(buffer)
  if (!/^\s*solid/i.test(text) || !/facet/i.test(text)) {
    throw new StlParseError('This does not look like an STL file.')
  }
  const re = /vertex\s+([-+]?[\d.]+(?:e[-+]?\d+)?)\s+([-+]?[\d.]+(?:e[-+]?\d+)?)\s+([-+]?[\d.]+(?:e[-+]?\d+)?)/gi
  const values: number[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    values.push(Number(m[1]), Number(m[2]), Number(m[3]))
  }
  if (values.length % 9 !== 0) {
    throw new StlParseError('The STL file has an incomplete triangle.')
  }
  return new Float32Array(values)
}

/** Parse an STL file into a flat list of triangle vertex positions. */
export function parseSTL(buffer: ArrayBuffer): Float32Array {
  if (buffer.byteLength > MAX_STL_BYTES) {
    throw new StlParseError('Files are limited to 50 MB.')
  }
  const positions = isBinary(buffer) ? parseBinary(buffer) : parseAscii(buffer)
  if (positions.length === 0) {
    throw new StlParseError('The STL file contains no triangles.')
  }
  for (let i = 0; i < positions.length; i++) {
    if (!Number.isFinite(positions[i])) {
      throw new StlParseError('The STL file contains invalid coordinates.')
    }
  }
  return positions
}

/**
 * Measure a triangle soup. Volume uses the divergence theorem (sum of signed
 * tetrahedra against the origin), so it's exact for closed meshes regardless
 * of where the part sits in space.
 */
export function computeMetrics(positions: Float32Array, units: Units = 'mm'): MeshMetrics {
  const s = UNIT_SCALE[units]
  let volume = 0
  let area = 0
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity

  for (let i = 0; i < positions.length; i += 9) {
    const ax = positions[i] * s, ay = positions[i + 1] * s, az = positions[i + 2] * s
    const bx = positions[i + 3] * s, by = positions[i + 4] * s, bz = positions[i + 5] * s
    const cx = positions[i + 6] * s, cy = positions[i + 7] * s, cz = positions[i + 8] * s

    volume += (ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)) / 6

    const ux = bx - ax, uy = by - ay, uz = bz - az
    const vx = cx - ax, vy = cy - ay, vz = cz - az
    const nx = uy * vz - uz * vy
    const ny = uz * vx - ux * vz
    const nz = ux * vy - uy * vx
    area += Math.sqrt(nx * nx + ny * ny + nz * nz) / 2

    minX = Math.min(minX, ax, bx, cx); maxX = Math.max(maxX, ax, bx, cx)
    minY = Math.min(minY, ay, by, cy); maxY = Math.max(maxY, ay, by, cy)
    minZ = Math.min(minZ, az, bz, cz); maxZ = Math.max(maxZ, az, bz, cz)
  }

  return {
    triangles: positions.length / 9,
    volumeMm3: Math.abs(volume),
    surfaceAreaMm2: area,
    bbox: { x: maxX - minX, y: maxY - minY, z: maxZ - minZ },
  }
}

/** Write a binary STL. Used by tests and the sample generator. */
export function writeBinarySTL(positions: Float32Array): ArrayBuffer {
  const count = positions.length / 9
  const buffer = new ArrayBuffer(84 + count * 50)
  const view = new DataView(buffer)
  view.setUint32(80, count, true)
  let offset = 84
  for (let i = 0; i < count; i++) {
    offset += 12
    for (let v = 0; v < 9; v++) {
      view.setFloat32(offset, positions[i * 9 + v], true)
      offset += 4
    }
    offset += 2
  }
  return buffer
}
