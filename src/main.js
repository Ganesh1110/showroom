import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import gsap from "gsap";

import {
  W,
  D,
  FLOOR_H,
  NUM_FLOORS,
  FLOORS,
  CAM,
  PROP_DATABASE,
} from "./constants.js";
import { screenShaderMat, skyMat, lobbyParticleMat } from "./shaders.js";
import { MAT, hoverMaterialsMap } from "./materials.js";
import {
  makeCSSLabel,
  makeClothingRack,
  makeMannequin,
  makeStaffMember,
  makeDisplayTable,
  makeReceptionDesk,
  makeBirdcage,
  makeLoungeSofa,
  makeHangingRack,
  makeFullLengthMirror,
  makeShelvingOrganizer,
  makeBigPottedPlant,
  makePartitionWall,
  mannequinHeads,
  mannequinTorsos,
} from "./building.js";
import {
  showToast,
  initEcommerceBindings,
  initTutorialBindings,
  initAccessibilityKeyboardRouter,
  updateProductPanelIcon,
} from "./ui.js";

// ─────────────────────────────────────────────────
//  STATE & PREFS
// ─────────────────────────────────────────────────
let isInside = false;
let currentInteriorFloor = 0;
let animating = false;

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

const initHint = document.getElementById("hint");
if (initHint && isTouchDevice) {
  initHint.textContent =
    "Touch & Drag to Orbit · Pinch to Zoom · Tap Door to Enter";
}

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
labelRenderer.domElement.style.cssText =
  "position:absolute;top:0;pointer-events:none;";
document.body.prepend(labelRenderer.domElement);

// ─────────────────────────────────────────────────
//  SCENE & BACKGROUND
// ─────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a18, 0.006);

scene.background = new THREE.Color(0x0a0a18);

// ─────────────────────────────────────────────────
//  CAMERA & CONTROLS
// ─────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(
  38,
  window.innerWidth / window.innerHeight,
  0.1,
  200,
);
camera.position.copy(CAM.exterior.pos);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.minDistance = 6;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2.1;
controls.minPolarAngle = Math.PI / 8;
controls.target.copy(CAM.exterior.target);
controls.update();

// ─────────────────────────────────────────────────
//  POST-PROCESSING
// ─────────────────────────────────────────────────
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const isMobileDevice = window.innerWidth <= 768 || "ontouchstart" in window;
const initialBloomStrength = isMobileDevice ? 0.15 : 0.65;
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  initialBloomStrength,
  isMobileDevice ? 0.1 : 0.4,
  0.65,
);
composer.addPass(bloomPass);

const outputPass = new OutputPass();
composer.addPass(outputPass);

// ─────────────────────────────────────────────────
//  LIGHTS
// ─────────────────────────────────────────────────
const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.6);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0x3a4a6a, 0x111118, 0.5);
scene.add(hemiLight);

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
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xffeedd, 0.5);
rimLight.position.set(-10, 6, 22);
scene.add(rimLight);

// ─────────────────────────────────────────────────
//  GROUND
// ─────────────────────────────────────────────────
const ground = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), MAT.groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.08;
ground.receiveShadow = true;
scene.add(ground);

const plaza = new THREE.Mesh(
  new THREE.PlaneGeometry(W + 8, 10),
  new THREE.MeshStandardMaterial({
    color: 0x1a1a22,
    roughness: 0.7,
    metalness: 0.1,
  }),
);
plaza.rotation.x = -Math.PI / 2;
plaza.position.set(0, -0.02, D / 2 + 4.5);
plaza.receiveShadow = true;
scene.add(plaza);

for (let i = -3; i <= 3; i++) {
  const strip = new THREE.Mesh(
    new THREE.PlaneGeometry(0.04, 8),
    new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      roughness: 0.3,
      metalness: 0.9,
      emissive: 0xc9a84c,
      emissiveIntensity: 0.04,
    }),
  );
  strip.rotation.x = -Math.PI / 2;
  strip.position.set(i * 1.2, -0.01, D / 2 + 4.5);
  scene.add(strip);
}

// ─────────────────────────────────────────────────
//  BUILDING STRUCTURE
// ─────────────────────────────────────────────────
const building = new THREE.Group();
scene.add(building);

// Concrete slabs
for (let i = 0; i <= NUM_FLOORS; i++) {
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(W + 0.1, 0.08, D + 0.1),
    MAT.conc,
  );
  slab.position.y = i * FLOOR_H;
  slab.receiveShadow = true;
  building.add(slab);
}

// Solid walls
for (let i = 0; i < NUM_FLOORS; i++) {
  const wallY = i * FLOOR_H + FLOOR_H / 2;
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(W, FLOOR_H, 0.15),
    MAT.conc,
  );
  backWall.position.set(0, wallY, -D / 2);
  backWall.receiveShadow = true;
  backWall.castShadow = true;
  building.add(backWall);

  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, FLOOR_H, D),
    MAT.conc,
  );
  leftWall.position.set(-W / 2, wallY, 0);
  leftWall.receiveShadow = true;
  leftWall.castShadow = true;
  building.add(leftWall);

  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, FLOOR_H, D),
    MAT.conc,
  );
  rightWall.position.set(W / 2, wallY, 0);
  rightWall.receiveShadow = true;
  rightWall.castShadow = true;
  building.add(rightWall);
}

// Facade curtain glass wall
const mullionW = 0.06;
const numBays = 4;
for (let i = 0; i < NUM_FLOORS; i++) {
  const baseY = i * FLOOR_H;
  const panelH = FLOOR_H - 0.08;

  // Mullions
  for (let b = 0; b <= numBays; b++) {
    const mx = -W / 2 + (b / numBays) * W;
    const mullion = new THREE.Mesh(
      new THREE.BoxGeometry(mullionW, panelH, mullionW),
      MAT.steel,
    );
    mullion.position.set(mx, baseY + panelH / 2 + 0.04, D / 2);
    building.add(mullion);
  }

  // Glass panels
  const bayW = W / numBays;
  for (let b = 0; b < numBays; b++) {
    const px = -W / 2 + b * bayW + bayW / 2;
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(bayW - mullionW, panelH, 0.04),
      MAT.glass,
    );
    glass.position.set(px, baseY + panelH / 2 + 0.04, D / 2);
    building.add(glass);
  }

  const glowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(W - 1, panelH - 0.2),
    new THREE.MeshBasicMaterial({
      color: 0xfff6e8,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
    }),
  );
  glowPlane.position.set(0, baseY + panelH / 2 + 0.14, D / 2 - 0.4);
  building.add(glowPlane);
}

