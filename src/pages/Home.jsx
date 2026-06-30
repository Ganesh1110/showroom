import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import useStore from '../stores/useStore'

function Particles() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.fill()
      })

      particles.forEach((a) => {
        particles.forEach((b) => {
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - dist / 120)})`
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  )
}

export default function Home() {
  const { enterShowroom } = useStore()

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-showroom-dark">
      <Particles />

      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-pink-500/5" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center px-4 max-w-3xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/50 mb-6 tracking-wider uppercase">
            Virtual Experience
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
        >
          <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
            3D Fashion
          </span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Showroom
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-base sm:text-lg text-white/40 mb-10 max-w-lg mx-auto leading-relaxed"
        >
          Explore our virtual collection in immersive 3D. Rotate, customize, and experience fashion like never before.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Button variant="accent" size="lg" onClick={enterShowroom}>
            Enter Showroom
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 flex items-center justify-center gap-8 text-white/20 text-[10px] uppercase tracking-widest"
        >
          <span>Three.js</span>
          <span className="w-px h-3 bg-white/10" />
          <span>React</span>
          <span className="w-px h-3 bg-white/10" />
          <span>WebGL</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
