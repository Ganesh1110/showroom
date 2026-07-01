import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Viewer3D from '../components/viewer/Viewer3D'
import LoadingScreen from '../components/viewer/LoadingScreen'
import useStore from '../stores/useStore'
import { getCategory, PRODUCT_INFO } from '../utils/garments'

/*─────────────────────────────────────────────
  Color swatches (video frame 25 — 8 in first row)
─────────────────────────────────────────────*/
const COLOR_PALETTE = [
  { hex: '#3d3527', label: 'Espresso' },
  { hex: '#e8e4dc', label: 'Cream' },
  { hex: '#6878e8', label: 'Cobalt' },
  { hex: '#e03040', label: 'Red' },
  { hex: '#e84aac', label: 'Pink' },
  { hex: '#8b5e3c', label: 'Tan' },
  { hex: '#dfc080', label: 'Sand' },
]

/*─────────────────────────────────────────────
  Material grid (video frame 25 — second section, 3 rows)
─────────────────────────────────────────────*/
const MATERIAL_PALETTE = [
  { hex: '#f5f5f5', label: 'White', texture: 'cotton' },
  { hex: '#e03040', label: 'Red', texture: 'cotton' },
  { hex: '#f4d03f', label: 'Yellow', texture: 'cotton' },
  { hex: '#27ae60', label: 'Green', texture: 'denim' },
  { hex: '#2980b9', label: 'Blue', texture: 'denim' },
  { hex: '#8e44ad', label: 'Purple', texture: 'velvet' },
  { hex: '#e84aac', label: 'Magenta', texture: 'velvet' },
  { hex: '#c8a060', label: 'Bronze', texture: 'leather' },
  { hex: '#8b6040', label: 'Camel', texture: 'leather' },
  { hex: '#4a4a4a', label: 'Charcoal', texture: 'cotton' },
  { hex: '#2c2c2c', label: 'Black', texture: 'velvet' },
  { hex: '#d0d0d0', label: 'Silver', texture: 'cotton' },
]