// ─────────────────────────────────────────────────
//  LIGHTING CONSOLIDATION (1 point light per floor)
// ─────────────────────────────────────────────────
const interiorLights = [];
for (let i = 0; i < NUM_FLOORS; i++) {
  const lightY = i * FLOOR_H + FLOOR_H * 0.75;

  const ptC = new THREE.PointLight(0xfff8f2, 5.2, FLOOR_H * 3.5, 1.25);
  ptC.position.set(0, lightY, 0);
  building.add(ptC);
  interiorLights.push(ptC);

  for (const lx of [-3.5, -1.2, 1.2, 3.5]) {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.04, 0.18),
      MAT.emitWhite,
    );
    strip.position.set(lx, i * FLOOR_H + FLOOR_H - 0.08, 0);
    building.add(strip);
  }
}

// ─────────────────────────────────────────────────
//  COLUMNS
// ─────────────────────────────────────────────────
for (let i = 0; i < NUM_FLOORS; i++) {
  const colY = i * FLOOR_H + FLOOR_H / 2;
  for (const cx of [-W / 2 + 0.4, W / 2 - 0.4]) {
    for (const cz of [-D / 2 + 0.4, D / 2 - 0.4]) {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, FLOOR_H - 0.08, 8),
        MAT.concDark,
      );
      col.position.set(cx, colY, cz);
      col.castShadow = true;
      building.add(col);
    }
  }
}

// ─────────────────────────────────────────────────
//  SPIRAL STAIRCASE
// ─────────────────────────────────────────────────
const stairsCenter = new THREE.Vector2(-4.5, -2.5);
const stairsRadius = 1.35;
const stairSteps = 18;
const stairH = FLOOR_H;

for (let f = 0; f < NUM_FLOORS - 1; f++) {
  const stairBaseY = f * FLOOR_H + 0.04;

  // Central column
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, stairH, 8),
    MAT.steel,
  );
  post.position.set(stairsCenter.x, stairBaseY + stairH / 2, stairsCenter.y);
  building.add(post);

  // Steps
  const stepThickness = 0.06;
  const stepGeo = new THREE.BoxGeometry(0.85, stepThickness, 0.28);
  for (let i = 0; i < stairSteps; i++) {
    const angle = (i / stairSteps) * Math.PI * 1.5;
    const dy = (i / stairSteps) * stairH;
    const step = new THREE.Mesh(stepGeo, MAT.marble);
    step.position.set(
      stairsCenter.x + Math.cos(angle) * (stairsRadius - 0.42),
      stairBaseY + dy + stepThickness / 2,
      stairsCenter.y + Math.sin(angle) * (stairsRadius - 0.42),
    );
    step.rotation.y = -angle;
    step.castShadow = true;
    building.add(step);
  }
}

// ─────────────────────────────────────────────────
//  ENTRANCE DOUBLE DOORS
// ─────────────────────────────────────────────────
const doorFrameH = 2.1;
const doorW = 0.85;

const canopy = new THREE.Mesh(
  new THREE.BoxGeometry(2.4, 0.08, 1.35),
  MAT.steelDark,
);
canopy.position.set(0, doorFrameH + 0.08, D / 2 + 0.6);
building.add(canopy);

const canopyTrim = new THREE.Mesh(
  new THREE.BoxGeometry(2.44, 0.03, 1.39),
  MAT.gold,
);
canopyTrim.position.set(0, doorFrameH + 0.08, D / 2 + 0.6);
building.add(canopyTrim);

const doorFrameL = new THREE.Mesh(
  new THREE.BoxGeometry(0.06, doorFrameH, 0.06),
  MAT.steel,
);
doorFrameL.position.set(-doorW - 0.03, doorFrameH / 2, D / 2 + 0.03);
building.add(doorFrameL);

const doorFrameR = new THREE.Mesh(
  new THREE.BoxGeometry(0.06, doorFrameH, 0.06),
  MAT.steel,
);
doorFrameR.position.set(doorW + 0.03, doorFrameH / 2, D / 2 + 0.03);
building.add(doorFrameR);

const leftDoorPivot = new THREE.Group();
leftDoorPivot.position.set(-doorW, 0, D / 2 + 0.03);
building.add(leftDoorPivot);

const leftDoorMesh = new THREE.Mesh(
  new THREE.BoxGeometry(doorW, doorFrameH - 0.02, 0.03),
  MAT.glassTinted,
);
leftDoorMesh.position.set(doorW / 2, doorFrameH / 2, 0);
leftDoorPivot.add(leftDoorMesh);

const leftDoorFrame = new THREE.Mesh(
  new THREE.BoxGeometry(doorW, doorFrameH - 0.02, 0.04),
  MAT.steelDark,
);
leftDoorFrame.position.set(doorW / 2, doorFrameH / 2, 0);
leftDoorPivot.add(leftDoorFrame);

const rightDoorPivot = new THREE.Group();
rightDoorPivot.position.set(doorW, 0, D / 2 + 0.03);
building.add(rightDoorPivot);

const rightDoorMesh = new THREE.Mesh(
  new THREE.BoxGeometry(doorW, doorFrameH - 0.02, 0.03),
  MAT.glassTinted,
);
rightDoorMesh.position.set(-doorW / 2, doorFrameH / 2, 0);
rightDoorPivot.add(rightDoorMesh);

const rightDoorFrame = new THREE.Mesh(
  new THREE.BoxGeometry(doorW, doorFrameH - 0.02, 0.04),
  MAT.steelDark,
);
rightDoorFrame.position.set(-doorW / 2, doorFrameH / 2, 0);
rightDoorPivot.add(rightDoorFrame);

const brandSign = makeCSSLabel("Earth Positive");
brandSign.position.set(0, doorFrameH + 0.55, D / 2 + 0.18);
building.add(brandSign);

const enterDiv = document.createElement("div");
enterDiv.id = "enter-hotspot";
enterDiv.textContent = "ENTER SHOWROOM";
Object.assign(enterDiv.style, {
  fontFamily: '"Playfair Display", serif',
  fontSize: "10px",
  fontWeight: "500",
  letterSpacing: "0.24em",
  color: "#ffffff",
  background: "rgba(10,10,12,0.92)",
  border: "1px solid #C9A84C",
  padding: "12px 28px",
  cursor: "pointer",
  borderRadius: "2px",
  pointerEvents: "auto",
  boxShadow: "0 4px 20px rgba(0,0,0,0.85)",
});
enterDiv.addEventListener("click", (e) => {
  e.stopPropagation();
  enterBuilding();
});

const enterBtnLabel = new CSS2DObject(enterDiv);
enterBtnLabel.position.set(0, doorFrameH * 0.52, D / 2 + 0.22);
building.add(enterBtnLabel);

// ─────────────────────────────────────────────────
//  LOBBY ASSEMBLY (Floor 0)
// ─────────────────────────────────────────────────
const lobby = new THREE.Group();
building.add(lobby);

