import { motion } from 'framer-motion'
import useStore from '../../stores/useStore'

export default function ViewerControls() {
  const { autoRotate, setAutoRotate, resetCustomization, backToShowroom } = useStore()

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="flex items-center gap-2 flex-wrap"
    >
      <button
        onClick={backToShowroom}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all duration-200"
        title="Back to Showroom"
        aria-label="Back to Showroom"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={() => setAutoRotate(!autoRotate)}
        className={`p-2 rounded-lg border transition-all duration-200 ${
          autoRotate
            ? 'bg-white/10 border-white/20 text-white'
            : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
        }`}
        title={autoRotate ? 'Disable Auto-Rotate' : 'Enable Auto-Rotate'}
        aria-label={autoRotate ? 'Disable Auto-Rotate' : 'Enable Auto-Rotate'}
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M8 3a5 5 0 014.9 4M8 3V1M8 3v2M8 13a5 5 0 01-4.9-4M8 13v2M8 13v-2M3 8H1M5 8H3M13 8h-2M15 8h-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M12.9 7A5 5 0 0011 4.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>

      <button
        onClick={resetCustomization}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all duration-200"
        title="Reset All"
        aria-label="Reset All"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M2 8a6 6 0 0111.33-3M14 8a6 6 0 01-11.33 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M14 2v3h-3M2 14v-3h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={handleFullscreen}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all duration-200"
        title="Fullscreen"
        aria-label="Fullscreen"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="ml-auto text-[10px] text-white/30 hidden sm:block">
        Drag to rotate · Scroll to zoom
      </div>
    </motion.div>
  )
}
