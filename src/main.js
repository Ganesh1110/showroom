import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import gsap from 'gsap';

// ── Constants ──
const W = 8;
const D = 6;
const FLOOR_H = 2.4;
const NUM_FLOORS = 4;

const FLOOR_DATA = {
  0: { title: 'Earth Positive Flagship', desc: 'Explore our luxury collections' },
  1: { title: 'Grand Lobby', desc: 'Welcome to the world of Earth Positive' },
  2: { title: 'T-Shirts Atelier', desc: 'Premium organic cotton essentials' },
  3: { title: 'Hoodies & Sweatshirts', desc: 'Luxury sustainable streetwear' },
  4: { title: 'Accessories Suite', desc: 'Tote bags, polos & more' },
  5: { title: 'Penthouse Lounge', desc: 'VIP showroom & sky garden' }
};

// ── Scene ──
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d0d0d);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(20, 14, 24);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.prepend(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.prepend(labelRenderer.domElement);

// ── Controls ──
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 7;
controls.maxDistance = 35;
controls.maxPolarAngle = Math.PI / 2.05;
controls.target.set(0, 5, 0);
controls.update();

// ── Lights ──
const ambient = new THREE.AmbientLight(0x222244, 0.3);
scene.add(ambient);

const hemi = new THREE.HemisphereLight(0x446688, 0x222222, 0.4);
scene.add(hemi);

const key = new THREE.DirectionalLight(0xFFEECC, 1.8);
key.position.set(15, 20, 10);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.near = 0.5;
key.shadow.camera.far = 50;
key.shadow.camera.left = -20;
key.shadow.camera.right = 20;
key.shadow.camera.top = 20;
key.shadow.camera.bottom = -20;
scene.add(key);

const fill = new THREE.DirectionalLight(0x446688, 0.4);
fill.position.set(-10, 8, -10);
scene.add(fill);

const rim = new THREE.DirectionalLight(0xFFEECC, 0.6);
rim.position.set(-8, 4, 18);
scene.add(rim);

// ── Materials ──
const goldMat = new THREE.MeshStandardMaterial({
  color: 0xC9A84C,
  roughness: 0.25,
  metalness: 0.85,
  envMapIntensity: 1.2
});

const goldDarkMat = new THREE.MeshStandardMaterial({
  color: 0xA88930,
  roughness: 0.3,
  metalness: 0.7
});

const goldEmissive = new THREE.MeshStandardMaterial({
  color: 0xC9A84C,
  roughness: 0.2,
  metalness: 0.9,
  emissive: 0xC9A84C,
  emissiveIntensity: 0.08
});

const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0x1a1a2a,
  metalness: 0.3,
  roughness: 0.05,
  transparent: true,
  opacity: 0.2,
  envMapIntensity: 1.5,
  side: THREE.DoubleSide
});

const darkFrame = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  roughness: 0.4,
  metalness: 0.3
});

const marbleMat = new THREE.MeshStandardMaterial({
  color: 0x2a2824,
  roughness: 0.35,
  metalness: 0.1
});

const warmGlow = new THREE.MeshStandardMaterial({
  color: 0xFFD54F,
  emissive: 0xFFD54F,
  emissiveIntensity: 0.6,
  transparent: true,
  opacity: 0.2,
  side: THREE.DoubleSide
});

function cssLabel(text, color = '#C9A84C', size = '13px', bg = 'rgba(0,0,0,0.8)') {
  const div = document.createElement('div');
  div.textContent = text;
  div.style.color = color;
  div.style.fontFamily = '"Inter", "Helvetica Neue", Arial, sans-serif';
  div.style.fontSize = size;
  div.style.fontWeight = '200';
  div.style.letterSpacing = '0.15em';
  div.style.padding = '5px 12px';
  div.style.background = bg;
  div.style.borderRadius = '2px';
  div.style.border = '1px solid rgba(201,168,76,0.25)';
  div.style.pointerEvents = 'none';
  return new CSS2DObject(div);
}

