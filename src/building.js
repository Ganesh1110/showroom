import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { MAT } from './materials.js';
import { FLOOR_H } from './constants.js';

export const mannequinTorsos = [];
export const mannequinHeads = [];

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
    post.position.set(px, 0.53, 0); g.add(post);
  }
  // Cross bar
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.35, 8), frameMat);
  bar.rotation.z = Math.PI / 2;
  bar.position.y = 1.05; g.add(bar);
  // Base
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.03, 0.18), frameMat);
  base.position.y = 0.015; g.add(base);

  // Garments
  for (let i = 0; i < colors.length; i++) {
    const gx = -0.5 + (i / (colors.length - 1)) * 1.0;
    const garment = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.7, 0.06),
      new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.7 })
    );
    garment.position.set(gx, 0.69, 0);
    g.add(garment);
  }
  return g;
}

export function makeMannequin(x, y, z, rotY, garmentColor = 0x222222) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.04, 8), MAT.steelDark);
  base.position.y = 0.02; g.add(base);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8), MAT.steelDark);
  pole.position.y = 0.32; g.add(pole);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.42, 4, 10),
    new THREE.MeshStandardMaterial({ color: garmentColor, roughness: 0.6 }));
  torso.position.y = 0.88; g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), MAT.concDark);
  head.position.y = 1.18; g.add(head);

  // Store for animation
  mannequinTorsos.push(torso);
  mannequinHeads.push(head);

  return g;
}

export function makeStaffMember(x, y, z, rotY) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.4, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0x18181e, roughness: 0.7 }));
  body.position.y = 0.78; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0xd4a07a, roughness: 0.5 }));
  head.position.y = 1.08; g.add(head);
  // Shirt collar
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.05, 8),
    MAT.white);
  collar.position.y = 0.94; g.add(collar);
  return g;
}

export function makeDisplayTable(x, y, z, rotY) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.05, 0.7), MAT.marble);
  top.position.y = 0.46; g.add(top);
  const trim = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.025, 0.74), MAT.gold);
  trim.position.y = 0.44; g.add(trim);
  for (const lx of [-0.42, 0.42]) for (const lz of [-0.27, 0.27]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.44, 8), MAT.steelDark);
    leg.position.set(lx, 0.22, lz); g.add(leg);
  }
  // Items on table
  const item1 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.16),
    new THREE.MeshStandardMaterial({ color: 0xc62828, roughness: 0.8 }));
  item1.position.set(-0.2, 0.51, -0.08); g.add(item1);
  const item2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.16),
    new THREE.MeshStandardMaterial({ color: 0x1a237e, roughness: 0.8 }));
  item2.position.set(0.22, 0.5, 0.08); g.add(item2);
  return g;
}

export function makeReceptionDesk(x, y, z, rotY) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;

  // Main body
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.95, 0.65), MAT.marbleDark);
  body.position.y = 0.48; g.add(body);

  // Marble top
  const top = new THREE.Mesh(new THREE.BoxGeometry(2.06, 0.055, 0.7), MAT.marble);
  top.position.y = 0.98; g.add(top);

  // Gold trim
  const goldTrim = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.03, 0.72), MAT.gold);
  goldTrim.position.y = 0.97; g.add(goldTrim);

  // Front panel detail
  const panel = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.55, 0.04), MAT.steelDark);
  panel.position.set(0, 0.45, 0.33); g.add(panel);

  // Laptop
  const lBase = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.012, 0.18),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.15 }));
  lBase.position.set(0.5, 1.01, 0.0); g.add(lBase);
  const lScreen = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.17, 0.01),
    new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.85, roughness: 0.1 }));
  lScreen.position.set(0.5, 1.1, -0.07);
  lScreen.rotation.x = -0.45; g.add(lScreen);

  return g;
}

