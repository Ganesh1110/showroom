import { motion } from 'framer-motion'
import useStore from '../../stores/useStore'
import { TEXTURES } from '../../utils/garments'

const textureEmoji = {
  cotton: '☁️',
  denim: '👖',
  leather: '👜',
  linen: '🌾',
  pattern: '🔷',
  floral: '🌺',
  stripes: '〰️',
  checks: '📊',
}

/**
 * @param {string[]} availableTextures - texture ids to filter
 * @param {boolean}  darkMode          - if false, renders on a light panel background (default: true)
 */
export default function TexturePicker({ availableTextures, darkMode = true }) {
  const { currentTexture, setCurrentTexture } = useStore()
  const textures = availableTextures
    ? TEXTURES.filter((t) => availableTextures.includes(t.id))
    : TEXTURES

  return (
    <div className="flex flex-wrap gap-1.5">
      {textures.map(({ id, name }) => (
        <motion.button
          key={id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentTexture(id)}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 flex items-center gap-1 ${
            currentTexture === id
              ? darkMode
                ? 'bg-white text-black'
                : 'bg-black/80 text-white'
              : darkMode
              ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              : 'bg-black/6 text-black/55 hover:bg-black/10 hover:text-black/80'
          }`}
          aria-label={`Texture: ${name}`}
          id={`texture-${id}`}
        >
          <span>{textureEmoji[id] || '🧵'}</span>
          {name}
        </motion.button>
      ))}
    </div>
  )
}