// ── Ground ──
const groundGeo = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x111111,
  roughness: 0.8,
  metalness: 0.1
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.05;
ground.receiveShadow = true;
scene.add(ground);

// Marble platform under building
const platform = new THREE.Mesh(
  new THREE.BoxGeometry(W + 3, 0.2, D + 3),
  new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.2,
    metalness: 0.3
  })
);
platform.position.y = 0;
platform.receiveShadow = true;
platform.castShadow = true;
scene.add(platform);

// Gold border on platform
const platBorder = new THREE.Mesh(
  new THREE.BoxGeometry(W + 3.2, 0.04, D + 3.2),
  goldDarkMat
);
platBorder.position.y = 0.11;
scene.add(platBorder);

// ── Building ──
const building = new THREE.Group();
building.position.set(0, 0, 0);

for (let i = 0; i < NUM_FLOORS; i++) {
  const y = i * FLOOR_H;

  // Floor slab
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(W + 0.6, 0.08, D + 0.6),
    darkFrame
  );
  slab.position.y = y;
  slab.receiveShadow = true;
  slab.castShadow = true;
  building.add(slab);

  // Gold trim on slab edge
  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(W + 0.8, 0.03, 0.08),
    goldDarkMat
  );
  trim.position.set(0, y + 0.05, D/2 + 0.35);
  building.add(trim);
  const trim2 = trim.clone();
  trim2.position.set(0, y + 0.05, -D/2 - 0.35);
  building.add(trim2);

  // Glass panels
  const wallH = FLOOR_H - 0.2;

  const glassFront = new THREE.Mesh(
    new THREE.PlaneGeometry(W - 0.8, wallH - 0.2),
    glassMat.clone()
  );
  glassFront.position.set(0, y + wallH/2 + 0.06, -D/2 + 0.02);
  glassFront.material.opacity = 0.15 + i * 0.025;
  building.add(glassFront);

  const glassBack = glassFront.clone();
  glassBack.position.set(0, y + wallH/2 + 0.06, D/2 - 0.02);
  building.add(glassBack);

  // Gold vertical mullions
  for (let j = -3; j <= 3; j++) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, wallH - 0.2, 0.04),
      goldDarkMat
    );
    m.position.set(j * 1.0, y + wallH/2 + 0.06, -D/2 + 0.02);
    building.add(m);
    const m2 = m.clone();
    m2.position.set(j * 1.0, y + wallH/2 + 0.06, D/2 - 0.02);
    building.add(m2);
  }

  // Side glass (left/right)
  for (const x of [-W/2 + 0.02, W/2 - 0.02]) {
    const side = new THREE.Mesh(
      new THREE.PlaneGeometry(D - 0.8, wallH - 0.2),
      glassMat.clone()
    );
    side.position.set(x, y + wallH/2 + 0.06, 0);
    side.rotation.y = Math.PI / 2;
    side.material.opacity = 0.2;
    building.add(side);
  }

  // Gold corner pillars
  const corners = [
    [-W/2, -D/2], [W/2, -D/2],
    [-W/2, D/2], [W/2, D/2]
  ];
  for (const [cx, cz] of corners) {
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, wallH, 0.1),
      goldDarkMat
    );
    pillar.position.set(cx, y + wallH/2 + 0.06, cz);
    building.add(pillar);
  }

  // Warm interior glow
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(W - 1.2, wallH - 0.5),
    warmGlow.clone()
  );
  glow.position.set(0, y + wallH/2 + 0.06, D/2 - 0.015);
  glow.material.opacity = 0.1 + i * 0.04;
  building.add(glow);

  // Floor label
  if (i > 0) {
    const names = ['LOBBY', 'T-SHIRTS', 'HOODIES', 'ACCESSORIES'];
    const lbl = cssLabel(`FLOOR ${i+1} · ${names[i]}`);
    lbl.position.set(0, y + wallH/2, -D/2 - 0.9);
    building.add(lbl);
  }
}

