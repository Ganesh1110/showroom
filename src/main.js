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
  color: 0xFFFFFF,
  emissive: 0xFFFFFF,
  emissiveIntensity: 0.5,
  transparent: true,
  opacity: 0.18,
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

  // Wall Height
  const wallH = FLOOR_H - 0.2;

  // Glass panel on the front face (Z = +D/2)
  const glassFrontFacade = new THREE.Mesh(
    new THREE.PlaneGeometry(W - 0.8, wallH - 0.2),
    glassMat.clone()
  );
  glassFrontFacade.position.set(0, y + wallH/2 + 0.06, D/2 - 0.02);
  glassFrontFacade.material.opacity = 0.15 + i * 0.025;
  building.add(glassFrontFacade);

  // Front face vertical mullions
  for (let j = -3; j <= 3; j++) {
    const mFront = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, wallH - 0.2, 0.04),
      goldDarkMat
    );
    mFront.position.set(j * 1.0, y + wallH/2 + 0.06, D/2 - 0.02);
    building.add(mFront);
  }

  // Solid Back Wall (Z = -D/2)
  const backSolidWall = new THREE.Mesh(
    new THREE.BoxGeometry(W - 0.1, wallH, 0.1),
    marbleMat
  );
  backSolidWall.position.set(0, y + wallH/2 + 0.06, -D/2 + 0.05);
  backSolidWall.castShadow = true;
  backSolidWall.receiveShadow = true;
  building.add(backSolidWall);

  // Solid Left & Right Walls
  for (const x of [-W/2 + 0.05, W/2 - 0.05]) {
    const sideSolidWall = new THREE.Mesh(
      new THREE.BoxGeometry(D - 0.1, wallH, 0.1),
      marbleMat
    );
    sideSolidWall.position.set(x, y + wallH/2 + 0.06, 0);
    sideSolidWall.rotation.y = Math.PI / 2;
    sideSolidWall.castShadow = true;
    sideSolidWall.receiveShadow = true;
    building.add(sideSolidWall);
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
    new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
  );
  lightSphere.position.y = 0;
  group.add(lightSphere);

  const pointLight = new THREE.PointLight(0xFFFFFF, 0.5, 4);
  pointLight.position.y = 0;
  group.add(pointLight);

  group.position.set(0, y + 0.5, 0);
  return group;
}

const chandelier = createChandelier(0.2);
building.add(chandelier);

// ── Spiral Staircase Generator ──
function createStaircase(startY, endY, pivotX, pivotZ) {
  const group = new THREE.Group();
  const stepCount = 16;
  const heightDiff = endY - startY;
  const stepHeight = heightDiff / stepCount;
  const radius = 0.9;

  const stepGeo = new THREE.BoxGeometry(0.7, 0.03, 0.22);
  const stepMat = new THREE.MeshStandardMaterial({
    color: 0xC9A84C,
    metalness: 0.85,
    roughness: 0.2
  });

  const centralPillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, heightDiff, 8),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.4, roughness: 0.6 })
  );
  centralPillar.position.set(pivotX, startY + heightDiff/2, pivotZ);
  group.add(centralPillar);

  for (let i = 0; i < stepCount; i++) {
    const step = new THREE.Mesh(stepGeo, stepMat);
    const ratio = i / stepCount;
    const angle = ratio * Math.PI * 1.5; // spiral 270 deg
    
    const sx = pivotX + Math.cos(angle) * (radius - 0.35);
    const sy = startY + i * stepHeight + 0.015;
    const sz = pivotZ + Math.sin(angle) * (radius - 0.35);

    step.position.set(sx, sy, sz);
    step.rotation.y = -angle;
    step.castShadow = true;
    step.receiveShadow = true;
    group.add(step);
  }
  return group;
}

// ── Character & Mannequin Generator ──
function createCharacter(x, y, z, rotY, isStaff = false) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = rotY;

  const standMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
  const goldBodyMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.9, roughness: 0.1 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xe0a98c, roughness: 0.5 });
  const suitMat = new THREE.MeshStandardMaterial({ color: 0x1c1d21, roughness: 0.7 });

  // Stand base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.03, 8), standMat);
  base.position.y = 0.015;
  group.add(base);

  // Legs / Support rod
  const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.55, 6), standMat);
  legs.position.y = 0.28;
  group.add(legs);

  // Body (Capsule torso)
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.38, 4, 8), isStaff ? suitMat : goldBodyMat);
  body.position.y = 0.75;
  body.castShadow = true;
  group.add(body);

  // Head (Sphere)
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), isStaff ? skinMat : goldBodyMat);
  head.position.y = 1.02;
  head.castShadow = true;
  group.add(head);

  if (isStaff) {
    // Hair
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), new THREE.MeshStandardMaterial({ color: 0x221100, roughness: 0.8 }));
    hair.position.set(0, 1.06, -0.01);
    group.add(hair);

    // Collar
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.04, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    collar.position.y = 0.9;
    group.add(collar);
  }

  return group;
}

