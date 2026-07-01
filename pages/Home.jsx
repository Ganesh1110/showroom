import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/ui/Navbar'
import useStore from '../stores/useStore'

/* ── Gold Bokeh Particles ───────────────────────────── */
function GoldParticles() {
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

    // Gold-tinted bokeh particles
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 4 + 1.5,
      opacity: Math.random() * 0.25 + 0.06,
      gold: Math.random() > 0.45,  // some particles are gold-tinted
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

        // Glowing bokeh dot
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5)
        if (p.gold) {
          gradient.addColorStop(0, `rgba(220, 190, 100, ${p.opacity * 2.5})`)
          gradient.addColorStop(0.5, `rgba(180, 140, 60, ${p.opacity})`)
          gradient.addColorStop(1, `rgba(140, 100, 30, 0)`)
        } else {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity * 2})`)
          gradient.addColorStop(0.5, `rgba(200, 200, 200, ${p.opacity})`)
          gradient.addColorStop(1, `rgba(150, 150, 150, 0)`)
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
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

/* ── 4-pointed Sparkle SVG ──────────────────────────── */
function Sparkle({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z"
        fill="rgba(220,190,100,0.85)"
      />
    </svg>
  )
}

/* ── Oval Swoop SVG around headline ─────────────────── */
function SwoopOval() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      viewBox="0 0 600 200"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >
      <ellipse
        cx="300"
        cy="100"
        rx="285"
        ry="95"
        stroke="rgba(210,180,90,0.5)"
        strokeWidth="1.5"
        fill="none"
        className="swoop-path"
      />
    </svg>
  )
}

/* ── Slide dots (6 dots carousel indicator) ─────────── */
function SlideDots({ total = 6, active = 0 }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`nav-dot ${i === active ? 'active' : ''}`}
        />
      ))}
    </div>
  )
}

/* ── Category preview strip at bottom ───────────────── */
const PREVIEW_CATS = [
  { id: 'tshirt', label: 'T-Shirts', emoji: '👕', color: '#ec4899' },
  { id: 'hoodie', label: 'Hoodies', emoji: '🧥', color: '#8b5cf6' },
  { id: 'shirt', label: 'Shirts', emoji: '👔', color: '#f97316' },
  { id: 'pants', label: 'Pants', emoji: '👖', color: '#3b82f6' },
]

function CategoryPreviewStrip({ onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.7 }}
      className="absolute bottom-0 left-0 right-0 flex"
    >
      {PREVIEW_CATS.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className="flex-1 py-5 px-4 flex flex-col items-center gap-1 border-t border-white/8 hover:bg-white/5 transition-colors duration-200 group"
          id={`home-preview-${cat.id}`}
        >
          <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{cat.emoji}</span>
          <span className="text-white/40 text-[10px] font-medium tracking-widest uppercase group-hover:text-white/70 transition-colors">
            {cat.label}
          </span>
        </button>
      ))}
    </motion.div>
  )
}

/* ── Main Home Page ─────────────────────────────────── */
export default function Home() {
  const { enterShowroom, selectCategory } = useStore()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-showroom-dark">
      {/* Gold bokeh background */}
      <GoldParticles />

      {/* Subtle directional gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/8 via-transparent to-amber-900/8 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

      {/* Navbar */}
      <Navbar />

      {/* ── Hero block ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 text-center px-6 max-w-4xl w-full"
      >
        {/* Oval swoop headline container */}
        <div className="relative inline-block mb-8 px-10 py-6">
          <SwoopOval />

          {/* Sparkle stars at oval corners */}
          <div className="absolute -top-2 -left-2 sparkle">
            <Sparkle size={22} />
          </div>
          <div className="absolute -top-1 -right-3 sparkle-delayed">
            <Sparkle size={18} />
          </div>
          <div className="absolute -bottom-1 -left-4 sparkle-delayed">
            <Sparkle size={14} />
          </div>
          <div className="absolute bottom-0 right-0 sparkle">
            <Sparkle size={16} />
          </div>

          {/* Headline text */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-tight tracking-tight"
          >
            3D Fashion
            <br />
            Showroom
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="text-white/45 text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed"
        >
          Explore our virtual collection in immersive 3D.
          Rotate, customize, and experience fashion like never before.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7 }}
        >
          <button
            onClick={enterShowroom}
            id="enter-showroom-btn"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-semibold text-black overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #e8d08a 0%, #c9a84c 50%, #b8932e 100%)',
            }}
          >
            <span>Enter Showroom</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>

        {/* Slide indicator dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-10 flex justify-center"
        >
          <SlideDots total={6} active={5} />
        </motion.div>
      </motion.div>

      {/* Bottom 4-pointed star decoration */}
      <div className="absolute bottom-24 right-8 sparkle opacity-60">
        <Sparkle size={28} />
      </div>

      {/* Category preview at very bottom */}
      <CategoryPreviewStrip onSelect={selectCategory} />
    </div>
  )
}
