/** Axis-aligned box as a closed triangle mesh, outward-facing. */
export function boxPositions(x: number, y: number, z: number, offset: [number, number, number] = [0, 0, 0]): Float32Array {
  const [ox, oy, oz] = offset
  const v = (a: number, b: number, c: number) => [ox + a * x, oy + b * y, oz + c * z]
  const quads = [
    [v(0, 0, 0), v(0, 1, 0), v(1, 1, 0), v(1, 0, 0)],
    [v(0, 0, 1), v(1, 0, 1), v(1, 1, 1), v(0, 1, 1)],
    [v(0, 0, 0), v(1, 0, 0), v(1, 0, 1), v(0, 0, 1)],
    [v(0, 1, 0), v(0, 1, 1), v(1, 1, 1), v(1, 1, 0)],
    [v(0, 0, 0), v(0, 0, 1), v(0, 1, 1), v(0, 1, 0)],
    [v(1, 0, 0), v(1, 1, 0), v(1, 1, 1), v(1, 0, 1)],
  ]
  const out: number[] = []
  for (const [a, b, c, d] of quads) out.push(...a, ...b, ...c, ...a, ...c, ...d)
  return new Float32Array(out)
}

export function asciiSTL(positions: Float32Array): string {
  const lines = ['solid test']
  for (let i = 0; i < positions.length; i += 9) {
    lines.push('  facet normal 0 0 0', '    outer loop')
    for (let v = 0; v < 3; v++) {
      lines.push(`      vertex ${positions[i + v * 3]} ${positions[i + v * 3 + 1]} ${positions[i + v * 3 + 2]}`)
    }
    lines.push('    endloop', '  endfacet')
  }
  lines.push('endsolid test')
  return lines.join('\n')
}
