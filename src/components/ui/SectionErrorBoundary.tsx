'use client'
import { Component, ReactNode } from 'react'

interface Props { children: ReactNode; label?: string }
interface State { hasError: boolean; error?: Error }

export default class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error } }
  componentDidCatch(error: Error) { console.error(`[${this.props.label}] Section crashed:`, error) }
  render() {
    if (this.state.hasError) {
      return (
        <div className="border border-dashed border-border rounded-card p-8 text-center my-6">
          <div className="text-muted text-sm font-medium mb-1">{this.props.label || 'Section'} failed to render</div>
          <div className="text-xs text-muted/60 font-mono">{this.state.error?.message}</div>
          <button onClick={() => this.setState({ hasError: false })} className="mt-4 text-xs text-muted border border-border rounded-btn px-3 py-1.5 hover:border-ink transition-colors">Try again</button>
        </div>
      )
    }
    return this.props.children
  }
}
