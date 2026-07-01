import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { getFloor, getSection, getSectionCategories } from '../../utils/garments'
import useStore from '../../stores/useStore'
import Store3D from './Store3D'

/* ─────────────────────────────────────────────────────
   Section tabs — switch between sections on this floor
───────────────────────────────────────────────────── */
function SectionTabs({ floor, currentSectionId, onSelect }) {
  return (
    <div className="hidden sm:flex items-center gap-2">
      {floor.sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSelect(section.id)}
          className={`text-[11px] px-3.5 py-1.5 rounded-full border font-medium transition-all duration-200 ${
            section.id === currentSectionId
              ? 'text-black bg-white border-white'
              : 'text-white/65 glass-panel border-white/15 hover:text-white hover:bg-white/10'
          }`}
          id={`section-tab-${section.id}`}
        >
          {section.name}
        </button>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   Floor switcher — jump floor without going to lobby
───────────────────────────────────────────────────── */
function FloorSwitcher({ floor, onPrev, onNext, onDirectory }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onDirectory}
        className="text-[10px] px-3 py-1.5 rounded-full glass-panel border border-white/15 text-white/70 font-semibold hover:text-white hover:bg-white/10 transition-all duration-200"
        id="floor-directory-btn"
        title="All floors"
      >
        {floor.name}
      </button>
      <button
        onClick={onPrev}
        className="w-7 h-7 rounded-full glass-panel border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
        id="floor-prev-btn"
        aria-label="Previous floor"
        title="Previous floor"
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3"><path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button
        onClick={onNext}
        className="w-7 h-7 rounded-full glass-panel border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
        id="floor-next-btn"
        aria-label="Next floor"
        title="Next floor"
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   Main Showroom component — an interactive 3D store
   floor. Displays for the current section's categories
   are laid out inside the store; drag to look around,
   scroll to zoom, click a display to view it in 3D.
───────────────────────────────────────────────────── */
export default function Showroom({ onSelectCategory }) {
  const currentFloorId = useStore((s) => s.currentFloorId)
  const currentSectionId = useStore((s) => s.currentSectionId)
  const selectSection = useStore((s) => s.selectSection)
  const goToDirectory = useStore((s) => s.goToDirectory)
  const nextFloor = useStore((s) => s.nextFloor)
  const prevFloor = useStore((s) => s.prevFloor)

  const floor = getFloor(currentFloorId)
  const section = getSection(currentFloorId, currentSectionId)

  const categories = useMemo(
    () => getSectionCategories(currentFloorId, currentSectionId),
    [currentFloorId, currentSectionId]
  )

  if (!floor || !section) return null

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">

      {/* Interactive 3D store floor */}
      <div className="absolute inset-0">
        <Store3D key={`${currentFloorId}-${currentSectionId}`} categories={categories} onSelectCategory={onSelectCategory} />
      </div>

      {/* Cinematic top/bottom gradient so the overlay UI stays legible */}
      <div className="absolute inset-0 venue-overlay pointer-events-none" />

      {/* Top header bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-10 py-5 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="flex items-center gap-2.5 select-none min-w-0">
          <div className="w-9 h-9 rounded-xl glass-panel border border-white/20 flex items-center justify-center flex-shrink-0">
            <span className="font-serif text-white text-sm font-light">✦</span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm tracking-wide truncate">{floor.name}</p>
            <p className="text-white/50 text-[10px] tracking-widest uppercase truncate">{section.name}</p>
          </div>
        </div>

        <SectionTabs floor={floor} currentSectionId={currentSectionId} onSelect={selectSection} />
        <FloorSwitcher floor={floor} onPrev={prevFloor} onNext={nextFloor} onDirectory={goToDirectory} />
      </motion.div>

      {/* Mobile section tabs */}
      <motion.div
        className="sm:hidden absolute top-[68px] left-0 right-0 z-20 px-4 flex items-center gap-2 overflow-x-auto pb-1 pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {floor.sections.map((s) => (
          <button
            key={s.id}
            onClick={() => selectSection(s.id)}
            className={`flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full border font-medium transition-all duration-200 ${
              s.id === currentSectionId ? 'text-black bg-white border-white' : 'text-white/65 glass-panel border-white/15'
            }`}
          >
            {s.name}
          </button>
        ))}
      </motion.div>

      {/* Bottom navigation bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-10 py-5 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 pointer-events-auto">
            <button
              onClick={goToDirectory}
              className="w-9 h-9 rounded-full glass-panel border border-white/20 flex items-center justify-center flex-shrink-0 hover:bg-white/10 transition-colors"
              id="showroom-directory-btn"
              aria-label="All floors"
              title="All floors"
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-white/80">
                <path d="M4 17V9l6-5 6 5v8M4 17h12M8 17v-5h4v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <p className="text-white/55 text-xs font-medium truncate">
              <span className="text-white/85">{categories.length} collection{categories.length === 1 ? '' : 's'}</span>{' '}
              in {section.name} — drag to look around, click a display to view in 3D
            </p>
          </div>

          <div className="hidden md:flex items-center gap-5 text-white/35 text-[11px] flex-shrink-0">
            <span>Drag to Look</span>
            <span className="w-px h-3 bg-white/15" />
            <span>Scroll to Zoom</span>
            <span className="w-px h-3 bg-white/15" />
            <span>Click a Display</span>
          </div>
        </div>
      </motion.div>

    </div>
  )
}
