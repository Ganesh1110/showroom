import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
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
renderer.toneMappingExposure = 1.8;
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
scene.fog = new THREE.FogExp2(0x0a0a18, 0.006);

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
//  POST-PROCESSING (Bloom & Output)
// ─────────────────────────────────────────────────
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.65, // strength
  0.4,  // radius
  0.65  // threshold
);
composer.addPass(bloomPass);

const outputPass = new OutputPass();
composer.addPass(outputPass);

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

// ── INTERIOR LIGHTS (per floor, multiple sources for even coverage) ──
const interiorLights = [];
for (let i = 0; i < NUM_FLOORS; i++) {
  const lightY = i * FLOOR_H + FLOOR_H * 0.75;

  // Centre fill
  const ptC = new THREE.PointLight(0xfff8f2, 3.8, FLOOR_H * 2.2, 1.5);
  ptC.position.set(0, lightY, 0);
  building.add(ptC);
  interiorLights.push(ptC);

  // Front and back fill
  for (const pz of [-2.0, 2.0]) {
    const ptSide = new THREE.PointLight(0xfff4e8, 2.2, FLOOR_H * 1.8, 1.8);
    ptSide.position.set(0, lightY - 0.2, pz);
    building.add(ptSide);
  }

  // Light fixture strips on ceiling
  for (const lx of [-3.5, -1.2, 1.2, 3.5]) {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.04, 0.18),
      MAT.emitWhite
    );
    strip.position.set(lx, i * FLOOR_H + FLOOR_H - 0.1, 0);
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
const doorFrameW = 2.8, doorFrameH = FLOOR_H * 0.82;
const doorPanelW = doorFrameW / 2 - 0.06;
const doorPanelH = doorFrameH - 0.1;

// Door surround frame
const doorFrame = new THREE.Mesh(
  new THREE.BoxGeometry(doorFrameW + 0.24, doorFrameH + 0.16, 0.18),
  MAT.blackFrame
);
doorFrame.position.set(0, doorFrameH / 2 + 0.14, D / 2 + 0.05);
building.add(doorFrame);

const doorGlassMat = new THREE.MeshPhysicalMaterial({
  color: 0xb8d8f0, metalness: 0.05, roughness: 0.0,
  transparent: true, opacity: 0.4,
  side: THREE.DoubleSide, envMapIntensity: 1.2
});

// LEFT DOOR — pivot at its LEFT edge, hinge at x = -doorFrameW/2
const leftDoorPivot = new THREE.Group();
leftDoorPivot.position.set(-doorFrameW / 2 + 0.04, doorFrameH / 2 + 0.14, D / 2 + 0.1);
building.add(leftDoorPivot);

const leftDoorMesh = new THREE.Mesh(
  new THREE.BoxGeometry(doorPanelW, doorPanelH, 0.05),
  doorGlassMat.clone()
);
leftDoorMesh.position.set(doorPanelW / 2, 0, 0); // shift so pivot is at left edge
leftDoorPivot.add(leftDoorMesh);

// Left handle
const lHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.5, 8), MAT.steel);
lHandle.rotation.x = Math.PI / 2;
lHandle.position.set(doorPanelW - 0.12, 0, 0.06);
leftDoorPivot.add(lHandle);

// RIGHT DOOR — pivot at its RIGHT edge, hinge at x = +doorFrameW/2
const rightDoorPivot = new THREE.Group();
rightDoorPivot.position.set(doorFrameW / 2 - 0.04, doorFrameH / 2 + 0.14, D / 2 + 0.1);
building.add(rightDoorPivot);

const rightDoorMesh = new THREE.Mesh(
  new THREE.BoxGeometry(doorPanelW, doorPanelH, 0.05),
  doorGlassMat.clone()
);
rightDoorMesh.position.set(-doorPanelW / 2, 0, 0); // shift so pivot is at right edge
rightDoorPivot.add(rightDoorMesh);

const rHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.5, 8), MAT.steel);
rHandle.rotation.x = Math.PI / 2;
rHandle.position.set(-(doorPanelW - 0.12), 0, 0.06);
rightDoorPivot.add(rHandle);

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

