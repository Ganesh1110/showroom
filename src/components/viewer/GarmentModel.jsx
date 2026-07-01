import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import useStore from '../../stores/useStore'
import { createFabricMaterial, updateFabricMaterial } from '../../utils/materials'

/* ─────────────────────────────────────────────────────
   Vertex displacement: adds realistic fabric fold bumps
   to any cylindrical / round geometry.
───────────────────────────────────────────────────── */
function applyFabricFolds(geometry, intensity = 0.014, frequency = 9) {
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const theta = Math.atan2(z, x)
    const r = Math.sqrt(x * x + z * z)

    const fold =
      Math.sin(y * frequency + theta * 2.5) * intensity +
      Math.sin(y * (frequency * 1.4) + theta * 4.1) * intensity * 0.45 +
      Math.cos(y * (frequency * 0.6) - theta * 3.2) * intensity * 0.3

    const nr = r + fold
    pos.setXYZ(i, Math.cos(theta) * nr, y, Math.sin(theta) * nr)
  }
  pos.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

function useShirtGeometries(type) {
  return useMemo(() => {
    const isTee     = type === 'tshirt'
    const isShirt   = type === 'shirt'
    const isHoodie  = type === 'hoodie'

    const bodyTopR  = isHoodie ? 0.34 : 0.33
    const bodyBotR  = isHoodie ? 0.29 : 0.28
    const bodyH     = isHoodie ? 0.88 : isShirt ? 0.92 : 0.80

    const sleeveTopR = isShirt ? 0.115 : 0.130
    const sleeveBotR = isShirt ? 0.105 : 0.115
    const sleeveH    = isShirt ? 0.56  : isTee ? 0.40 : 0.48
    const sleeveAngle = Math.PI * 0.42

    const collarR   = isShirt ? 0.095 : 0.115
    const neckH     = isShirt ? 0.055 : 0.06

    const bodyY      = isHoodie ? -0.06 : -0.04
    const shoulderY  = bodyY + bodyH / 2
    const collarY    = shoulderY + neckH * 0.5
    const hemY       = bodyY - bodyH / 2

    const slSideX    = (bodyTopR + sleeveH * Math.sin(sleeveAngle) * 0.5)
    const slY        = shoulderY - sleeveH * Math.cos(sleeveAngle) * 0.5

    const parts = []

    const bodyGeo = applyFabricFolds(
      new THREE.CylinderGeometry(bodyTopR, bodyBotR, bodyH, 72, 18, true),
      0.015, 10
    )
    parts.push({ geo: bodyGeo, pos: [0, bodyY, 0], rot: [0, 0, 0] })

    const yokeGeo = new THREE.RingGeometry(collarR, bodyTopR, 72)
    parts.push({ geo: yokeGeo, pos: [0, shoulderY, 0], rot: [0, 0, 0] })

    const hemGeo = new THREE.TorusGeometry(bodyBotR, 0.018, 10, 72)
    parts.push({ geo: hemGeo, pos: [0, hemY, 0], rot: [0, 0, 0] })

    const neckGeo = new THREE.CylinderGeometry(collarR, collarR, neckH, 48, 2, true)
    parts.push({ geo: neckGeo, pos: [0, shoulderY + neckH / 2, 0], rot: [0, 0, 0] })

    const collarTorusGeo = new THREE.TorusGeometry(collarR, 0.022, 14, 60)
    parts.push({ geo: collarTorusGeo, pos: [0, collarY + neckH * 0.5, 0], rot: [0, 0, 0] })

    for (const side of [-1, 1]) {
      const slGeo = applyFabricFolds(
        new THREE.CylinderGeometry(sleeveTopR, sleeveBotR, sleeveH, 48, 10, true),
        0.009, 8
      )
      parts.push({
        geo: slGeo,
        pos: [side * slSideX, slY, 0],
        rot: [0, 0, side * sleeveAngle],
      })

      const cuffAngle = side * sleeveAngle
      const cuffX = side * (slSideX + sleeveH * 0.5 * Math.sin(Math.abs(sleeveAngle)))
      const cuffY = slY - sleeveH * 0.5 * Math.cos(sleeveAngle) + 0.01
      const cuffGeo = new THREE.TorusGeometry(sleeveBotR, 0.012, 8, 48)
      parts.push({ geo: cuffGeo, pos: [cuffX, cuffY, 0], rot: [0, 0, cuffAngle] })

      const capGeo = new THREE.CircleGeometry(sleeveTopR + 0.01, 48)
      const capX = side * (bodyTopR * 0.88)
      parts.push({
        geo: capGeo,
        pos: [capX, shoulderY - 0.03, 0],
        rot: [0, 0, side * sleeveAngle],
      })
    }

    if (isHoodie) {
      const hoodGeo = new THREE.SphereGeometry(0.25, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.65)
      parts.push({ geo: hoodGeo, pos: [0, shoulderY + 0.22, -0.08], rot: [0.15, 0, 0] })

      const drawGeo = new THREE.TorusGeometry(0.24, 0.012, 8, 48, Math.PI)
      parts.push({ geo: drawGeo, pos: [0, shoulderY + 0.24, 0.01], rot: [Math.PI * 0.55, 0, 0] })

      const pocketGeo = applyFabricFolds(
        new THREE.CylinderGeometry(0.18, 0.20, 0.14, 32, 4, false, Math.PI * 0.15, Math.PI * 1.7),
        0.005, 5
      )
      parts.push({ geo: pocketGeo, pos: [0, bodyY - 0.18, bodyBotR * 0.9], rot: [Math.PI * 0.5, 0, 0] })
    }

    if (isShirt) {
      for (const side of [-1, 1]) {
        const wingGeo = new THREE.BoxGeometry(0.11, 0.04, 0.06)
        parts.push({
          geo: wingGeo,
          pos: [side * 0.09, collarY + neckH * 0.5 + 0.015, 0.07],
          rot: [0, side * 0.3, side * 0.2],
        })
      }

      const placketGeo = new THREE.BoxGeometry(0.035, bodyH * 0.85, 0.025)
      parts.push({ geo: placketGeo, pos: [0, bodyY + 0.04, bodyTopR * 0.97], rot: [0, 0, 0] })

      for (let b = 0; b < 5; b++) {
        const btnGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.016, 16)
        parts.push({
          geo: btnGeo,
          pos: [0, shoulderY - 0.1 - b * 0.13, bodyTopR * 0.98 + 0.01],
          rot: [Math.PI / 2, 0, 0],
        })
      }
    }

    return parts
  }, [type])
}

