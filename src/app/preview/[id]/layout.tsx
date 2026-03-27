import AttomikLogo from '@/components/ui/AttomikLogo'

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Attomik Header */}
      <header style={{ background: '#000', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AttomikLogo height={26} color="#ffffff" />
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }} />
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em' }}>
              AI-Powered Funnel Builder
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {['✦ Brand-aware copy', '✦ Multi-platform creatives', '✦ Conversion-optimized pages'].map(label => (
              <span key={label} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{label}</span>
            ))}
          </div>
          <button style={{ background: '#00ff97', color: '#000', fontSize: 12, fontWeight: 700, padding: '8px 18px', borderRadius: 999 }}>
            Get full access →
          </button>
        </div>
      </header>

      <main>{children}</main>

      {/* Attomik Footer */}
      <footer style={{ background: '#000', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 64 }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AttomikLogo height={18} color="#ffffff" />
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
              Built by Attomik — the growth OS for CPG brands.
            </span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>© 2026 Attomik. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
