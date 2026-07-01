import * as THREE from 'three';

export const MAT = {
  conc: new THREE.MeshStandardMaterial({ color: 0xd8d4cc, roughness: 0.85, metalness: 0.02 }),
  concDark: new THREE.MeshStandardMaterial({ color: 0x1c1c24, roughness: 0.9, metalness: 0.0 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0x8ab4d8, metalness: 0.1, roughness: 0.0, transparent: true, opacity: 0.22, side: THREE.DoubleSide, envMapIntensity: 1.8 }),
  glassTinted: new THREE.MeshPhysicalMaterial({ color: 0x4a6880, metalness: 0.15, roughness: 0.02, transparent: true, opacity: 0.18, side: THREE.DoubleSide }),
  steel: new THREE.MeshStandardMaterial({ color: 0xb0b8c8, roughness: 0.15, metalness: 0.88 }),
  steelDark: new THREE.MeshStandardMaterial({ color: 0x303038, roughness: 0.2, metalness: 0.85 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xC9A84C, roughness: 0.2, metalness: 0.9 }),
  marble: new THREE.MeshStandardMaterial({ color: 0xf0ece4, roughness: 0.3, metalness: 0.05 }),
  marbleDark: new THREE.MeshStandardMaterial({ color: 0x252528, roughness: 0.4, metalness: 0.1 }),
  floor: new THREE.MeshStandardMaterial({ color: 0x181820, roughness: 0.65, metalness: 0.05 }),
  blackFrame: new THREE.MeshStandardMaterial({ color: 0x0d0d12, roughness: 0.3, metalness: 0.6 }),
  white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7, metalness: 0.0 }),
  emitWhite: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.6 }),
  groundMat: new THREE.MeshStandardMaterial({ color: 0x0e0e16, roughness: 0.9, metalness: 0.05 }),
};
