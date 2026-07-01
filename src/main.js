import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import gsap from 'gsap';

// ─────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────
const W = 12;          // building width
const D = 8;           // building depth
const FLOOR_H = 3.2;   // floor height
const NUM_FLOORS = 4;

const FLOORS = [
  { id: 0, name: 'Grand Lobby',        desc: 'Welcome to the world of Earth Positive', tags: ['Reception', 'Concierge', 'Café Bar'] },
  { id: 1, name: 'T-Shirts Atelier',   desc: 'Premium organic cotton essentials',       tags: ['Classic Tees', 'Graphic Series', 'Limited Drops'] },
  { id: 2, name: 'Hoodies & Streetwear', desc: 'Luxury sustainable streetwear',         tags: ['Oversized', 'Zip-Ups', 'Collaborations'] },
  { id: 3, name: 'Accessories Suite',  desc: 'Tote bags, caps & premium accessories',   tags: ['Totes', 'Caps', 'Jewellery'] },
];

// ─────────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────────
let isInside = false;
let currentInteriorFloor = 0;
let animating = false;

// ─────────────────────────────────────────────────
//  RENDERER
// ─────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.prepend(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.cssText = 'position:absolute;top:0;pointer-events:none;';
document.body.prepend(labelRenderer.domElement);

// ─────────────────────────────────────────────────
//  SCENE
// ─────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05050e, 0.018);

// City skyline background
const bgLoader = new THREE.TextureLoader();
bgLoader.load('/city_skyline.jpg', (tex) => {
  tex.colorSpace = THREE.SRGBColorSpace;
  scene.background = tex;
});

// ─────────────────────────────────────────────────
//  CAMERA
// ─────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(22, 16, 28);

// ─────────────────────────────────────────────────
//  CONTROLS
// ─────────────────────────────────────────────────
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.minDistance = 6;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2.1;
controls.minPolarAngle = Math.PI / 8;
controls.target.set(0, 6, 0);
controls.update();

// ─────────────────────────────────────────────────
//  LIGHTS
// ─────────────────────────────────────────────────
// Ambient
scene.add(new THREE.AmbientLight(0x1a1a2e, 0.6));

// Hemisphere — sky warmth
const hemi = new THREE.HemisphereLight(0x3a4a6a, 0x111118, 0.5);
scene.add(hemi);

// Key directional
const keyLight = new THREE.DirectionalLight(0xfff0e8, 2.0);
keyLight.position.set(18, 28, 16);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(4096, 4096);
keyLight.shadow.camera.near = 1;
keyLight.shadow.camera.far = 80;
keyLight.shadow.camera.left = -30;
keyLight.shadow.camera.right = 30;
keyLight.shadow.camera.top = 30;
keyLight.shadow.camera.bottom = -30;
keyLight.shadow.bias = -0.0005;
scene.add(keyLight);

// Fill
const fillLight = new THREE.DirectionalLight(0x4060a0, 0.35);
fillLight.position.set(-15, 10, -12);
scene.add(fillLight);

// Rim
const rimLight = new THREE.DirectionalLight(0xffeedd, 0.5);
rimLight.position.set(-10, 6, 22);
scene.add(rimLight);

// ─────────────────────────────────────────────────
//  MATERIALS (shared)
// ─────────────────────────────────────────────────
const MAT = {
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

// ─────────────────────────────────────────────────
//  GROUND PLANE
// ─────────────────────────────────────────────────
const ground = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), MAT.groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.08;
ground.receiveShadow = true;
scene.add(ground);

// Approach plaza
const plaza = new THREE.Mesh(
  new THREE.PlaneGeometry(W + 8, 10),
  new THREE.MeshStandardMaterial({ color: 0x1a1a22, roughness: 0.7, metalness: 0.1 })
);
plaza.rotation.x = -Math.PI / 2;
plaza.position.set(0, -0.02, D / 2 + 4.5);
plaza.receiveShadow = true;
scene.add(plaza);

// Gold inlay strips on plaza
for (let i = -3; i <= 3; i++) {
  const strip = new THREE.Mesh(
    new THREE.PlaneGeometry(0.04, 8),
    new THREE.MeshStandardMaterial({ color: 0xC9A84C, roughness: 0.3, metalness: 0.9, emissive: 0xC9A84C, emissiveIntensity: 0.04 })
  );
  strip.rotation.x = -Math.PI / 2;
  strip.position.set(i * 1.2, -0.01, D / 2 + 4.5);
  scene.add(strip);
}

