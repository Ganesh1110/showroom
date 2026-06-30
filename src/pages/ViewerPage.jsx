import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Viewer3D from '../components/viewer/Viewer3D'
import ColorPicker from '../components/ui/ColorPicker'
import TexturePicker from '../components/ui/TexturePicker'
import LoadingScreen from '../components/viewer/LoadingScreen'
import useStore from '../stores/useStore'
import { getCategory, PRODUCT_INFO, MATERIAL_OPTIONS } from '../utils/garments'

/* ─────────────────────────────────────────────
   Material slider
───────────────────────────────────────────── */
function MaterialSlider({ label, value, onChange, min, max, step }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-black/50">{label}</span>
        <span className="text-[10px] text-black/60 font-mono">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: '#6366f1' }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────
   Floating customization drawer (bottom centre)
───────────────────────────────────────────── */
function CustomizationDrawer({ category }) {
  const [open, setOpen] = useState(false)
  const { materialProps, setMaterialProps, resetCustomization } = useStore()

  if (!category) return null

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
      {/* Drawer panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="glass-panel-light rounded-2xl px-5 py-4 shadow-2xl w-[340px] sm:w-[420px]"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-black/70 uppercase tracking-widest">Customize</p>
              <button
                onClick={resetCustomization}
                className="text-[10px] text-black/40 hover:text-black/70 transition-colors"
                id="customize-reset-btn"
              >
                Reset
              </button>
            </div>

            {/* Color picker */}
            <div className="mb-3">
              <p className="text-[10px] text-black/40 uppercase tracking-widest mb-1.5 font-medium">Color</p>
              <ColorPicker availableColors={category.availableColors} darkMode={false} />
            </div>

            {/* Texture picker */}
            <div className="mb-3">
              <p className="text-[10px] text-black/40 uppercase tracking-widest mb-1.5 font-medium">Texture</p>
              <TexturePicker availableTextures={category.availableTextures} darkMode={false} />
            </div>

            {/* Material sliders */}
            <div className="space-y-2">
              <p className="text-[10px] text-black/40 uppercase tracking-widest mb-1.5 font-medium">Material</p>
              {MATERIAL_OPTIONS.map((opt) => (
                <MaterialSlider
                  key={opt.key}
                  label={opt.name}
                  value={materialProps[opt.key]}
                  min={opt.min}
                  max={opt.max}
                  step={opt.step}
                  onChange={(val) => setMaterialProps({ [opt.key]: val })}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle pill button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full shadow-xl text-sm font-semibold transition-all"
        style={{
          background: open ? 'rgba(99,102,241,0.9)' : 'rgba(255,255,255,0.88)',
          color: open ? '#fff' : '#111',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0,0,0,0.08)',
        }}
        id="customize-drawer-toggle"
        aria-label="Toggle Customization Panel"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {open ? 'Close' : 'Customize'}
      </motion.button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main ViewerPage
───────────────────────────────────────────── */
export default function ViewerPage() {
  const { selectedCategory, autoRotate, setAutoRotate, backToShowroom } = useStore()
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

      {/* Studio vignette overlay */}
      <div className="absolute inset-0 studio-vignette pointer-events-none z-10" />

      {/* ── 3D Canvas (fills entire page) ── */}
      <div className="absolute inset-0 z-0">
        <Viewer3D />
      </div>

      {/* ══════════════════════════════════
          TOP: Title block (centre)
      ══════════════════════════════════ */}
      <motion.div
        className="absolute top-8 left-0 right-0 z-20 flex flex-col items-center pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <p className="text-black/40 text-xs font-semibold tracking-[0.35em] uppercase mb-1">
          3D MODEL
        </p>
        <h1 className="text-black/70 text-2xl sm:text-3xl font-light tracking-wide">
          {info?.name || category?.name || 'Garment'}
        </h1>
      </motion.div>

      {/* ══════════════════════════════════
          BOTTOM-LEFT: Cursive branding
      ══════════════════════════════════ */}
      <motion.div
        className="absolute bottom-8 left-8 z-20 pointer-events-none"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <p className="font-caveat text-3xl sm:text-4xl text-black/45 leading-tight font-bold">
          Clothing
        </p>
        <p className="font-caveat text-3xl sm:text-4xl text-black/45 leading-tight font-bold -mt-1">
          Mockups
        </p>
        <p className="font-caveat text-sm text-black/25 tracking-wide mt-0.5">™ 3D</p>
      </motion.div>

      {/* ══════════════════════════════════
          TOP-LEFT: Back button + category
      ══════════════════════════════════ */}
      <motion.div
        className="absolute top-6 left-6 z-20 flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <button
          onClick={backToShowroom}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200"
          style={{
            background: 'rgba(0,0,0,0.10)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,0,0,0.12)',
            color: 'rgba(0,0,0,0.65)',
          }}
          id="back-to-showroom-btn"
          aria-label="Back to Showroom"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Store
        </button>

        {category && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
            <span className="text-[10px] font-semibold text-black/45 uppercase tracking-widest">
              {category.name}
            </span>
          </div>
        )}
      </motion.div>

      {/* ══════════════════════════════════
          TOP-RIGHT: Rotate toggle
      ══════════════════════════════════ */}
      <motion.div
        className="absolute top-6 right-6 z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200"
          style={{
            background: autoRotate ? 'rgba(99,102,241,0.12)' : 'rgba(0,0,0,0.08)',
            backdropFilter: 'blur(12px)',
            border: autoRotate ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(0,0,0,0.1)',
            color: autoRotate ? '#4f46e5' : 'rgba(0,0,0,0.5)',
          }}
          id="auto-rotate-toggle"
          aria-label={autoRotate ? 'Disable Auto-Rotate' : 'Enable Auto-Rotate'}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
            <path d="M8 3a5 5 0 014.9 4M8 3V1M8 3v2M3.1 7A5 5 0 008 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M8 13v2M8 13v-2M12.9 7A5 5 0 0011 4.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          {autoRotate ? 'Rotating' : 'Rotate'}
        </button>
      </motion.div>

      {/* ══════════════════════════════════
          BOTTOM-CENTER: Customization drawer
      ══════════════════════════════════ */}
      <CustomizationDrawer category={category} />

      {/* ══════════════════════════════════
          BOTTOM-RIGHT: Price
      ══════════════════════════════════ */}
      {info && (
        <motion.div
          className="absolute bottom-8 right-8 z-20 text-right pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-[10px] text-black/35 uppercase tracking-wider font-medium mb-0.5">Starting at</p>
          <p className="text-3xl font-bold text-black/65">{info.price}</p>
          <p className="text-[10px] text-black/30 mt-1">Drag to rotate · Scroll to zoom</p>
        </motion.div>
      )}
    </motion.div>
  )
}
