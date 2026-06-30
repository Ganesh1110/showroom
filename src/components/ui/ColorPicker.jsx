import { motion } from 'framer-motion'
import useStore from '../../stores/useStore'
import { ALL_COLORS } from '../../utils/garments'

/**
 * @param {string[]} availableColors - hex array to filter from ALL_COLORS
 * @param {boolean}  darkMode        - if false, renders on a light panel background (default: true)
 */
export default function ColorPicker({ availableColors, darkMode = true }) {
  const { currentColor, setCurrentColor } = useStore()
  const colors = availableColors
    ? ALL_COLORS.filter((c) => availableColors.includes(c.hex))
    : ALL_COLORS

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map(({ name, hex }) => (
        <motion.button
          key={hex}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentColor(hex)}
          title={name}
          className={`w-7 h-7 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
            currentColor === hex
              ? darkMode
                ? 'border-white scale-110 shadow-lg shadow-white/20'
                : 'border-black/50 scale-110 shadow-md shadow-black/15'
              : darkMode
              ? 'border-white/20 hover:border-white/50'
              : 'border-black/15 hover:border-black/35'
          }`}
          style={{ backgroundColor: hex }}
          aria-label={`Color: ${name}`}
          id={`color-${hex.replace('#', '')}`}
        >
          {currentColor === hex && (
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke={hex === '#000000' || hex === '#1e3a5f' || hex === '#2d2d2d' ? '#fff' : '#000'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </motion.button>
      ))}
    </div>
  )
}