// ─────────────────────────────────────────────────
//  BUILDING GROUP
// ─────────────────────────────────────────────────
const building = new THREE.Group();
scene.add(building);

// ── CORE CONCRETE STRUCTURE ──
// Back solid wall (full height)
const backWall = new THREE.Mesh(
  new THREE.BoxGeometry(W, FLOOR_H * NUM_FLOORS, 0.35),
  MAT.concDark
);
backWall.position.set(0, (FLOOR_H * NUM_FLOORS) / 2, -D / 2 + 0.18);
backWall.castShadow = true;
backWall.receiveShadow = true;
building.add(backWall);

// Left solid wall
const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(0.35, FLOOR_H * NUM_FLOORS, D),
  MAT.concDark
);
leftWall.position.set(-W / 2 + 0.18, (FLOOR_H * NUM_FLOORS) / 2, 0);
leftWall.castShadow = true;
building.add(leftWall);

// Right solid wall
const rightWall = leftWall.clone();
rightWall.position.set(W / 2 - 0.18, (FLOOR_H * NUM_FLOORS) / 2, 0);
building.add(rightWall);

// ── FLOOR SLABS ──
for (let i = 0; i <= NUM_FLOORS; i++) {
  const y = i * FLOOR_H;

  // Main slab
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(W + 0.8, 0.18, D + 0.8),
    new THREE.MeshStandardMaterial({ color: 0x202028, roughness: 0.6, metalness: 0.15 })
  );
  slab.position.y = y;
  slab.receiveShadow = true;
  slab.castShadow = true;
  building.add(slab);

  // Front slab edge — steel/dark metal cap
  const edgeCap = new THREE.Mesh(
    new THREE.BoxGeometry(W + 0.85, 0.12, 0.12),
    MAT.steelDark
  );
  edgeCap.position.set(0, y + 0.05, D / 2 + 0.44);
  building.add(edgeCap);

  if (i < NUM_FLOORS) {
    // Interior floor surface (white marble look)
    const floorSurface = new THREE.Mesh(
      new THREE.PlaneGeometry(W - 0.5, D - 0.5),
      new THREE.MeshStandardMaterial({ color: 0xf5f2ec, roughness: 0.25, metalness: 0.08 })
    );
    floorSurface.rotation.x = -Math.PI / 2;
    floorSurface.position.set(0, y + 0.1, 0);
    floorSurface.receiveShadow = true;
    building.add(floorSurface);
  }
}

// ── FRONT FACADE — CURTAIN WALL ──
for (let floor = 0; floor < NUM_FLOORS; floor++) {
  const baseY = floor * FLOOR_H;
  const panelH = FLOOR_H - 0.22;

  // Large glass curtain panels (split into bay sections)
  const numBays = 5;
  const bayW = (W - 0.5) / numBays;

  for (let bay = 0; bay < numBays; bay++) {
    // Skip center-bottom bay on floor 0 — that's the door
    if (floor === 0 && bay === 2) continue;

    const bx = -W / 2 + 0.25 + bay * bayW + bayW / 2;

    const glassPane = new THREE.Mesh(
      new THREE.BoxGeometry(bayW - 0.12, panelH - 0.08, 0.05),
      MAT.glass.clone()
    );
    glassPane.position.set(bx, baseY + panelH / 2 + 0.14, D / 2 + 0.03);
    building.add(glassPane);

    // Spandrel (opaque band below each panel)
    const spandrel = new THREE.Mesh(
      new THREE.BoxGeometry(bayW - 0.12, 0.28, 0.06),
      MAT.steelDark
    );
    spandrel.position.set(bx, baseY + 0.22, D / 2 + 0.03);
    building.add(spandrel);
  }

  // Vertical mullions — dark aluminium look
  for (let bay = 0; bay <= numBays; bay++) {
    const bx = -W / 2 + 0.25 + bay * bayW;
    const mullion = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, panelH, 0.1),
      MAT.blackFrame
    );
    mullion.position.set(bx, baseY + panelH / 2 + 0.14, D / 2 + 0.04);
    building.add(mullion);
  }

  // Warm interior glow plane (subtle, not yellow)
  const glowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(W - 1, panelH - 0.2),
    new THREE.MeshBasicMaterial({ color: 0xfff6e8, transparent: true, opacity: 0.06, side: THREE.DoubleSide })
  );
  glowPlane.position.set(0, baseY + panelH / 2 + 0.14, D / 2 - 0.4);
  building.add(glowPlane);
}

