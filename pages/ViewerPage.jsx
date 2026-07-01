import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Viewer3D from '../components/viewer/Viewer3D'
import LoadingScreen from '../components/viewer/LoadingScreen'
import useStore from '../stores/useStore'
import { getCategory, getSectionCategories, getFloor, getSection, getCardImage, PRODUCT_INFO } from '../utils/garments'

/* ── Color palette for swatches ──────────────────────── */
const COLOR_SWATCHES = [
  { color: '#c8c8c8', label: 'White' },
  { color: '#d4b483', label: 'Sand' },
  { color: '#8a6545', label: 'Brown' },
  { color: '#3a7bd5', label: 'Blue' },
  { color: '#e84393', label: 'Pink' },
  { color: '#2d2d2d', label: 'Black' },
  { color: '#6b4f9e', label: 'Purple' },
  { color: '#2ea86c', label: 'Green' },
]

const MATERIAL_SWATCHES = [
  { color: '#f5f5f5', label: 'Cotton', texture: 'cotton' },
  { color: '#e63946', label: 'Red', texture: 'cotton' },
  { color: '#f4d03f', label: 'Yellow', texture: 'cotton' },
  { color: '#27ae60', label: 'Green', texture: 'denim' },
  { color: '#2980b9', label: 'Blue', texture: 'denim' },
  { color: '#8e44ad', label: 'Purple', texture: 'velvet' },
  { color: '#1a1a2e', label: 'Dark', texture: 'leather' },
  { color: '#7f8c8d', label: 'Grey', texture: 'cotton' },
  { color: '#9b7653', label: 'Leather', texture: 'leather' },
  { color: '#4a4a4a', label: 'Charcoal', texture: 'cotton' },
  { color: '#2c2c2c', label: 'Black', texture: 'velvet' },
]

