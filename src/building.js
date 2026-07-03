import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { MAT } from './materials.js';
import { FLOOR_H } from './constants.js';
import { createFabricTexture } from './textures.js';

export const mannequinTorsos = [];
export const mannequinHeads = [];

const fabricCache = new Map();
function getCachedFabric(hexColor) {
  if (!fabricCache.has(hexColor)) {
    const hexStr = '#' + new THREE.Color(hexColor).getHexString();
    fabricCache.set(hexColor, new THREE.MeshStandardMaterial({
      map: createFabricTexture(hexStr),
      roughness: 0.85
    }));
  }
  return fabricCache.get(hexColor);
}

// Custom Extrusion helper to build floor slabs with circular staircase wells (cutouts)
export function createFloorSlabGeometry(w, d) {
  const shape = new THREE.Shape();
  // Draw rectangular slab profile
  shape.moveTo(-w/2, -d/2);
  shape.lineTo(w/2, -d/2);
  shape.lineTo(w/2, d/2);
  shape.lineTo(-w/2, d/2);
  shape.closePath();

  // Circular stair well opening cutout at stairsCenter (-4.5, -2.5) with radius 1.45
  const hole = new THREE.Path();
  const radius = 1.45;
  hole.absarc(-4.5, -2.5, radius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  // Extrude configuration
  const extrudeSettings = {
    depth: 0.08,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  // Extrude naturally projects along Z axis, rotate it to sit flat on XZ plane
  geo.rotateX(-Math.PI / 2);
  // Center it vertically so it aligns with slab position Y
  geo.translate(0, 0.04, 0);
  return geo;
}

export function makeCSSLabel(text, styles = {}) {
  const div = document.createElement('div');
  div.textContent = text;
  Object.assign(div.style, {
    fontFamily: '"Inter", sans-serif',
    fontSize: '11px', fontWeight: '500',
    letterSpacing: '0.28em', color: '#F5D76E',
    padding: '5px 14px',
    background: 'rgba(0,0,0,0.9)',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: '2px',
    pointerEvents: 'none',
    textTransform: 'uppercase',
    ...styles,
  });
  return new CSS2DObject(div);
}

export function makeClothingRack(x, y, z, rotY, colors = [0x222222, 0x993333, 0x334499, 0x228833]) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;
  const frameMat = MAT.steelDark;

  // Posts
  for (const px of [-0.65, 0.65]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.05, 8), frameMat);
    post.position.set(px, 0.53, 0); 
    post.name = 'interactive';
    post.userData = { productName: 'Organic Tees' };
    g.add(post);
  }
  // Cross bar
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.35, 8), frameMat);
  bar.rotation.z = Math.PI / 2;
  bar.position.y = 1.05; 
  bar.name = 'interactive';
  bar.userData = { productName: 'Organic Tees' };
  g.add(bar);
  // Base
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.03, 0.18), frameMat);
  base.position.y = 0.015; 
  base.name = 'interactive';
  base.userData = { productName: 'Organic Tees' };
  g.add(base);

  // Garments
  for (let i = 0; i < colors.length; i++) {
    const gx = -0.5 + (i / (colors.length - 1)) * 1.0;
    const garment = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.7, 0.06),
      getCachedFabric(colors[i])
    );
    garment.position.set(gx, 0.69, 0);
    garment.name = 'interactive';
    garment.userData = { productName: 'Organic Tees' };
    g.add(garment);
  }
  return g;
}

export function makeMannequin(x, y, z, rotY, garmentColor = 0x222222) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;
  
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.04, 8), MAT.steelDark);
  base.position.y = 0.02; 
  base.name = 'interactive';
  base.userData = { productName: 'Organic Tees' };
  g.add(base);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8), MAT.steelDark);
  pole.position.y = 0.32; 
  pole.name = 'interactive';
  pole.userData = { productName: 'Organic Tees' };
  g.add(pole);

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.42, 4, 10), getCachedFabric(garmentColor));
  torso.position.y = 0.88; 
  torso.name = 'interactive';
  torso.userData = { productName: 'Organic Tees' };
  g.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), MAT.concDark);
  head.position.y = 1.18; 
  head.name = 'interactive';
  head.userData = { productName: 'Organic Tees' };
  g.add(head);

  mannequinTorsos.push(torso);
  mannequinHeads.push(head);

  return g;
}

