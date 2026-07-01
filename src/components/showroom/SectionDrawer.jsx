import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../stores/useStore'
import { getFloor, getSectionCategories, getCardImage, getCategory } from '../../utils/garments'

function ProductCard({ category, onExplore }) {
  const { toggleWishlist, wishlistItems } = useStore()
  const cat = getCategory(category.id)
  const imgSrc = getCardImage(category.id)
  const isWishlisted = wishlistItems.includes(category.id)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-white/5 flex items-center justify-center p-3">
        {imgSrc ? (
          <img src={imgSrc} alt={cat?.name || category.id} className="w-full h-full object-contain" />
        ) : (
          <span className="text-4xl opacity-30">{category.icon || '👕'}</span>
        )}
        {/* Wishlist heart */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(category.id) }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(6px)',
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg viewBox="0 0 16 16" fill={isWishlisted ? '#ef4444' : 'none'} className="w-3.5 h-3.5">
            <path d="M8 13.5S2 9.5 2 5.8 4.5 2 8 5.5 14 2 14 5.8 8 13.5 8 13.5z"
              stroke={isWishlisted ? '#ef4444' : 'rgba(255,255,255,0.6)'}
              strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-2.5 space-y-1.5">
        <p className="text-white text-xs font-semibold truncate">{cat?.name || category.id}</p>
        <p className="text-white/30 text-[10px] truncate">{cat?.description || ''}</p>
        <p className="text-white/60 text-xs font-bold">{cat?.price || ''}</p>
        <button
          onClick={() => onExplore(category.id)}
          className="w-full py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-200 hover:bg-white/20"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
          id={`explore-3d-${category.id}`}
        >
          Explore in 3D
        </button>
      </div>
    </motion.div>
  )
}

export default function SectionDrawer() {
  const { currentFloorId, currentSectionId, selectCategory } = useStore()
  const [filter, setFilter] = useState('all')
  const [isOpen, setIsOpen] = useState(true)

  const floor = getFloor(currentFloorId)
  const section = floor?.sections.find((s) => s.id === currentSectionId)
  const categories = useMemo(() => getSectionCategories(currentFloorId, currentSectionId), [currentFloorId, currentSectionId])

  const filtered = useMemo(() => {
    if (filter === 'all') return categories
    return categories.filter((c) => c.availableMaterials?.includes(filter))
  }, [categories, filter])

  const filters = useMemo(() => {
    const set = new Set(['all'])
    categories.forEach((c) => c.availableMaterials?.forEach((m) => set.add(m)))
    return Array.from(set)
  }, [categories])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="absolute right-0 top-0 bottom-0 z-20 w-72"
          style={{
            background: 'rgba(12, 14, 20, 0.88)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/8">
              <div>
                <h3 className="text-white text-sm font-semibold">{section?.name || 'Products'}</h3>
                <p className="text-white/30 text-[10px]">{section?.description || ''}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/30 hover:text-white/60 transition-colors p-1"
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Filter tags */}
            <div className="px-4 py-2.5 flex gap-1.5 overflow-x-auto scrollbar-none border-b border-white/8">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${
                    filter === f
                      ? 'bg-white/15 text-white'
                      : 'text-white/40 hover:text-white/70 bg-white/5'
                  }`}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Product grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-2.5">
                <AnimatePresence mode="popLayout">
                  {filtered.map((cat) => (
                    <ProductCard key={cat.id} category={cat} onExplore={selectCategory} />
                  ))}
                </AnimatePresence>
              </div>
              {filtered.length === 0 && (
                <p className="text-white/30 text-xs text-center mt-8">No items match this filter</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