/* ── Customization Panel (drawer from bottom) ──────── */
function CustomizationPanel({ onClose }) {
  const { currentColor, currentTexture, setCurrentColor, setCurrentTexture, resetCustomization, selectedCategory } = useStore()
  const category = getCategory(selectedCategory)

  const availableColors = category?.availableColors || COLOR_SWATCHES.map(s => s.color)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.97 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40"
      style={{ width: 'min(380px, 90vw)' }}
    >
      <div
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'rgba(18, 20, 28, 0.88)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/8">
          <div className="w-8 h-1 rounded-full bg-white/20 mx-auto" style={{ position: 'absolute', left: '50%', top: 10, transform: 'translateX(-50%)' }} />
          <p className="text-white/80 text-xs font-semibold uppercase tracking-widest">Customization</p>
          <div className="flex items-center gap-3">
            <button
              onClick={resetCustomization}
              className="text-[10px] text-white/40 hover:text-white/70 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white/75 transition-colors"
              id="customization-close-btn"
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Color swatches */}
          <div>
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-2.5">Color</p>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_SWATCHES.map((sw) => (
                <button
                  key={sw.color}
                  title={sw.label}
                  onClick={() => setCurrentColor(sw.color)}
                  className={`swatch ${currentColor === sw.color ? 'selected' : ''}`}
                  style={{ backgroundColor: sw.color, width: 28, height: 28 }}
                  aria-label={`Color: ${sw.label}`}
                />
              ))}
            </div>
          </div>

          {/* Material swatches */}
          <div>
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-2.5">Material</p>
            <div className="flex items-center gap-2 flex-wrap">
              {MATERIAL_SWATCHES.map((sw) => (
                <button
                  key={`${sw.color}-${sw.label}`}
                  title={sw.label}
                  onClick={() => setCurrentTexture(sw.texture)}
                  className={`swatch ${currentTexture === sw.texture && currentColor === sw.color ? 'selected' : ''}`}
                  style={{ backgroundColor: sw.color, width: 28, height: 28 }}
                  aria-label={`Material: ${sw.label}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Orbit Ring decoration around garment ─────────── */
function OrbitRingDecor() {
  return (
    <div
      className="absolute pointer-events-none z-5"
      style={{
        left: '50%',
        top: '52%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        height: 60,
        perspective: '600px',
      }}
    >
      <motion.div
        className="w-full h-full"
        animate={{ rotateY: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{
          border: '1.5px solid rgba(255,255,255,0.18)',
          borderRadius: '50%',
          transformStyle: 'preserve-3d',
          rotateX: '75deg',
        }}
      />
    </div>
  )
}

/* ── Floating control pills (left side) ──────────── */
function FloatingPills({ autoRotate, onToggleRotate }) {
  return (
    <motion.div
      className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2.5"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <button
        onClick={onToggleRotate}
        className={`viewer-pill ${autoRotate ? 'active' : ''}`}
        id="orbit-pill-btn"
        title="Toggle orbit"
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
          <path d="M8 3a5 5 0 014.9 4M8 3V1M8 3v2M3.1 7A5 5 0 008 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M8 13v2M8 13v-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        Orbit
      </button>

      <button className="viewer-pill" id="rotate-pill-btn">
        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
          <path d="M3 8c0-2.76 2.24-5 5-5s5 2.24 5 5M11 6l2 2-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Rotate
      </button>

      <button className="viewer-pill" id="zoom-pill-btn">
        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
          <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.3" />
          <path d="M11 11l2.5 2.5M5.5 7H8.5M7 5.5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        Zoom
      </button>
    </motion.div>
  )
}

/* ── Left vertical zoom slider ───────────────────── */
function ZoomSlider() {
  const { viewerZoom, setViewerZoom } = useStore()
  // Slider shows inverted (bottom = zoomed in = small distance value)
  const sliderVal = 6 - viewerZoom  // invert so slider top = zoom in

  return (
    <motion.div
      className="absolute left-6 bottom-24 z-30 flex flex-col items-center gap-2"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-white/40">
        <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="range"
        min={0}
        max={3.5}
        step={0.05}
        value={sliderVal}
        onChange={(e) => setViewerZoom(6 - parseFloat(e.target.value))}
        className="zoom-slider"
        aria-label="Zoom level"
        id="zoom-slider"
      />
      <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-white/40">
        <path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  )
}

/* ── Bottom dot navigator ─────────────────────────── */
function BottomNav({ categoryList, selectedCategory }) {
  const { prevCategory, nextCategory } = useStore()
  const currentIdx = categoryList.indexOf(selectedCategory)

  // Nothing to page between if this section only has one item
  if (categoryList.length <= 1) return null

  return (
    <motion.div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <button
        onClick={prevCategory}
        className="viewer-pill px-3"
        id="prev-category-btn"
        aria-label="Previous category"
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
          <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="flex items-center gap-1.5">
        {categoryList.map((_, i) => (
          <div
            key={i}
            className={`nav-dot ${i === currentIdx ? 'active' : ''}`}
          />
        ))}
      </div>

      <button
        onClick={nextCategory}
        className="viewer-pill px-3"
        id="next-category-btn"
        aria-label="Next category"
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </motion.div>
  )
}

/* ── Current color thumbnail preview ─────────────── */
function GarmentThumbnail({ categoryId }) {
  const src = getCardImage(categoryId)
  if (!src) return null

  return (
    <motion.div
      className="absolute top-16 right-5 z-30 rounded-xl overflow-hidden shadow-xl"
      style={{
        width: 56,
        height: 68,
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(10px)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.4 }}
    >
      <img src={src} alt="Current garment" className="w-full h-full object-contain p-1" />
    </motion.div>
  )
}

/* ── Main ViewerPage ─────────────────────────────── */
export default function ViewerPage() {
  const {
    selectedCategory,
    autoRotate,
    setAutoRotate,
    backToShowroom,
    showCustomization,
    toggleCustomization,
    currentFloorId,
    currentSectionId,
  } = useStore()
  const category = getCategory(selectedCategory)
  const info = PRODUCT_INFO[selectedCategory]
  const [menuOpen, setMenuOpen] = useState(false)

  const floor = getFloor(currentFloorId)
  const section = getSection(currentFloorId, currentSectionId)
  const categoryList = getSectionCategories(currentFloorId, currentSectionId).map((c) => c.id)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 studio-bg overflow-hidden"
    >
      <LoadingScreen />

      {/* Studio vignette overlay */}
      <div className="absolute inset-0 studio-vignette pointer-events-none z-10" />

      {/* ── 3D Canvas ── */}
      <div className="absolute inset-0 z-0">
        <Viewer3D />
      </div>

      {/* Orbit ring decoration */}
      <OrbitRingDecor />

      {/* ══════════════════════════════════
          TOP BAR: Hamburger + "Customization" label
          + Thumbnail + Add to Store + Grid icon
      ══════════════════════════════════ */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="viewer-pill !px-2.5 !py-2"
            id="viewer-menu-btn"
            aria-label="Menu"
          >
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-white/75 text-sm font-semibold tracking-wide">Customization</span>

          {/* Floor / section / category breadcrumb */}
          {category && (
            <div className="hidden sm:flex items-center gap-1.5 ml-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="text-[10px] font-medium text-white/45 uppercase tracking-widest">
                {floor?.name}{section ? ` · ${section.name}` : ''} · {category.name}
              </span>
            </div>
          )}
        </div>

        {/* Right: Add to Store + Grid */}
        <div className="flex items-center gap-2">
          <button
            className="viewer-pill gap-1.5"
            id="add-to-store-btn"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M8 5.5v5M5.5 8h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Add to Store
          </button>
          <button
            className="viewer-pill !px-2.5 !py-2"
            id="viewer-grid-btn"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Garment thumbnail (top-right, below header) */}
      <GarmentThumbnail categoryId={selectedCategory} />

      {/* ══════════════════════════════════
          LEFT: Floating control pills + zoom slider
      ══════════════════════════════════ */}
      <FloatingPills autoRotate={autoRotate} onToggleRotate={() => setAutoRotate(!autoRotate)} />
      <ZoomSlider />

      {/* ══════════════════════════════════
          LEFT/RIGHT NAV ARROWS
      ══════════════════════════════════ */}
      <motion.button
        className="absolute left-16 top-1/2 -translate-y-1/2 z-30 viewer-pill !px-3 !py-3"
        onClick={() => useStore.getState().prevCategory()}
        id="viewer-prev-btn"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
          <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>

      <motion.button
        className="absolute right-5 top-1/2 -translate-y-1/2 z-30 viewer-pill !px-3 !py-3"
        onClick={() => useStore.getState().nextCategory()}
        id="viewer-next-btn"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>

      {/* ══════════════════════════════════
          BOTTOM-LEFT: Enter Showroom button
      ══════════════════════════════════ */}
      <motion.button
        onClick={backToShowroom}
        className="absolute bottom-6 left-5 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-white/70 transition-all duration-200 hover:text-white"
        style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.13)',
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        id="back-to-showroom-btn"
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Enter Showroom
      </motion.button>

      {/* ══════════════════════════════════
          BOTTOM CENTER: Dot nav + arrows
      ══════════════════════════════════ */}
      <BottomNav categoryList={categoryList} selectedCategory={selectedCategory} />

      {/* ══════════════════════════════════
          BOTTOM RIGHT: Customize button + sparkle
      ══════════════════════════════════ */}
      <motion.div
        className="absolute bottom-6 right-5 z-30 flex flex-col items-end gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {/* Sparkle decoration */}
        <div className="sparkle opacity-70">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z"
              fill="rgba(220,190,100,0.7)" />
          </svg>
        </div>

        {/* Customize toggle */}
        <button
          onClick={toggleCustomization}
          className="viewer-pill !px-4 !py-2.5"
          style={showCustomization ? {
            background: 'rgba(99,102,241,0.25)',
            borderColor: 'rgba(99,102,241,0.5)',
            color: '#a5b4fc',
          } : {}}
          id="customize-toggle-btn"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
            <circle cx="5" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="11" cy="4" r="2" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="11" cy="12" r="2" stroke="currentColor" strokeWidth="1.3" />
            <path d="M7 8h7M2 8H3M11 6V2M11 14v-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {showCustomization ? 'Close' : 'Customize'}
        </button>
      </motion.div>

      {/* ══════════════════════════════════
          CUSTOMIZATION PANEL
      ══════════════════════════════════ */}
      <AnimatePresence>
        {showCustomization && (
          <CustomizationPanel onClose={toggleCustomization} />
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════
          TOP CENTER: Garment name
      ══════════════════════════════════ */}
      <motion.div
        className="absolute top-16 left-0 right-0 z-20 flex flex-col items-center pointer-events-none"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <p className="text-white/30 text-[10px] font-semibold tracking-[0.35em] uppercase mb-0.5">
          3D MODEL
        </p>
        <h1 className="text-white/65 text-2xl sm:text-3xl font-light tracking-wide font-serif">
          {info?.name || category?.name || 'Garment'}
        </h1>
      </motion.div>

      {/* ══════════════════════════════════
          BOTTOM-LEFT cursive branding
      ══════════════════════════════════ */}
      <motion.div
        className="absolute bottom-20 left-20 z-20 pointer-events-none"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <p className="font-caveat text-2xl sm:text-3xl text-white/25 leading-tight font-bold">
          Clothing
        </p>
        <p className="font-caveat text-2xl sm:text-3xl text-white/25 leading-tight font-bold -mt-1">
          Mockups
        </p>
        <p className="font-caveat text-xs text-white/15 tracking-wide mt-0.5">™ 3D</p>
      </motion.div>

      {/* Drag/scroll hint (bottom right corner) */}
      {info && (
        <motion.div
          className="absolute bottom-20 right-5 z-20 text-right pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <p className="text-[9px] text-white/25 uppercase tracking-wider font-medium">Starting at</p>
          <p className="text-2xl font-bold text-white/50">{info.price}</p>
          <p className="text-[9px] text-white/20 mt-0.5">Drag · Scroll to zoom</p>
        </motion.div>
      )}
    </motion.div>
  )
}