// ── INTERIOR LIGHTS (one per floor) ──
const interiorLights = [];
for (let i = 0; i < NUM_FLOORS; i++) {
  const lightY = i * FLOOR_H + FLOOR_H * 0.7;
  const pt = new THREE.PointLight(0xffffff, 1.6, FLOOR_H * 1.5, 1.8);
  pt.position.set(0, lightY, 0);
  building.add(pt);
  interiorLights.push(pt);

  // Light fixture (ceiling strip)
  for (const lx of [-3, 0, 3]) {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.04, 0.22),
      MAT.emitWhite
    );
    strip.position.set(lx, i * FLOOR_H + FLOOR_H - 0.12, 0);
    building.add(strip);
  }
}

// ── STRUCTURAL COLUMNS (4 corners + intermediate) ──
const colPositions = [
  [-W/2+0.2, -D/2+0.2], [W/2-0.2, -D/2+0.2],
  [-W/2+0.2, D/2-0.2], [W/2-0.2, D/2-0.2],
  [0, -D/2+0.2], [0, D/2-0.2],
];
for (const [cx, cz] of colPositions) {
  const col = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, FLOOR_H * NUM_FLOORS + 0.3, 0.28),
    MAT.steelDark
  );
  col.position.set(cx, (FLOOR_H * NUM_FLOORS) / 2, cz);
  col.castShadow = true;
  building.add(col);
}

// ── ROOF ──
const roofSlab = new THREE.Mesh(
  new THREE.BoxGeometry(W + 0.9, 0.3, D + 0.9),
  new THREE.MeshStandardMaterial({ color: 0x252530, roughness: 0.6, metalness: 0.25 })
);
roofSlab.position.y = NUM_FLOORS * FLOOR_H + 0.15;
roofSlab.castShadow = true;
building.add(roofSlab);

// Roof parapet
const parapet = new THREE.Mesh(
  new THREE.BoxGeometry(W + 0.9, 0.5, 0.15),
  MAT.steelDark
);
parapet.position.set(0, NUM_FLOORS * FLOOR_H + 0.55, D / 2 + 0.45);
building.add(parapet);

// Roof edge light strip
const roofEdge = new THREE.Mesh(
  new THREE.BoxGeometry(W + 1, 0.04, D + 1),
  new THREE.MeshStandardMaterial({ color: 0xC9A84C, roughness: 0.2, metalness: 0.9, emissive: 0xC9A84C, emissiveIntensity: 0.15 })
);
roofEdge.position.y = NUM_FLOORS * FLOOR_H + 0.32;
building.add(roofEdge);

// ── GRAND ENTRANCE DOOR ──
// Door surround frame
const doorFrameW = 2.8, doorFrameH = FLOOR_H * 0.82;
const doorFrame = new THREE.Mesh(
  new THREE.BoxGeometry(doorFrameW + 0.24, doorFrameH + 0.16, 0.18),
  MAT.blackFrame
);
doorFrame.position.set(0, doorFrameH / 2 + 0.14, D / 2 + 0.05);
building.add(doorFrame);

// Left door glass panel
const doorGlassMat = new THREE.MeshPhysicalMaterial({
  color: 0xa8c8e8, metalness: 0.1, roughness: 0.0,
  transparent: true, opacity: 0.35,
  side: THREE.DoubleSide, envMapIntensity: 1.5
});
const leftDoor = new THREE.Mesh(
  new THREE.BoxGeometry(doorFrameW / 2 - 0.06, doorFrameH - 0.1, 0.05),
  doorGlassMat.clone()
);
leftDoor.position.set(-doorFrameW / 4, doorFrameH / 2 + 0.14, D / 2 + 0.1);
building.add(leftDoor);

const rightDoor = leftDoor.clone();
rightDoor.position.set(doorFrameW / 4, doorFrameH / 2 + 0.14, D / 2 + 0.1);
building.add(rightDoor);

// Door center divider
const doorDivider = new THREE.Mesh(
  new THREE.BoxGeometry(0.06, doorFrameH - 0.1, 0.12),
  MAT.blackFrame
);
doorDivider.position.set(0, doorFrameH / 2 + 0.14, D / 2 + 0.1);
building.add(doorDivider);