const floorDecals = new THREE.Group();
const numDecals = 16;
const decalsRadius = 3.3;
const decalGeo = new THREE.BoxGeometry(0.22, 0.005, 0.22);
const decalMat = new THREE.MeshBasicMaterial({ color: 0x222226 });
for (let i = 0; i < numDecals; i++) {
  const angle = (i / numDecals) * Math.PI * 2;
  const decal = new THREE.Mesh(decalGeo, decalMat);
  decal.position.set(
    Math.cos(angle) * decalsRadius,
    0.015,
    Math.sin(angle) * decalsRadius,
  );
  decal.rotation.y = -angle;
  floorDecals.add(decal);
}
lobby.add(floorDecals);

const leftSection = new THREE.Group();
leftSection.position.set(-3.4, 0.04, -0.6);
lobby.add(leftSection);

const copperPanel = new THREE.Mesh(
  new THREE.CylinderGeometry(1.9, 1.9, 2.9, 32, 1, true, 0, Math.PI / 1.7),
  new THREE.MeshStandardMaterial({
    color: 0x824424,
    metalness: 0.85,
    roughness: 0.25,
    side: THREE.DoubleSide,
  }),
);
copperPanel.rotation.y = -Math.PI / 3;
copperPanel.position.set(-1.0, 1.45, -0.5);
leftSection.add(copperPanel);

const cageSmall = makeBirdcage(0.8);
cageSmall.position.set(-0.9, 1.6, -0.3);
leftSection.add(cageSmall);

const cageBig = makeBirdcage(1.2);
cageBig.position.set(-0.25, 0.6, -0.15);
leftSection.add(cageBig);

const hirumeLabel = makeCSSLabel("HIRUME Showcase", {
  fontSize: "8px",
  border: "none",
  background: "transparent",
});
hirumeLabel.position.set(-0.85, 1.8, -0.2);
lobby.add(hirumeLabel);

const centerBack = new THREE.Group();
centerBack.position.set(0, 0.04, -2.6);
lobby.add(centerBack);

const centerPlat = new THREE.Group();
centerPlat.position.set(0, 0.0, 1.5);
lobby.add(centerPlat);
const cp1 = new THREE.Mesh(
  new THREE.CylinderGeometry(2.4, 2.4, 0.08, 32),
  MAT.marble,
);
cp1.position.y = 0.04;
cp1.receiveShadow = true;
centerPlat.add(cp1);
const cp2 = new THREE.Mesh(
  new THREE.CylinderGeometry(2.0, 2.0, 0.08, 32),
  MAT.marble,
);
cp2.position.y = 0.12;
cp2.receiveShadow = true;
centerPlat.add(cp2);
const cp3 = new THREE.Mesh(
  new THREE.CylinderGeometry(1.6, 1.6, 0.08, 32),
  MAT.marble,
);
cp3.position.y = 0.2;
cp3.receiveShadow = true;
centerPlat.add(cp3);

const numScreens = 4;
const screenW = 0.65;
const screenH = 1.0;

for (let i = 0; i < numScreens; i++) {
  const sx = -1.2 + i * 0.8;
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(screenW, screenH),
    screenShaderMat,
  );
  screen.position.set(sx, 1.8, 0.04);
  centerBack.add(screen);

  const bezel = new THREE.Mesh(
    new THREE.BoxGeometry(screenW + 0.04, screenH + 0.04, 0.02),
    MAT.steelDark,
  );
  bezel.position.set(sx, 1.8, 0.0);
  centerBack.add(bezel);
}

lobby.add(makeStaffMember(0, 0.24, 0.3, 0));

const rightSection = new THREE.Group();
rightSection.position.set(3.4, 0.04, -0.6);
lobby.add(rightSection);

const plasterPanel = new THREE.Mesh(
  new THREE.CylinderGeometry(
    1.9,
    1.9,
    2.9,
    32,
    1,
    true,
    Math.PI,
    Math.PI / 1.7,
  ),
  new THREE.MeshStandardMaterial({
    color: 0xf6f3ef,
    roughness: 0.5,
    side: THREE.DoubleSide,
  }),
);
plasterPanel.rotation.y = Math.PI / 6;
plasterPanel.position.set(1.0, 1.45, -0.5);
rightSection.add(plasterPanel);

const showcaseBase = new THREE.Mesh(
  new THREE.CylinderGeometry(0.85, 0.85, 0.08, 24),
  MAT.steelDark,
);
showcaseBase.position.set(0, 0.04, 0.2);
rightSection.add(showcaseBase);

const grass = new THREE.Mesh(
  new THREE.CylinderGeometry(0.83, 0.83, 0.02, 24),
  new THREE.MeshStandardMaterial({ color: 0x2a561e, roughness: 0.95 }),
);
grass.position.set(0, 0.09, 0.2);
rightSection.add(grass);

const dressGroup = new THREE.Group();
dressGroup.position.set(0, 0.1, 0.2);
rightSection.add(dressGroup);
const colorsList = [0x512da8, 0x1976d2, 0x388e3c, 0xfbc02d, 0xf57c00, 0xd32f2f];
for (let i = 0; i < 6; i++) {
  const ry = 0.12 + i * 0.15;
  const radius = 0.36 - i * 0.05;
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0.13, 16, 32),
    new THREE.MeshStandardMaterial({ color: colorsList[i], roughness: 0.9 }),
  );
  torus.rotation.x = Math.PI / 2;
  torus.position.y = ry;
  dressGroup.add(torus);
}
const dressTop = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.08, 0.2, 4, 8),
  new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 }),
);
dressTop.position.y = 1.0;
dressGroup.add(dressTop);

const accordionFan = new THREE.Group();
accordionFan.position.set(0, 2.5, 0.2);
rightSection.add(accordionFan);
const numWedges = 32;
for (let i = 0; i < numWedges; i++) {
  const angle = (i / numWedges) * Math.PI * 2;
  const wedgeGeo = new THREE.ConeGeometry(0.65, 0.07, 3);
  const wedge = new THREE.Mesh(
    wedgeGeo,
    new THREE.MeshStandardMaterial({
      color: 0xe8e4db,
      roughness: 0.75,
      side: THREE.DoubleSide,
    }),
  );
  wedge.rotation.z = Math.PI / 2;
  wedge.rotation.y = angle;
  wedge.rotation.x = i % 2 === 0 ? 0.18 : -0.18;
  wedge.position.set(Math.cos(angle) * 0.3, 0, Math.sin(angle) * 0.3);
  accordionFan.add(wedge);
}

const tomoLabel = makeCSSLabel("TOMO KOIZUMI", {
  fontSize: "8px",
  color: "#ffffff",
  letterSpacing: "0.15em",
  background: "transparent",
  border: "none",
});
tomoLabel.position.set(2.2, 1.8, -1.2);
lobby.add(tomoLabel);

const skyDome = new THREE.Mesh(
  new THREE.CylinderGeometry(2.2, 2.2, 0.1, 32, 1, false),
  skyMat,
);
skyDome.position.set(0, FLOOR_H - 0.05, 0);
lobby.add(skyDome);

