import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../stores/useStore'
import { getCardImage, PRODUCT_INFO } from '../../utils/garments'

export default function CartPanel() {
  const { cartItems, removeFromCart } = useStore()
  const [isOpen, setIsOpen] = useState(false)

  const total = cartItems.length

  return (
    <>
      {/* Cart trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative viewer-pill !px-3 !py-2"
        id="cart-trigger-btn"
        aria-label="Open cart"
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
          <path d="M2 3h1.5l1 8h9l1-6H4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="13" r="1" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="12" cy="13" r="1" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        {total > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center">
            {total}
          </span>
        )}
      </button>

      {/* Cart dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full right-0 mt-2 z-50 rounded-xl overflow-hidden shadow-2xl"
            style={{
              width: 260,
              background: 'rgba(14, 16, 22, 0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            <div className="p-4">
              <p className="text-white text-sm font-semibold mb-3">
                Cart {total > 0 && <span className="text-white/40 font-normal">({total})</span>}
              </p>
              {total === 0 ? (
                <p className="text-white/30 text-xs py-4 text-center">Your cart is empty</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {cartItems.map((id) => {
                    const info = PRODUCT_INFO[id]
                    const img = getCardImage(id)
                    return (
                      <div key={id} className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5">
                        {img && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                            <img src={img} alt="" className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate">{info?.name || id}</p>
                          <p className="text-white/40 text-[10px]">{info?.price || ''}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(id)}
                          className="text-white/30 hover:text-red-400 transition-colors p-1"
                        >
                          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                            <path d="M2 3h8M4.5 3V2a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M9.5 3l-.5 7.5a.5.5 0 01-.5.5h-5a.5.5 0 01-.5-.5L2.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