// Door handles
for (const hx of [-0.45, 0.45]) {
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.55, 8),
    MAT.steel
  );
  handle.rotation.x = Math.PI / 2;
  handle.position.set(hx, doorFrameH * 0.48, D / 2 + 0.14);
  building.add(handle);
}

// Entrance canopy — modern thin overhang
const canopy = new THREE.Mesh(
  new THREE.BoxGeometry(doorFrameW + 2.5, 0.08, 1.6),
  new THREE.MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.4, metalness: 0.7 })
);
canopy.position.set(0, doorFrameH + 0.36, D / 2 + 0.7);
canopy.castShadow = true;
building.add(canopy);

// Canopy support fins
for (const cx of [-1.0, 0, 1.0]) {
  const fin = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.4, 1.6),
    MAT.steelDark
  );
  fin.position.set(cx, doorFrameH + 0.16, D / 2 + 0.7);
  building.add(fin);
}

// Canopy underside LED
const canopyLED = new THREE.Mesh(
  new THREE.PlaneGeometry(doorFrameW + 2.3, 1.5),
  new THREE.MeshBasicMaterial({ color: 0xfff5e8, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
);
canopyLED.rotation.x = Math.PI / 2;
canopyLED.position.set(0, doorFrameH + 0.31, D / 2 + 0.7);
building.add(canopyLED);

// Canopy spotlight
const canopySpot = new THREE.SpotLight(0xfff5e8, 4.0, 8, Math.PI / 4.5, 0.5, 1.5);
canopySpot.position.set(0, doorFrameH + 0.28, D / 2 + 0.7);
canopySpot.target.position.set(0, 0, D / 2 + 0.7);
scene.add(canopySpot);
scene.add(canopySpot.target);

// Brand signage above door
function makeCSSLabel(text, styles = {}) {
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

const brandSign = makeCSSLabel('Earth Positive');
brandSign.position.set(0, doorFrameH + 0.55, D / 2 + 0.18);
building.add(brandSign);

// ── INTERIOR ASSETS (per floor) ──
function makeClothingRack(x, y, z, rotY, colors = [0x222222, 0x993333, 0x334499, 0x228833]) {
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

function makeMannequin(x, y, z, rotY, garmentColor = 0x222222) {
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
  return g;
}

function makeStaffMember(x, y, z, rotY) {
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

function makeDisplayTable(x, y, z, rotY) {
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

function makeReceptionDesk(x, y, z, rotY) {
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

// ── FLOOR 0 — Grand Lobby ──
const lobby = new THREE.Group();
building.add(lobby);

lobby.add(makeReceptionDesk(0, 0.04, -0.8, 0));
lobby.add(makeStaffMember(0, 0.04, 0.0, 0));
lobby.add(makeClothingRack(-3.5, 0.04, -1.8, Math.PI / 2, [0x111111, 0x333333, 0x222222, 0xcccccc]));
lobby.add(makeMannequin(-1.8, 0.04, 1.0, Math.PI * 0.1, 0x111111));
lobby.add(makeMannequin(1.8, 0.04, 1.0, -Math.PI * 0.1, 0x333344));
lobby.add(makeDisplayTable(3.2, 0.04, -1.0, -Math.PI / 8));

// Lobby sofa
const sofaMat = new THREE.MeshStandardMaterial({ color: 0x18181e, roughness: 0.7 });
for (const sx of [-2.5, 2.5]) {
  const sofa = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.42, 0.6), sofaMat);
  sofa.position.set(sx, FLOOR_H * 0 + 0.22, 1.8);
  building.add(sofa);
  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.12), sofaMat);
  sofaBack.position.set(sx, FLOOR_H * 0 + 0.52, 2.1);
  building.add(sofaBack);
}

// Lobby potted plant
const potMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });
const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.35, 10), potMat);
pot.position.set(-4.5, FLOOR_H * 0 + 0.18, 2.4);
building.add(pot);
const plant = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 10),
  new THREE.MeshStandardMaterial({ color: 0x1b4d1e, roughness: 0.8 }));
plant.position.set(-4.5, FLOOR_H * 0 + 0.5, 2.4);
building.add(plant);

// ── FLOOR 1 — T-Shirts ──
const tShirtFloor = new THREE.Group();
tShirtFloor.position.y = FLOOR_H;
building.add(tShirtFloor);

