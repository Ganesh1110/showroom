import { motion } from 'framer-motion'
import useStore from '../../stores/useStore'
import { getFloor } from '../../utils/garments'

export default function SectionTabs() {
  const { currentFloorId, currentSectionId, selectSection } = useStore()
  const floor = getFloor(currentFloorId)
  if (!floor) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex items-center gap-1.5"
    >
      {floor.sections.map((section) => (
        <button
          key={section.id}
          onClick={() => selectSection(section.id)}
          className={`px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all duration-200 ${
            currentSectionId === section.id
              ? 'text-white bg-white/15 border border-white/25'
              : 'text-white/50 border border-transparent hover:text-white/75 hover:bg-white/5'
          }`}
          id={`section-tab-${section.id}`}
        >
          {section.name}
        </button>
      ))}
    </motion.div>
  )
}
