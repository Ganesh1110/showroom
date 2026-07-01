import * as THREE from 'three';

// Display Screens Shader
export const screenShaderMat = new THREE.ShaderMaterial({
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

// Ceiling Sky Dome (Skylight) Shader
export const skyMat = new THREE.ShaderMaterial({
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

// Floating Dust Particles Shader
export const lobbyParticleMat = new THREE.ShaderMaterial({
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