tShirtFloor.add(makeClothingRack(-2.5, 0.04, -1.5, 0, [0xe53935, 0xffa000, 0x43a047, 0x1e88e5]));
tShirtFloor.add(makeClothingRack(2.5, 0.04, -1.5, 0, [0x333333, 0x111111, 0xffffff, 0x880000]));
tShirtFloor.add(makeClothingRack(0, 0.04, -2.0, 0, [0x5c6bc0, 0xef5350, 0x66bb6a, 0xffca28]));
tShirtFloor.add(makeDisplayTable(0, 0.04, 0.8, 0));
tShirtFloor.add(makeMannequin(-0.8, 0.04, 1.2, -0.2, 0x1a1a1a));
tShirtFloor.add(makeMannequin(0.8, 0.04, 1.2, 0.2, 0xd32f2f));
tShirtFloor.add(makeStaffMember(3.8, 0.04, 0.6, -Math.PI / 2));

// ── FLOOR 2 — Hoodies ──
const hoodieFloor = new THREE.Group();
hoodieFloor.position.y = FLOOR_H * 2;
building.add(hoodieFloor);

hoodieFloor.add(makeClothingRack(-3.0, 0.04, -1.5, 0, [0x212121, 0x263238, 0x37474f, 0xbdbdbd]));
hoodieFloor.add(makeClothingRack(3.0, 0.04, -1.5, 0, [0x33691e, 0x558b2f, 0x1b5e20, 0x004d40]));
hoodieFloor.add(makeClothingRack(0, 0.04, -2.4, 0, [0x880e4f, 0xad1457, 0xc62828, 0x4a148c]));
hoodieFloor.add(makeDisplayTable(-2.0, 0.04, 1.0, Math.PI / 6));
hoodieFloor.add(makeDisplayTable(2.0, 0.04, 1.0, -Math.PI / 6));
hoodieFloor.add(makeMannequin(0, 0.04, 0.8, 0, 0x212121));
hoodieFloor.add(makeStaffMember(-3.8, 0.04, 0.6, Math.PI / 2));

// ── FLOOR 3 — Accessories ──
const accFloor = new THREE.Group();
accFloor.position.y = FLOOR_H * 3;
building.add(accFloor);

accFloor.add(makeClothingRack(-1.5, 0.04, -1.5, 0, [0xC9A84C, 0xb8860b, 0x8B6914, 0xffd700]));
accFloor.add(makeClothingRack(1.5, 0.04, -1.5, 0, [0x1a1a1a, 0x2d2d2d, 0xeeeeee, 0x888888]));
accFloor.add(makeDisplayTable(-2.8, 0.04, 0.8, Math.PI / 5));
accFloor.add(makeDisplayTable(2.8, 0.04, 0.8, -Math.PI / 5));
accFloor.add(makeDisplayTable(0, 0.04, 1.2, 0));
accFloor.add(makeMannequin(-1.0, 0.04, 1.5, 0.3, 0xC9A84C));
accFloor.add(makeMannequin(1.0, 0.04, 1.5, -0.3, 0x1a1a1a));
accFloor.add(makeStaffMember(4.0, 0.04, 0.0, -Math.PI / 2));

// ── STAIRCASES (spiral) ──
for (let floor = 0; floor < NUM_FLOORS - 1; floor++) {
  const baseY = floor * FLOOR_H;
  for (let step = 0; step < 12; step++) {
    const ratio = step / 12;
    const angle = ratio * Math.PI * 1.4;
    const r = 0.9;
    const stairMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.04, 0.25),
      MAT.marble
    );
    stairMesh.position.set(
      -W / 2 + 1.5 + Math.cos(angle) * r,
      baseY + ratio * FLOOR_H + 0.02,
      -D / 2 + 1.5 + Math.sin(angle) * r
    );
    stairMesh.rotation.y = -angle;
    building.add(stairMesh);
  }
  // Stair newel post
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, FLOOR_H, 8), MAT.steel);
  post.position.set(-W / 2 + 1.5, baseY + FLOOR_H / 2, -D / 2 + 1.5);
  building.add(post);
}

// ── EXTERIOR ELEMENTS ──
// Entry bollards
for (const bx of [-2.5, -1.5, 1.5, 2.5]) {
  const bollard = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 0.8, 8),
    MAT.steelDark
  );
  bollard.position.set(bx, 0.4, D / 2 + 1.2);
  scene.add(bollard);
  // Bollard cap glow
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.4 }));
  cap.position.set(bx, 0.88, D / 2 + 1.2);
  scene.add(cap);
  const blight = new THREE.PointLight(0xfff8e8, 0.4, 2.5);
  blight.position.set(bx, 0.85, D / 2 + 1.2);
  scene.add(blight);
}

