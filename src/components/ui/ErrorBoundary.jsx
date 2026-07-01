import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[999] bg-[#09090b] flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <svg className="w-7 h-7 text-amber-400" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-white text-xl font-semibold mb-2">Graphics Engine Snag Encountered</h1>
            <p className="text-white/50 text-sm mb-8 leading-relaxed">
              The 3D showroom layout hit an unexpected failure.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="px-6 py-3 rounded-full text-sm font-semibold text-black transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #e8d08a 0%, #c9a84c 50%, #b8932e 100%)',
              }}
            >
              Reload Viewport
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
