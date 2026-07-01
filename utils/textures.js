import * as THREE from 'three'

const textureCache = new Map()

function createCanvasTexture(width, height, drawFn) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  drawFn(ctx, width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  return texture
}

export function getTexture(type, color = '#ffffff') {
  const cacheKey = `${type}-${color}`
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)
  }

  let texture

  switch (type) {
    case 'cotton':
      texture = createCottonTexture(color)
      break
    case 'denim':
      texture = createDenimTexture(color)
      break
    case 'leather':
      texture = createLeatherTexture(color)
      break
    case 'linen':
      texture = createLinenTexture(color)
      break
    case 'pattern':
      texture = createPatternTexture(color)
      break
    case 'floral':
      texture = createFloralTexture(color)
      break
    case 'stripes':
      texture = createStripeTexture(color)
      break
    case 'checks':
      texture = createCheckTexture(color)
      break
    default:
      texture = createCottonTexture(color)
  }

  texture.needsUpdate = true
  textureCache.set(cacheKey, texture)
  return texture
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

function createCottonTexture(colorHex) {
  const [r, g, b] = hexToRgb(colorHex)
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = colorHex
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const variation = (Math.random() - 0.5) * 0.08
      ctx.fillStyle = `rgba(${(r + variation) * 255},${(g + variation) * 255},${(b + variation) * 255},0.3)`
      ctx.fillRect(x, y, 1, 1)
    }
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.05})`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + (Math.random() - 0.5) * 4, y + (Math.random() - 0.5) * 4)
      ctx.stroke()
    }
  })
}

function createDenimTexture(colorHex = '#1e3a5f') {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = colorHex
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const brightness = Math.random() * 40 + 30
      ctx.fillStyle = `rgba(${brightness},${brightness * 0.8},${brightness * 1.2},0.15)`
      ctx.fillRect(x, y, 2, 1)
    }
    for (let i = 0; i < 30; i++) {
      const x = i * 8.5 + Math.random() * 2
      ctx.strokeStyle = `rgba(255,255,255,0.03)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x + 3, h)
      ctx.stroke()
    }
  })
}

function createLeatherTexture(colorHex = '#2d2d2d') {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = colorHex
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const v = (Math.random() - 0.5) * 0.1
      const val = Math.floor((0.5 + v) * 255)
      ctx.fillStyle = `rgba(${val},${val * 0.9},${val * 0.85},0.5)`
      ctx.beginPath()
      ctx.ellipse(x, y, Math.random() * 3 + 1, Math.random() * 2 + 0.5, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
  })
}

function createLinenTexture(colorHex = '#d4c5a9') {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = colorHex
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 100; i++) {
      const y = i * 2.5 + Math.random() * 1
      ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.04 + 0.02})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, y)
      for (let x = 0; x < w; x += 5) {
        ctx.lineTo(x, y + (Math.random() - 0.5) * 1.5)
      }
      ctx.stroke()
    }
    for (let i = 0; i < 100; i++) {
      const x = i * 2.5 + Math.random() * 1
      ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.04 + 0.02})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, 0)
      for (let y = 0; y < h; y += 5) {
        ctx.lineTo(x + (Math.random() - 0.5) * 1.5, y)
      }
      ctx.stroke()
    }
  })
}