export function makeBirdcage(scale = 1.0) {
  const g = new THREE.Group();
  g.scale.set(scale, scale, scale);
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.9, roughness: 0.15 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 16), goldMat);
  g.add(base);
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), goldMat);
  top.position.y = 0.4;
  g.add(top);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.009, 8, 16), goldMat);
  ring.position.y = 0.6;
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
    new THREE.MeshStandardMaterial({ color: 0xdad5cd, roughness: 0.9 })
  );
  sofaBase.position.set(0, 0.18, 0);
  sofaBase.castShadow = true;
  g.add(sofaBase);

  // Sofa back
  const sofaBack = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.46, 0.15),
    new THREE.MeshStandardMaterial({ color: 0xdad5cd, roughness: 0.9 })
  );
  sofaBack.position.set(0, 0.48, -0.25);
  sofaBack.castShadow = true;
  g.add(sofaBack);

  // Seated Person (sitting mannequin style)
  const person = new THREE.Group();
  person.position.set(0.15, 0.2, 0.0);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.3, 4, 8), new THREE.MeshStandardMaterial({ color: 0xaecbe6, roughness: 0.7 }));
  body.position.y = 0.28;
  body.castShadow = true;
  person.add(body);
  const thighs = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.35), new THREE.MeshStandardMaterial({ color: 0xdad5cd, roughness: 0.7 }));
  thighs.position.set(0, 0.16, 0.16);
  thighs.castShadow = true;
  person.add(thighs);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), new THREE.MeshStandardMaterial({ color: 0xe0b295 }));
  head.position.y = 0.49;
  head.castShadow = true;
  person.add(head);
  g.add(person);

  // Marble Coffee Table
  const table = new THREE.Group();
  table.position.set(-0.25, 0, 0.75);
  const tLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 10), MAT.gold);
  tLeg.position.y = 0.1;
  table.add(tLeg);
  const tTop = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.025, 24), MAT.marble);
  tTop.position.y = 0.21;
  table.add(tTop);
  // Small vase
  const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.09, 8), MAT.steelDark);
  vase.position.set(0.04, 0.26, 0.04);
  table.add(vase);
  // Dried branches
  for (let i = 0; i < 3; i++) {
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.24, 4), MAT.gold);
    branch.position.set(0.04, 0.38, 0.04);
    branch.rotation.z = -0.18 + i * 0.18;
    branch.rotation.x = -0.08 + i * 0.12;
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
    g.add(rod);
  }

  // Horizontal rack bar
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 1.3, 8), frameMat);
  bar.rotation.z = Math.PI / 2;
  bar.position.y = FLOOR_H - rodLen;
  g.add(bar);

  // Hanging garments
  for (let i = 0; i < colors.length; i++) {
    const gx = -0.5 + (i / (colors.length - 1)) * 1.0;
    const garment = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.65, 0.04),
      new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.85 })
    );
    garment.position.set(gx, FLOOR_H - rodLen - 0.34, 0);
    g.add(garment);

    // Hanger hook
    const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.06, 4), MAT.steelDark);
    hook.position.set(gx, FLOOR_H - rodLen - 0.03, 0);
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
  g.add(frame);

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(0.44, 1.57),
    new THREE.MeshStandardMaterial({ color: 0xdaeffa, metalness: 0.95, roughness: 0.05 })
  );
  glass.position.set(0, 0.825, 0.021);
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
    g.add(post);
  }

  // Wooden shelves
  for (const sy of [0.08, 0.55, 1.02]) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.025, 0.42), shelfMat);
    shelf.position.y = sy;
    g.add(shelf);
  }

  // Box on bottom shelf
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.3), new THREE.MeshStandardMaterial({ color: 0xe5dac6, roughness: 0.75 }));
  box.position.set(-0.15, 0.15, 0);
  g.add(box);

  // Backpack on middle shelf
  const pack = new THREE.Group();
  pack.position.set(0.12, 0.56, 0);
  const packBody = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.3, 0.12), new THREE.MeshStandardMaterial({ color: 0x503b31, roughness: 0.9 }));
  packBody.position.y = 0.15;
  pack.add(packBody);
  const packPocket = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.05), new THREE.MeshStandardMaterial({ color: 0x3a251b, roughness: 0.9 }));
  packPocket.position.set(0, 0.08, 0.07);
  pack.add(packPocket);
  g.add(pack);

  // Cap on top shelf
  const cap = new THREE.Group();
  cap.position.set(-0.12, 1.04, 0);
  const capDome = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x1d1d21 }));
  capDome.scale.set(1, 0.75, 1);
  cap.add(capDome);
  const capBrim = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.005, 0.07), new THREE.MeshStandardMaterial({ color: 0x1d1d21 }));
  capBrim.position.set(0, 0.002, 0.05);
  cap.add(capBrim);
  g.add(cap);

  return g;
}

export function makeBigPottedPlant(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.4, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.65 }));
  pot.position.y = 0.2;
  g.add(pot);

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.0, 8), new THREE.MeshStandardMaterial({ color: 0x51382b, roughness: 0.95 }));
  trunk.position.y = 0.7;
  g.add(trunk);

  const leafMat = new THREE.MeshStandardMaterial({ color: 0x224820, roughness: 0.8, side: THREE.DoubleSide });
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    const leafHeight = 0.55 + Math.random() * 0.35;
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.005, 0.32), leafMat);
    leaf.position.set(Math.cos(angle) * 0.16, leafHeight, Math.sin(angle) * 0.16);
    leaf.rotation.y = -angle;
    leaf.rotation.x = 0.22;
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
  g.add(wall);

  return g;
}

export function makeThinTree(x, z, h = 2.8) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.06, h, 6),
    new THREE.MeshStandardMaterial({ color: 0x2a2218, roughness: 0.9 })
  );
  trunk.position.y = h / 2; g.add(trunk);
  
  // Layered canopy
  for (let i = 0; i < 3; i++) {
    const r = 0.45 - i * 0.1;
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(r, 0.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x1a2e1a, roughness: 0.9 })
    );
    cone.position.y = h * 0.65 + i * 0.45;
    cone.castShadow = true;
    g.add(cone);
  }
  g.position.set(x, 0, z);
  return g;
}