const spokesGroup = new THREE.Group();
spokesGroup.position.set(0, FLOOR_H - 0.06, 0);
lobby.add(spokesGroup);
for (let i = 0; i < 12; i++) {
  const angle = (i / 12) * Math.PI * 2;
  const spoke = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 4.4, 6),
    MAT.steelDark,
  );
  spoke.rotation.x = Math.PI / 2;
  spoke.rotation.y = angle;
  spokesGroup.add(spoke);
}

const chandelierGroup = new THREE.Group();
chandelierGroup.position.set(0, FLOOR_H * 0.65, 0);
lobby.add(chandelierGroup);
const chandelierRods = 6;
for (let i = 0; i < chandelierRods; i++) {
  const angle = (i / chandelierRods) * Math.PI * 2;
  const rx = Math.cos(angle) * 0.45;
  const rz = Math.sin(angle) * 0.45;
  const rod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.008, 0.9, 8),
    MAT.emitWhite,
  );
  rod.position.set(rx, 0, rz);
  chandelierGroup.add(rod);

  const fixture = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.94, 8),
    MAT.steelDark,
  );
  fixture.position.set(rx, 0.02, rz);
  chandelierGroup.add(fixture);
}

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
lobbyParticleGeo.setAttribute("position", new THREE.BufferAttribute(lpPos, 3));
lobbyParticleGeo.setAttribute("aRandom", new THREE.BufferAttribute(lpRand, 1));

const lobbyParticles = new THREE.Points(lobbyParticleGeo, lobbyParticleMat);
lobby.add(lobbyParticles);

const lobbyHotspots = new THREE.Group();
lobby.add(lobbyHotspots);
lobbyHotspots.add(makeNavHotspot(1, "Go to 1F ↗", -3.2, 0.9, -1.8));
lobbyHotspots.add(
  makePropHotspot(
    "Tomo Koizumi Gown",
    "Fluffy ruffled rainbow dress made of layered colored tulle.",
    3.4,
    1.3,
    -0.4,
  ),
);
lobbyHotspots.add(
  makePropHotspot(
    "Hirume Bonsai",
    "Traditional Japanese Bonsai tree representing natural beauty.",
    -2.8,
    0.7,
    -0.4,
  ),
);
lobbyHotspots.add(
  makePropHotspot(
    "Rod Chandelier",
    "Contemporary vertical tube rod chandelier with glow bloom.",
    0,
    2.3,
    0,
  ),
);

// ─────────────────────────────────────────────────
//  FLOOR 1 ASSEMBLY — T-Shirts
// ─────────────────────────────────────────────────
const tShirtFloor = new THREE.Group();
tShirtFloor.position.y = FLOOR_H;
building.add(tShirtFloor);

tShirtFloor.add(makePartitionWall(2.5, 0.02, -1.8, Math.PI / 1.1, 0x2b3d4a));
tShirtFloor.add(
  makeHangingRack(0, 0.02, -1.8, 0, [0x43a047, 0x1e88e5, 0xe53935]),
);
tShirtFloor.add(
  makeClothingRack(-2.5, 0.02, -1.6, 0, [0xffffff, 0x888888, 0x333333]),
);
tShirtFloor.add(makeLoungeSofa(2.6, 0.02, 1.2, -Math.PI / 1.4));
tShirtFloor.add(makeFullLengthMirror(1.3, 0.02, -1.1, -Math.PI / 8));
tShirtFloor.add(makeShelvingOrganizer(-2.8, 0.02, -0.3, Math.PI / 2));
tShirtFloor.add(makeBigPottedPlant(-3.1, 0.02, 1.4));
tShirtFloor.add(makeMannequin(2.1, 0.02, -1.0, -Math.PI / 4, 0x424242));
tShirtFloor.add(makeMannequin(-1.2, 0.02, 1.4, Math.PI / 3, 0x9e9e9e));
tShirtFloor.add(makeStaffMember(-2.2, 0.02, 0.8, -Math.PI / 2));

const tShirtHotspots = new THREE.Group();
tShirtFloor.add(tShirtHotspots);
tShirtHotspots.add(makeNavHotspot(2, "Go to 2F ↗", -3.2, 0.9, -1.8));
tShirtHotspots.add(makeNavHotspot(0, "Go to Lobby ↙", -5.2, 0.9, -2.6));
tShirtHotspots.add(
  makePropHotspot(
    "Organic Tees",
    "Premium cotton T-shirt collection.",
    0,
    1.2,
    -1.8,
  ),
);
tShirtHotspots.add(
  makePropHotspot(
    "Organizer Stand",
    "Sustainable accessory displays.",
    -2.8,
    1.0,
    -0.3,
  ),
);
tShirtHotspots.add(
  makePropHotspot("Lounge Sofa", "Client seating lounge.", 2.6, 0.8, 1.2),
);

// ─────────────────────────────────────────────────
//  FLOOR 2 ASSEMBLY — Hoodies
// ─────────────────────────────────────────────────
const hoodieFloor = new THREE.Group();
hoodieFloor.position.y = FLOOR_H * 2;
building.add(hoodieFloor);

hoodieFloor.add(makePartitionWall(2.5, 0.02, -1.8, Math.PI / 1.1, 0x1f3442));
hoodieFloor.add(
  makeHangingRack(0, 0.02, -1.8, 0, [0xf4511e, 0xfd9f00, 0x7c4dff]),
);
hoodieFloor.add(
  makeClothingRack(-2.5, 0.02, -1.6, 0, [0xe0e0e0, 0x757575, 0x212121]),
);
hoodieFloor.add(makeLoungeSofa(2.6, 0.02, 1.2, -Math.PI / 1.4));
hoodieFloor.add(makeFullLengthMirror(1.3, 0.02, -1.1, -Math.PI / 8));
hoodieFloor.add(makeShelvingOrganizer(-2.8, 0.02, -0.3, Math.PI / 2));
hoodieFloor.add(makeBigPottedPlant(-3.1, 0.02, 1.4));
hoodieFloor.add(makeMannequin(2.1, 0.02, -1.0, -Math.PI / 4, 0x1565c0));
hoodieFloor.add(makeMannequin(-1.2, 0.02, 1.4, Math.PI / 3, 0xad1457));
hoodieFloor.add(makeStaffMember(-2.2, 0.02, 0.8, -Math.PI / 2));

const hoodieHotspots = new THREE.Group();
hoodieFloor.add(hoodieHotspots);
hoodieHotspots.add(makeNavHotspot(3, "Go to 3F ↗", -3.2, 0.9, -1.8));
hoodieHotspots.add(makeNavHotspot(1, "Go to 1F ↙", -5.2, 0.9, -2.6));
hoodieHotspots.add(
  makePropHotspot(
    "Organic Hoodies",
    "Heavyweight streetwear collection.",
    0,
    1.2,
    -1.8,
  ),
);