// Modern slim trees (exterior)
function makeThinTree(x, z, h = 2.8) {
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

const treePositions = [
  [-7, 5], [-7, 2], [-7, -2], [-7, -5],
  [7, 5], [7, 2], [7, -2], [7, -5],
  [-4, 7.5], [4, 7.5], [-2, 8.5], [2, 8.5]
];
for (const [tx, tz] of treePositions) {
  scene.add(makeThinTree(tx, tz));
}

// ── PARTICLES (ambient gold dust) ──
const pCount = 300;
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(pCount * 3);
for (let i = 0; i < pCount; i++) {
  const a = Math.random() * Math.PI * 2;
  const r = 5 + Math.random() * 18;
  pPos[i*3]   = Math.cos(a) * r;
  pPos[i*3+1] = Math.random() * 20;
  pPos[i*3+2] = Math.sin(a) * r;
}
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
  color: 0xC9A84C, size: 0.025, transparent: true, opacity: 0.18,
  blending: THREE.AdditiveBlending, sizeAttenuation: true
}));
scene.add(particles);

// ─────────────────────────────────────────────────
//  INTERACTIVE "ENTER SHOWROOM" BUTTON (CSS2D)
// ─────────────────────────────────────────────────
const enterDiv = document.createElement('button');
enterDiv.id = 'enter-door-btn';
enterDiv.innerHTML = `
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style="margin-right:7px">
    <path d="M3 1.5L7 5L3 8.5" stroke="#F5D76E" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
  Enter Showroom`;
Object.assign(enterDiv.style, {
  fontFamily: '"Inter", sans-serif',
  fontSize: '10.5px', fontWeight: '500',
  letterSpacing: '0.22em',
  color: '#F5D76E',
  padding: '9px 20px',
  background: 'rgba(0,0,0,0.88)',
  border: '1px solid rgba(201,168,76,0.45)',
  borderRadius: '2px',
  cursor: 'pointer',
  pointerEvents: 'auto',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 20px rgba(0,0,0,0.6)',
  display: 'flex', alignItems: 'center',
  textTransform: 'uppercase',
  backdropFilter: 'blur(8px)',
  whiteSpace: 'nowrap',
  opacity: '1',
});

enterDiv.addEventListener('pointerenter', () => {
  Object.assign(enterDiv.style, {
    background: '#C9A84C',
    color: '#000',
    boxShadow: '0 0 28px rgba(201,168,76,0.5)',
    borderColor: '#C9A84C',
  });
  enterDiv.querySelector('path').setAttribute('stroke', '#000');
});
enterDiv.addEventListener('pointerleave', () => {
  Object.assign(enterDiv.style, {
    background: 'rgba(0,0,0,0.88)',
    color: '#F5D76E',
    boxShadow: '0 2px 20px rgba(0,0,0,0.6)',
    borderColor: 'rgba(201,168,76,0.45)',
  });
  enterDiv.querySelector('path').setAttribute('stroke', '#F5D76E');
});
enterDiv.addEventListener('click', (e) => {
  e.stopPropagation();
  enterBuilding();
});

const enterBtnLabel = new CSS2DObject(enterDiv);
enterBtnLabel.position.set(0, doorFrameH * 0.52, D / 2 + 0.22);
building.add(enterBtnLabel);

// ─────────────────────────────────────────────────
//  CAMERA PRESETS
// ─────────────────────────────────────────────────
const CAM = {
  exterior: {
    pos: new THREE.Vector3(22, 16, 28),
    target: new THREE.Vector3(0, 6, 0)
  },
  lobby: {
    pos: new THREE.Vector3(0, FLOOR_H * 0.5, D / 2 + 4),
    target: new THREE.Vector3(0, FLOOR_H * 0.5, -1)
  },
  floors: [
    { pos: new THREE.Vector3(0, FLOOR_H * 0.55, D / 2 + 3.8), target: new THREE.Vector3(0, FLOOR_H * 0.55, -1) },
    { pos: new THREE.Vector3(0, FLOOR_H * 1.55, D / 2 + 3.8), target: new THREE.Vector3(0, FLOOR_H * 1.55, -1) },
    { pos: new THREE.Vector3(0, FLOOR_H * 2.55, D / 2 + 3.8), target: new THREE.Vector3(0, FLOOR_H * 2.55, -1) },
    { pos: new THREE.Vector3(0, FLOOR_H * 3.55, D / 2 + 3.8), target: new THREE.Vector3(0, FLOOR_H * 3.55, -1) },
  ]
};

