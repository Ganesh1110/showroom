import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, useTexture, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { CARD_IMAGES, getCardImage } from '../../utils/garments'

/* ─────────────────────────────────────────────────────
   Procedurally generated glossy tile-floor texture.
   Built once at module load (not per-render / per-color
   change) so it never re-triggers the synchronous-canvas
   frame drops the earlier code review flagged for the
   fabric textures.
───────────────────────────────────────────────────── */
let _floorTexture = null
function getFloorTexture() {
  if (_floorTexture) return _floorTexture
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#e9e9ec'
  ctx.fillRect(0, 0, size, size)
  const tiles = 8
  const step = size / tiles
  ctx.strokeStyle = 'rgba(150,150,158,0.35)'
  ctx.lineWidth = 2
  for (let i = 0; i <= tiles; i++) {
    ctx.beginPath(); ctx.moveTo(i * step, 0); ctx.lineTo(i * step, size); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i * step); ctx.lineTo(size, i * step); ctx.stroke()
  }
  // subtle sheen streaks
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`
    ctx.fillRect(Math.random() * size, Math.random() * size, Math.random() * 60 + 10, 1.5)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(5, 4)
  tex.colorSpace = THREE.SRGBColorSpace
  _floorTexture = tex
  return tex
}

/* ── Ceiling recessed downlights ─────────────────────── */
function CeilingLights() {
  const positions = useMemo(() => {
    const pts = []
    for (let x = -3; x <= 3; x += 1.5) {
      for (let z = -2.6; z <= 2.2; z += 1.6) {
        pts.push([x, 2.98, z])
      }
    }
    return pts
  }, [])
  return (
    <group>
      {positions.map((p, i) => (
        <group key={i} position={p}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.26, 0.26]} />
            <meshBasicMaterial color="#fff9e8" />
          </mesh>
          <pointLight position={[0, -0.05, 0]} intensity={2.2} distance={4.5} decay={2} color="#fff6e0" />
        </group>
      ))}
    </group>
  )
}

/* ── Store shell: floor, walls, ceiling, pillars ─────── */
function StoreShell() {
  const floorTex = useMemo(() => getFloorTexture(), [])
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10.5, 7.5]} />
        <meshStandardMaterial map={floorTex} roughness={0.25} metalness={0.15} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.5, -3.35]}>
        <boxGeometry args={[10.5, 3, 0.1]} />
        <meshStandardMaterial color="#f3f3f5" roughness={0.9} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-5.15, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[7.5, 3, 0.1]} />
        <meshStandardMaterial color="#f6f6f8" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <planeGeometry args={[10.5, 7.5]} />
        <meshStandardMaterial color="#fafafa" roughness={1} />
      </mesh>
      <CeilingLights />

      {/* Pillars */}
      {[[2.1, -0.6], [3.6, 1.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.5, z]} castShadow>
          <boxGeometry args={[0.28, 3, 0.28]} />
          <meshStandardMaterial color="#c9c9cd" roughness={0.4} metalness={0.1} />
        </mesh>
      ))}
    </group>
  )
}

/* ── Photo wall — grid of framed lifestyle shots ─────── */
function PhotoFrame({ position, rotation, src }) {
  const tex = useTexture(src)
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[0.42, 0.56, 0.03]} />
        <meshStandardMaterial color="#2b1c10" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.018]}>
        <planeGeometry args={[0.34, 0.48]} />
        <meshStandardMaterial map={tex} roughness={0.7} />
      </mesh>
    </group>
  )
}

function PhotoWall() {
  const images = Object.values(CARD_IMAGES)
  const cols = 3
  const rows = 4
  return (
    <group position={[-5.08, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const src = images[(r * cols + c) % images.length]
          const x = (c - (cols - 1) / 2) * 0.68
          const y = 0.9 + r * 0.66
          return <PhotoFrame key={`${r}-${c}`} position={[x, y, 0]} src={src} />
        })
      )}
    </group>
  )
}

/* ── Checkout counter (front-left, decorative) ───────── */
function CheckoutCounter() {
  return (
    <group position={[-3.4, 0, 2.6]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 1.0, 0.7]} />
        <meshStandardMaterial color="#fbfbfc" roughness={0.35} />
      </mesh>
      <mesh position={[0.75, 1.02, 0]}>
        <boxGeometry args={[0.7, 0.05, 0.72]} />
        <meshStandardMaterial color="#d9c08a" roughness={0.5} />
      </mesh>
    </group>
  )
}

/* ── Trial room booth (decorative, center-back) ──────── */
function TrialRoomBooth() {
  return (
    <group position={[-1.1, 0, -3.0]}>
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[0.9, 2.6, 0.08]} />
        <meshStandardMaterial color="#eef0f4" roughness={0.8} />
      </mesh>
      <Html position={[0, 2.75, 0.06]} center distanceFactor={8} occlude={false}>
        <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-white whitespace-nowrap"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          Trial Room
        </div>
      </Html>
      {/* simple mannequin silhouette */}
      <mesh position={[0, 1.0, 0.08]}>
        <capsuleGeometry args={[0.14, 0.55, 4, 8]} />
        <meshStandardMaterial color="#d8dce4" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.55, 0.08]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#d8dce4" roughness={0.6} />
      </mesh>
    </group>
  )
}

/* ─────────────────────────────────────────────────────
   Product display — one interactive shelf + hanging rack
   unit per category. Hover highlights it and shows a
   floating label; click enters the 3D viewer for it.
───────────────────────────────────────────────────── */
function ProductDisplay({ category, position, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef()
  const color = new THREE.Color(category.color)

  const shelfLevels = [0.45, 0.95, 1.45]
  const stackColors = useMemo(() => {
    const base = new THREE.Color(category.color)
    return [0, 1, 2, 3].map((i) => base.clone().offsetHSL(0, 0, (i - 1.5) * 0.06))
  }, [category.color])

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false) }}
      onClick={(e) => { e.stopPropagation(); onSelect(category.id) }}
    >
      {/* Shelf frame */}
      <mesh position={[0, 0.95, -0.02]}>
        <boxGeometry args={[0.9, 2.0, 0.06]} />
        <meshStandardMaterial color="#3b2a1a" roughness={0.6} />
      </mesh>

      {/* Shelves + folded stacks */}
      {shelfLevels.map((y, i) => (
        <group key={i}>
          <mesh position={[0, y, 0.16]}>
            <boxGeometry args={[0.82, 0.03, 0.32]} />
            <meshStandardMaterial color="#5a4028" roughness={0.6} />
          </mesh>
          {stackColors.map((c, j) => (
            <mesh key={j} position={[-0.3 + j * 0.2, y + 0.06 + j * 0.005, 0.16]} castShadow>
              <boxGeometry args={[0.17, 0.09, 0.26]} />
              <meshStandardMaterial color={c} roughness={0.85} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Hanging rod + garments on top */}
      <mesh position={[0, 2.05, 0.16]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.82, 8]} />
        <meshStandardMaterial color="#8a8a8a" metalness={0.6} roughness={0.3} />
      </mesh>
      {[-0.28, -0.09, 0.1, 0.29].map((x, i) => (
        <mesh key={i} position={[x, 1.85, 0.16]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.22, 0.02, 0.16]} />
          <meshStandardMaterial color={color.clone().offsetHSL(0, 0, (i - 1.5) * 0.05)} roughness={0.8} />
        </mesh>
      ))}

      {/* Hover highlight ring on floor */}
      <mesh position={[0, 0.01, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.62, 32]} />
        <meshBasicMaterial color={category.color} transparent opacity={hovered ? 0.55 : 0} />
      </mesh>

      {/* Label */}
      <Html position={[0, 2.28, 0.16]} center distanceFactor={7} occlude={false}>
        <div
          onClick={() => onSelect(category.id)}
          className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold whitespace-nowrap transition-transform"
          style={{
            background: 'rgba(10,10,10,0.75)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${category.color}80`,
            boxShadow: hovered ? `0 0 16px ${category.color}70` : 'none',
            transform: hovered ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
          {category.name}
        </div>
      </Html>
    </group>
  )
}