// ─────────────────────────────────────────────────
//  FLOOR 3 ASSEMBLY — Accessories & Penthouse
// ─────────────────────────────────────────────────
const accFloor = new THREE.Group();
accFloor.position.y = FLOOR_H * 3;
building.add(accFloor);

accFloor.add(makePartitionWall(2.5, 0.02, -1.8, Math.PI / 1.1, 0x24242a));
accFloor.add(makeHangingRack(0, 0.02, -1.8, 0, [0xffb74d, 0x81c784, 0x64b5f6]));
accFloor.add(
  makeClothingRack(-2.5, 0.02, -1.6, 0, [0xd1c4e9, 0xb2dfdb, 0xffcc80]),
);
accFloor.add(makeLoungeSofa(2.6, 0.02, 1.2, -Math.PI / 1.4));
accFloor.add(makeFullLengthMirror(1.3, 0.02, -1.1, -Math.PI / 8));
accFloor.add(makeShelvingOrganizer(-2.8, 0.02, -0.3, Math.PI / 2));
accFloor.add(makeBigPottedPlant(-3.1, 0.02, 1.4));
accFloor.add(makeMannequin(2.1, 0.02, -1.0, -Math.PI / 4, 0xe65100));
accFloor.add(makeMannequin(-1.2, 0.02, 1.4, Math.PI / 3, 0x004d40));
accFloor.add(makeStaffMember(-2.2, 0.02, 0.8, -Math.PI / 2));

const accHotspots = new THREE.Group();
accFloor.add(accHotspots);
accHotspots.add(makeNavHotspot(2, "Go to 2F ↙", -5.2, 0.9, -2.6));
accHotspots.add(
  makePropHotspot(
    "Accessories Collection",
    "Caps, bags & jewelry.",
    0,
    1.2,
    -1.8,
  ),
);

// ─────────────────────────────────────────────────
//  FLOOR VISIBILITY CONTROLLERS (Draw call frustum optimization)
// ─────────────────────────────────────────────────
const floorGroups = [lobby, tShirtFloor, hoodieFloor, accFloor];
function updateFloorVisibility(floorIndex) {
  if (!isInside) {
    floorGroups.forEach((g) => {
      g.visible = true;
    });
    // Keep ceiling sky dome off in exterior mode
    skyDome.visible = false;
  } else {
    skyDome.visible = true;
    lobby.visible = floorIndex === 0 || floorIndex === 1;
    tShirtFloor.visible =
      floorIndex === 0 || floorIndex === 1 || floorIndex === 2;
    hoodieFloor.visible =
      floorIndex === 1 || floorIndex === 2 || floorIndex === 3;
    accFloor.visible = floorIndex === 2 || floorIndex === 3;
  }
}

// ─────────────────────────────────────────────────
//  HOTSPOT BUILDER METHODS
// ─────────────────────────────────────────────────
function makePropHotspot(name, desc, x, y, z) {
  const btn = document.createElement("button");
  btn.className = "prop-hotspot-btn";
  btn.textContent = "+";

  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    document
      .querySelectorAll(".prop-hotspot-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const details = PROP_DATABASE[name] || {
      price: "$0.00",
      icon: "tag",
      desc: desc,
    };

    document.getElementById("prod-title").textContent = name;
    document.getElementById("prod-price").textContent = details.price;
    document.getElementById("prod-desc").textContent = details.desc;

    updateProductPanelIcon(details.icon);

    const panel = document.getElementById("product-panel");
    if (panel) {
      panel.classList.remove("product-panel-hidden");
      const closeBtn = document.getElementById("product-panel-close");
      if (closeBtn) closeBtn.focus();
    }
  });

  btn.style.display = "none";
  const obj = new CSS2DObject(btn);
  obj.position.set(x, y, z);
  return obj;
}

function makeNavHotspot(targetFloor, text, x, y, z) {
  const btn = document.createElement("button");
  btn.className = "nav-hotspot-btn";
  btn.innerHTML = `<svg width="9" height="9" viewBox="0 0 10 10" fill="none" style="margin-right:5px;vertical-align:middle"><path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>${text}`;
  Object.assign(btn.style, {
    fontFamily: '"Inter", sans-serif',
    fontSize: "9px",
    fontWeight: "600",
    letterSpacing: "0.15em",
    color: "#F5D76E",
    padding: "6px 12px",
    background: "rgba(0,0,0,0.85)",
    border: "1px solid rgba(201,168,76,0.3)",
    borderRadius: "2px",
    cursor: "pointer",
    pointerEvents: "auto",
    whiteSpace: "nowrap",
    textTransform: "uppercase",
  });

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    goToInteriorFloor(targetFloor);
  });

  btn.style.display = "none";
  const obj = new CSS2DObject(btn);
  obj.position.set(x, y, z);
  return obj;
}

// ─────────────────────────────────────────────────
//  HOTSPOT VISIBILITY TOGGLES
// ─────────────────────────────────────────────────
function toggleCSS2DVisibility(group, show) {
  if (!group) return;
  group.traverse((node) => {
    if (node instanceof CSS2DObject && node.element) {
      node.element.style.display = show ? "block" : "none";
    }
  });
}

function updateHotspotsVisibility(idx) {
  toggleCSS2DVisibility(lobbyHotspots, isInside && idx === 0);
  toggleCSS2DVisibility(tShirtHotspots, isInside && idx === 1);
  toggleCSS2DVisibility(hoodieHotspots, isInside && idx === 2);
  toggleCSS2DVisibility(accHotspots, isInside && idx === 3);
}

// ─────────────────────────────────────────────────
//  HUD UPDATER
// ─────────────────────────────────────────────────
const interiorHUD = document.getElementById("interior-hud");
const interiorTitle = document.getElementById("interiorTitle");
const interiorDesc = document.getElementById("interiorDesc");
const interiorTags = document.getElementById("interiorTags");

function updateInteriorHUD(idx) {
  const f = FLOORS[idx];
  if (!f) return;
  interiorTitle.textContent = f.name;
  interiorDesc.textContent = f.desc;

  interiorTags.innerHTML = "";
  f.tags.forEach((t) => {
    const el = document.createElement("span");
    el.className = "floor-item-tag";
    el.textContent = t;
    interiorTags.appendChild(el);
  });

  updateHotspotsVisibility(idx);
}