// ── Clothing Rack Generator ──
function createClothingRack(x, y, z, rotY, garmentColor) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = rotY;

  const frameMat = new THREE.MeshStandardMaterial({ color: 0xC9A84C, metalness: 0.8, roughness: 0.2 });
  const hangerMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.5, roughness: 0.5 });
  const garmentMat = new THREE.MeshStandardMaterial({ color: garmentColor, roughness: 0.65 });

  // Left Post
  const leftPost = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.1, 8), frameMat);
  leftPost.position.set(-0.7, 0.55, 0);
  leftPost.castShadow = true;
  group.add(leftPost);

  // Right Post
  const rightPost = leftPost.clone();
  rightPost.position.set(0.7, 0.55, 0);
  group.add(rightPost);

  // Top Hanging Bar
  const topBar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.45, 8), frameMat);
  topBar.rotation.z = Math.PI / 2;
  topBar.position.set(0, 1.1, 0);
  group.add(topBar);

  // Base Bar
  const baseBar = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.03, 0.16), frameMat);
  baseBar.position.set(0, 0.015, 0);
  group.add(baseBar);

  // Hanging shirts
  const numGarments = 5;
  const sp = 1.1 / (numGarments - 1);
  for (let i = 0; i < numGarments; i++) {
    const gx = -0.55 + i * sp;
    
    // Hanger hook
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.004, 4, 8, Math.PI), hangerMat);
    hook.position.set(gx, 1.085, 0);
    hook.rotation.x = Math.PI / 2;
    group.add(hook);

    // Flat shirt volume
    const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.65, 0.07), garmentMat);
    shirt.position.set(gx, 0.72, 0);
    shirt.castShadow = true;
    shirt.receiveShadow = true;
    group.add(shirt);
  }

  return group;
}

// ── Display Table Generator ──
function createDisplayTable(x, y, z, rotY) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = rotY;

  const tableMat = new THREE.MeshStandardMaterial({ color: 0x1f1d1b, roughness: 0.5 });
  const goldAcc = new THREE.MeshStandardMaterial({ color: 0xC9A84C, metalness: 0.8, roughness: 0.2 });

  // Top
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.04, 0.7), tableMat);
  top.position.y = 0.45;
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  // Legs
  for (const lx of [-0.4, 0.4]) {
    for (const lz of [-0.25, 0.25]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8), tableMat);
      leg.position.set(lx, 0.225, lz);
      leg.castShadow = true;
      group.add(leg);
    }
  }

  // Folded shirts on table
  const fold1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.16), new THREE.MeshStandardMaterial({ color: 0xc62828, roughness: 0.8 }));
  fold1.position.set(-0.2, 0.51, -0.08);
  group.add(fold1);

  const fold2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.16), new THREE.MeshStandardMaterial({ color: 0x1565c0, roughness: 0.8 }));
  fold2.position.set(0.2, 0.5, 0.08);
  group.add(fold2);

  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), goldAcc);
  orb.position.set(0, 0.51, 0);
  group.add(orb);

  return group;
}

// ── Populate Building Interiors Floor-by-Floor ──

// Winding Staircases connecting levels
const stairs1 = createStaircase(0.04, FLOOR_H, -2.8, 0);
building.add(stairs1);
const stairs2 = createStaircase(FLOOR_H + 0.04, FLOOR_H * 2, -2.8, 0);
building.add(stairs2);
const stairs3 = createStaircase(FLOOR_H * 2 + 0.04, FLOOR_H * 3, -2.8, 0);
building.add(stairs3);
const stairs4 = createStaircase(FLOOR_H * 3 + 0.04, FLOOR_H * 4, -2.8, 0);
building.add(stairs4);

// FLOOR 0: Earth Positive Flagship (Ground retail entrance area)
// Internal light
const lightG = new THREE.PointLight(0xFFFFFF, 1.8, 8);
lightG.position.set(0, 1.8, 0);
building.add(lightG);

const staffG = createCharacter(0, 0.04, 0.8, Math.PI, true);
building.add(staffG);
const rackG = createClothingRack(-1.6, 0.04, -1.0, 0, 0x111111);
building.add(rackG);
const tableG = createDisplayTable(1.8, 0.04, -1.0, Math.PI / 6);
building.add(tableG);
const manG1 = createCharacter(-1.8, 0.04, D/2 - 0.8, Math.PI / 4, false);
building.add(manG1);
const manG2 = createCharacter(1.8, 0.04, D/2 - 0.8, -Math.PI / 4, false);
building.add(manG2);

// FLOOR 1: Grand Lobby (Reception & Lounge seating)
// Internal light
const lightL = new THREE.PointLight(0xFFFFFF, 1.8, 8);
lightL.position.set(0, FLOOR_H + 1.8, 0);
building.add(lightL);

const receptionDesk = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 0.8, 0.5),
  new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.5 })
);
receptionDesk.position.set(0, FLOOR_H + 0.4, 0.4);
building.add(receptionDesk);
const receptionTrim = new THREE.Mesh(
  new THREE.BoxGeometry(1.55, 0.04, 0.55),
  new THREE.MeshStandardMaterial({ color: 0xC9A84C, metalness: 0.8, roughness: 0.2 })
);
receptionTrim.position.set(0, FLOOR_H + 0.82, 0.4);
building.add(receptionTrim);

