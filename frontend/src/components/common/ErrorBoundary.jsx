import { Component } from 'react'
import { FaTriangleExclamation } from 'react-icons/fa6'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[Wanderlust] Render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-accent-500/10 text-4xl text-accent-500">
            <FaTriangleExclamation />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Something went wrong</h1>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
            An unexpected error occurred while rendering this page. Please reload to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary mt-2"
          >
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
