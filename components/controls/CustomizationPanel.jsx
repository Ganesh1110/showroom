import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../stores/useStore'
import ColorPicker from '../ui/ColorPicker'
import TexturePicker from '../ui/TexturePicker'
import ProductInfo from '../ui/ProductInfo'
import { getCategory, MATERIAL_OPTIONS } from '../../utils/garments'

function MaterialSlider({ label, value, onChange, min, max, step }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">{label}</span>
        <span className="text-xs text-white/60 font-mono">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  )
}

export default function CustomizationPanel() {
  const { selectedCategory, materialProps, setMaterialProps, showCustomization, toggleCustomization } = useStore()
  const category = getCategory(selectedCategory)

  if (!category) return null

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-white">Customize</h3>
        <button
          onClick={toggleCustomization}
          className="lg:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
          aria-label="Toggle customization panel"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showCustomization ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto space-y-6 pr-1"
          >
            <ColorPicker availableColors={category.availableColors} />
            <TexturePicker availableTextures={category.availableTextures} />

            <div>
              <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Material</p>
              <div className="space-y-3">
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
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto pr-1"
          >
            <ProductInfo />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex gap-2">
          <button
            onClick={() => toggleCustomization()}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              !showCustomization
                ? 'bg-white/10 text-white'
                : 'bg-white/5 text-white/50 hover:text-white/70'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => toggleCustomization()}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              showCustomization
                ? 'bg-white/10 text-white'
                : 'bg-white/5 text-white/50 hover:text-white/70'
            }`}
          >
            Customize
          </button>
        </div>
      </div>
    </div>
  )
}
