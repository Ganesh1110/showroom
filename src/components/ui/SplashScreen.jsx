import { useEffect, useState } from 'react'
import useStore from '../../stores/useStore'
import showroomBg from '../../assets/showroom-bg.png'

export default function SplashScreen() {
  const { completeSplash } = useStore()
  const [phase, setPhase] = useState('in') // 'in' | 'out'

  useEffect(() => {
    // Hold for 3s, then fade out → complete
    const t1 = setTimeout(() => setPhase('out'), 3000)
    const t2 = setTimeout(completeSplash, 3700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [completeSplash])

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        opacity: phase === 'out' ? 0 : 1,
        transition: 'opacity 0.7s ease',
      }}
    >
      {/* Showroom interior bg */}
      <img
        src={showroomBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Center text - exactly matching the video */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{
          opacity: phase === 'in' ? 1 : 0,
          transition: 'opacity 0.4s ease',
          animationDelay: '0.3s',
        }}
      >
        {/* "3D" logo — large serif as in the video */}
        <div
          className="font-serif text-white font-light select-none"
          style={{
            fontSize: 'clamp(64px, 12vw, 100px)',
            letterSpacing: '-0.01em',
            lineHeight: 1,
            animation: 'splash-logo-in 1s cubic-bezier(0.25,1,0.5,1) 0.2s forwards',
            opacity: 0,
          }}
        >
          3D
        </div>

        {/* Tagline — two lines matching the video */}
        <div
          className="mt-5 space-y-1 select-none"
          style={{
            animation: 'splash-tagline-in 0.9s ease 1s forwards',
            opacity: 0,
          }}
        >
          <p
            className="text-white font-serif font-light"
            style={{ fontSize: 'clamp(20px, 3.5vw, 32px)', letterSpacing: '0.01em' }}
          >
            Design. Customize.
          </p>
          <p
            className="text-white font-serif font-light"
            style={{ fontSize: 'clamp(20px, 3.5vw, 32px)', letterSpacing: '0.01em' }}
          >
            Experience Fashion in 3D.
          </p>
        </div>
      </div>

      {/* Bottom right sparkle — same as video */}
      <div
        className="absolute bottom-8 right-8"
        style={{ animation: 'sparkle-twinkle 2.4s ease-in-out infinite' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z"
            fill="rgba(255,255,255,0.65)" />
        </svg>
      </div>
    </div>
  )
}
