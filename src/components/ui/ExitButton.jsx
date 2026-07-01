import { motion } from 'framer-motion'
import useStore from '../../stores/useStore'

export default function ExitButton() {
  const { isExiting } = useStore()

  if (isExiting) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[999] bg-black flex items-center justify-center"
        style={{ animation: 'splash-fade-out 0.6s ease forwards' }}
        onAnimationEnd={() => {
          // completeExit is called after the fade-out finishes
          setTimeout(() => useStore.getState().completeExit(), 100)
        }}
      >
        <p className="text-white/30 text-sm tracking-widest uppercase">See you soon</p>
      </motion.div>
    )
  }

  return null
}
