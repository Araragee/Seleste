// Generates the sample STL models in public/samples.
// Run with `npm run samples`. Units are millimetres.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'samples')
mkdirSync(outDir, { recursive: true })

const tri = []
const push = (a, b, c) => tri.push([a, b, c])
const quad = (a, b, c, d) => {
  push(a, b, c)
  push(a, c, d)
}

function signedVolume(tris) {
  let v = 0
  for (const [a, b, c] of tris) {
    v += (a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6
  }
  return v
}

function write(name, tris) {
  if (signedVolume(tris) < 0) tris = tris.map(([a, b, c]) => [a, c, b])
  const buf = Buffer.alloc(84 + tris.length * 50)
  buf.write(`Seleste sample: ${name}`.padEnd(80, ' '), 0, 'ascii')
  buf.writeUInt32LE(tris.length, 80)
  let o = 84
  for (const [a, b, c] of tris) {
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
    const w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]
    const len = Math.hypot(...n) || 1
    for (const x of [...n.map((x) => x / len), ...a, ...b, ...c]) {
      buf.writeFloatLE(x, o)
      o += 4
    }
    o += 2
  }
  writeFileSync(join(outDir, name), buf)
  console.log(`${name}: ${tris.length} triangles, ${(Math.abs(signedVolume(tris)) / 1000).toFixed(2)} cm³`)
}

/** Closed solid from a star-shaped profile p(i, layer) sampled n times per layer. */
function loft(n, layers, profile) {
  tri.length = 0
  const ring = (l) => Array.from({ length: n }, (_, i) => profile(i, l))
  const rings = Array.from({ length: layers + 1 }, (_, l) => ring(l))
  for (let l = 0; l < layers; l++) {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      quad(rings[l][i], rings[l][j], rings[l + 1][j], rings[l + 1][i])
    }
  }
  const bottomZ = rings[0][0][2]
  const topZ = rings[layers][0][2]
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    push([0, 0, bottomZ], rings[0][j], rings[0][i])
    push([0, 0, topZ], rings[layers][i], rings[layers][j])
  }
  return [...tri]
}

/** Closed solid with a through-hole: outer and inner profiles extruded to height h. */
function ringExtrude(n, h, outer, inner) {
  tri.length = 0
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const [ox0, oy0] = outer(i), [ox1, oy1] = outer(j)
    const [ix0, iy0] = inner(i), [ix1, iy1] = inner(j)
    quad([ox0, oy0, 0], [ox1, oy1, 0], [ox1, oy1, h], [ox0, oy0, h])
    quad([ix1, iy1, 0], [ix0, iy0, 0], [ix0, iy0, h], [ix1, iy1, h])
    quad([ox0, oy0, h], [ox1, oy1, h], [ix1, iy1, h], [ix0, iy0, h])
    quad([ox1, oy1, 0], [ox0, oy0, 0], [ix0, iy0, 0], [ix1, iy1, 0])
  }
  return [...tri]
}

// 1. Calibration cube, 20 mm.
{
  const s = 20
  const v = (x, y, z) => [x * s, y * s, z * s]
  tri.length = 0
  quad(v(0, 0, 0), v(0, 1, 0), v(1, 1, 0), v(1, 0, 0))
  quad(v(0, 0, 1), v(1, 0, 1), v(1, 1, 1), v(0, 1, 1))
  quad(v(0, 0, 0), v(1, 0, 0), v(1, 0, 1), v(0, 0, 1))
  quad(v(0, 1, 0), v(0, 1, 1), v(1, 1, 1), v(1, 1, 0))
  quad(v(0, 0, 0), v(0, 0, 1), v(0, 1, 1), v(0, 1, 0))
  quad(v(1, 0, 0), v(1, 1, 0), v(1, 1, 1), v(1, 0, 1))
  write('calibration-cube.stl', [...tri])
}

// 2. Spur gear: 24 teeth, 60 mm OD, 8 mm thick, 10 mm bore.
{
  const teeth = 24, perTooth = 8, n = teeth * perTooth
  const outer = (i) => {
    const t = i / n
    const a = t * Math.PI * 2
    const phase = (t * teeth) % 1
    const r = phase < 0.15 || phase >= 0.85 ? 26.5 : phase < 0.3 ? 26.5 + ((phase - 0.15) / 0.15) * 3.5 : phase < 0.7 ? 30 : 30 - ((phase - 0.7) / 0.15) * 3.5
    return [Math.cos(a) * r, Math.sin(a) * r]
  }
  const inner = (i) => {
    const a = (i / n) * Math.PI * 2
    return [Math.cos(a) * 5, Math.sin(a) * 5]
  }
  write('spur-gear.stl', ringExtrude(n, 8, outer, inner))
}

// 3. Twisted tower: rounded hexagon, 120° twist, 90 mm tall.
{
  const n = 96, layers = 48, h = 90
  write(
    'twisted-tower.stl',
    loft(n, layers, (i, l) => {
      const t = l / layers
      const a = (i / n) * Math.PI * 2 + t * (Math.PI * 2) / 3
      const hex = Math.cos(Math.PI / 6) / Math.cos(((((i / n) * Math.PI * 2) % (Math.PI / 3)) - Math.PI / 6))
      const bulge = 1 + 0.25 * Math.sin(t * Math.PI)
      const r = 18 * hex * bulge
      return [Math.cos(a) * r, Math.sin(a) * r, t * h]
    }),
  )
}

// 4. Ring: torus, 17 mm inner diameter (US size ~7).
{
  const R = 9.9, r = 1.4, nu = 72, nv = 20
  const p = (u, v) => {
    const a = (u / nu) * Math.PI * 2, b = (v / nv) * Math.PI * 2
    return [(R + r * Math.cos(b)) * Math.cos(a), (R + r * Math.cos(b)) * Math.sin(a), r * Math.sin(b) * 1.6]
  }
  tri.length = 0
  for (let u = 0; u < nu; u++) for (let v = 0; v < nv; v++) quad(p(u, v), p(u + 1, v), p(u + 1, v + 1), p(u, v + 1))
  write('ring.stl', [...tri])
}