// ─────────────────────────────────────────────────
//  NAVIGATION TRANSITIONS (GSAP)
// ─────────────────────────────────────────────────
function goToInteriorFloor(idx) {
  if (!isInside || animating) return;
  if (idx < 0 || idx >= FLOORS.length) return;

  animating = true;
  controls.enabled = false;

  const duration = prefersReducedMotion ? 0 : 2.0;

  // Move camera along spiral stairs path
  const timeline = gsap.timeline({
    onComplete: () => {
      currentInteriorFloor = idx;
      controls.target.set(0, idx * FLOOR_H + FLOOR_H * 0.55, -1);
      camera.position.set(0, idx * FLOOR_H + FLOOR_H * 0.55, D / 2 + 3.8);
      controls.enabled = true;
      animating = false;
      updateInteriorHUD(idx);
      updateFloorVisibility(idx);
    },
  });

  if (prefersReducedMotion) {
    timeline.set(camera.position, { y: idx * FLOOR_H + FLOOR_H * 0.55 });
    return;
  }

  // Visual blur overlay transition swipe
  const transitionOverlay = document.getElementById("transition-overlay");
  timeline
    .to(transitionOverlay, { opacity: 0.65, duration: 0.4 })
    .add(() => {
      updateFloorVisibility(idx);
    })
    .to(camera.position, {
      x: stairsCenter.x + Math.cos(Math.PI) * stairsRadius,
      y: idx * FLOOR_H + FLOOR_H * 0.55,
      z: stairsCenter.y + Math.sin(Math.PI) * stairsRadius,
      duration: duration - 0.8,
      ease: "power2.inOut",
      onUpdate: () => {
        controls.target.set(
          stairsCenter.x,
          idx * FLOOR_H + FLOOR_H * 0.5,
          stairsCenter.y,
        );
        controls.update();
      },
    })
    .to(transitionOverlay, { opacity: 0, duration: 0.4 });
}

function enterBuilding() {
  if (isInside || animating) return;
  animating = true;
  controls.enabled = false;

  const lobbyY = FLOOR_H * 0.5;
  const doorZ = D / 2 + 0.1;
  const duration = prefersReducedMotion ? 0 : 1.5;

  const enterTimeline = gsap.timeline({
    onComplete: () => {
      isInside = true;
      currentInteriorFloor = 0;

      controls.minDistance = 1.5;
      controls.maxDistance = 14;
      controls.maxPolarAngle = Math.PI / 1.7;
      controls.minPolarAngle = Math.PI / 5;
      controls.target.set(0, lobbyY, -1);
      camera.position.set(0, lobbyY + 0.2, D / 2 + 3.8);
      controls.enabled = true;
      controls.update();

      updateInteriorHUD(0);
      updateFloorVisibility(0);

      const enterDiv = document.getElementById("enter-hotspot");
      // const navDots = document.getElementById("nav-dots");
      const hintEl = document.getElementById("hint");
      const backBtn = document.getElementById("back-btn");
      // const floorInfoEl = document.getElementById("floor-info");
      const dn = document.getElementById("daynight-toggle");
      const bl = document.getElementById("bloom-toggle");

      if (enterDiv) enterDiv.style.display = "none";
      // if (navDots) navDots.style.display = "none";
      if (hintEl) {
        hintEl.textContent = isTouchDevice
          ? "Touch & Drag to explore · Pinch to zoom · Arrow HUD buttons to change floors"
          : "Drag to explore · Scroll to zoom · ← → to change floors";
      }
      if (backBtn) backBtn.classList.add("visible");
      if (dn) dn.classList.add("visible");
      if (bl) bl.classList.add("visible");
      if (interiorHUD) interiorHUD.classList.add("visible");
      // if (floorInfoEl) floorInfoEl.classList.remove("visible");

      // Trigger tutorial modal
      const hasVisited = localStorage.getItem("visitedShowroom");
      const tutorialOverlay = document.getElementById("tutorial-overlay");
      if (!hasVisited && tutorialOverlay) {
        tutorialOverlay.classList.remove("tutorial-hidden");
      }

      animating = false;
    },
  });

  if (prefersReducedMotion) {
    enterTimeline.set(camera.position, {
      x: 0,
      y: lobbyY + 0.2,
      z: D / 2 + 3.8,
    });
    return;
  }

  // Open glass doors swing GSAP
  enterTimeline.to(
    leftDoorPivot.rotation,
    { y: Math.PI / 2.2, duration: 0.8, ease: "power2.out" },
    0,
  );
  enterTimeline.to(
    rightDoorPivot.rotation,
    { y: -Math.PI / 2.2, duration: 0.8, ease: "power2.out" },
    0,
  );

  // Zoom camera through frame
  enterTimeline.to(
    camera.position,
    {
      x: 0,
      y: lobbyY + 0.2,
      z: doorZ - 0.5,
      duration: duration,
      ease: "power3.inOut",
      onUpdate: () => {
        controls.target.set(0, lobbyY, doorZ - 2);
        controls.update();
      },
    },
    0.2,
  );
}

function exitBuilding() {
  if (!isInside || animating) return;
  animating = true;
  controls.enabled = false;

  const lobbyY = FLOOR_H * 0.5;
  const doorZ = D / 2 + 0.1;
  const duration = prefersReducedMotion ? 0 : 1.6;

  const exitTimeline = gsap.timeline({
    onComplete: () => {
      isInside = false;
      controls.minDistance = 6;
      controls.maxDistance = 50;
      controls.maxPolarAngle = Math.PI / 2.1;
      controls.minPolarAngle = Math.PI / 8;
      controls.target.copy(CAM.exterior.target);
      controls.enabled = true;
      controls.update();

      const enterDiv = document.getElementById("enter-hotspot");
      // const navDots = document.getElementById("nav-dots");
      const hintEl = document.getElementById("hint");
      const backBtn = document.getElementById("back-btn");
      const dn = document.getElementById("daynight-toggle");
      const bl = document.getElementById("bloom-toggle");

      if (enterDiv) enterDiv.style.display = "flex";
      // if (navDots) navDots.style.display = "flex";
      if (hintEl) {
        hintEl.textContent = isTouchDevice
          ? "Touch & Drag to Orbit · Pinch to Zoom · Tap Door to Enter"
          : "Drag to Orbit · Scroll to Zoom · Click Door to Enter";
      }
      if (backBtn) backBtn.classList.remove("visible");
      if (dn) dn.classList.remove("visible");
      if (bl) bl.classList.remove("visible");
      if (interiorHUD) interiorHUD.classList.remove("visible");

      updateFloorVisibility(0);
      updateHotspotsVisibility(0);

      animating = false;
    },
  });

  if (prefersReducedMotion) {
    exitTimeline.set(camera.position, {
      x: CAM.exterior.pos.x,
      y: CAM.exterior.pos.y,
      z: CAM.exterior.pos.z,
    });
    return;
  }

  exitTimeline.to(camera.position, {
    x: 0,
    y: lobbyY + 0.2,
    z: doorZ + 5,
    duration: 1.3,
    ease: "power3.inOut",
    onUpdate: () => {
      controls.target.set(0, lobbyY, doorZ - 1);
      controls.update();
    },
  });

  exitTimeline.to(
    leftDoorPivot.rotation,
    { y: 0, duration: 0.9, ease: "power2.inOut", delay: 0.4 },
    0.5,
  );
  exitTimeline.to(
    rightDoorPivot.rotation,
    { y: 0, duration: 0.9, ease: "power2.inOut", delay: 0.4 },
    0.5,
  );

  exitTimeline.to(camera.position, {
    x: CAM.exterior.pos.x,
    y: CAM.exterior.pos.y,
    z: CAM.exterior.pos.z,
    duration: duration,
    ease: "power3.inOut",
    delay: 1.1,
    onUpdate: () => {
      controls.target.lerp(CAM.exterior.target, 0.05);
      controls.update();
    },
  });

  // hide product panel if open
  const panel = document.getElementById("product-panel");
  if (panel) panel.classList.add("product-panel-hidden");
}

