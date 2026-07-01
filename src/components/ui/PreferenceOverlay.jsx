import { motion } from 'framer-motion'
import useStore from '../../stores/useStore'

function TogglePill({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-white/15 text-white border border-white/25'
          : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/8 hover:text-white/70'
      }`}
    >
      {icon && <span className="text-base">{icon}</span>}
      {label}
    </button>
  )
}

export default function PreferenceOverlay() {
  const {
    motionPreference, setMotionPreference,
    inputDevice, setInputDevice,
    soundEnabled, setSoundEnabled,
    completeOnboarding,
  } = useStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm mx-4 rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(18, 20, 28, 0.92)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-white text-lg font-semibold text-center">Your Preferences</h2>
          <p className="text-white/40 text-sm text-center mt-1">
            Set up your experience in seconds
          </p>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Motion Profile */}
          <div>
            <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-2.5">Motion Profile</p>
            <div className="flex gap-2">
              <TogglePill
                label="Cinematic"
                icon="🎬"
                active={motionPreference === 'cinematic'}
                onClick={() => setMotionPreference('cinematic')}
              />
              <TogglePill
                label="Low Motion"
                icon="⚡"
                active={motionPreference === 'low'}
                onClick={() => setMotionPreference('low')}
              />
            </div>
          </div>

          {/* Input Device */}
          <div>
            <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-2.5">Input Device</p>
            <div className="flex gap-2">
              <TogglePill
                label="Mouse / Trackpad"
                icon="🖱️"
                active={inputDevice === 'mouse'}
                onClick={() => setInputDevice('mouse')}
              />
              <TogglePill
                label="Keyboard / SR"
                icon="⌨️"
                active={inputDevice === 'keyboard'}
                onClick={() => setInputDevice('keyboard')}
              />
            </div>
          </div>

          {/* Sound */}
          <div>
            <p className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-2.5">Sound</p>
            <div className="flex gap-2">
              <TogglePill
                label="On"
                icon="🔊"
                active={soundEnabled}
                onClick={() => setSoundEnabled(true)}
              />
              <TogglePill
                label="Mute"
                icon="🔇"
                active={!soundEnabled}
                onClick={() => setSoundEnabled(false)}
              />
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={completeOnboarding}
            className="w-full py-3 rounded-xl text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #e8d08a 0%, #c9a84c 50%, #b8932e 100%)',
            }}
          >
            Initialize Profile
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
