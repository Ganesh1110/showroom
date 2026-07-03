import * as THREE from 'three';
import { createMarbleTexture, createConcreteTexture, createFabricTexture } from './textures.js';

// Instantiate procedural canvas textures
const marbleTex = createMarbleTexture();
const concreteTex = createConcreteTexture();
const concreteBumpTex = createConcreteTexture(); // distinct instance for bumps

export const MAT = {
  conc: new THREE.MeshStandardMaterial({ 
    color: 0xe8e8e8, 
    roughness: 0.85, 
    metalness: 0.15,
    map: concreteTex,
    bumpMap: concreteBumpTex,
    bumpScale: 0.05
  }),
  concDark: new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a, 
    roughness: 0.4, 
    metalness: 0.8,
    map: concreteTex,
    bumpMap: concreteBumpTex,
    bumpScale: 0.04
  }),
  glass: new THREE.MeshPhysicalMaterial({ 
    color: 0xe6f2f2, 
    metalness: 0.9, 
    roughness: 0.02, 
    transparent: true, 
    opacity: 0.25, 
    side: THREE.DoubleSide, 
    envMapIntensity: 3.0 
  }),
  glassTinted: new THREE.MeshPhysicalMaterial({ 
    color: 0xe6f2f2, 
    metalness: 0.9, 
    roughness: 0.02, 
    transparent: true, 
    opacity: 0.35, 
    side: THREE.DoubleSide,
    envMapIntensity: 3.0
  }),
  steel: new THREE.MeshStandardMaterial({ 
    color: 0xb0b8c8, 
    roughness: 0.18, 
    metalness: 0.88,
    bumpMap: concreteBumpTex,
    bumpScale: 0.005 // very fine metallic grit
  }),
  steelDark: new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a, 
    roughness: 0.4, 
    metalness: 0.8,
    bumpMap: concreteBumpTex,
    bumpScale: 0.005
  }),
  gold: new THREE.MeshStandardMaterial({ 
    color: 0xD4AF37, 
    roughness: 0.2, 
    metalness: 0.9,
    bumpMap: concreteBumpTex,
    bumpScale: 0.004
  }),
  woodSlat: new THREE.MeshStandardMaterial({
    color: 0x8b5a2b,
    roughness: 0.9,
    metalness: 0.05
  }),
  woodSlatDark: new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 1.0,
    metalness: 0.0
  }),
  marble: new THREE.MeshStandardMaterial({ 
    color: 0xf0ece4, 
    roughness: 0.28, 
    metalness: 0.05,
    map: marbleTex
  }),
  marbleDark: new THREE.MeshStandardMaterial({ 
    color: 0x252528, 
    roughness: 0.35, 
    metalness: 0.1,
    map: marbleTex
  }),
  floor: new THREE.MeshStandardMaterial({ 
    color: 0xc8c4c0, 
    roughness: 0.3, 
    metalness: 0.1,
    map: concreteTex,
    bumpMap: concreteBumpTex,
    bumpScale: 0.02
  }),
  blackFrame: new THREE.MeshStandardMaterial({ 
    color: 0x0d0d12, 
    roughness: 0.3, 
    metalness: 0.6 
  }),
  white: new THREE.MeshStandardMaterial({ 
    color: 0xffffff, 
    roughness: 0.7, 
    metalness: 0.0 
  }),
  emitWhite: new THREE.MeshStandardMaterial({ 
    color: 0xfffcd2, 
    emissive: 0xfffcd2, 
    emissiveIntensity: 1.0 
  }),
  groundMat: new THREE.MeshStandardMaterial({ 
    color: 0xd4d4d4, 
    roughness: 0.8, 
    metalness: 0.1,
    map: concreteTex,
    bumpMap: concreteBumpTex,
    bumpScale: 0.08
  }),
  
  // Custom fabrics for boutique items
  fabricRed: new THREE.MeshStandardMaterial({ map: createFabricTexture('#e53935'), roughness: 0.85 }),
  fabricBlue: new THREE.MeshStandardMaterial({ map: createFabricTexture('#1e88e5'), roughness: 0.85 }),
  fabricGreen: new THREE.MeshStandardMaterial({ map: createFabricTexture('#43a047'), roughness: 0.85 }),
  fabricOrange: new THREE.MeshStandardMaterial({ map: createFabricTexture('#f4511e'), roughness: 0.85 }),
  fabricYellow: new THREE.MeshStandardMaterial({ map: createFabricTexture('#fdd835'), roughness: 0.85 }),
  fabricPurple: new THREE.MeshStandardMaterial({ map: createFabricTexture('#7c4dff'), roughness: 0.85 }),
  fabricWhite: new THREE.MeshStandardMaterial({ map: createFabricTexture('#ffffff'), roughness: 0.85 }),
  fabricGrey: new THREE.MeshStandardMaterial({ map: createFabricTexture('#888888'), roughness: 0.85 }),
  fabricBlack: new THREE.MeshStandardMaterial({ map: createFabricTexture('#222222'), roughness: 0.85 }),
  fabricSofa: new THREE.MeshStandardMaterial({ map: createFabricTexture('#dad5cd'), roughness: 0.9 }),
  fabricMannequin: new THREE.MeshStandardMaterial({ map: createFabricTexture('#424242'), roughness: 0.8 })
};

// ─────────────────────────────────────────────────
//  PRE-GENERATED HOVER HIGHLIGHTING MATERIALS (Zero allocation on hover!)
// ─────────────────────────────────────────────────
export const hoverMaterialsMap = new Map();

Object.keys(MAT).forEach(key => {
  const original = MAT[key];
  const hovered = original.clone();
  if (hovered.emissive) {
    // Subtle golden glow intensity overlay
    hovered.emissive.setHex(0x2d240c);
    hovered.emissiveIntensity = 0.6;
  }
  hoverMaterialsMap.set(original, hovered);
});