// ── Circular Floor Decal Rings (Dark Markings) ──
const floorDecals = new THREE.Group();
const numDecals = 16;
const decalsRadius = 3.3;
const decalGeo = new THREE.BoxGeometry(0.22, 0.005, 0.22);
const decalMat = new THREE.MeshBasicMaterial({ color: 0x222226 });
for (let i = 0; i < numDecals; i++) {
  const angle = (i / numDecals) * Math.PI * 2;
  const decal = new THREE.Mesh(decalGeo, decalMat);
  decal.position.set(Math.cos(angle) * decalsRadius, 0.015, Math.sin(angle) * decalsRadius);
  decal.rotation.y = -angle;
  floorDecals.add(decal);
}
lobby.add(floorDecals);

// ── Left Section: Copper Panel, Birdcages, Bonsai, and HIRUME Banner ──
const leftSection = new THREE.Group();
leftSection.position.set(-3.4, 0.04, -0.6);
lobby.add(leftSection);

const copperPanel = new THREE.Mesh(
  new THREE.CylinderGeometry(1.9, 1.9, 2.9, 32, 1, true, 0, Math.PI / 1.7),
  new THREE.MeshStandardMaterial({ color: 0x824424, metalness: 0.85, roughness: 0.25, side: THREE.DoubleSide })
);
copperPanel.rotation.y = -Math.PI / 3;
copperPanel.position.set(-1.0, 1.45, -0.5);
leftSection.add(copperPanel);

// Procedural Birdcages
function makeBirdcage(scale = 1.0) {
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
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.4, 4), goldMat);
    col.position.set(Math.cos(angle) * 0.17, 0.2, Math.sin(angle) * 0.17);
    g.add(col);
  }
  return g;
}
const cage1 = makeBirdcage(0.85);
cage1.position.set(-0.6, 1.2, 0.5);
leftSection.add(cage1);
const cage2 = makeBirdcage(0.7);
cage2.position.set(-1.1, 0.7, 0.2);
leftSection.add(cage2);
const cage3 = makeBirdcage(1.0);
cage3.position.set(-0.2, 0.5, 0.8);
leftSection.add(cage3);

// Stepped platform
const steppedPlat = new THREE.Group();
steppedPlat.position.set(0.6, 0.0, 0.2);
leftSection.add(steppedPlat);
const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.06, 24), MAT.marble);
p1.position.y = 0.03; steppedPlat.add(p1);
const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.06, 24), MAT.marble);
p2.position.y = 0.09; steppedPlat.add(p2);
const p3 = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.06, 24), MAT.marble);
p3.position.y = 0.15; steppedPlat.add(p3);

// Bonsai Tree on left platform
const bonsai = new THREE.Group();
bonsai.position.set(0.6, 0.18, 0.2);
const bTrunk = new THREE.Mesh(
  new THREE.CylinderGeometry(0.025, 0.045, 0.35, 8),
  new THREE.MeshStandardMaterial({ color: 0x3d2716, roughness: 0.95 })
);
bTrunk.position.y = 0.18;
bTrunk.rotation.z = 0.12;
bonsai.add(bTrunk);
for (let i = 0; i < 3; i++) {
  const fol = new THREE.Mesh(
    new THREE.SphereGeometry(0.16 - i * 0.02, 12, 8),
    new THREE.MeshStandardMaterial({ color: 0x18481a, roughness: 0.85 })
  );
  fol.position.set(0.04 * i, 0.3 + i * 0.08, 0);
  fol.scale.set(1.4, 0.5, 1.2);
  bonsai.add(fol);
}
leftSection.add(bonsai);

// "HIRUME" banner
const hirumeBanner = new THREE.Mesh(
  new THREE.BoxGeometry(0.55, 1.9, 0.02),
  new THREE.MeshStandardMaterial({ color: 0x222225, roughness: 0.8 })
);
hirumeBanner.position.set(1.4, 0.95, -0.6);
hirumeBanner.rotation.y = -Math.PI / 6;
leftSection.add(hirumeBanner);
const hirumeLabel = makeCSSLabel('HIRUME', { fontSize: '8px', color: '#ffffff', letterSpacing: '0.15em', background: 'transparent', border: 'none' });
hirumeLabel.position.set(-1.8, 1.8, -1.2);
lobby.add(hirumeLabel);

