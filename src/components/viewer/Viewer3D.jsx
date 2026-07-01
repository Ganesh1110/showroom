import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../stores/useStore'
import GarmentModel from './GarmentModel'
import Environment from './Environment'

/* ── Smooth zoom interpolation via useFrame ── */
function SmoothCamera() {
  const { viewerZoom } = useStore()
  const { camera } = useThree()

  targetRef.current = viewerZoom

  useFrame((state, delta) => {
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetRef.current,
      Math.min(1, delta * 4)
    )
  })

  return null
}

export default function Viewer3D() {
  const { autoRotate, motionPreference } = useStore()
  const isLowMotion = motionPreference === 'low'

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 0.1, 3.2], fov: 32, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: 3,
          toneMappingExposure: 1.15,
        }}
        onCreated={(state) => {
          state.gl.setClearColor(0x000000, 0)
        }}
      >
        <Suspense fallback={null}>
          <Environment />
          <SmoothCamera />

          <Float
            speed={isLowMotion ? 0 : 1.2}
            rotationIntensity={0}
            floatIntensity={isLowMotion ? 0 : 0.08}
          >
            <GarmentModel />
          </Float>

          <OrbitControls
            target={[0, 0, 0]}
            enablePan={false}
            minDistance={1.5}
            maxDistance={5.5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.6}
            autoRotate={autoRotate}
            autoRotateSpeed={isLowMotion ? 0 : 2.0}
            enableDamping={!isLowMotion}
            dampingFactor={0.07}
            rotateSpeed={0.65}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