// Laptop on Desk
const laptopBase = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 0.01, 0.15),
  new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 })
);
laptopBase.position.set(0, FLOOR_H + 0.84, 0.45);
building.add(laptopBase);

const laptopScreen = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 0.15, 0.01),
  new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 })
);
laptopScreen.position.set(0, FLOOR_H + 0.92, 0.38);
laptopScreen.rotation.x = -Math.PI / 6;
building.add(laptopScreen);

// Potted Plant in Corner
const pot = new THREE.Mesh(
  new THREE.CylinderGeometry(0.14, 0.1, 0.3, 8),
  new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 })
);
pot.position.set(-2.2, FLOOR_H + 0.15, 1.2);
building.add(pot);

const plantLeaves = new THREE.Mesh(
  new THREE.SphereGeometry(0.22, 8, 8),
  new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.8 })
);
plantLeaves.position.set(-2.2, FLOOR_H + 0.38, 1.2);
building.add(plantLeaves);

// Lobby Best Seller Dress Rack
const lobbyRack = createClothingRack(-2.0, FLOOR_H + 0.04, -0.6, Math.PI / 4, 0xC9A84C);
building.add(lobbyRack);

// Lobby staff
const receptionDeskStaff = createCharacter(0, FLOOR_H + 0.04, 0.0, 0, true);
building.add(receptionDeskStaff);

const sofaL = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.4, 1.2),
  new THREE.MeshStandardMaterial({ color: 0x151618, roughness: 0.6 })
);
sofaL.position.set(-2.0, FLOOR_H + 0.2, -1.0);
building.add(sofaL);

const sofaR = sofaL.clone();
sofaR.position.set(2.0, FLOOR_H + 0.2, -1.0);
building.add(sofaR);

// FLOOR 2: T-Shirts Atelier
// Internal light
const lightT = new THREE.PointLight(0xFFFFFF, 1.8, 8);
lightT.position.set(0, FLOOR_H * 2 + 1.8, 0);
building.add(lightT);

const rackT1 = createClothingRack(-1.6, FLOOR_H * 2 + 0.04, -1.0, 0, 0xe53935);
building.add(rackT1);
const rackT2 = createClothingRack(1.6, FLOOR_H * 2 + 0.04, -1.0, 0, 0x222222);
building.add(rackT2);
const tableT = createDisplayTable(0, FLOOR_H * 2 + 0.04, 1.0, 0);
building.add(tableT);
const mannequinT = createCharacter(0, FLOOR_H * 2 + 0.04, -0.2, 0, false);
building.add(mannequinT);

// Guiding staff member for Floor 2
const staffT = createCharacter(0.8, FLOOR_H * 2 + 0.04, 0.8, Math.PI, true);
building.add(staffT);

// FLOOR 3: Hoodies & Sweatstreet
// Internal light
const lightH = new THREE.PointLight(0xFFFFFF, 1.8, 8);
lightH.position.set(0, FLOOR_H * 3 + 1.8, 0);
building.add(lightH);

const rackH1 = createClothingRack(-1.6, FLOOR_H * 3 + 0.04, -1.0, 0, 0x1b5e20);
building.add(rackH1);
const rackH2 = createClothingRack(1.6, FLOOR_H * 3 + 0.04, -1.0, 0, 0xffa000);
building.add(rackH2);
const mannequinH1 = createCharacter(-0.6, FLOOR_H * 3 + 0.04, 0.8, Math.PI / 8, false);
building.add(mannequinH1);
const mannequinH2 = createCharacter(0.6, FLOOR_H * 3 + 0.04, 0.8, -Math.PI / 8, false);
building.add(mannequinH2);

// Guiding staff member for Floor 3
const staffH = createCharacter(0.8, FLOOR_H * 3 + 0.04, 0.8, Math.PI, true);
building.add(staffH);

// ROOFTOP / PENTHOUSE LOUNGE
const loungeChairL = new THREE.Mesh(
  new THREE.BoxGeometry(0.6, 0.35, 1.0),
  new THREE.MeshStandardMaterial({ color: 0xc9a84c, metalness: 0.6, roughness: 0.3 })
);
loungeChairL.position.set(-1.6, NUM_FLOORS * FLOOR_H + 0.18, 0);
building.add(loungeChairL);
const loungeChairR = loungeChairL.clone();
loungeChairR.position.set(1.6, NUM_FLOORS * FLOOR_H + 0.18, 0);
building.add(loungeChairR);

const loungeTable = new THREE.Mesh(
  new THREE.CylinderGeometry(0.3, 0.3, 0.35, 10),
  new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 })
);
loungeTable.position.set(0, NUM_FLOORS * FLOOR_H + 0.175, -0.8);
building.add(loungeTable);

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
      color: 0xFFFFFF,
      emissive: 0xFFFFFF,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8
    })
  );
  globe.position.y = 0.35;
  group.add(globe);

  const pl = new THREE.PointLight(0xFFFFFF, 0.2, 3);
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
