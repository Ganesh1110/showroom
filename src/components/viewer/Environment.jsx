import { Environment as DreiEnvironment } from '@react-three/drei'

/**
 * Studio-quality lighting setup designed for the light gray radial-gradient
 * background that appears in the viewer page. Mimics a professional 3D render
 * environment (three-point lighting + environment HDRI).
 */
export default function Environment() {
  return (
    <>
      {/* Soft ambient fill */}
      <ambientLight intensity={0.35} color="#f0f0f0" />

      {/* Key light — upper-left front (mimics main studio softbox) */}
      <directionalLight
        position={[-4, 6, 5]}
        intensity={1.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0003}
      />

      {/* Fill light — right side, softer */}
      <directionalLight position={[5, 3, 3]} intensity={0.7} color="#e8eeff" />

      {/* Rim / back light — creates nice edge highlight on the garment */}
      <directionalLight position={[0, 4, -6]} intensity={0.5} color="#ffffff" />

      {/* Subtle under-fill to avoid completely dark bottom */}
      <directionalLight position={[0, -3, 1]} intensity={0.15} color="#d0d8e8" />

      {/* HDRI studio environment */}
      <DreiEnvironment
        preset="studio"
        environmentIntensity={0.55}
        environmentRotation={[0, Math.PI / 4, 0]}
      />
    </>
  )
}