// ── Grand Entrance ──
const entranceFrame = new THREE.Mesh(
  new THREE.BoxGeometry(2.2, 2.2, 0.1),
  goldMat
);
entranceFrame.position.set(0, 1.1, D/2 + 0.02);
building.add(entranceFrame);

const doorGlass = new THREE.Mesh(
  new THREE.BoxGeometry(1.6, 1.8, 0.04),
  new THREE.MeshPhysicalMaterial({
    color: 0x222233,
    metalness: 0.2,
    roughness: 0.05,
    transparent: true,
    opacity: 0.4,
    envMapIntensity: 0.8
  })
);
doorGlass.position.set(0, 1.1, D/2 + 0.06);
building.add(doorGlass);

// Door handles
for (const hx of [-0.5, 0.5]) {
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.15, 8),
    goldMat
  );
  handle.position.set(hx, 1.1, D/2 + 0.1);
  handle.rotation.x = Math.PI / 2;
  building.add(handle);
}

// Entrance canopy
const canopy = new THREE.Mesh(
  new THREE.BoxGeometry(2.8, 0.04, 0.6),
  goldDarkMat
);
canopy.position.set(0, 2.3, D/2 + 0.15);
building.add(canopy);

// Earth Positive sign above entrance
const sign = cssLabel('✦ EARTH POSITIVE ✦', '#F5D76E', '16px', 'rgba(0,0,0,0.85)');
sign.position.set(0, 2.7, D/2 + 0.3);
building.add(sign);

// ── Roof ──
const roofSlab = new THREE.Mesh(
  new THREE.BoxGeometry(W + 1, 0.1, D + 1),
  new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.5,
    metalness: 0.3
  })
);
roofSlab.position.y = NUM_FLOORS * FLOOR_H;
roofSlab.castShadow = true;
roofSlab.receiveShadow = true;
building.add(roofSlab);

// Gold roof edge
const roofEdge = new THREE.Mesh(
  new THREE.BoxGeometry(W + 1.2, 0.03, D + 1.2),
  goldDarkMat
);
roofEdge.position.y = NUM_FLOORS * FLOOR_H + 0.06;
building.add(roofEdge);

// Rooftop glass railing
for (let i = 0; i < 12; i++) {
  const angle = (i / 12) * Math.PI * 2;
  const r = 3.5;
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6),
    goldDarkMat
  );
  post.position.set(
    Math.cos(angle) * r,
    NUM_FLOORS * FLOOR_H + 0.2,
    Math.sin(angle) * r
  );
  building.add(post);
}

const roofLabel = cssLabel('PENTHOUSE LOUNGE', '#F5D76E', '11px', 'rgba(0,0,0,0.7)');
roofLabel.position.set(0, NUM_FLOORS * FLOOR_H + 0.7, 0);
building.add(roofLabel);

// ── Chandelier in lobby ──
function createChandelier(y) {
  const group = new THREE.Group();

  const chainMat = new THREE.MeshStandardMaterial({ color: 0xC9A84C, metalness: 0.8, roughness: 0.2 });
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0xEEEEFF,
    metalness: 0.0,
    roughness: 0.0,
    transparent: true,
    opacity: 0.3,
    envMapIntensity: 2.0
  });

  const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), chainMat);
  chain.position.y = 0.25;
  group.add(chain);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.4, 0.03, 8, 24),
    goldMat
  );
  ring.position.y = 0;
  group.add(ring);

  const inner = new THREE.Mesh(
    new THREE.TorusGeometry(0.25, 0.02, 8, 20),
    chainMat
  );
  inner.position.y = 0;
  group.add(inner);

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const crystal = new THREE.Mesh(
      new THREE.ConeGeometry(0.03, 0.12, 6),
      crystalMat
    );
    crystal.position.set(Math.cos(a) * 0.4, -0.06, Math.sin(a) * 0.4);
    crystal.rotation.x = Math.random() * 0.3;
    crystal.rotation.z = Math.random() * 0.3;
    group.add(crystal);
  }

  // Light sphere in center
  const lightSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xFFD54F })
  );
  lightSphere.position.y = 0;
  group.add(lightSphere);

  const pointLight = new THREE.PointLight(0xFFD54F, 0.5, 4);
  pointLight.position.y = 0;
  group.add(pointLight);

  group.position.set(0, y + 0.5, 0);
  return group;
}

