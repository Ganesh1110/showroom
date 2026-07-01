import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import showroomBg from '../../assets/showroom-bg.png'
import useStore from '../../stores/useStore'

/*──────────────────────────────────────────────────────
  Category definitions — matching video card layout
──────────────────────────────────────────────────────*/
const CATEGORIES = [
  {
    id: 'tshirt',
    label: 'T-Shirts',
    img: '/tshirt_card.jpg',    // product card thumbnail
    render: '/tshirt_render.jpg',
    // position % on screen
    style: { left: '22%', top: '24%' },
    size: { w: 90, h: 112 },
    dotColor: '#9ca3af',
  },
  {
    id: 'shirt',
    label: 'Shirts',
    img: '/shirt_card.jpg',
    render: '/shirt_render.jpg',
    style: { left: '36%', top: '40%' },
    size: { w: 90, h: 112 },
    dotColor: '#9ca3af',
  },
  {
    id: 'hoodie',
    label: 'Hoodie',
    img: '/hoodie_card.jpg',
    render: '/hoodie_render.jpg',
    // Center featured — this is the large pedestal hologram
    style: { left: '50%', top: '28%' },
    size: { w: 105, h: 130 },
    dotColor: '#10b981',
    featured: true,
  },
  {
    id: 'pants',
    label: 'Pants',
    img: '/pants_card.jpg',
    render: '/pants_render.jpg',
    style: { left: '63%', top: '42%' },
    size: { w: 82, h: 102 },
    dotColor: '#9ca3af',
  },
  {
    id: 'hoodies2',  // second hoodie card (as in video — labelled "Hoodies")
    label: 'Hoodies',
    img: '/hoodie_card.jpg',
    render: '/hoodie_render.jpg',
    style: { left: '74%', top: '28%' },
    size: { w: 82, h: 102 },
    dotColor: '#9ca3af',
    categoryId: 'hoodie',
  },
  {
    id: 'cap',
    label: 'Accessories',
    img: '/cap_card.jpg',
    render: '/cap_render.jpg',
    style: { left: '86%', top: '38%' },
    size: { w: 90, h: 112 },
    dotColor: '#9ca3af',
  },
]

/*──────────────────────────────────────────────────────
  Glassmorphic card — matches video exactly
──────────────────────────────────────────────────────*/
function CategoryCard({ cat, onSelect, isHovered, onHover, onLeave }) {
  const catId = cat.categoryId || cat.id

  return (
    <motion.div
      className="absolute"
      style={{
        ...cat.style,
        transform: 'translate(-50%, -50%)',
        zIndex: isHovered ? 25 : 15,
      }}
      initial={{ opacity: 0, y: 20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Float animation */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity, delay: Math.random() * 1.5 }}
      >
        {/* Hover label (green dot + "Hoodie" — exactly as in video) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-30"
            >
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(8,10,16,0.82)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.featured ? '#10b981' : '#9ca3af' }}
                />
                <span className="text-white text-[11px] font-semibold">{cat.label}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card body — glassmorphic white frosted panel, exactly like video */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          onClick={() => onSelect(catId)}
          id={`showroom-card-${cat.id}`}
          aria-label={`View ${cat.label} in 3D`}
          style={{
            width: cat.size.w,
            height: cat.size.h,
            borderRadius: 14,
            background: isHovered
              ? 'rgba(255,255,255,0.26)'
              : 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: isHovered
              ? '1px solid rgba(255,255,255,0.5)'
              : '1px solid rgba(255,255,255,0.3)',
            boxShadow: isHovered
              ? '0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset'
              : '0 6px 20px rgba(0,0,0,0.25)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.25s ease',
          }}
        >
          {/* Garment image */}
          <img
            src={cat.img}
            alt={cat.label}
            style={{
              width: '100%',
              flex: 1,
              objectFit: 'contain',
              objectPosition: 'center',
              padding: '6px 6px 0',
              filter: 'contrast(0.92) brightness(0.98)',
            }}
          />

          {/* Label bar at bottom */}
          <div
            className="flex items-center justify-center py-1.5 shrink-0"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            <span className="text-white/90 text-[10px] font-semibold tracking-wide">
              {cat.label}
            </span>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

/*──────────────────────────────────────────────────────
  Central holographic garment on the pedestal
──────────────────────────────────────────────────────*/
function PedestalGarment({ hoveredCatId }) {
  const cat = CATEGORIES.find(c => (c.categoryId || c.id) === hoveredCatId && !c.id.includes('2')) || CATEGORIES[2]

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: '50%',
        top: '36%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        width: 180,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={hoveredCatId || 'default'}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          {/* Holographic garment image — bright white ghost effect */}
          <div
            style={{
              width: 160,
              height: 200,
              position: 'relative',
            }}
          >
            <motion.img
              src={cat.render}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'brightness(1.6) saturate(0) contrast(1.3)',
                opacity: 0.88,
                mixBlendMode: 'screen',
              }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
            />
            {/* Glow halo */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at 50% 60%, rgba(255,255,255,0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/*──────────────────────────────────────────────────────
  Top "..." dots menu (seen in video)
──────────────────────────────────────────────────────*/
function DotsMenu() {
  return (
    <div
      className="absolute z-20"
      style={{ top: '13%', left: '50%', transform: 'translateX(-50%)' }}
    >
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1 h-1 rounded-full bg-white/40" />
        ))}
      </div>
    </div>
  )
}

/*──────────────────────────────────────────────────────
  Main Showroom
──────────────────────────────────────────────────────*/
export default function Showroom({ onSelectCategory }) {
  const [hoveredId, setHoveredId] = useState(null)
  const { setHoveredCategory } = useStore()

  const handleHover = (id) => {
    setHoveredId(id)
    setHoveredCategory(id)
  }
  const handleLeave = () => {
    setHoveredId(null)
    setHoveredCategory(null)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* ── Background: luxury showroom interior (exactly as video) ── */}
      <motion.img
        src={showroomBg}
        alt="Virtual Fashion Showroom"
        className="absolute inset-0 w-full h-full object-cover object-center"
        draggable={false}
        initial={{ scale: 1.04, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      {/* Subtle dark vignette overlay */}
      <div className="absolute inset-0 venue-overlay pointer-events-none" />

      {/* ── Top bar ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center gap-2.5">
          <span className="font-serif text-white text-xl font-light">3D</span>
          <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Showroom</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/60 text-[10px] font-medium tracking-wide">LIVE</span>
        </div>
      </motion.div>

      {/* ── Three dots menu (from video) ── */}
      <DotsMenu />

      {/* ── Central pedestal garment ── */}
      <PedestalGarment hoveredCatId={hoveredId} />

      {/* ── Category cards floating over bg ── */}
      {CATEGORIES.map(cat => (
        <CategoryCard
          key={cat.id}
          cat={cat}
          isHovered={hoveredId === (cat.categoryId || cat.id) && cat.id === 'hoodie'
            || hoveredId === cat.id}
          onHover={() => handleHover(cat.categoryId || cat.id)}
          onLeave={handleLeave}
          onSelect={onSelectCategory}
        />
      ))}

      {/* ── Bottom instruction ── */}
      <motion.div
        className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <p className="text-white/40 text-xs font-medium tracking-wide">
          Hover to preview · Tap a card to view in 3D
        </p>
      </motion.div>

      {/* Bottom-right 4-point star */}
      <div
        className="absolute bottom-8 right-8 pointer-events-none z-20"
        style={{ animation: 'sparkle-twinkle 3s ease-in-out infinite' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z"
            fill="rgba(255,255,255,0.45)" />
        </svg>
      </div>
    </div>
  )
}
