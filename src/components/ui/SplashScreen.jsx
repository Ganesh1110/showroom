import { useEffect, useRef, useState } from 'react'
import useStore from '../../stores/useStore'

export default function SplashScreen() {
  const { completeSplash } = useStore()
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const orbitRef = useRef(null)

  useEffect(() => {
    const durations = {
      0: 600, 10: 400, 20: 350, 30: 300, 40: 250,
      50: 400, 60: 300, 70: 350, 80: 200, 85: 300,
      90: 200, 95: 400, 100: 0,
    }
    const steps = Object.entries(durations)
    let stepIndex = 0

    const tick = () => {
      if (stepIndex >= steps.length) return
      const [target, delay] = steps[stepIndex]
      setProgress(Number(target))
      stepIndex++
      if (Number(target) < 100) {
        setTimeout(tick, delay)
      } else {
        // 100% reached — amber flash + expand orbit
        setTimeout(() => {
          if (orbitRef.current) {
            orbitRef.current.style.transform = 'scale(2.5)'
            orbitRef.current.style.opacity = '0'
          }
          setTimeout(() => {
            setExiting(true)
            setTimeout(completeSplash, 500)
          }, 400)
        }, 300)
      }
    }

    const timer = setTimeout(tick, 400)
    return () => clearTimeout(timer)
  }, [completeSplash])

  return (
    <div className={`fixed inset-0 z-50 bg-[#09090b] flex flex-col items-center justify-center ${exiting ? 'splash-exiting' : ''}`}>
      {/* Orbit ring */}
      <div
        ref={orbitRef}
        className="absolute w-24 h-24 rounded-full transition-all duration-[400ms] ease-out"
        style={{
          border: '1px solid rgba(255,255,255,0.15)',
          animation: 'splash-orbit-spin 1.2s linear infinite',
          transitionProperty: 'transform, opacity',
        }}
      />

      {/* Percentage counter */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <span
          className="text-5xl sm:text-6xl font-light tabular-nums tracking-tight transition-colors duration-300"
          style={{ color: progress >= 100 ? '#f59e0b' : '#ffffff', fontFamily: 'Inter, sans-serif' }}
        >
          {String(progress).padStart(2, '0')}%
        </span>
        <span className="text-white/30 text-xs tracking-widest uppercase font-medium mt-2">
          Loading Experience
        </span>
      </div>

      {/* Bottom sparkle */}
      <div className="absolute bottom-8 right-8" style={{ animation: 'sparkle-twinkle 2.4s ease-in-out infinite' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.2 10.8L22 12L13.2 13.2L12 22L10.8 13.2L2 12L10.8 10.8L12 2Z"
            fill="rgba(255,255,255,0.3)" />
        </svg>
      </div>
    </div>
  )
}