// ── Center Section: Screens with GLSL Shader, Logo, receptionist ──
const centerBack = new THREE.Group();
centerBack.position.set(0, 0.04, -2.6);
lobby.add(centerBack);

// Stepped platform in center
const centerPlat = new THREE.Group();
centerPlat.position.set(0, 0.0, 1.5);
lobby.add(centerPlat);
const cp1 = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.08, 32), MAT.marble);
cp1.position.y = 0.04; centerPlat.add(cp1);
const cp2 = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.08, 32), MAT.marble);
cp2.position.y = 0.12; centerPlat.add(cp2);
const cp3 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.08, 32), MAT.marble);
cp3.position.y = 0.20; centerPlat.add(cp3);

// Display Screens on back wall with shifting GLSL color waves shader
const numScreens = 4;
const screenW = 0.65;
const screenH = 1.0;
const screenShaderMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vec2 uv = vUv;
      float time = uTime * 0.6;
      float wave1 = sin(uv.x * 5.0 + time) * 0.5 + 0.5;
      float wave2 = cos(uv.y * 4.0 - time) * 0.5 + 0.5;
      float wave3 = sin((uv.x + uv.y) * 6.0 + time * 1.2) * 0.5 + 0.5;
      vec3 col1 = vec3(0.95, 0.05, 0.35); // hot pink
      vec3 col2 = vec3(0.05, 0.55, 0.95); // deep cyan
      vec3 col3 = vec3(0.9, 0.9, 0.1);    // bright yellow
      vec3 finalCol = mix(col1, col2, wave1);
      finalCol = mix(finalCol, col3, wave2 * wave3);
      gl_FragColor = vec4(finalCol, 1.0);
    }
  `
});

for (let i = 0; i < numScreens; i++) {
  const sx = -1.2 + i * 0.8;
  const screenFrame = new THREE.Mesh(
    new THREE.BoxGeometry(screenW + 0.06, screenH + 0.06, 0.06),
    MAT.blackFrame
  );
  screenFrame.position.set(sx, 0.9, 0);
  centerBack.add(screenFrame);

  const screenDisplay = new THREE.Mesh(
    new THREE.PlaneGeometry(screenW, screenH),
    screenShaderMat
  );
  screenDisplay.position.set(sx, 0.9, 0.035);
  centerBack.add(screenDisplay);
}

// Glowing A logo shape
const logoA = makeCSSLabel('ANREALAGE', { fontSize: '10px', color: '#ffffff', letterSpacing: '0.12em', border: '1px solid rgba(255,255,255,0.4)', background: '#000000' });
logoA.position.set(0, 1.9, -2.55);
lobby.add(logoA);

// Center staff member
lobby.add(makeStaffMember(0, 0.24, 0.3, 0));

// ── Right Section: Tomo Koizumi Showcase, Backdrop, and Fans ──
const rightSection = new THREE.Group();
rightSection.position.set(3.4, 0.04, -0.6);
lobby.add(rightSection);

const plasterPanel = new THREE.Mesh(
  new THREE.CylinderGeometry(1.9, 1.9, 2.9, 32, 1, true, Math.PI, Math.PI / 1.7),
  new THREE.MeshStandardMaterial({ color: 0xf6f3ef, roughness: 0.5, side: THREE.DoubleSide })
);
plasterPanel.rotation.y = Math.PI / 6;
plasterPanel.position.set(1.0, 1.45, -0.5);
rightSection.add(plasterPanel);

const showcaseBase = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.08, 24), MAT.steelDark);
showcaseBase.position.set(0, 0.04, 0.2);
rightSection.add(showcaseBase);

const grass = new THREE.Mesh(
  new THREE.CylinderGeometry(0.83, 0.83, 0.02, 24),
  new THREE.MeshStandardMaterial({ color: 0x2a561e, roughness: 0.95 })
);
grass.position.set(0, 0.09, 0.2);
rightSection.add(grass);

// Fluffy Tomo Koizumi Rainbow Ruffled Dress
const dressGroup = new THREE.Group();
dressGroup.position.set(0, 0.1, 0.2);
rightSection.add(dressGroup);
const colorsList = [0x512da8, 0x1976d2, 0x388e3c, 0xfbc02d, 0xf57c00, 0xd32f2f]; // purple, blue, green, yellow, orange, red
for (let i = 0; i < 6; i++) {
  const ry = 0.12 + i * 0.15;
  const radius = 0.36 - i * 0.05;
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0.13, 16, 32),
    new THREE.MeshStandardMaterial({ color: colorsList[i], roughness: 0.9 })
  );
  torus.rotation.x = Math.PI / 2;
  torus.position.y = ry;
  dressGroup.add(torus);
}
const dressTop = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.08, 0.2, 4, 8),
  new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 })
);
dressTop.position.y = 1.0;
dressGroup.add(dressTop);

// Pleated origami accordion ceiling fan
const accordionFan = new THREE.Group();
accordionFan.position.set(0, 2.5, 0.2);
rightSection.add(accordionFan);
const numWedges = 32;
for (let i = 0; i < numWedges; i++) {
  const angle = (i / numWedges) * Math.PI * 2;
  const wedgeGeo = new THREE.ConeGeometry(0.65, 0.07, 3);
  const wedge = new THREE.Mesh(
    wedgeGeo,
    new THREE.MeshStandardMaterial({ color: 0xe8e4db, roughness: 0.75, side: THREE.DoubleSide })
  );
  wedge.rotation.z = Math.PI / 2;
  wedge.rotation.y = angle;
  wedge.rotation.x = i % 2 === 0 ? 0.18 : -0.18;
  wedge.position.set(Math.cos(angle) * 0.3, 0, Math.sin(angle) * 0.3);
  accordionFan.add(wedge);
}

const tomoLabel = makeCSSLabel('TOMO KOIZUMI', { fontSize: '8px', color: '#ffffff', letterSpacing: '0.15em', background: 'transparent', border: 'none' });
tomoLabel.position.set(2.2, 1.8, -1.2);
lobby.add(tomoLabel);

// ── Circular Blue Sky Dome (Skylight) on Ceiling with custom shader ──
const skyMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vec2 center = vec2(0.5);
      float dist = distance(vUv, center);
      vec3 innerColor = vec3(0.35, 0.65, 1.0);
      vec3 outerColor = vec3(0.08, 0.12, 0.28);
      vec3 color = mix(innerColor, outerColor, smoothstep(0.0, 0.5, dist));
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      float rays = sin(angle * 12.0 + uTime * 0.4) * 0.04 * (1.0 - dist);
      gl_FragColor = vec4(color + rays, 1.0);
    }
  `,
  side: THREE.DoubleSide
});
const skyDome = new THREE.Mesh(
  new THREE.CylinderGeometry(2.2, 2.2, 0.1, 32, 1, false),
  skyMat
);
skyDome.position.set(0, FLOOR_H - 0.05, 0);
lobby.add(skyDome);