const chandelier = createChandelier(0.2);
building.add(chandelier);

// ── Decorative Gold Rings (Floating Displays) ──
function createGoldRingDisplay(y, color, posX, posZ) {
  const group = new THREE.Group();

  const ringMat = new THREE.MeshPhysicalMaterial({
    color: 0xC9A84C,
    metalness: 0.9,
    roughness: 0.15,
    envMapIntensity: 1.5
  });

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.35, 0.025, 12, 24),
    ringMat
  );
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.25, 0.015, 10, 20),
    ringMat
  );
  innerRing.rotation.x = Math.PI / 2;
  innerRing.position.y = 0.05;
  group.add(innerRing);

  const fabric = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.5, 0.04),
    new THREE.MeshPhysicalMaterial({
      color: color,
      roughness: 0.4,
      metalness: 0.0,
      clearcoat: 0.05
    })
  );
  fabric.position.y = -0.05;
  fabric.castShadow = true;
  group.add(fabric);

  const lineMat = new THREE.LineBasicMaterial({
    color: 0xC9A84C,
    transparent: true,
    opacity: 0.3
  });
  const pts = [new THREE.Vector3(0, 0.5, 0), new THREE.Vector3(0, 0, 0)];
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat);
  group.add(line);

  group.position.set(posX, y, posZ);
  return group;
}

const displayItems = [
  createGoldRingDisplay(FLOOR_H * 1 + 0.4, 0x333333, -2.8, -D/2 - 1.0),
  createGoldRingDisplay(FLOOR_H * 1 + 0.4, 0x444444, 2.8, -D/2 - 1.0),
  createGoldRingDisplay(FLOOR_H * 2 + 0.4, 0x2a2a2a, -2.8, -D/2 - 1.3),
  createGoldRingDisplay(FLOOR_H * 2 + 0.4, 0x3a3a3a, 2.8, -D/2 - 1.3),
  createGoldRingDisplay(FLOOR_H * 3 + 0.4, 0x4a3a2a, -2.8, -D/2 - 1.0),
  createGoldRingDisplay(FLOOR_H * 3 + 0.4, 0x2a3a4a, 2.8, -D/2 - 1.0),
];

for (const item of displayItems) {
  scene.add(item);
}

// ── Gold Globe Lights on pillars ──
function createGlobeLight(x, y, z) {
  const group = new THREE.Group();

  const rod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.3, 6),
    goldDarkMat
  );
  rod.position.y = 0.15;
  group.add(rod);

  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 12, 12),
    new THREE.MeshPhysicalMaterial({
      color: 0xFFD54F,
      emissive: 0xFFD54F,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8
    })
  );
  globe.position.y = 0.35;
  group.add(globe);

  const pl = new THREE.PointLight(0xFFD54F, 0.2, 3);
  pl.position.y = 0.35;
  group.add(pl);

  group.position.set(x, y, z);
  return group;
}

const globePositions = [
  [-W/2 - 0.5, 0, -D/2 - 0.5],
  [W/2 + 0.5, 0, -D/2 - 0.5],
  [-W/2 - 0.5, 0, D/2 + 0.5],
  [W/2 + 0.5, 0, D/2 + 0.5],
  [-W/2 - 0.5, FLOOR_H * 2 + 0.2, -D/2 - 0.5],
  [W/2 + 0.5, FLOOR_H * 2 + 0.2, -D/2 - 0.5]
];

for (const [gx, gy, gz] of globePositions) {
  scene.add(createGlobeLight(gx, gy, gz));
}

