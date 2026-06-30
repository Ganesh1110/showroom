import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import useStore from '../../stores/useStore'
import GarmentModel from './GarmentModel'
import Environment from './Environment'

export default function Viewer3D() {
  const { autoRotate } = useStore()

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 0.1, 3.2], fov: 32, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,           // transparent — HTML studio-bg gradient shows through
          toneMapping: 3,
          toneMappingExposure: 1.1,
        }}
        onCreated={(state) => {
          state.gl.setClearColor(0x000000, 0)
        }}
      >
        <Suspense fallback={null}>
          <Environment />

          <Float speed={1.2} rotationIntensity={0} floatIntensity={0.08}>
            <GarmentModel />
          </Float>

          <OrbitControls
            target={[0, 0, 0]}
            enablePan={false}
            minDistance={1.5}
            maxDistance={5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.6}
            autoRotate={autoRotate}
            autoRotateSpeed={2.0}
            enableDamping
            dampingFactor={0.07}
            rotateSpeed={0.65}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