export function makeStaffMember(x, y, z, rotY) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.4, 4, 8), MAT.steelDark);
  body.position.y = 0.78; 
  body.name = 'interactive';
  body.userData = { productName: 'Tomo Koizumi Gown' };
  g.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0xd4a07a, roughness: 0.5 }));
  head.position.y = 1.08; 
  head.name = 'interactive';
  head.userData = { productName: 'Tomo Koizumi Gown' };
  g.add(head);

  // Shirt collar
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.05, 8), MAT.white);
  collar.position.y = 0.94; 
  collar.name = 'interactive';
  collar.userData = { productName: 'Tomo Koizumi Gown' };
  g.add(collar);
  return g;
}

export function makeDisplayTable(x, y, z, rotY) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.05, 0.7), MAT.marble);
  top.position.y = 0.46; 
  top.name = 'interactive';
  top.userData = { productName: 'Organic Tees' };
  g.add(top);

  const trim = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.025, 0.74), MAT.gold);
  trim.position.y = 0.44; 
  trim.name = 'interactive';
  trim.userData = { productName: 'Organic Tees' };
  g.add(trim);

  for (const lx of [-0.42, 0.42]) for (const lz of [-0.27, 0.27]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.44, 8), MAT.steelDark);
    leg.position.set(lx, 0.22, lz); 
    leg.name = 'interactive';
    leg.userData = { productName: 'Organic Tees' };
    g.add(leg);
  }

  // Items on table
  const item1 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.16), getCachedFabric(0xc62828));
  item1.position.set(-0.2, 0.51, -0.08); 
  item1.name = 'interactive';
  item1.userData = { productName: 'Organic Tees' };
  g.add(item1);

  const item2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.16), getCachedFabric(0x1a237e));
  item2.position.set(0.22, 0.5, 0.08); 
  item2.name = 'interactive';
  item2.userData = { productName: 'Organic Tees' };
  g.add(item2);
  return g;
}

export function makeReceptionDesk(x, y, z, rotY) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;

  // Main body
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.95, 0.65), MAT.marbleDark);
  body.position.y = 0.48; 
  body.name = 'interactive';
  body.userData = { productName: 'Hirume Bonsai' };
  g.add(body);

  // Marble top
  const top = new THREE.Mesh(new THREE.BoxGeometry(2.06, 0.055, 0.7), MAT.marble);
  top.position.y = 0.98; 
  top.name = 'interactive';
  top.userData = { productName: 'Hirume Bonsai' };
  g.add(top);

  // Gold trim
  const goldTrim = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.03, 0.72), MAT.gold);
  goldTrim.position.y = 0.97; 
  goldTrim.name = 'interactive';
  goldTrim.userData = { productName: 'Hirume Bonsai' };
  g.add(goldTrim);

  // Front panel detail
  const panel = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.55, 0.04), MAT.steelDark);
  panel.position.set(0, 0.45, 0.33); 
  panel.name = 'interactive';
  panel.userData = { productName: 'Hirume Bonsai' };
  g.add(panel);

  // Laptop
  const lBase = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.012, 0.18),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.15 }));
  lBase.position.set(0.5, 1.01, 0.0); 
  lBase.name = 'interactive';
  lBase.userData = { productName: 'Hirume Bonsai' };
  g.add(lBase);

  const lScreen = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.17, 0.01),
    new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.85, roughness: 0.1 }));
  lScreen.position.set(0.5, 1.1, -0.07);
  lScreen.rotation.x = -0.45; 
  lScreen.name = 'interactive';
  lScreen.userData = { productName: 'Hirume Bonsai' };
  g.add(lScreen);

  return g;
}

export function makeBirdcage(scale = 1.0) {
  const g = new THREE.Group();
  g.scale.set(scale, scale, scale);
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.9, roughness: 0.15 });
  
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 16), goldMat);
  base.name = 'interactive';
  base.userData = { productName: 'Hirume Bonsai' };
  g.add(base);

  const top = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), goldMat);
  top.position.y = 0.4;
  top.name = 'interactive';
  top.userData = { productName: 'Hirume Bonsai' };
  g.add(top);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.009, 8, 16), goldMat);
  ring.position.y = 0.6;
  ring.name = 'interactive';
  ring.userData = { productName: 'Hirume Bonsai' };
  g.add(ring);

  return g;
}