// ── Trees (Topiary / Luxury) ──
function createTopiary(x, z, scale = 1) {
  const group = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.06, 0.6, 6),
    new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 })
  );
  trunk.position.y = 0.3;
  group.add(trunk);

  const foliageMat = new THREE.MeshStandardMaterial({
    color: 0x1a2a1a,
    roughness: 0.8,
    metalness: 0.0
  });

  const f1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), foliageMat);
  f1.position.set(0, 0.9, 0);
  f1.castShadow = true;
  group.add(f1);

  const f2 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), foliageMat);
  f2.position.set(0.2, 0.7, 0.15);
  group.add(f2);

  const f3 = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), foliageMat);
  f3.position.set(-0.18, 0.75, -0.12);
  group.add(f3);

  group.position.set(x, 0, z);
  group.scale.set(scale, scale, scale);
  return group;
}

const topiaryPositions = [
  [-5.5, -3.5], [5.5, -3.5], [-5.5, 3.5], [5.5, 3.5],
  [-4.5, -4.5], [4.5, -4.5], [-4.5, 4.5], [4.5, 4.5],
  [-6.5, 0], [6.5, 0], [0, -4.5], [0, 4.5]
];

for (const [tx, tz] of topiaryPositions) {
  scene.add(createTopiary(tx, tz));
}

// ── Gold Pathway ──
for (let i = 0; i < 6; i++) {
  const stone = new THREE.Mesh(
    new THREE.CircleGeometry(0.15, 6),
    new THREE.MeshStandardMaterial({
      color: 0xC9A84C,
      roughness: 0.4,
      metalness: 0.6
    })
  );
  const t = i / 5;
  stone.position.set(
    Math.sin(t * Math.PI * 0.8) * 0.5,
    0.02,
    D/2 + 0.6 + t * 1.5
  );
  stone.rotation.x = -Math.PI / 2;
  scene.add(stone);
}

// ── Luxury Water Feature ──
const basin = new THREE.Mesh(
  new THREE.CylinderGeometry(0.6, 0.7, 0.2, 16),
  new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, metalness: 0.5 })
);
basin.position.set(3.5, 0.1, 3.5);
scene.add(basin);

const water = new THREE.Mesh(
  new THREE.CircleGeometry(0.55, 16),
  new THREE.MeshPhysicalMaterial({
    color: 0x1a2a3a,
    roughness: 0.0,
    metalness: 0.1,
    transparent: true,
    opacity: 0.6
  })
);
water.position.set(3.5, 0.22, 3.5);
water.rotation.x = -Math.PI / 2;
scene.add(water);

const fountainCenter = new THREE.Mesh(
  new THREE.ConeGeometry(0.04, 0.2, 8),
  goldMat
);
fountainCenter.position.set(3.5, 0.35, 3.5);
scene.add(fountainCenter);

// ── Particles ──
const pCount = 400;
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(pCount * 3);
for (let i = 0; i < pCount; i++) {
  const theta = Math.random() * Math.PI * 2;
  const r = 4 + Math.random() * 14;
  pPos[i*3] = Math.cos(theta) * r;
  pPos[i*3+1] = Math.random() * 12;
  pPos[i*3+2] = Math.sin(theta) * r;
}
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

const pMat = new THREE.PointsMaterial({
  color: 0xC9A84C,
  size: 0.03,
  transparent: true,
  opacity: 0.25,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true
});
const particles = new THREE.Points(pGeo, pMat);
scene.add(particles);

// ── Stars ──
const sGeo = new THREE.BufferGeometry();
const sPos = new Float32Array(1500 * 3);
for (let i = 0; i < 1500; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 60 + Math.random() * 40;
  sPos[i*3] = Math.sin(phi) * Math.cos(theta) * r;
  sPos[i*3+1] = Math.sin(phi) * Math.sin(theta) * r * 0.3 + 10;
  sPos[i*3+2] = Math.cos(phi) * r;
}
sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
const sMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.4 });
const stars = new THREE.Points(sGeo, sMat);
scene.add(stars);

scene.add(building);