// Radial metal spokes inside skylight dome
const spokesGroup = new THREE.Group();
const numSpokes = 24;
const spokesRadius = 2.2;
for (let i = 0; i < numSpokes; i++) {
  const angle = (i / numSpokes) * Math.PI * 2;
  const spoke = new THREE.Mesh(
    new THREE.CylinderGeometry(0.007, 0.007, spokesRadius, 4),
    MAT.steelDark
  );
  spoke.rotation.z = Math.PI / 2;
  spoke.rotation.y = angle;
  spoke.position.set(Math.cos(angle) * (spokesRadius / 2), 0, Math.sin(angle) * (spokesRadius / 2));
  spokesGroup.add(spoke);
}
spokesGroup.position.set(0, FLOOR_H - 0.08, 0);
lobby.add(spokesGroup);

// ── Hanging vertical tube rod Chandelier ──
const chandelierGroup = new THREE.Group();
const numOuterTubes = 24;
const outerRadius = 1.6;
for (let i = 0; i < numOuterTubes; i++) {
  const angle = (i / numOuterTubes) * Math.PI * 2;
  const isGlowing = i % 3 === 0;
  const tubeMat = isGlowing 
    ? new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.6 })
    : MAT.steel;
  const tube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.011, 0.011, 1.1, 8),
    tubeMat
  );
  tube.position.set(Math.cos(angle) * outerRadius, FLOOR_H - 0.65, Math.sin(angle) * outerRadius);
  chandelierGroup.add(tube);
}
const numInnerTubes = 12;
const innerRadius = 1.0;
for (let i = 0; i < numInnerTubes; i++) {
  const angle = (i / numInnerTubes) * Math.PI * 2;
  const isGlowing = i % 2 === 0;
  const tubeMat = isGlowing 
    ? new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.6 })
    : MAT.steel;
  const tube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.011, 0.011, 0.8, 8),
    tubeMat
  );
  tube.position.set(Math.cos(angle) * innerRadius, FLOOR_H - 0.5, Math.sin(angle) * innerRadius);
  chandelierGroup.add(tube);
}
lobby.add(chandelierGroup);