// ─────────────────────────────────────────────────
//  EXTERNAL NAV DOTS (Exterior Orbit)
// ─────────────────────────────────────────────────
// const navDots = document.getElementById("nav-dots");
// if (navDots) {
//   const dots = navDots.querySelectorAll(".dot");
//   dots.forEach((dot) => {
//     dot.addEventListener("click", (e) => {
//       e.stopPropagation();
//       if (isInside || animating) return;
//       const idx = parseInt(dot.getAttribute("data-idx"));
//       dots.forEach((d) => d.classList.remove("active"));
//       dot.classList.add("active");

//       const floorInfoEl = document.getElementById("floor-info");
//       const fiTitle = document.getElementById("fiTitle");
//       const fiDesc = document.getElementById("fiDesc");

//       if (idx === 0) {
//         gsap.to(camera.position, {
//           x: 22,
//           y: 16,
//           z: 28,
//           duration: 2.0,
//           ease: "power3.inOut",
//           onUpdate: () => {
//             controls.target.set(0, 6, 0);
//             controls.update();
//           },
//         });
//         if (fiTitle) fiTitle.textContent = "Earth Positive Flagship";
//         if (fiDesc) fiDesc.textContent = "Explore our luxury collections";
//       } else {
//         const floorY = (idx - 1) * FLOOR_H + FLOOR_H / 2;
//         gsap.to(camera.position, {
//           x: 0,
//           y: floorY + 0.3,
//           z: D / 2 + 5.5,
//           duration: 1.8,
//           ease: "power3.inOut",
//           onUpdate: () => {
//             controls.target.set(0, floorY, 0);
//             controls.update();
//           },
//         });
//         const f = FLOORS[idx - 1];
//         if (fiTitle && f) fiTitle.textContent = f.name;
//         if (fiDesc && f) fiDesc.textContent = f.desc;
//       }
//     });
//   });
// }

// ─────────────────────────────────────────────────
//  INITIALIZE UI EVENT BINDINGS
// ─────────────────────────────────────────────────
initTutorialBindings();

initEcommerceBindings((title) => {
  // Callback when "View Details" is clicked: zoom in on the product!
  const config = SEARCH_FOCUS[title];
  if (config) {
    triggerFocusAnim(config, title);
  }
});

initAccessibilityKeyboardRouter(() => {
  exitBuilding();
});

const backBtn = document.getElementById("back-btn");
if (backBtn) {
  backBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    exitBuilding();
  });
}

// ─────────────────────────────────────────────────
//  ⚡ BLOOM POST-PROCESSING PERFORMANCE TOGGLE
// ─────────────────────────────────────────────────
const bloomToggleBtn = document.getElementById("bloom-toggle");
const bloomIcon = document.getElementById("bloom-icon");
const bloomText = document.getElementById("bloom-text");

if (bloomToggleBtn) {
  if (bloomIcon && bloomText) {
    bloomIcon.textContent = initialBloomStrength > 0 ? "⚡" : "⚪";
    bloomText.textContent = initialBloomStrength > 0 ? "BLOOM ON" : "BLOOM OFF";
  }

  bloomToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (bloomPass.strength > 0) {
      bloomPass.strength = 0;
      if (bloomIcon) bloomIcon.textContent = "⚪";
      if (bloomText) bloomText.textContent = "BLOOM OFF";
      showToast("Bloom disabled (high performance)");
    } else {
      bloomPass.strength = isMobileDevice ? 0.15 : 0.65;
      if (bloomIcon) bloomIcon.textContent = "⚡";
      if (bloomText) bloomText.textContent = "BLOOM ON";
      showToast("Bloom enabled (cinematic quality)");
    }
  });
}

// ─────────────────────────────────────────────────
//  🌓 DAY/NIGHT LIGHTING MODE TOGGLE
// ─────────────────────────────────────────────────
let isNight = false;
const dnToggle = document.getElementById("daynight-toggle");
const dnIcon = document.getElementById("daynight-icon");
const dnText = document.getElementById("daynight-text");

if (dnToggle) {
  dnToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    isNight = !isNight;
    if (dnIcon) dnIcon.textContent = isNight ? "☀️" : "🌙";
    if (dnText) dnText.textContent = isNight ? "DAY MODE" : "NIGHT MODE";

    gsap.to(ambientLight, {
      intensity: isNight ? 0.15 : 0.6,
      duration: 1.5,
      ease: "power2.out",
    });
    gsap.to(ambientLight.color, {
      r: isNight ? 0.35 : 1.0,
      g: isNight ? 0.45 : 1.0,
      b: isNight ? 0.75 : 1.0,
      duration: 1.5,
      ease: "power2.out",
    });
    gsap.to(keyLight, {
      intensity: isNight ? 0.4 : 2.0,
      duration: 1.5,
      ease: "power2.out",
    });
    gsap.to(scene.fog, {
      density: isNight ? 0.012 : 0.006,
      duration: 1.5,
      ease: "power2.out",
    });
  });
}

function triggerFocusAnim(config, name) {
  goToInteriorFloor(config.floor);

  animating = true;
  controls.enabled = false;

  const duration = prefersReducedMotion ? 0 : 1.6;

  gsap.to(camera.position, {
    x: config.pos.x,
    y: config.pos.y,
    z: config.pos.z,
    duration: duration,
    ease: "power3.inOut",
    onUpdate: () => controls.update(),
  });

  gsap.to(controls.target, {
    x: config.target.x,
    y: config.target.y,
    z: config.target.z,
    duration: duration,
    ease: "power3.inOut",
    onUpdate: () => controls.update(),
    onComplete: () => {
      controls.enabled = true;
      animating = false;

      const details = PROP_DATABASE[name] || {
        price: "$0.00",
        icon: "tag",
        desc: "",
      };
      document.getElementById("prod-title").textContent = name;
      document.getElementById("prod-price").textContent = details.price;
      document.getElementById("prod-desc").textContent = details.desc;

      updateProductPanelIcon(details.icon);

      const panel = document.getElementById("product-panel");
      if (panel) panel.classList.remove("product-panel-hidden");
    },
  });
}

// ─────────────────────────────────────────────────
//  INTERACTIVE HOVER GLOW (Raycasting on Pre-allocated Materials)
// ─────────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;
let pointerMoved = false;

window.addEventListener("pointermove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  pointerMoved = true;
});

