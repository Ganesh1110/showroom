import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../stores/useStore'
import { getCategory, PRODUCT_INFO } from '../../utils/garments'

export default function ProductInfo() {
  const { selectedCategory } = useStore()
  const category = getCategory(selectedCategory)
  const info = PRODUCT_INFO[selectedCategory]

  if (!category || !info) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${category.color}20`, color: category.color }}
          >
            {category.name}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-white">{info.name}</h2>

        <p className="text-sm text-white/50 leading-relaxed">{info.description}</p>

        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-xs text-white/40">Category</span>
            <span className="text-xs text-white/70">{category.name}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-xs text-white/40">Available Colors</span>
            <span className="text-xs text-white/70">{category.availableColors.length}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-xs text-white/40">Available Textures</span>
            <span className="text-xs text-white/70">{category.availableTextures.length}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-xs text-white/40">Material</span>
            <span className="text-xs text-white/70">{category.availableMaterials.join(', ')}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-white/40">Price</span>
            <span className="text-sm font-semibold text-white">{info.price}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