function usePantsGeometries() {
  return useMemo(() => {
    const parts = []

    parts.push({
      geo: new THREE.TorusGeometry(0.23, 0.032, 10, 64),
      pos: [0, 0.38, 0], rot: [0, 0, 0],
    })

    parts.push({
      geo: applyFabricFolds(new THREE.CylinderGeometry(0.23, 0.22, 0.12, 64, 4, true), 0.006, 6),
      pos: [0, 0.30, 0], rot: [0, 0, 0],
    })

    parts.push({
      geo: applyFabricFolds(new THREE.CylinderGeometry(0.22, 0.18, 0.20, 64, 6, true), 0.008, 7),
      pos: [0, 0.13, 0], rot: [0, 0, 0],
    })

    for (const side of [-1, 1]) {
      const legGeo = applyFabricFolds(
        new THREE.CylinderGeometry(0.13, 0.115, 0.72, 48, 14, true),
        0.013, 9
      )
      parts.push({ geo: legGeo, pos: [side * 0.135, -0.35, 0], rot: [0, 0, 0] })

      const cuffGeo = new THREE.TorusGeometry(0.115, 0.016, 8, 48)
      parts.push({ geo: cuffGeo, pos: [side * 0.135, -0.72, 0], rot: [0, 0, 0] })
    }

    const bridgeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.27, 32, 4, true)
    parts.push({ geo: bridgeGeo, pos: [0, 0.0, 0.08], rot: [Math.PI / 2.4, 0, 0] })

    return parts
  }, [])
}

function useCapGeometries() {
  return useMemo(() => {
    const parts = []

    parts.push({
      geo: new THREE.SphereGeometry(0.32, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.56),
      pos: [0, 0.05, 0], rot: [0, 0, 0],
    })

    parts.push({
      geo: new THREE.TorusGeometry(0.32, 0.028, 10, 64),
      pos: [0, 0.05, 0], rot: [0, 0, 0],
    })

    const brimGeo = new THREE.CylinderGeometry(0.46, 0.44, 0.03, 64, 1, false, -Math.PI * 0.05, Math.PI * 1.1)
    parts.push({ geo: brimGeo, pos: [0, -0.06, 0.08], rot: [0.12, 0, 0] })

    parts.push({
      geo: new THREE.SphereGeometry(0.03, 12, 8),
      pos: [0, 0.38, 0], rot: [0, 0, 0],
    })

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.PI / 6
      parts.push({
        geo: new THREE.TorusGeometry(0.018, 0.006, 6, 16),
        pos: [Math.cos(angle) * 0.30, 0.16, Math.sin(angle) * 0.30],
        rot: [Math.PI / 2, angle, 0],
      })
    }

    return parts
  }, [])
}

function GarmentGroup({ parts, material }) {
  return (
    <group>
      {parts.map(({ geo, pos, rot }, i) => (
        <mesh
          key={i}
          geometry={geo}
          material={material}
          position={pos}
          rotation={rot}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  )
}

export default function GarmentModel() {
  const selectedCategory = useStore((s) => s.selectedCategory)
  const currentColor = useStore((s) => s.currentColor)
  const currentTexture = useStore((s) => s.currentTexture)
  const materialProps = useStore((s) => s.materialProps)

  const isShirtType = ['tshirt', 'shirt', 'hoodie'].includes(selectedCategory)
  const isPants     = selectedCategory === 'pants'
  const isCap       = selectedCategory === 'cap'

  const shirtParts = useShirtGeometries(isShirtType ? selectedCategory : 'tshirt')
  const pantsParts = usePantsGeometries()
  const capParts   = useCapGeometries()

  const material = useMemo(
    () => createFabricMaterial({ color: currentColor, textureType: currentTexture, ...materialProps }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    updateFabricMaterial(material, { color: currentColor, textureType: currentTexture, ...materialProps })
  }, [currentColor, currentTexture, materialProps, material])

  const activeParts = isPants ? pantsParts : isCap ? capParts : shirtParts

  return (
    <group>
      <GarmentGroup parts={activeParts} material={material} />
    </group>
  )
}
