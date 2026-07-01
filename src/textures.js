import * as THREE from 'three';

// Generates procedural white marble texture with elegant wispy grey veins
export function createMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Background base color (soft cream/off-white)
  ctx.fillStyle = '#f5f3ee';
  ctx.fillRect(0, 0, 512, 512);

  // Trace fine organic veins
  ctx.strokeStyle = 'rgba(120, 115, 110, 0.28)';
  ctx.lineWidth = 1.2;

  // Let's draw some random wispy paths
  for (let v = 0; v < 8; v++) {
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = 0;
    ctx.moveTo(x, y);

    while (y < 512) {
      x += (Math.sin(y * 0.05 + v) * 4) + (Math.random() - 0.5) * 8;
      y += 4;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Add micro-noise details for tactile finish
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 3;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
    data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.5, 1.5);
  return tex;
}

// Generates concrete texture map with organic cloud noise and fine micro-grains
export function createConcreteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Neutral concrete grey
  ctx.fillStyle = '#d2cecb';
  ctx.fillRect(0, 0, 512, 512);

  // Overlay structural variations
  for (let i = 0; i < 20; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    const radius = 40 + Math.random() * 120;
    const grad = ctx.createRadialGradient(rx, ry, 5, rx, ry, radius);
    grad.addColorStop(0, 'rgba(100, 96, 92, 0.09)');
    grad.addColorStop(1, 'rgba(100, 96, 92, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(rx, ry, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pixel grains
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 14;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i+1] = Math.max(0, Math.min(255, data[i+1] + grain));
    data[i+2] = Math.max(0, Math.min(255, data[i+2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

// Generates a fine fabric cross-weave bump texture
export function createFabricTexture(colorHex = '#aecbe6') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 128, 128);

  // Draw weave lines
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 128; i += 4) {
    // Horizontal
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(128, i);
    ctx.stroke();

    // Vertical
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 128);
    ctx.stroke();
  }

  // Alternate dark threads
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  for (let i = 2; i < 128; i += 4) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(128, i);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 128);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  return tex;
}
