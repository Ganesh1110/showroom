import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCT_INFO } from '../../utils/garments'
import showroomBg from '../../assets/showroom-bg.png'

/**
 * Hotspot positions on the showroom background image.
 * Positions are in percentage (left / top) relative to the image container.
 */
const HOTSPOTS = [
  {
    id: 'tshirt',
    label: 'T-Shirts',
    left: '37%',
    top: '46%',
    color: '#ec4899',
    icon: '👕',
  },
  {
    id: 'shirt',
    label: 'Shirts',
    left: '74%',
    top: '60%',
    color: '#f97316',
    icon: '👔',
  },
  {
    id: 'hoodie',
    label: 'Hoodies',
    left: '88%',
    top: '38%',
    color: '#8b5cf6',
    icon: '🧥',
  },
  {
    id: 'pants',
    label: 'Pants',
    left: '47%',
    top: '58%',
    color: '#3b82f6',
    icon: '👖',
  },
  {
    id: 'cap',
    label: 'Accessories',
    left: '63%',
    top: '57%',
    color: '#10b981',
    icon: '🧢',
  },
  {
    id: 'shirt',
    label: 'Jackets',
    left: '16%',
    top: '44%',
    color: '#f59e0b',
    icon: '🥼',
  },
]

function Hotspot({ spot, onSelect, index }) {
  const [hovered, setHovered] = useState(false)
  const info = PRODUCT_INFO[spot.id]

  return (
    <motion.div
      className="absolute"
      style={{ left: spot.left, top: spot.top, transform: 'translate(-50%, -50%)' }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 + index * 0.12, type: 'spring', stiffness: 260, damping: 20 }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 pointer-events-none z-50"
          >
            <div className="glass-panel rounded-xl px-3 py-2 text-center shadow-2xl min-w-[120px]">
              <p className="text-white font-semibold text-xs leading-tight">{spot.label}</p>
              {info && (
                <p className="text-white/60 text-[10px] mt-0.5">{info.price}</p>
              )}
              <p className="text-white/40 text-[9px] mt-0.5 tracking-wide">Tap to explore 3D</p>
            </div>
            {/* Tooltip arrow */}
            <div className="flex justify-center mt-0.5">
              <div className="w-2 h-2 rotate-45" style={{ background: 'rgba(255,255,255,0.08)', marginTop: '-5px' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse rings */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <span
          className="hotspot-ping absolute inset-0 rounded-full"
          style={{ backgroundColor: spot.color + '55' }}
        />
        <span
          className="hotspot-ping-slow absolute inset-0 rounded-full"
          style={{ backgroundColor: spot.color + '33' }}
        />

        {/* Clickable core dot */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(spot.id)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-shadow"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${spot.color}ee, ${spot.color}99)`,
            boxShadow: `0 0 0 2px rgba(255,255,255,0.5), 0 4px 20px ${spot.color}88`,
          }}
          aria-label={`Explore ${spot.label}`}
          id={`hotspot-${spot.id}-${Math.round(parseFloat(spot.left))}`}
        >
          <div className="w-2 h-2 rounded-full bg-white/90" />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function Showroom({ onSelectCategory }) {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">

      {/* ── Store background image ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <img
          src={showroomBg}
          alt="Virtual Fashion Showroom"
          className="w-full h-full object-cover object-center"
          draggable={false}
        />
      </motion.div>

      {/* ── Cinematic gradient overlay ── */}
      <div className="absolute inset-0 venue-overlay pointer-events-none" />

      {/* ── Top header bar ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <span className="text-sm">✦</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-wide">VIRTUAL SHOWROOM</p>
            <p className="text-white/50 text-[10px] tracking-widest uppercase">Click a hotspot to explore</p>
          </div>
        </div>

        {/* Category badges */}
        <div className="hidden sm:flex items-center gap-2">
          {['T-Shirts', 'Shirts', 'Hoodies', 'Pants', 'Accessories'].map((cat) => (
            <span
              key={cat}
              className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/70 font-medium"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Live badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/70 text-[10px] font-medium tracking-wide">LIVE</span>
        </div>
      </motion.div>

      {/* ── Product Hotspots ── */}
      {HOTSPOTS.map((spot, i) => (
        <Hotspot
          key={`${spot.id}-${i}`}
          spot={spot}
          index={i}
          onSelect={onSelectCategory}
        />
      ))}

      {/* ── Bottom navigation bar ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 px-6 py-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Instruction */}
          <div className="flex items-center gap-3">
            {/* Navigation icon (like the Wrangler image bottom center) */}
            <div
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center"
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-white/80">
                <path d="M10 16V4M4 10l6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-white/60 text-xs font-medium">
              <span className="text-white/90">5 collections</span> available — tap a{' '}
              <span className="text-white/90">● hotspot</span> to view in 3D
            </p>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-6 text-white/40 text-xs">
            <span>360° Rotate</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Color Customize</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>3D Studio View</span>
          </div>
        </div>
      </motion.div>

    </div>
  )
}