/* ─────────────────────────────────────────────────────
   Lighting — bright, even retail-store setup
───────────────────────────────────────────────────── */
function StoreLighting() {
  return (
    <>
      <ambientLight intensity={0.55} color="#ffffff" />
      <directionalLight position={[3, 5, 4]} intensity={0.9} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 4, 2]} intensity={0.4} color="#fff3e0" />
    </>
  )
}

/* ── Loading fallback while textures/canvas init ─────── */
function StoreLoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
        <p className="text-white/50 text-xs">Setting up the store…</p>
      </div>
    </Html>
  )
}

/* ─────────────────────────────────────────────────────
   Main export — the interactive 3D showroom floor
───────────────────────────────────────────────────── */
export default function Store3D({ categories, onSelectCategory }) {
  const n = categories.length
  const spacing = 1.9
  const positions = useMemo(
    () => categories.map((_, i) => [
      (i - (n - 1) / 2) * spacing,
      0,
      -3.0 + (n > 1 && i % 2 === 1 ? 0.35 : 0),
    ]),
    [categories, n]
  )

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0.6, 3.3, 6.8], fov: 42, near: 0.1, far: 60 }}
        gl={{ antialias: true, toneMapping: 3, toneMappingExposure: 1.1 }}
      >
        <color attach="background" args={['#101014']} />
        <fog attach="fog" args={['#101014', 9, 16]} />
        <Suspense fallback={<StoreLoadingFallback />}>
          <StoreLighting />
          <StoreShell />
          <PhotoWall />
          <CheckoutCounter />
          <TrialRoomBooth />

          {categories.map((cat, i) => (
            <ProductDisplay key={cat.id} category={cat} position={positions[i]} onSelect={onSelectCategory} />
          ))}

          <ContactShadows position={[0, 0.01, 0]} opacity={0.35} scale={12} blur={2} far={3} />

          <OrbitControls
            target={[0, 1.2, -1]}
            enablePan={false}
            minDistance={4}
            maxDistance={9}
            minAzimuthAngle={-Math.PI / 5}
            maxAzimuthAngle={Math.PI / 5}
            minPolarAngle={Math.PI / 4.2}
            maxPolarAngle={Math.PI / 2.15}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