// Also support touch moves for mobile raycasting
window.addEventListener("touchmove", (event) => {
  if (event.touches.length > 0) {
    mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    pointerMoved = true;
  }
});

function checkRaycast() {
  if (!isInside || animating) {
    document.body.style.cursor = "default";
    return;
  }
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(building.children, true);
  let found = null;
  for (let i = 0; i < intersects.length; i++) {
    const obj = intersects[i].object;
    if (
      obj.isMesh &&
      obj.material &&
      !obj.name.includes("wall") &&
      !obj.name.includes("slab") &&
      !obj.name.includes("floor") &&
      !obj.name.includes("column") &&
      !obj.name.includes("stair") &&
      !obj.name.includes("spoke")
    ) {
      found = intersects[i];
      break;
    }
  }

  if (found) {
    const obj = found.object;
    document.body.style.cursor = "pointer";
    if (hoveredObject !== obj) {
      if (hoveredObject && hoveredObject.savedMaterial) {
        hoveredObject.material = hoveredObject.savedMaterial;
        hoveredObject.savedMaterial = null;
      }
      hoveredObject = obj;
      if (obj.material) {
        const hoverMat = hoverMaterialsMap.get(obj.material);
        if (hoverMat) {
          obj.savedMaterial = obj.material;
          obj.material = hoverMat;
        }
      }
    }
  } else {
    document.body.style.cursor = "default";
    if (hoveredObject) {
      if (hoveredObject.savedMaterial) {
        hoveredObject.material = hoveredObject.savedMaterial;
        hoveredObject.savedMaterial = null;
      }
      hoveredObject = null;
    }
  }
}

// ─────────────────────────────────────────────────
//  INTERIOR NAVIGATION CONTROLS (HUD)
// ─────────────────────────────────────────────────
const btnUp = document.getElementById("floor-up-btn");
const btnDown = document.getElementById("floor-down-btn");

if (btnUp) {
  btnUp.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentInteriorFloor < FLOORS.length - 1) {
      goToInteriorFloor(currentInteriorFloor + 1);
    }
  });
}
if (btnDown) {
  btnDown.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentInteriorFloor > 0) {
      goToInteriorFloor(currentInteriorFloor - 1);
    }
  });
}

// ─────────────────────────────────────────────────
//  ANIMATION LOOP
// ─────────────────────────────────────────────────
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  // Breathe interior lights
  interiorLights.forEach((lt, i) => {
    lt.intensity = 4.8 + Math.sin(t * 0.4 + i * 1.2) * 0.15;
  });

  // Mannequins idle breathing/head drift
  if (typeof mannequinHeads !== "undefined") {
    mannequinHeads.forEach((head, i) => {
      head.rotation.y = Math.sin(t * 0.4 + i * 2.0) * 0.08;
    });
  }
  if (typeof mannequinTorsos !== "undefined") {
    mannequinTorsos.forEach((torso, i) => {
      torso.position.y = 0.88 + Math.sin(t * 0.8 + i * 1.5) * 0.012;
    });
  }

  // Animate custom lobby shaders
  if (typeof screenShaderMat !== "undefined")
    screenShaderMat.uniforms.uTime.value = t;
  if (typeof skyMat !== "undefined") skyMat.uniforms.uTime.value = t;
  if (typeof lobbyParticleMat !== "undefined")
    lobbyParticleMat.uniforms.uTime.value = t;
  if (typeof chandelierGroup !== "undefined")
    chandelierGroup.rotation.y = t * 0.12;

  if (pointerMoved) {
    checkRaycast();
    pointerMoved = false;
  }

  // Prevent camera from clipping through floor, ceilings, or walls
  applyCollisionDetection();

  controls.update();

  composer.render();
  labelRenderer.render(scene, camera);
}

function applyCollisionDetection() {
  if (!isInside || animating) return;
  const halfW = W / 2 - 0.65;
  const halfD = D / 2 - 0.65;
  camera.position.x = Math.max(-halfW, Math.min(halfW, camera.position.x));
  camera.position.z = Math.max(-halfD, Math.min(halfD, camera.position.z));

  const floorMinY = currentInteriorFloor * FLOOR_H + 0.22;
  const floorMaxY = (currentInteriorFloor + 1) * FLOOR_H - 0.22;
  camera.position.y = Math.max(
    floorMinY,
    Math.min(floorMaxY, camera.position.y),
  );
}

animate();

// ─────────────────────────────────────────────────
//  RESIZE
// ─────────────────────────────────────────────────
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }, 150);
});

// ─────────────────────────────────────────────────
//  LOADING EXPERIENCE & STORYTELLING
// ─────────────────────────────────────────────────
const loadingStories = [
  "We believe in organic, climate-neutral fashion...",
  "Ethically sourced, crafted for the planet...",
  "Step into the future of sustainable luxury...",
  "Earth Positive — Fashion for a better tomorrow.",
];
let storyIndex = 0;
const storyEl = document.getElementById("loading-story");
const storyInterval = setInterval(() => {
  if (storyEl) {
    storyEl.style.opacity = 0;
    setTimeout(() => {
      storyIndex = (storyIndex + 1) % loadingStories.length;
      storyEl.textContent = loadingStories[storyIndex];
      storyEl.style.opacity = 1;
    }, 500);
  }
}, 3000);

THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const progress = Math.min((itemsLoaded / itemsTotal) * 100, 100);
  const progressBar = document.getElementById("loading-bar-fill");
  const progressPercent = document.getElementById("loading-percent");
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (progressPercent) progressPercent.textContent = `${Math.round(progress)}%`;
};

THREE.DefaultLoadingManager.onLoad = () => {
  clearInterval(storyInterval);
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading");
    if (loadingScreen) loadingScreen.classList.add("hidden");

    const fiDesc = document.getElementById("fiDesc");

    if (floorInfoEl) floorInfoEl.classList.add("visible");
    if (fiTitle) fiTitle.textContent = "Earth Positive Flagship";
    if (fiDesc) fiDesc.textContent = "Explore our luxury collections";

    gsap.from(camera.position, {
      z: 50,
      y: 24,
      duration: 2.8,
      ease: "power4.out",
      onUpdate: () => controls.update(),
    });
    gsap.from(building.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 2.2,
      ease: "back.out(1.6)",
      delay: 0.3,
    });
  }, 800);
};

// Fallback safety boot loader trigger
setTimeout(() => {
  const loadingScreen = document.getElementById("loading");
  if (loadingScreen && !loadingScreen.classList.contains("hidden")) {
    clearInterval(storyInterval);
    loadingScreen.classList.add("hidden");

    const floorInfoEl = document.getElementById("floor-info");
    if (floorInfoEl) floorInfoEl.classList.add("visible");

    gsap.from(camera.position, {
      z: 50,
      y: 24,
      duration: 2.8,
      ease: "power4.out",
      onUpdate: () => controls.update(),
    });
  }
}, 3500);
