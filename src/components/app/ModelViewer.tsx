import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Box, Minus, Plus, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ModelViewerProps {
  positions: Float32Array
  color: string
  metallic?: boolean
  className?: string
}

interface Stage {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
  material: THREE.MeshStandardMaterial
  mesh: THREE.Mesh | null
  grid: THREE.GridHelper | null
  home: { position: THREE.Vector3; target: THREE.Vector3 }
}

const controlClass =
  'inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-lg bg-white/90 px-2 text-xs font-medium text-ink/70 shadow-sm ring-1 ring-ink/10 backdrop-blur hover:text-ink'

/** Interactive WebGL preview of an STL mesh (Z-up, millimetres). */
export default function ModelViewer({ positions, color, metallic, className }: ModelViewerProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Stage | null>(null)
  const [unsupported, setUnsupported] = useState(false)

  // Scene setup / teardown.
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setUnsupported(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(host.clientWidth, host.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, host.clientWidth / host.clientHeight, 0.1, 10000)
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd9dde3, 1.6))
    const key = new THREE.DirectionalLight(0xffffff, 2.2)
    key.position.set(1, 2, 1.5)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xffd9cc, 1.1)
    rim.position.set(-1.5, 0.8, -1)
    scene.add(rim)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.6
    const stopAutoRotate = () => (controls.autoRotate = false)
    controls.addEventListener('start', stopAutoRotate)
    renderer.domElement.addEventListener('pointerdown', stopAutoRotate)
    // OrbitControls sets touch-action: none, which traps page scrolling on phones.
    // Let the browser handle vertical swipes; horizontal drags still rotate.
    if (window.matchMedia('(pointer: coarse)').matches) renderer.domElement.style.touchAction = 'pan-y'

    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.05, flatShading: false })
    stageRef.current = {
      renderer,
      scene,
      camera,
      controls,
      material,
      mesh: null,
      grid: null,
      home: { position: new THREE.Vector3(), target: new THREE.Vector3() },
    }

    let frame = 0
    const tick = () => {
      controls.update()
      renderer.render(scene, camera)
      frame = requestAnimationFrame(tick)
    }
    tick()

    const observer = new ResizeObserver(() => {
      const { clientWidth: w, clientHeight: h } = host
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    })
    observer.observe(host)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      controls.dispose()
      material.dispose()
      stageRef.current?.mesh?.geometry.dispose()
      stageRef.current?.grid?.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      stageRef.current = null
    }
  }, [])

  // Swap geometry when the model changes.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.rotateX(-Math.PI / 2) // STL is Z-up, three.js is Y-up
    geometry.computeVertexNormals()
    geometry.computeBoundingBox()
    const box = geometry.boundingBox!
    const center = box.getCenter(new THREE.Vector3())
    geometry.translate(-center.x, -box.min.y, -center.z)
    geometry.computeBoundingSphere()
    const size = box.getSize(new THREE.Vector3())
    const radius = geometry.boundingSphere!.radius || 1

    if (stage.mesh) {
      stage.scene.remove(stage.mesh)
      stage.mesh.geometry.dispose()
    }
    if (stage.grid) {
      stage.scene.remove(stage.grid)
      stage.grid.dispose()
    }
    const mesh = new THREE.Mesh(geometry, stage.material)
    stage.scene.add(mesh)
    stage.mesh = mesh

    const gridSize = Math.max(10, Math.ceil((radius * 3) / 10) * 10)
    const grid = new THREE.GridHelper(gridSize, gridSize / 10, 0xc4c9d1, 0xe3e6ea)
    stage.scene.add(grid)
    stage.grid = grid

    const distance = radius / Math.sin(THREE.MathUtils.degToRad(stage.camera.fov / 2)) * 0.85
    stage.home.target.set(0, size.y / 2, 0)
    stage.home.position.set(distance * 0.75, size.y / 2 + distance * 0.5, distance * 0.75)
    stage.camera.near = distance / 100
    stage.camera.far = distance * 20
    stage.camera.updateProjectionMatrix()
    stage.camera.position.copy(stage.home.position)
    stage.controls.target.copy(stage.home.target)
    stage.controls.update()
  }, [positions])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    stage.material.color.set(color)
    stage.material.metalness = metallic ? 0.85 : 0.05
    stage.material.roughness = metallic ? 0.3 : 0.55
  }, [color, metallic])

  const zoom = (factor: number) => {
    const stage = stageRef.current
    if (!stage) return
    const { camera, controls } = stage
    const offset = camera.position.clone().sub(controls.target).multiplyScalar(factor)
    camera.position.copy(controls.target).add(offset)
    controls.update()
  }

  const resetView = () => {
    const stage = stageRef.current
    if (!stage) return
    stage.camera.position.copy(stage.home.position)
    stage.controls.target.copy(stage.home.target)
    stage.controls.autoRotate = true
  }

  return (
    <div className={cn('relative overflow-hidden rounded-2xl bg-gradient-to-b from-mist to-white', className)}>
      <div ref={hostRef} className="absolute inset-0" aria-label="3D model preview" role="img" />
      {unsupported ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink/50">
          <Box className="size-8" />
          <p className="text-sm">3D preview needs WebGL.</p>
        </div>
      ) : (
        <div className="absolute right-3 bottom-3 flex gap-1.5">
          <button type="button" onClick={() => zoom(1 / 1.25)} aria-label="Zoom in" className={controlClass}>
            <Plus className="size-4" />
          </button>
          <button type="button" onClick={() => zoom(1.25)} aria-label="Zoom out" className={controlClass}>
            <Minus className="size-4" />
          </button>
          <button type="button" onClick={resetView} aria-label="Reset view" className={controlClass}>
            <RotateCcw className="size-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      )}
    </div>
  )
}
