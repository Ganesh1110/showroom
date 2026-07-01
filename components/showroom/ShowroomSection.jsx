import { motion } from 'framer-motion'

export default function ShowroomSection({ category, index, onSelect }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(category.id)}
      className="relative group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${category.gradient}`} />

      <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[180px] sm:min-h-[220px]">
        <motion.span
          className="text-4xl sm:text-5xl mb-3"
          whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
        >
          {category.icon}
        </motion.span>

        <h3
          className="text-lg sm:text-xl font-bold text-white mb-1.5 group-hover:text-white transition-colors"
        >
          {category.name}
        </h3>

        <p className="text-xs text-white/40 group-hover:text-white/70 transition-colors text-center max-w-[160px]">
          {category.description}
        </p>

        <div className="mt-4 flex gap-1.5">
          {category.availableColors.slice(0, 5).map((color) => (
            <span
              key={color}
              className="w-3 h-3 rounded-full border border-white/20"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs text-white/60 flex items-center gap-1">
            Explore Collection
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  )
}