export function makeLoungeSofa(x, y, z, rotY) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;

  // Sofa base
  const sofaBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.36, 0.65),
    MAT.fabricSofa
  );
  sofaBase.position.set(0, 0.18, 0);
  sofaBase.castShadow = true;
  sofaBase.name = 'interactive';
  sofaBase.userData = { productName: 'Lounge Sofa' };
  g.add(sofaBase);

  // Sofa back
  const sofaBack = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.46, 0.15),
    MAT.fabricSofa
  );
  sofaBack.position.set(0, 0.48, -0.25);
  sofaBack.castShadow = true;
  sofaBack.name = 'interactive';
  sofaBack.userData = { productName: 'Lounge Sofa' };
  g.add(sofaBack);

  // Seated Person (sitting mannequin style)
  const person = new THREE.Group();
  person.position.set(0.15, 0.2, 0.0);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.3, 4, 8), getCachedFabric(0xaecbe6));
  body.position.y = 0.28;
  body.castShadow = true;
  body.name = 'interactive';
  body.userData = { productName: 'Lounge Sofa' };
  person.add(body);

  const thighs = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.35), MAT.fabricSofa);
  thighs.position.set(0, 0.16, 0.16);
  thighs.castShadow = true;
  thighs.name = 'interactive';
  thighs.userData = { productName: 'Lounge Sofa' };
  person.add(thighs);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), new THREE.MeshStandardMaterial({ color: 0xe0b295 }));
  head.position.y = 0.49;
  head.castShadow = true;
  head.name = 'interactive';
  head.userData = { productName: 'Lounge Sofa' };
  person.add(head);
  g.add(person);

  // Marble Coffee Table
  const table = new THREE.Group();
  table.position.set(-0.25, 0, 0.75);
  const tLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 10), MAT.gold);
  tLeg.position.y = 0.1;
  tLeg.name = 'interactive';
  tLeg.userData = { productName: 'Lounge Sofa' };
  table.add(tLeg);

  const tTop = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.025, 24), MAT.marble);
  tTop.position.y = 0.21;
  tTop.name = 'interactive';
  tTop.userData = { productName: 'Lounge Sofa' };
  table.add(tTop);

  // Small vase
  const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.09, 8), MAT.steelDark);
  vase.position.set(0.04, 0.26, 0.04);
  vase.name = 'interactive';
  vase.userData = { productName: 'Lounge Sofa' };
  table.add(vase);

  // Dried branches
  for (let i = 0; i < 3; i++) {
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.24, 4), MAT.gold);
    branch.position.set(0.04, 0.38, 0.04);
    branch.rotation.z = -0.18 + i * 0.18;
    branch.rotation.x = -0.08 + i * 0.12;
    branch.name = 'interactive';
    branch.userData = { productName: 'Lounge Sofa' };
    table.add(branch);
  }
  g.add(table);

  return g;
}

export function makeHangingRack(x, y, z, rotY, colors = [0x222222, 0x993333, 0x334499]) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;

  const frameMat = MAT.gold;
  const rodLen = 1.6;

  // Ceiling rods
  for (const rx of [-0.6, 0.6]) {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, rodLen, 8), frameMat);
    rod.position.set(rx, FLOOR_H - rodLen / 2, 0);
    rod.name = 'interactive';
    rod.userData = { productName: 'Organic Hoodies' };
    g.add(rod);
  }

  // Horizontal rack bar
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 1.3, 8), frameMat);
  bar.rotation.z = Math.PI / 2;
  bar.position.y = FLOOR_H - rodLen;
  bar.name = 'interactive';
  bar.userData = { productName: 'Organic Hoodies' };
  g.add(bar);

  // Hanging garments
  for (let i = 0; i < colors.length; i++) {
    const gx = -0.5 + (i / (colors.length - 1)) * 1.0;
    const garment = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.65, 0.04),
      getCachedFabric(colors[i])
    );
    garment.position.set(gx, FLOOR_H - rodLen - 0.34, 0);
    garment.name = 'interactive';
    garment.userData = { productName: 'Organic Hoodies' };
    g.add(garment);

    // Hanger hook
    const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.06, 4), MAT.steelDark);
    hook.position.set(gx, FLOOR_H - rodLen - 0.03, 0);
    hook.name = 'interactive';
    hook.userData = { productName: 'Organic Hoodies' };
    g.add(hook);
  }

  return g;
}

export function makeFullLengthMirror(x, y, z, rotY) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;

  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.65, 0.04), MAT.gold);
  frame.position.y = 0.825;
  frame.castShadow = true;
  frame.name = 'interactive';
  frame.userData = { productName: 'Organic Tees' };
  g.add(frame);

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(0.44, 1.57),
    new THREE.MeshStandardMaterial({ color: 0xdaeffa, metalness: 0.95, roughness: 0.05 })
  );
  glass.position.set(0, 0.825, 0.021);
  glass.name = 'interactive';
  glass.userData = { productName: 'Organic Tees' };
  g.add(glass);

  return g;
}

