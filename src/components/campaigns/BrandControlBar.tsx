'use client'
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'

interface BrandControlBarProps {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  allImageUrls: string[]
  activeImageIndex: number
  onPrimaryChange: (v: string) => void
  onSecondaryChange: (v: string) => void
  onAccentChange: (v: string) => void
  onFontChange: (v: string) => void
  onImageIndexChange: (i: number) => void
  onSave: () => void
  saving?: boolean
}

export default function BrandControlBar({
  primaryColor, secondaryColor, accentColor,
  fontFamily, allImageUrls, activeImageIndex,
  onPrimaryChange, onSecondaryChange, onAccentChange,
  onFontChange, onImageIndexChange,
  onSave, saving,
}: BrandControlBarProps) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '14px 20px',
      marginBottom: 24,
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      flexWrap: 'wrap',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      {/* Label */}
      <div style={{
        fontSize: 11, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: '#999', flexShrink: 0,
      }}>
        Preview using
      </div>

      <div style={{ width: 1, height: 28, background: '#eee', flexShrink: 0 }} />

      {/* Colors */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#999', fontWeight: 600, marginRight: 4 }}>Colors</span>
        {[
          { label: 'Primary', value: primaryColor, onChange: onPrimaryChange },
          { label: 'Secondary', value: secondaryColor, onChange: onSecondaryChange },
          { label: 'Accent', value: accentColor, onChange: onAccentChange },
        ].map(({ label, value, onChange }) => (
          <input
            key={label}
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            title={label}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: '2px solid #eee', cursor: 'pointer',
              padding: 2, background: 'none',
            }}
          />
        ))}
      </div>

      <div style={{ width: 1, height: 28, background: '#eee', flexShrink: 0 }} />

      {/* Font */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#999', fontWeight: 600 }}>Font</span>
        <input
          value={fontFamily}
          onChange={e => onFontChange(e.target.value)}
          placeholder="Barlow, Montserrat..."
          style={{
            border: '1px solid #eee', borderRadius: 8,
            padding: '5px 10px', fontSize: 12, fontWeight: 600,
            width: 140, outline: 'none',
            fontFamily: fontFamily || 'inherit',
          }}
          onBlur={e => {
            if (!e.target.value) return
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = `https://fonts.googleapis.com/css2?family=${e.target.value.replace(/ /g, '+')}:wght@400;700;800;900&display=swap`
            document.head.appendChild(link)
          }}
        />
      </div>

      {/* Images */}
      {allImageUrls.length > 0 && (
        <>
          <div style={{ width: 1, height: 28, background: '#eee', flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#999', fontWeight: 600 }}>Images</span>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <button
                onClick={() => onImageIndexChange((activeImageIndex - 1 + allImageUrls.length) % allImageUrls.length)}
                style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid #eee', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
              >
                <ChevronLeft size={12} />
              </button>
              <div style={{ display: 'flex', gap: 4 }}>
                {allImageUrls.slice(0, 5).map((url, i) => (
                  <div
                    key={i}
                    onClick={() => onImageIndexChange(i)}
                    style={{
                      width: 32, height: 32, borderRadius: 6,
                      overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                      border: i === activeImageIndex ? '2px solid #000' : '2px solid transparent',
                      transition: 'border-color 0.15s',
                    }}
                  >
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.currentTarget.parentElement!.style.display = 'none' }} />
                  </div>
                ))}
              </div>
              <button
                onClick={() => onImageIndexChange((activeImageIndex + 1) % allImageUrls.length)}
                style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid #eee', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
              >
                <ChevronRight size={12} />
              </button>
              <span style={{ fontSize: 11, color: '#bbb', marginLeft: 2 }}>{allImageUrls.length} images</span>
            </div>
          </div>
        </>
      )}

      <div style={{ flex: 1 }} />

      {/* Save */}
      <button
        onClick={onSave}
        disabled={saving}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#000', color: '#00ff97',
          fontSize: 12, fontWeight: 700,
          padding: '8px 16px', borderRadius: 999,
          border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.7 : 1, flexShrink: 0,
        }}
      >
        <RefreshCw size={12} style={{ animation: saving ? 'spin 1s linear infinite' : 'none' }} />
        {saving ? 'Saving...' : 'Save to brand'}
      </button>
    </div>
  )
}