// ─────────────────────────────────────────────────
//  DOM REFS
// ─────────────────────────────────────────────────
const overlay     = document.getElementById('transition-overlay');
const navDots     = document.getElementById('nav-dots');
const hintEl      = document.getElementById('hint');
const backBtn     = document.getElementById('back-btn');
const interiorHUD = document.getElementById('interior-hud');
const interiorTitle = document.getElementById('interiorTitle');
const interiorDesc  = document.getElementById('interiorDesc');
const interiorTags  = document.getElementById('interiorTags');
const floorInfoEl   = document.getElementById('floor-info');
const fiTitle       = document.getElementById('fiTitle');
const fiDesc        = document.getElementById('fiDesc');

// ─────────────────────────────────────────────────
//  ENTER BUILDING (door click → fly-through)
// ─────────────────────────────────────────────────
function enterBuilding() {
  if (isInside || animating) return;
  animating = true;

  // Phase 1: fade to black
  overlay.classList.add('active');

  setTimeout(() => {
    isInside = true;

    // Restrict controls inside
    controls.minDistance = 1.5;
    controls.maxDistance = 12;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.minPolarAngle = Math.PI / 4;

    // Move camera instantly while black
    const f = CAM.floors[0];
    camera.position.copy(f.pos);
    controls.target.copy(f.target);
    controls.update();

    currentInteriorFloor = 0;
    updateInteriorHUD(0);

    // Show interior UI
    enterDiv.style.display = 'none';
    navDots.style.display = 'none';
    hintEl.textContent = 'Drag to explore · Scroll to zoom · Use ← → to change floors';
    backBtn.classList.add('visible');
    interiorHUD.classList.add('visible');
    floorInfoEl.classList.remove('visible');

    // Phase 2: fade back in (inside building now)
    setTimeout(() => {
      overlay.classList.remove('active');
      animating = false;
    }, 200);

  }, 450);
}

// ─────────────────────────────────────────────────
//  EXIT BUILDING
// ─────────────────────────────────────────────────
function exitBuilding() {
  if (!isInside || animating) return;
  animating = true;

  overlay.classList.add('active');

  setTimeout(() => {
    isInside = false;

    // Restore exterior controls
    controls.minDistance = 6;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minPolarAngle = Math.PI / 8;

    camera.position.copy(CAM.exterior.pos);
    controls.target.copy(CAM.exterior.target);
    controls.update();

    // Restore exterior UI
    enterDiv.style.display = 'flex';
    navDots.style.display = 'flex';
    hintEl.textContent = 'Drag to Orbit · Scroll to Zoom · Click Door to Enter';
    backBtn.classList.remove('visible');
    interiorHUD.classList.remove('visible');

    setTimeout(() => {
      overlay.classList.remove('active');
      animating = false;
    }, 200);

  }, 450);
}

// ─────────────────────────────────────────────────
//  CHANGE INTERIOR FLOOR (smooth GSAP)
// ─────────────────────────────────────────────────
function goToInteriorFloor(idx) {
  if (!isInside || animating || idx === currentInteriorFloor) return;
  animating = true;

  const f = CAM.floors[idx];
  gsap.to(camera.position, {
    x: f.pos.x, y: f.pos.y, z: f.pos.z,
    duration: 1.4, ease: 'power3.inOut',
    onUpdate: () => controls.update()
  });
  gsap.to(controls.target, {
    x: f.target.x, y: f.target.y, z: f.target.z,
    duration: 1.4, ease: 'power3.inOut',
    onUpdate: () => controls.update(),
    onComplete: () => { animating = false; }
  });

  currentInteriorFloor = idx;
  updateInteriorHUD(idx);
}

function updateInteriorHUD(idx) {
  const data = FLOORS[idx];
  interiorTitle.textContent = data.name;
  interiorDesc.textContent = data.desc;
  interiorTags.innerHTML = data.tags
    .map(t => `<span class="floor-item-tag">${t}</span>`)
    .join('');
}

