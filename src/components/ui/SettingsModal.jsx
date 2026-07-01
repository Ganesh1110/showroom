import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../stores/useStore'

function SettingSlider({ label, value, onChange, min, max, step = 0.01 }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/50">{label}</span>
        <span className="text-xs text-white/70 font-mono">{Math.round(value * 100)}%</span>
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
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  )
}

function ToggleGroup({ label, options, value, onChange }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-white/50">{label}</p>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              value === opt.value
                ? 'bg-white/15 text-white border border-white/25'
                : 'bg-white/5 text-white/40 border border-transparent hover:text-white/70'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function SettingsModal() {
  const {
    showSettings, toggleSettings,
    graphicsQuality, setGraphicsQuality,
    audioVolume, setAudioVolume,
    contrastProfile, setContrastProfile,
    motionPreference, setMotionPreference,
    inputDevice, setInputDevice,
    soundEnabled, setSoundEnabled,
  } = useStore()

  return (
    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={toggleSettings}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm mx-4 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(16, 18, 26, 0.94)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/8">
              <h2 className="text-white text-sm font-semibold">Settings</h2>
              <button
                onClick={toggleSettings}
                className="text-white/30 hover:text-white/60 transition-colors p-1"
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-5 max-h-[60vh] overflow-y-auto">
              <ToggleGroup
                label="Graphics Fidelity"
                value={graphicsQuality}
                onChange={setGraphicsQuality}
                options={[
                  { label: 'High', value: 'high' },
                  { label: 'Low ⚡', value: 'low' },
                ]}
              />

              <SettingSlider
                label="Audio Volume"
                value={audioVolume}
                onChange={setAudioVolume}
                min={0}
                max={1}
              />

              <ToggleGroup
                label="Motion Profile"
                value={motionPreference}
                onChange={setMotionPreference}
                options={[
                  { label: 'Cinematic', value: 'cinematic' },
                  { label: 'Low Motion', value: 'low' },
                ]}
              />

              <ToggleGroup
                label="Input Device"
                value={inputDevice}
                onChange={setInputDevice}
                options={[
                  { label: 'Mouse', value: 'mouse' },
                  { label: 'Keyboard', value: 'keyboard' },
                ]}
              />

              <ToggleGroup
                label="Sound"
                value={soundEnabled ? 'on' : 'off'}
                onChange={(v) => setSoundEnabled(v === 'on')}
                options={[
                  { label: 'On', value: 'on' },
                  { label: 'Mute', value: 'off' },
                ]}
              />

              <ToggleGroup
                label="Contrast Profile"
                value={contrastProfile}
                onChange={setContrastProfile}
                options={[
                  { label: 'Normal', value: 'normal' },
                  { label: 'High', value: 'high' },
                ]}
              />
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 pt-2 border-t border-white/8">
              <div className="flex gap-2">
                <button
                  onClick={toggleSettings}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 transition-all"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setGraphicsQuality('high')
                    setAudioVolume(0.4)
                    setContrastProfile('normal')
                    setMotionPreference('cinematic')
                    setInputDevice('mouse')
                    setSoundEnabled(false)
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-white/40 hover:text-white/70 transition-all"
                >
                  Reset Defaults
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