export function makeShelvingOrganizer(x, y, z, rotY) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;

  const frameMat = MAT.blackFrame;
  const shelfMat = new THREE.MeshStandardMaterial({ color: 0xd4c4ab, roughness: 0.7 });

  // Vertical posts
  for (const px of [-0.38, 0.38]) for (const pz of [-0.18, 0.18]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 1.45, 8), frameMat);
    post.position.set(px, 0.725, pz);
    post.name = 'interactive';
    post.userData = { productName: 'Organizer Stand' };
    g.add(post);
  }

  // Wooden shelves
  for (const sy of [0.08, 0.55, 1.02]) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.025, 0.42), shelfMat);
    shelf.position.y = sy;
    shelf.name = 'interactive';
    shelf.userData = { productName: 'Organizer Stand' };
    g.add(shelf);
  }

  // Box on bottom shelf
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.3), new THREE.MeshStandardMaterial({ color: 0xe5dac6, roughness: 0.75 }));
  box.position.set(-0.15, 0.15, 0);
  box.name = 'interactive';
  box.userData = { productName: 'Organizer Stand' };
  g.add(box);

  // Backpack on middle shelf
  const pack = new THREE.Group();
  pack.position.set(0.12, 0.56, 0);
  const packBody = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.3, 0.12), new THREE.MeshStandardMaterial({ color: 0x503b31, roughness: 0.9 }));
  packBody.position.y = 0.15;
  packBody.name = 'interactive';
  packBody.userData = { productName: 'Organizer Stand' };
  pack.add(packBody);
  
  const packPocket = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.05), new THREE.MeshStandardMaterial({ color: 0x3a251b, roughness: 0.9 }));
  packPocket.position.set(0, 0.08, 0.07);
  packPocket.name = 'interactive';
  packPocket.userData = { productName: 'Organizer Stand' };
  pack.add(packPocket);
  g.add(pack);

  // Cap on top shelf
  const cap = new THREE.Group();
  cap.position.set(-0.12, 1.04, 0);
  const capDome = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x1d1d21 }));
  capDome.scale.set(1, 0.75, 1);
  capDome.name = 'interactive';
  capDome.userData = { productName: 'Organizer Stand' };
  cap.add(capDome);
  
  const capBrim = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.005, 0.07), new THREE.MeshStandardMaterial({ color: 0x1d1d21 }));
  capBrim.position.set(0, 0.002, 0.05);
  capBrim.name = 'interactive';
  capBrim.userData = { productName: 'Organizer Stand' };
  cap.add(capBrim);
  g.add(cap);

  return g;
}

export function makeBigPottedPlant(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.4, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.65 }));
  pot.position.y = 0.2;
  pot.name = 'interactive';
  pot.userData = { productName: 'Hirume Bonsai' };
  g.add(pot);

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.0, 8), new THREE.MeshStandardMaterial({ color: 0x51382b, roughness: 0.95 }));
  trunk.position.y = 0.7;
  trunk.name = 'interactive';
  trunk.userData = { productName: 'Hirume Bonsai' };
  g.add(trunk);

  const leafMat = new THREE.MeshStandardMaterial({ color: 0x224820, roughness: 0.8, side: THREE.DoubleSide });
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    const leafHeight = 0.55 + Math.random() * 0.35;
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.005, 0.32), leafMat);
    leaf.position.set(Math.cos(angle) * 0.16, leafHeight, Math.sin(angle) * 0.16);
    leaf.rotation.y = -angle;
    leaf.rotation.x = 0.22;
    leaf.name = 'interactive';
    leaf.userData = { productName: 'Hirume Bonsai' };
    g.add(leaf);
  }

  return g;
}

export function makePartitionWall(x, y, z, rotY, color = 0x2a3d4a) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;

  const wall = new THREE.Mesh(
    new THREE.CylinderGeometry(2.3, 2.3, FLOOR_H - 0.1, 32, 1, true, 0, Math.PI / 2.1),
    new THREE.MeshStandardMaterial({ color: color, roughness: 0.75, side: THREE.DoubleSide })
  );
  wall.position.y = (FLOOR_H - 0.1) / 2;
  wall.castShadow = true;
  wall.name = 'interactive';
  wall.userData = { productName: 'Hirume Bonsai' };
  g.add(wall);

  return g;
}
