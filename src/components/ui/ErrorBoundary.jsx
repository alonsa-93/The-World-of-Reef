import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[Reef World Error]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-reef-bg gap-6 p-8">
          <div className="text-8xl">😅</div>
          <p className="font-hebrew text-kid-xl text-gray-700 text-center" dir="rtl">
            אופס! משהו השתבש
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.history.back() }}
            className="bg-reef-ocean text-white font-hebrew font-bold text-kid-lg px-8 py-4 rounded-full shadow-kid"
          >
            חזרה 🏠
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
