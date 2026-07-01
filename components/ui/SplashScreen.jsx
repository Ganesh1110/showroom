import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../../stores/useStore'

export default function SplashScreen() {
  const { completeSplash } = useStore()
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    // Auto-advance after 2.8s
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(completeSplash, 700)
    }, 2800)
    return () => clearTimeout(timer)
  }, [completeSplash])

  return (
    <motion.div
      className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center ${exiting ? 'splash-exiting' : ''}`}
      initial={{ opacity: 1 }}
    >
      {/* 3D logo */}
      <div className="splash-logo font-serif text-white text-[80px] sm:text-[110px] font-light tracking-tight leading-none select-none">
        3D
      </div>

      {/* Tagline */}
      <div className="splash-tagline text-center mt-6 space-y-1">
        <p className="text-white/75 text-xl sm:text-2xl font-light tracking-[0.08em]">
          Design. Customize.
        </p>
        <p className="text-white/75 text-xl sm:text-2xl font-light tracking-[0.08em]">
          Experience Fashion in 3D.
        </p>
      </div>

      {/* Bottom sparkle decoration */}
      <div className="absolute bottom-8 right-8 sparkle">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.2 10.8L22 12L13.2 13.2L12 22L10.8 13.2L2 12L10.8 10.8L12 2Z"
            fill="rgba(255,255,255,0.4)" />
        </svg>
      </div>
    </motion.div>
  )
}
