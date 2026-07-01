import { motion } from 'framer-motion'
import useStore from '../stores/useStore'
import { FLOORS, getCardImage } from '../utils/garments'
import showroomBg from '../assets/showroom-bg.png'

/* ─────────────────────────────────────────────────────
   A single floor button on the elevator-style panel.
   Shows the floor level, name, tagline, and a small
   collage of product thumbnails drawn from its sections.
───────────────────────────────────────────────────── */
function FloorButton({ floor, index, onSelect }) {
  const thumbs = floor.sections
    .flatMap((s) => s.categoryIds)
    .map((id) => getCardImage(id))
    .filter(Boolean)
    .slice(0, 3)

  const sectionCount = floor.sections.length
  const itemCount = floor.sections.reduce((n, s) => n + s.categoryIds.length, 0)

  return (
    <motion.button
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35 + index * 0.1, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ x: 6 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(floor.id)}
      className="group relative w-full flex items-center gap-5 px-5 sm:px-7 py-5 rounded-2xl text-left overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}
      id={`floor-btn-${floor.id}`}
    >
      {/* Hover accent wash */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 0% 50%, ${floor.accent}22 0%, transparent 70%)` }}
      />

      {/* Level badge — like an elevator button */}
      <div
        className="relative flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-serif text-2xl text-white transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${floor.accent}55, rgba(0,0,0,0.5))`,
          border: `1px solid ${floor.accent}70`,
          boxShadow: `0 0 20px ${floor.accent}30`,
        }}
      >
        {floor.shortName}
      </div>

      {/* Floor info */}
      <div className="relative flex-1 min-w-0">
        <p className="text-white font-semibold text-base sm:text-lg tracking-wide">{floor.name}</p>
        <p className="text-white/45 text-xs sm:text-sm mt-0.5">{floor.tagline}</p>
        <p className="text-white/30 text-[10px] mt-1.5 uppercase tracking-widest">
          {sectionCount} {sectionCount === 1 ? 'section' : 'sections'} · {itemCount} {itemCount === 1 ? 'collection' : 'collections'}
        </p>
      </div>

      {/* Thumbnail collage */}
      <div className="relative hidden sm:flex items-center -space-x-3">
        {thumbs.map((src, i) => (
          <div
            key={src}
            className="w-11 h-11 rounded-full overflow-hidden border-2 border-black/40 shadow-lg"
            style={{ zIndex: thumbs.length - i }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Arrow */}
      <svg
        className="relative w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0"
        viewBox="0 0 16 16" fill="none"
      >
        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  )
}

export default function FloorDirectory() {
  const selectFloor = useStore((s) => s.selectFloor)
  const setPage = useStore((s) => s.setPage)

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black px-6 py-16">
      {/* Background */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <img src={showroomBg} alt="" className="w-full h-full object-cover object-center" style={{ filter: 'blur(6px) brightness(0.4)' }} draggable={false} />
      </motion.div>
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-9"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl glass-panel border border-white/20 flex items-center justify-center">
              <span className="font-serif text-white text-sm font-light">✦</span>
            </div>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-tight">
            Select a Floor
          </h1>
          <p className="text-white/45 text-sm mt-2">
            Step into the lobby and choose where to browse
          </p>
        </motion.div>

        {/* Floor list — elevator panel */}
        <div className="flex flex-col gap-3">
          {FLOORS.map((floor, i) => (
            <FloorButton key={floor.id} floor={floor} index={i} onSelect={selectFloor} />
          ))}
        </div>

        {/* Back to home */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          onClick={() => setPage('home')}
          className="mt-8 mx-auto flex items-center gap-2 px-4 py-2 text-white/40 hover:text-white/75 text-xs font-medium transition-colors"
          id="directory-back-home-btn"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </motion.button>
      </div>
    </div>
  )
}