// ─────────────────────────────────────────────────
//  EXTERIOR DOT NAVIGATION (exterior only)
// ─────────────────────────────────────────────────
const EXT_CAM = [
  { pos: new THREE.Vector3(22, 16, 28), target: new THREE.Vector3(0, 6, 0) },
  { pos: new THREE.Vector3(0, 4, 22),   target: new THREE.Vector3(0, 4, 0) },
  { pos: new THREE.Vector3(-18, 8, 18), target: new THREE.Vector3(0, 6, 0) },
  { pos: new THREE.Vector3(-22, 12, 0), target: new THREE.Vector3(0, 7, 0) },
  { pos: new THREE.Vector3(0, 18, -22), target: new THREE.Vector3(0, 7, 0) },
  { pos: new THREE.Vector3(0, 26, 10),  target: new THREE.Vector3(0, 10, 0) },
];

let currentDot = 0;

function goToExteriorView(idx) {
  if (isInside || animating || idx === currentDot) return;
  animating = true;
  const v = EXT_CAM[idx] || EXT_CAM[0];
  gsap.to(camera.position, {
    x: v.pos.x, y: v.pos.y, z: v.pos.z,
    duration: 1.8, ease: 'power3.inOut',
    onUpdate: () => controls.update()
  });
  gsap.to(controls.target, {
    x: v.target.x, y: v.target.y, z: v.target.z,
    duration: 1.8, ease: 'power3.inOut',
    onUpdate: () => controls.update(),
    onComplete: () => { animating = false; }
  });
  currentDot = idx;

  const data = { 0: 'Overview', 1: 'Front View', 2: 'Side View', 3: 'Left Facade', 4: 'Rear View', 5: 'Aerial' };
  fiTitle.textContent = data[idx] || 'Earth Positive';
  fiDesc.textContent = 'Virtual Flagship Store';
  floorInfoEl.classList.add('visible');

  document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
  const dot = document.querySelector(`.dot[data-idx="${idx}"]`);
  if (dot) dot.classList.add('active');
}

// ─────────────────────────────────────────────────
//  EVENTS
// ─────────────────────────────────────────────────
document.querySelectorAll('.dot').forEach(d => {
  d.addEventListener('click', () => {
    if (!isInside) goToExteriorView(parseInt(d.dataset.idx));
  });
});

backBtn.addEventListener('click', exitBuilding);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isInside) { exitBuilding(); return; }
  if (isInside) {
    if (e.key === 'ArrowRight' && currentInteriorFloor < FLOORS.length - 1) goToInteriorFloor(currentInteriorFloor + 1);
    if (e.key === 'ArrowLeft' && currentInteriorFloor > 0) goToInteriorFloor(currentInteriorFloor - 1);
    if (e.key === 'ArrowUp' && currentInteriorFloor < FLOORS.length - 1) goToInteriorFloor(currentInteriorFloor + 1);
    if (e.key === 'ArrowDown' && currentInteriorFloor > 0) goToInteriorFloor(currentInteriorFloor - 1);
  }
});

// ─────────────────────────────────────────────────
//  ANIMATION LOOP
// ─────────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Drift particles
  const pos = particles.geometry.attributes.position.array;
  for (let i = 0; i < pCount; i++) {
    pos[i*3+1] += Math.sin(t * 0.15 + i) * 0.001;
    if (pos[i*3+1] > 22) pos[i*3+1] = 0;
    if (pos[i*3+1] < 0)  pos[i*3+1] = 22;
  }
  particles.geometry.attributes.position.needsUpdate = true;

  // Breathe interior lights
  interiorLights.forEach((lt, i) => {
    lt.intensity = 1.4 + Math.sin(t * 0.4 + i * 1.2) * 0.12;
  });

  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

animate();

// ─────────────────────────────────────────────────
//  RESIZE
// ─────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// ─────────────────────────────────────────────────
//  BOOT — fade loading screen & intro animation
// ─────────────────────────────────────────────────
setTimeout(() => {
  document.getElementById('loading').classList.add('hidden');
  floorInfoEl.classList.add('visible');
  fiTitle.textContent = 'Earth Positive Flagship';
  fiDesc.textContent = 'Explore our luxury collections';

  // Cinematic intro pan
  gsap.from(camera.position, {
    z: 50, y: 24,
    duration: 2.8,
    ease: 'power4.out',
    onUpdate: () => controls.update()
  });
  gsap.from(building.scale, {
    x: 0, y: 0, z: 0,
    duration: 2.2,
    ease: 'back.out(1.6)',
    delay: 0.3,
  });
}, 1600);
