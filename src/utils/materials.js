import * as THREE from 'three'
import { getTexture, createNormalMap } from './textures'

export function createFabricMaterial({
  color = '#ffffff',
  textureType = 'cotton',
  roughness = 0.6,
  metalness = 0.0,
  opacity = 1.0,
  fabricShine = 0.3,
}) {
  const map = getTexture(textureType, color)
  const normalMap = createNormalMap(textureType)

  map.repeat.set(2, 2)
  normalMap.repeat.set(2, 2)

  const adjustedRoughness = Math.max(0, Math.min(1, roughness - fabricShine * 0.3))

  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    map,
    normalMap,
    roughness: adjustedRoughness,
    metalness,
    transparent: opacity < 1,
    opacity,
    envMapIntensity: 0.5 + fabricShine * 0.5,
    clearcoat: fabricShine * 0.3,
    clearcoatRoughness: 0.4,
    side: THREE.DoubleSide,
  })
}

export function updateFabricMaterial(material, {
  color,
  textureType,
  roughness,
  metalness,
  opacity,
  fabricShine,
}) {
  if (color !== undefined) {
    material.color.set(color)
  }
  if (textureType !== undefined) {
    const newMap = getTexture(textureType, color || material.color.getHexString())
    const newNormal = createNormalMap(textureType)
    newMap.repeat.set(2, 2)
    newNormal.repeat.set(2, 2)
    material.map = newMap
    material.normalMap = newNormal
    material.needsUpdate = true
  }
  if (roughness !== undefined && fabricShine !== undefined) {
    material.roughness = Math.max(0, Math.min(1, roughness - fabricShine * 0.3))
  } else if (roughness !== undefined) {
    material.roughness = roughness
  }
  if (metalness !== undefined) material.metalness = metalness
  if (opacity !== undefined) {
    material.transparent = opacity < 1
    material.opacity = opacity
  }
  if (fabricShine !== undefined) {
    const currentMat = material
    if (currentMat.roughness !== undefined) {
      currentMat.roughness = Math.max(0, Math.min(1, (roughness || currentMat.roughness) - fabricShine * 0.3))
    }
    currentMat.envMapIntensity = 0.5 + fabricShine * 0.5
    currentMat.clearcoat = fabricShine * 0.3
  }
  material.needsUpdate = true
}
