import { motion } from 'framer-motion'
import useStore from '../../stores/useStore'
import { FLOORS } from '../../utils/garments'

export default function FloorSwitcher() {
  const { currentFloorId, selectFloor, goToDirectory } = useStore()

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2"
    >
      {FLOORS.map((floor) => {
        const active = floor.id === currentFloorId
        return (
          <button
            key={floor.id}
            onClick={() => selectFloor(floor.id)}
            className="relative group"
            title={`${floor.name}: ${floor.tagline}`}
            id={`floor-switcher-${floor.id}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-serif transition-all duration-200 ${
                active
                  ? 'text-white scale-110'
                  : 'text-white/40 hover:text-white/70 hover:scale-105'
              }`}
              style={{
                background: active
                  ? `radial-gradient(circle at 35% 30%, ${floor.accent}55, rgba(0,0,0,0.5))`
                  : 'rgba(255,255,255,0.06)',
                border: active
                  ? `1px solid ${floor.accent}70`
                  : '1px solid rgba(255,255,255,0.12)',
                boxShadow: active ? `0 0 16px ${floor.accent}30` : 'none',
              }}
            >
              {floor.shortName}
            </div>
            {/* Active indicator dot */}
            {active && (
              <div
                className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: floor.accent }}
              />
            )}
            {/* Tooltip */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              <div className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-white/80" style={{
                background: 'rgba(10,10,10,0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                {floor.tagline}
              </div>
            </div>
          </button>
        )
      })}

      {/* Separator */}
      <div className="w-6 h-px bg-white/10 my-1" />

      {/* Directory button */}
      <button
        onClick={goToDirectory}
        className="w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white/60 transition-colors text-xs"
        title="Floor Directory"
        id="floor-switcher-directory"
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
          <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>
    </motion.div>
  )
}