/*─────────────────────────────────────────────
  Customization panel — video frame 25 / 31
  Shown at bottom-center, not a side drawer
─────────────────────────────────────────────*/
function CustomizationPanel({ onClose }) {
  const { currentColor, currentTexture, setCurrentColor, setCurrentTexture } = useStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 32, scale: 0.96 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40"
      style={{ width: 'min(420px, 90vw)' }}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(14,16,22,0.88)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-8 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <p className="text-white/80 text-sm font-semibold tracking-wide">Customization</p>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/15 transition-colors"
            id="customization-close-btn"
          >
            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-white/70">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Color row — exactly 7 squares in a row (frame 25) */}
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {COLOR_PALETTE.map(sw => (
              <button
                key={sw.hex}
                title={sw.label}
                onClick={() => setCurrentColor(sw.hex)}
                aria-label={sw.label}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: sw.hex,
                  borderRadius: 8,
                  border: currentColor === sw.hex
                    ? '2.5px solid rgba(255,255,255,0.9)'
                    : '2px solid rgba(255,255,255,0.12)',
                  boxShadow: currentColor === sw.hex ? '0 0 0 3px rgba(255,255,255,0.25)' : 'none',
                  transition: 'all 0.15s ease',
                  transform: currentColor === sw.hex ? 'scale(1.1)' : 'scale(1)',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Divider + Material label */}
        <div className="px-5 pb-2">
          <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Material</p>
        </div>

        {/* Material grid — matching video (3 rows of 4) */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {MATERIAL_PALETTE.map(sw => (
              <button
                key={sw.hex}
                title={sw.label}
                onClick={() => {
                  setCurrentColor(sw.hex)
                  setCurrentTexture(sw.texture)
                }}
                aria-label={sw.label}
                style={{
                  width: 38,
                  height: 38,
                  backgroundColor: sw.hex,
                  borderRadius: 8,
                  border: currentTexture === sw.texture && currentColor === sw.hex
                    ? '2.5px solid rgba(255,255,255,0.9)'
                    : '2px solid rgba(255,255,255,0.10)',
                  boxShadow: currentTexture === sw.texture && currentColor === sw.hex
                    ? '0 0 0 3px rgba(255,255,255,0.2)' : 'none',
                  transition: 'all 0.15s ease',
                  transform: currentTexture === sw.texture && currentColor === sw.hex ? 'scale(1.1)' : 'scale(1)',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/*─────────────────────────────────────────────
  Orbit ring (animated ellipse around garment)
─────────────────────────────────────────────*/
function OrbitRing({ color }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: '50%',
        top: '55%',
        transform: 'translate(-50%, -50%)',
        zIndex: 5,
        width: '60vmin',
        height: '12vmin',
        perspective: '800px',
      }}
    >
      {/* Outer ellipse ring */}
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.30)',
          rotateX: '75deg',
        }}
        animate={{ rotateZ: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      {/* Arrows on ring */}
      <div
        className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none"
        style={{ top: '30%' }}
      >
        <div className="text-white/60 text-xl font-light select-none">←</div>
        <div className="text-white/60 text-xl font-light select-none">→</div>
      </div>
      {/* Center dots */}
      <div
        className="absolute flex gap-1"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
      </div>
    </div>
  )
}

/*─────────────────────────────────────────────
  Left sidebar floating pills (video frames 17-25)
─────────────────────────────────────────────*/
function LeftSidebar({ autoRotate, onToggleRotate }) {
  return (
    <>
      {/* Vertical zoom slider line */}
      <motion.div
        className="absolute left-4 top-1/2 z-30 flex flex-col items-center"
        style={{ transform: 'translateY(-50%)', height: 140 }}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        {/* Slider track */}
        <div
          className="w-px flex-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.18)' }}
        />
        {/* Thumb dot */}
        <div
          className="absolute w-3 h-3 rounded-full bg-white/90"
          style={{ top: '25%', left: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
        />
      </motion.div>

      {/* Floating pill buttons — left side */}
      <motion.div
        className="absolute z-30 flex flex-col gap-2"
        style={{ left: 40, top: '50%', transform: 'translateY(-50%)' }}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        {/* Pause/Play toggle — icon pill as in video */}
        <button
          onClick={onToggleRotate}
          id="orbit-toggle-btn"
          className="viewer-pill"
          style={autoRotate ? {} : { background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}
        >
          <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
            {autoRotate ? (
              <><rect x="3" y="2.5" width="2.5" height="9" rx="0.8" fill="currentColor" /><rect x="8.5" y="2.5" width="2.5" height="9" rx="0.8" fill="currentColor" /></>
            ) : (
              <path d="M4 2.5l7 4.5-7 4.5V2.5z" fill="currentColor" />
            )}
          </svg>
        </button>

        {/* Category name pill (eg. "T-Shirt 🔔") — from video frame 17 */}
        <div className="viewer-pill gap-1.5" id="category-name-pill">
          <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 opacity-60">
            <path d="M7 1.5C5 1.5 3.5 2.5 3 4H11C10.5 2.5 9 1.5 7 1.5z" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M3 4v7.5a.5.5 0 00.5.5h7a.5.5 0 00.5-.5V4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          T-Shirt
        </div>
      </motion.div>
    </>
  )
}

/*─────────────────────────────────────────────
  Right floating pills (video: "Reu Orbit" etc.)
─────────────────────────────────────────────*/
function RightPills() {
  const [orbitLabel, setOrbitLabel] = useState('Reu Orbit')

  return (
    <motion.div
      className="absolute z-30 flex flex-col gap-2"
      style={{ right: 20, top: '40%', transform: 'translateY(-50%)' }}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.65 }}
    >
      <button
        onClick={() => setOrbitLabel(l => l === 'Reu Orbit' ? 'Reset' : 'Reu Orbit')}
        className="viewer-pill gap-1.5"
        id="reu-orbit-btn"
      >
        <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
          <path d="M7 2a5 5 0 100 10A5 5 0 007 2z" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <path d="M9.5 7H4.5M7 4.5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        {orbitLabel}
      </button>
    </motion.div>
  )
}

/*─────────────────────────────────────────────
  Bottom bar: ← ↓ slider → (video frames 17-31)
─────────────────────────────────────────────*/
function BottomBar({ selectedCategory, categoryList }) {
  const { prevCategory, nextCategory, toggleCustomization, showCustomization } = useStore()
  const currentIdx = categoryList.indexOf(selectedCategory)

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-5 py-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
    >
      {/* Left: Enter Showroom */}
      <button
        onClick={() => useStore.getState().backToShowroom()}
        className="flex items-center gap-2 viewer-pill"
        id="enter-showroom-btn"
      >
        <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
          <rect x="2" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5 7h4M7 5l2 2-2 2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Enter Showroom
      </button>

      {/* Center: ← ↓ slider indicator → */}
      <div className="flex items-center gap-3">
        <button
          onClick={prevCategory}
          className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          id="viewer-prev-btn"
        >
          <svg viewBox="0 0 12 12" fill="none" className="w-4 h-4">
            <path d="M8 3L5 6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Slider track + down chevron */}
        <button
          onClick={toggleCustomization}
          className="flex items-center gap-2"
          id="customize-toggle-btn"
          aria-label="Open customization"
        >
          <div
            className="flex items-center gap-1"
            style={{ width: 100, position: 'relative' }}
          >
            {/* Track */}
            <div className="w-full h-px bg-white/25 rounded-full" />
            {/* Current position thumb */}
            <div
              className="absolute w-1 h-3 rounded-sm bg-white/70"
              style={{
                left: `${((currentIdx) / Math.max(categoryList.length - 1, 1)) * 100}%`,
                transform: 'translateX(-50%)',
              }}
            />
          </div>
          {/* Chevron down (opens customization) */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5 text-white/75">
              <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>

        <button
          onClick={nextCategory}
          className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          id="viewer-next-btn"
        >
          <svg viewBox="0 0 12 12" fill="none" className="w-4 h-4">
            <path d="M4 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Right: Grid/customize button */}
      <button
        onClick={toggleCustomization}
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: showCustomization ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
        id="grid-customize-btn"
      >
        <svg viewBox="0 0 14 14" fill="none" className="w-4 h-4 text-white/80">
          <rect x="2" y="2" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
          <rect x="8" y="2" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
          <rect x="2" y="8" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
          <rect x="8" y="8" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>
    </motion.div>
  )
}

/*─────────────────────────────────────────────
  Floating badges near the garment (video frames 17-21)
  These are small labels that float around the garment
─────────────────────────────────────────────*/
function FloatingBadges({ categoryId }) {
  const info = PRODUCT_INFO[categoryId]
  if (!info) return null

  return (
    <>
      {/* Bottom left cursive brand */}
      <motion.div
        className="absolute pointer-events-none z-20"
        style={{ bottom: '16%', left: '8%' }}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9 }}
      >
        <p className="font-caveat text-white/20 text-2xl font-bold leading-tight">Clothing</p>
        <p className="font-caveat text-white/20 text-2xl font-bold leading-tight -mt-1">Mockups</p>
        <p className="font-caveat text-white/12 text-xs">™ 3D</p>
      </motion.div>

      {/* Bottom right price */}
      <motion.div
        className="absolute pointer-events-none z-20 text-right"
        style={{ bottom: '16%', right: '6%' }}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.0 }}
      >
        <p className="text-white/20 text-xs uppercase tracking-wider">Starting at</p>
        <p className="text-white/30 text-3xl font-bold">{info.price}</p>
      </motion.div>

      {/* Small floating annotation pills (like video bottom "Accessories" pill) */}
      <motion.div
        className="absolute z-20"
        style={{ bottom: '32%', left: '50%', transform: 'translateX(-50%)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: [0, -4, 0] }}
        transition={{ delay: 1.1, y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold"
          style={{
            background: 'rgba(8,10,18,0.75)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 opacity-60">
            <path d="M6 1a5 5 0 100 10A5 5 0 006 1z" stroke="currentColor" strokeWidth="1.1" fill="none" />
          </svg>
          {info.name.split(' ').slice(0, 2).join(' ')}
        </div>
      </motion.div>
    </>
  )
}

/*─────────────────────────────────────────────
  Main ViewerPage
─────────────────────────────────────────────*/
export default function ViewerPage() {
  const {
    selectedCategory,
    autoRotate,
    setAutoRotate,
    showCustomization,
    toggleCustomization,
    categoryList,
    currentColor,
  } = useStore()

  const category = getCategory(selectedCategory)
  const info = PRODUCT_INFO[selectedCategory]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 studio-bg overflow-hidden"
    >
      <LoadingScreen />

      {/* Studio vignette */}
      <div className="absolute inset-0 studio-vignette pointer-events-none z-5" />

      {/* ── 3D Canvas ── */}
      <div className="absolute inset-0 z-0">
        <Viewer3D />
      </div>

      {/* Orbit ring decoration */}
      <OrbitRing color={currentColor} />

      {/* Floating badges near garment */}
      <FloatingBadges categoryId={selectedCategory} />

      {/* ══════════════════
          TOP BAR: ≡ Customization | Addt Shore | ⊞
      ══════════════════ */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3.5"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        {/* Left: hamburger + Customization label */}
        <div className="flex items-center gap-3">
          <button
            className="viewer-pill !px-2.5 !py-2"
            id="viewer-hamburger-btn"
            onClick={() => useStore.getState().backToShowroom()}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M3 5h10M3 8h10M3 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-white/75 text-sm font-semibold tracking-wide">Customization</span>
        </div>

        {/* Right: "Addt Shore" + grid */}
        <div className="flex items-center gap-2">
          <button
            className="viewer-pill gap-1.5"
            id="addt-shore-btn"
          >
            <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
              <circle cx="5" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10 7a2 2 0 100 4 2 2 0 000-4z" stroke="currentColor" strokeWidth="1.2" />
              <path d="M7.5 5.5L9 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Addt Shore
          </button>

          <button
            className="viewer-pill !px-2.5 !py-2"
            id="viewer-grid-btn"
            onClick={toggleCustomization}
          >
            <svg viewBox="0 0 14 14" fill="none" className="w-4 h-4">
              <rect x="2" y="2" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
              <rect x="8" y="2" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
              <rect x="2" y="8" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
              <rect x="8" y="8" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* ══════════════════
          GARMENT NAME — top center
      ══════════════════ */}
      <motion.div
        className="absolute top-16 left-0 right-0 flex flex-col items-center pointer-events-none z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-white/25 text-[9px] font-semibold tracking-[0.4em] uppercase">3D MODEL</p>
        <h1 className="text-white/55 text-3xl sm:text-4xl font-light tracking-wide font-serif mt-0.5">
          {info?.name || category?.name}
        </h1>
      </motion.div>

      {/* ══════════════════
          LEFT: Sidebar (zoom slider + pills)
      ══════════════════ */}
      <LeftSidebar autoRotate={autoRotate} onToggleRotate={() => setAutoRotate(!autoRotate)} />

      {/* ══════════════════
          RIGHT: Arrow + pill
      ══════════════════ */}
      <RightPills />

      {/* Outer left/right large arrows */}
      <motion.button
        className="absolute left-3 top-1/2 z-30 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center viewer-pill !px-0"
        onClick={() => useStore.getState().prevCategory()}
        id="viewer-left-arrow"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <svg viewBox="0 0 14 14" fill="none" className="w-4 h-4">
          <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>

      <motion.button
        className="absolute right-3 top-1/2 z-30 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center viewer-pill !px-0"
        onClick={() => useStore.getState().nextCategory()}
        id="viewer-right-arrow"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <svg viewBox="0 0 14 14" fill="none" className="w-4 h-4">
          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>

      {/* Bottom-right sparkle */}
      <div
        className="absolute bottom-20 right-6 z-20 pointer-events-none"
        style={{ animation: 'sparkle-twinkle 3s ease-in-out infinite' }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z"
            fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>

      {/* ══════════════════
          BOTTOM BAR
      ══════════════════ */}
      <BottomBar selectedCategory={selectedCategory} categoryList={categoryList} />

      {/* ══════════════════
          CUSTOMIZATION PANEL
      ══════════════════ */}
      <AnimatePresence>
        {showCustomization && (
          <CustomizationPanel onClose={toggleCustomization} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