// ── Floor Navigation ──
const floorCam = {
  0: { pos: new THREE.Vector3(0, 5, 18), target: new THREE.Vector3(0, 5, 0) },
  1: { pos: new THREE.Vector3(0, 2, 6.5), target: new THREE.Vector3(0, 1.5, 0) },
  2: { pos: new THREE.Vector3(0, 4.5, 6.5), target: new THREE.Vector3(0, 4.5, 0) },
  3: { pos: new THREE.Vector3(0, 7, 6.5), target: new THREE.Vector3(0, 7, 0) },
  4: { pos: new THREE.Vector3(0, 9.5, 6.5), target: new THREE.Vector3(0, 9.5, 0) },
  5: { pos: new THREE.Vector3(0, 12, 5.5), target: new THREE.Vector3(0, 11, 0) }
};

let currentFloor = 0;
let animating = false;

function goToFloor(idx) {
  if (animating || idx === currentFloor) return;
  animating = true;

  const d = floorCam[idx];
  gsap.to(camera.position, {
    x: d.pos.x, y: d.pos.y, z: d.pos.z,
    duration: 1.6,
    ease: 'power3.inOut',
    onUpdate: () => controls.update()
  });
  gsap.to(controls.target, {
    x: d.target.x, y: d.target.y, z: d.target.z,
    duration: 1.6,
    ease: 'power3.inOut',
    onUpdate: () => controls.update(),
    onComplete: () => { animating = false; }
  });

  currentFloor = idx;
  const data = FLOOR_DATA[idx];
  document.getElementById('fiTitle').textContent = data.title;
  document.getElementById('fiDesc').textContent = data.desc;
  document.getElementById('floor-info').classList.add('visible');

  document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
  const dot = document.querySelector(`.dot[data-idx="${idx}"]`);
  if (dot) dot.classList.add('active');
}

// ── Dot click ──
document.querySelectorAll('.dot').forEach(d => {
  d.addEventListener('click', () => goToFloor(parseInt(d.dataset.idx)));
});

// ── Keyboard ──
document.addEventListener('keydown', e => {
  const k = parseInt(e.key);
  if (k >= 0 && k <= 5) goToFloor(k);
  if (e.key === 'ArrowUp' && currentFloor < 5) goToFloor(currentFloor + 1);
  if (e.key === 'ArrowDown' && currentFloor > 0) goToFloor(currentFloor - 1);
});

// ── Animation Loop ──
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Chandelier rotation
  chandelier.rotation.y = t * 0.15;

  // Float displays
  displayItems.forEach((item, i) => {
    const off = i * 0.4;
    item.position.y += Math.sin(t * 0.6 + off) * 0.0008;
    item.children[0].rotation.z = Math.sin(t * 0.4 + off) * 0.03;
  });

  // Particles
  const pos = particles.geometry.attributes.position.array;
  for (let i = 0; i < pCount; i++) {
    pos[i*3+1] += Math.sin(t * (0.1 + (i % 10) * 0.03) + i) * 0.002;
    if (pos[i*3+1] > 12) pos[i*3+1] = 0;
    if (pos[i*3+1] < 0) pos[i*3+1] = 12;
  }
  particles.geometry.attributes.position.needsUpdate = true;

  stars.rotation.y += 0.00008;

  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

animate();

// ── Resize ──
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// ── Init ──
setTimeout(() => {
  document.getElementById('loading').classList.add('hidden');
  goToFloor(0);
}, 1500);

// Entrance animations
gsap.from(camera.position, {
  z: 35, y: 22,
  duration: 2.5,
  ease: 'power3.out',
  delay: 1.6,
  onUpdate: () => controls.update()
});

gsap.from(building.scale, {
  x: 0, y: 0, z: 0,
  duration: 2,
  ease: 'back.out(1.4)',
  delay: 1.6
});

gsap.from('#header .brand, #header .tagline', {
  y: -30, opacity: 0,
  duration: 1.2,
  ease: 'power3.out',
  delay: 2.2,
  stagger: 0.2
});
