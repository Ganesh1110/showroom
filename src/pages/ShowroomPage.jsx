import { Suspense } from 'react'
import { motion } from 'framer-motion'
import useStore from '../stores/useStore'
import { getFloor, getSectionCategories } from '../utils/garments'
import Store3D from '../components/showroom/Store3D'
import SectionTabs from '../components/showroom/SectionTabs'
import FloorSwitcher from '../components/showroom/FloorSwitcher'
import SectionDrawer from '../components/showroom/SectionDrawer'
import CartPanel from '../components/ui/CartPanel'

function TopBar() {
  const { currentFloorId, goToDirectory, toggleSettings } = useStore()
  const floor = getFloor(currentFloorId)

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4"
    >
      {/* Left: Brand + floor name */}
      <div className="flex items-center gap-3">
        <button
          onClick={goToDirectory}
          className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-xs font-medium"
          id="showroom-back-directory"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Directory
        </button>
        <span className="text-white/20 text-xs">|</span>
        <div className="flex items-center gap-2">
          {floor && (
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: floor.accent }} />
          )}
          <span className="text-white/70 text-xs font-semibold tracking-wide">
            {floor?.name || 'Showroom'}
          </span>
        </div>
      </div>

      {/* Center: Section tabs */}
      <SectionTabs />

      {/* Right: Cart + Settings */}
      <div className="flex items-center gap-2">
        <CartPanel />
        <button
          onClick={toggleSettings}
          className="viewer-pill !px-2.5 !py-2"
          aria-label="Settings"
          id="showroom-settings-btn"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
            <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8 1.5v1M8 13.5v1M14.5 8h-1M2.5 8h-1M12.5 3.5l-.7.7M4.2 11.8l-.7.7M12.5 12.5l-.7-.7M4.2 4.2l-.7-.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#101014]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
        <p className="text-white/40 text-xs">Loading store environment…</p>
      </div>
    </div>
  )
}

export default function ShowroomPage() {
  const { selectCategory, currentFloorId, currentSectionId } = useStore()
  const categories = getSectionCategories(currentFloorId, currentSectionId)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="fixed inset-0 bg-black overflow-hidden"
    >
      {/* 3D Store Environment */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<LoadingFallback />}>
          <Store3D categories={categories} onSelectCategory={selectCategory} />
        </Suspense>
      </div>

      {/* Overlay UI */}
      <TopBar />
      <FloorSwitcher />
      <SectionDrawer />

      {/* Bottom instruction */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      >
        <p className="text-white/25 text-[10px] font-medium tracking-wide">
          Hover the shelves · Click to explore in 3D
        </p>
      </motion.div>
    </motion.div>
  )
}