function createPatternTexture(colorHex) {
  const [r, g, b] = hexToRgb(colorHex)
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    const lightBg = `rgb(${(r * 0.3 + 0.7) * 255},${(g * 0.3 + 0.7) * 255},${(b * 0.3 + 0.7) * 255})`
    ctx.fillStyle = lightBg
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = colorHex
    for (let x = 0; x < w; x += 32) {
      for (let y = 0; y < h; y += 32) {
        ctx.beginPath()
        ctx.arc(x + 16, y + 16, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x + 16, y + 16, 8, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r * 255},${g * 255},${b * 255},0.3)`
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }
  })
}

function createFloralTexture(colorHex) {
  const [r, g, b] = hexToRgb(colorHex)
  return createCanvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = `rgb(${Math.min(255, (r * 0.5 + 0.5) * 255)},${Math.min(255, (g * 0.5 + 0.5) * 255)},${Math.min(255, (b * 0.5 + 0.5) * 255)})`
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 60; i++) {
      const cx = Math.random() * w
      const cy = Math.random() * h
      const size = Math.random() * 15 + 8
      const color = `hsl(${Math.random() * 360}, 70%, 60%)`
      ctx.fillStyle = color
      for (let p = 0; p < 5; p++) {
        const angle = (p / 5) * Math.PI * 2 - Math.PI / 2
        const px = cx + Math.cos(angle) * size
        const py = cy + Math.sin(angle) * size
        ctx.beginPath()
        ctx.ellipse(px, py, size * 0.4, size * 0.2, angle, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = `hsl(${Math.random() * 60 + 30}, 80%, 50%)`
      ctx.beginPath()
      ctx.arc(cx, cy, size * 0.25, 0, Math.PI * 2)
      ctx.fill()
    }
  })
}

function createStripeTexture(colorHex) {
  const [r, g, b] = hexToRgb(colorHex)
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = `rgb(${Math.min(255, (r * 0.7 + 0.3) * 255)},${Math.min(255, (g * 0.7 + 0.3) * 255)},${Math.min(255, (b * 0.7 + 0.3) * 255)})`
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 20; i++) {
      const y = i * 13
      ctx.fillStyle = i % 2 === 0 ? `rgba(255,255,255,0.1)` : `rgba(0,0,0,0.1)`
      ctx.fillRect(0, y, w, 6)
    }
  })
}

function createCheckTexture(colorHex) {
  const [r, g, b] = hexToRgb(colorHex)
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    const lightBg = `rgb(${(r * 0.3 + 0.7) * 255},${(g * 0.3 + 0.7) * 255},${(b * 0.3 + 0.7) * 255})`
    ctx.fillStyle = lightBg
    ctx.fillRect(0, 0, w, h)
    const size = 24
    for (let x = 0; x < w; x += size) {
      for (let y = 0; y < h; y += size) {
        if ((Math.floor(x / size) + Math.floor(y / size)) % 2 === 0) {
          ctx.fillStyle = `rgba(${r * 255},${g * 255},${b * 255},0.4)`
          ctx.fillRect(x, y, size, size)
        }
      }
    }
    for (let x = 0; x < w; x += size) {
      ctx.strokeStyle = `rgba(0,0,0,0.1)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let y = 0; y < h; y += size) {
      ctx.strokeStyle = `rgba(0,0,0,0.1)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
  })
}

export function createNormalMap(type) {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#8080ff'
    ctx.fillRect(0, 0, w, h)

    if (type === 'denim') {
      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        const r = Math.floor(Math.random() * 60 + 98)
        const g = Math.floor(Math.random() * 60 + 98)
        ctx.fillStyle = `rgb(${r},${g},255)`
        ctx.fillRect(x, y, 2, 1)
      }
    } else if (type === 'leather') {
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        const v = Math.floor(Math.random() * 80 + 80)
        ctx.fillStyle = `rgb(${v},${v},255)`
        ctx.beginPath()
        ctx.ellipse(x, y, Math.random() * 3 + 1, Math.random() * 2 + 0.5, Math.random() * Math.PI, 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (type === 'linen') {
      for (let i = 0; i < 50; i++) {
        const y = i * 5
        ctx.fillStyle = `rgb(100,100,255)`
        ctx.fillRect(0, y, w, 1)
      }
      for (let i = 0; i < 50; i++) {
        const x = i * 5
        ctx.fillStyle = `rgb(100,100,255)`
        ctx.fillRect(x, 0, 1, h)
      }
    } else {
      for (let i = 0; i < 3000; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        const v = Math.floor(Math.random() * 40 + 118)
        ctx.fillStyle = `rgb(${v},${v},255)`
        ctx.fillRect(x, y, 1, 1)
      }
    }
  })
}
