import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = ['Services', 'Products']

export default function Navbar({ onLogin, onSignUp }) {
  const [rendersOpen, setRendersOpen] = useState(false)

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-10 py-5"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 select-none">
        <span className="font-serif text-white text-2xl font-light leading-none">3D</span>
        <span className="text-white/70 text-sm font-medium tracking-widest uppercase">Showroom</span>
      </div>

      {/* Center nav links */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <button
            key={link}
            className="text-white/60 text-sm font-medium hover:text-white transition-colors duration-200"
          >
            {link}
          </button>
        ))}

        {/* Renders dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-1.5 text-white/60 text-sm font-medium hover:text-white transition-colors duration-200"
            onClick={() => setRendersOpen((v) => !v)}
            id="nav-renders-btn"
          >
            Renders
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${rendersOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 16 16" fill="none"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <AnimatePresence>
            {rendersOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 glass-panel rounded-xl py-2 min-w-[160px] z-50"
              >
                {['3D Models', 'Product Shots', 'Lifestyle Renders', 'AR Preview'].map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => setRendersOpen(false)}
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onLogin}
          className="text-white/65 text-sm font-medium hover:text-white transition-colors duration-200 hidden sm:block"
          id="nav-login-btn"
        >
          Login
        </button>
        <button
          onClick={onSignUp}
          className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 hover:bg-white/10 hover:border-white/55 transition-all duration-200"
          id="nav-signup-btn"
        >
          Sign Up
        </button>
      </div>
    </motion.nav>
  )
}