// ── GPU-based Particles System (ambient floating dust) ──
const lobbyParticleCount = 400;
const lobbyParticleGeo = new THREE.BufferGeometry();
const lpPos = new Float32Array(lobbyParticleCount * 3);
const lpRand = new Float32Array(lobbyParticleCount);
for (let i = 0; i < lobbyParticleCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const rDist = Math.random() * 4.5;
  lpPos[i * 3] = Math.cos(angle) * rDist;
  lpPos[i * 3 + 1] = Math.random() * 3.0;
  lpPos[i * 3 + 2] = Math.sin(angle) * rDist;
  lpRand[i] = Math.random();
}
lobbyParticleGeo.setAttribute('position', new THREE.BufferAttribute(lpPos, 3));
lobbyParticleGeo.setAttribute('aRandom', new THREE.BufferAttribute(lpRand, 1));

const lobbyParticleMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uSize: { value: 18.0 }
  },
  vertexShader: `
    uniform float uTime;
    uniform float uSize;
    attribute float aRandom;
    varying float vAlpha;
    void main() {
      vec3 pos = position;
      pos.y += sin(uTime * 0.4 + aRandom * 12.0) * 0.15;
      pos.x += cos(uTime * 0.25 + aRandom * 8.0) * 0.08;
      pos.z += sin(uTime * 0.35 + aRandom * 10.0) * 0.08;
      vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPos;
      gl_PointSize = uSize * (1.0 / -mvPos.z) * (0.75 + 0.25 * sin(uTime + aRandom * 50.0));
      vAlpha = 0.35 + 0.25 * sin(uTime + aRandom * 8.0);
    }
  `,
  fragmentShader: `
    varying float vAlpha;
    void main() {
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) discard;
      float strength = 1.0 - (dist * 2.0);
      gl_FragColor = vec4(1.0, 0.93, 0.82, strength * vAlpha);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});
const lobbyParticles = new THREE.Points(lobbyParticleGeo, lobbyParticleMat);
lobby.add(lobbyParticles);

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

  // Disable controls during animation
  controls.enabled = false;

  // STEP 1 — swing doors open with GSAP
  gsap.to(leftDoorPivot.rotation,  { y:  Math.PI * 0.45, duration: 1.0, ease: 'power2.inOut' });
  gsap.to(rightDoorPivot.rotation, { y: -Math.PI * 0.45, duration: 1.0, ease: 'power2.inOut' });

  // STEP 2 — camera flies from outside, through the door frame, into the lobby
  const doorZ = D / 2 + 0.1;
  const lobbyZ = -1.5;
  const lobbyY = doorFrameH * 0.5;

  // Brief pause, then start flying forward
  gsap.to(camera.position, {
    x: 0, y: lobbyY + 0.3, z: doorZ + 3.5,
    duration: 0.5, ease: 'power1.in', delay: 0.3,
    onUpdate: () => { controls.target.set(0, lobbyY, doorZ - 0.5); controls.update(); }
  });

  // Through the door threshold
  gsap.to(camera.position, {
    x: 0, y: lobbyY, z: doorZ - 0.5,
    duration: 0.9, ease: 'power2.inOut', delay: 0.85,
    onUpdate: () => { controls.target.set(0, lobbyY, doorZ - 3); controls.update(); }
  });

  // Settle into lobby
  gsap.to(camera.position, {
    x: 0, y: lobbyY + 0.2, z: lobbyZ + 4.5,
    duration: 1.2, ease: 'power3.out', delay: 1.75,
    onUpdate: () => { controls.target.set(0, lobbyY, lobbyZ); controls.update(); },
    onComplete: () => {
      isInside = true;
      currentInteriorFloor = 0;

      // Settle controls for interior
      controls.minDistance = 1.5;
      controls.maxDistance = 14;
      controls.maxPolarAngle = Math.PI / 1.7;
      controls.minPolarAngle = Math.PI / 5;
      controls.target.set(0, lobbyY, lobbyZ);
      camera.position.set(0, lobbyY + 0.2, lobbyZ + 4.5);
      controls.enabled = true;
      controls.update();

      updateInteriorHUD(0);
      enterDiv.style.display = 'none';
      navDots.style.display = 'none';
      hintEl.textContent = 'Drag to explore · Scroll to zoom · ← → to change floors';
      backBtn.classList.add('visible');
      interiorHUD.classList.add('visible');
      floorInfoEl.classList.remove('visible');
      animating = false;
    }
  });
}

// ─────────────────────────────────────────────────
//  EXIT BUILDING
// ─────────────────────────────────────────────────
function exitBuilding() {
  if (!isInside || animating) return;
  animating = true;
  controls.enabled = false;

  const lobbyY = doorFrameH * 0.5;
  const doorZ = D / 2 + 0.1;

  // Fly back out through the door
  gsap.to(camera.position, {
    x: 0, y: lobbyY + 0.2, z: doorZ + 5,
    duration: 1.6, ease: 'power3.inOut',
    onUpdate: () => { controls.target.set(0, lobbyY, doorZ - 1); controls.update(); }
  });

  // Close doors
  gsap.to(leftDoorPivot.rotation,  { y: 0, duration: 0.9, ease: 'power2.inOut', delay: 0.5 });
  gsap.to(rightDoorPivot.rotation, { y: 0, duration: 0.9, ease: 'power2.inOut', delay: 0.5 });

  // Then pan back to full exterior shot
  gsap.to(camera.position, {
    x: CAM.exterior.pos.x, y: CAM.exterior.pos.y, z: CAM.exterior.pos.z,
    duration: 1.8, ease: 'power3.inOut', delay: 1.6,
    onUpdate: () => { controls.target.lerp(CAM.exterior.target, 0.05); controls.update(); },
    onComplete: () => {
      isInside = false;
      controls.minDistance = 6;
      controls.maxDistance = 50;
      controls.maxPolarAngle = Math.PI / 2.1;
      controls.minPolarAngle = Math.PI / 8;
      controls.target.copy(CAM.exterior.target);
      controls.enabled = true;
      controls.update();

      enterDiv.style.display = 'flex';
      navDots.style.display = 'flex';
      hintEl.textContent = 'Drag to Orbit · Scroll to Zoom · Click Door to Enter';
      backBtn.classList.remove('visible');
      interiorHUD.classList.remove('visible');
      animating = false;
    }
  });
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

  // Animate custom lobby shaders and meshes
  if (typeof screenShaderMat !== 'undefined') screenShaderMat.uniforms.uTime.value = t;
  if (typeof skyMat !== 'undefined') skyMat.uniforms.uTime.value = t;
  if (typeof lobbyParticleMat !== 'undefined') lobbyParticleMat.uniforms.uTime.value = t;
  if (typeof chandelierGroup !== 'undefined') chandelierGroup.rotation.y = t * 0.12;

  controls.update();
  
  // Render with post-processing bloom
  composer.render();
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
  composer.setSize(window.innerWidth, window.innerHeight);
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
