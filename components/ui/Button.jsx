import { motion } from 'framer-motion'

export default function Button({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 cursor-pointer border'
  const variants = {
    primary: 'bg-white text-black hover:bg-gray-200 border-white',
    secondary: 'bg-transparent text-white hover:bg-white/10 border-white/20',
    ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/5 border-transparent',
    accent: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-transparent',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-8 py-3.5 text-base gap-2.5',
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </motion.button>
  )
}
