'use client'
import { useEffect, useState, useRef } from 'react'
import { colors, font, fontWeight, fontSize, radius, zIndex, shadow, transition, letterSpacing } from '@/lib/design-tokens'

interface BrandControlBarProps {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  allImageUrls: string[]
  productImageUrls?: string[]
  lifestyleImageUrls?: string[]
  logoUrl?: string | null
  logoImageUrls?: string[]
  activeImageIndex: number
  onPrimaryChange: (v: string) => void
  onSecondaryChange: (v: string) => void
  onAccentChange: (v: string) => void
  onFontChange: (v: string) => void
  onImageIndexChange: (i: number) => void
  onAddImages: (files: File[]) => void
  onRemoveImage: (url: string) => void
  onSave: () => void
  saving?: boolean
}

export default function BrandControlBar({
  primaryColor, secondaryColor, accentColor,
  fontFamily, allImageUrls, productImageUrls = [], lifestyleImageUrls = [], logoUrl, logoImageUrls = [], activeImageIndex,
  onPrimaryChange, onSecondaryChange, onAccentChange,
  onFontChange, onImageIndexChange,
  onAddImages, onRemoveImage,
  onSave, saving,
}: BrandControlBarProps) {
  const [activeColorField, setActiveColorField] = useState<'primary' | 'secondary' | 'accent' | null>(null)
  const originalColors = useRef([primaryColor, secondaryColor, accentColor].filter(Boolean))

  const palette = [
    ...originalColors.current,
    primaryColor,
    secondaryColor,
    accentColor,
    colors.ink,
    colors.paper,
    colors.gray200,
    colors.darkCard,
  ].filter((c, i, arr) => c && arr.indexOf(c) === i)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('.color-picker-wrap')) {
        setActiveColorField(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const logoUrlList = [
    ...(logoUrl ? [logoUrl] : []),
    ...logoImageUrls,
  ]
  const logoUrlSet = new Set(logoUrlList)
  const isLogoUrl = (url: string) => {
    if (logoUrlSet.has(url)) return true
    if (/\/logo[._]|_logo[._]|\/logo_dark\.|\/logo_light\.|\/logo\//i.test(url)) return true
    if (/\.svg/i.test(url) && !/product|item|shop/i.test(url)) return true
    // Match if the URL shares the same filename as any known logo
    try {
      const urlFile = new URL(url).pathname.split('/').pop()
      if (urlFile) {
        for (const lu of logoUrlList) {
          try {
            const logoFile = new URL(lu).pathname.split('/').pop()
            if (logoFile && logoFile === urlFile) return true
          } catch {}
        }
      }
    } catch {}
    return false
  }

  const filteredProductUrls = productImageUrls.filter(u => !isLogoUrl(u))
  const filteredLifestyleUrls = lifestyleImageUrls.filter(u => !isLogoUrl(u))

  const imageThumb = (url: string, i: number, keyPrefix: string) => {
    const idx = allImageUrls.indexOf(url)
    return (
      <div key={`${keyPrefix}-${i}`} style={{ position: 'relative', flexShrink: 0 }}>
        <div onClick={() => onImageIndexChange(idx)}
          style={{ width: 88, height: 88, borderRadius: radius.xl, overflow: 'hidden', cursor: 'pointer', border: activeImageIndex === idx ? `3px solid ${colors.ink}` : `2px solid ${colors.gray300}`, transition: `border-color ${transition.base}` }}>
          <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none' }} />
        </div>
        <button onClick={() => onRemoveImage(url)}
          style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: colors.ink, color: colors.paper, border: `2px solid ${colors.paper}`, fontSize: fontSize.sm, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, zIndex: zIndex.thumb }}>×</button>
      </div>
    )
  }

  const addImageBtn = (
    <label style={{ width: 88, height: 88, borderRadius: radius.xl, border: `2px dashed ${colors.gray400}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: colors.gray600, fontSize: fontSize.xs, fontWeight: fontWeight.semibold, gap: 3, flexShrink: 0, transition: `border-color ${transition.normal}` }}>
      <span style={{ fontSize: fontSize['4xl'] }}>+</span>
      Add
      <input type="file" accept="image/*" multiple style={{ display: 'none' }}
        onChange={e => { const files = Array.from(e.target.files || []); if (files.length) onAddImages(files); e.target.value = '' }} />
    </label>
  )

  return (
    <div style={{ marginBottom: 32, borderRadius: 24, overflow: 'hidden', boxShadow: shadow.xl }}>
      {/* Dark header */}
      <div style={{ background: colors.darkBg, padding: '48px 40px 40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: colors.accentAlpha12, border: `1.5px solid ${colors.accentAlpha40}`, borderRadius: radius.pill, padding: '5px 16px', fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.accent, letterSpacing: letterSpacing.caps, textTransform: 'uppercase', marginBottom: 20 }}>
          ✦ Auto-detected from your website
        </div>
        <div style={{ fontFamily: font.heading, fontWeight: fontWeight.heading, fontSize: 'clamp(28px, 4vw, 42px)', color: colors.paper, letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: 12 }}>
          Your brand <span style={{ color: colors.accent }}>toolkit</span>
        </div>
        <div style={{ fontSize: fontSize.lg, color: colors.whiteAlpha45, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
          Update colors, font and images to make the creatives look dramatically better.
        </div>
      </div>

      {/* Content area — light card */}
      <div style={{ background: colors.paper }}>
        {/* Colors + Font row */}
        <div className="pv-bcb-row" style={{
          display: 'flex', gap: 40, alignItems: 'flex-start',
          padding: '32px 40px',
          borderBottom: `1px solid ${colors.gray250}`,
        }}>
          {/* Colors */}
          <div>
            <div style={{ fontSize: fontSize.sm, fontWeight: fontWeight.extrabold, letterSpacing: letterSpacing.widest, textTransform: 'uppercase', color: colors.brandGreen, marginBottom: 16 }}>Colors</div>
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                { label: 'Primary', value: primaryColor, key: 'primary' as const, onChange: onPrimaryChange },
                { label: 'Secondary', value: secondaryColor, key: 'secondary' as const, onChange: onSecondaryChange },
                { label: 'Accent', value: accentColor, key: 'accent' as const, onChange: onAccentChange },
              ].map(({ label, value, key, onChange }) => (
                <div key={label} className="color-picker-wrap" style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 8, position: 'relative',
                }}>
                  <div
                    onClick={() => setActiveColorField(activeColorField === key ? null : key)}
                    style={{
                      width: 56, height: 56, borderRadius: radius['2xl'],
                      background: value,
                      border: activeColorField === key ? `3px solid ${colors.ink}` : `2px solid ${colors.gray300}`,
                      cursor: 'pointer',
                      transition: `border-color ${transition.base}`,
                      boxShadow: activeColorField === key ? `0 0 0 2px ${colors.blackAlpha10}` : shadow.sm,
                    }}
                  />
                  <span style={{ fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: colors.gray700, fontFamily: font.mono, letterSpacing: '0.02em' }}>{/* TODO: tokenize */}
                    {value.toUpperCase()}
                  </span>
                  <span style={{ fontSize: fontSize['2xs'], fontWeight: fontWeight.bold, color: colors.gray500, letterSpacing: letterSpacing.wider, textTransform: 'uppercase' }}>
                    {label}
                  </span>

                  {activeColorField === key && (
                    <div style={{
                      position: 'absolute', top: '100%', left: '50%',
                      transform: 'translateX(-50%)', marginTop: 8,
                      background: colors.paper, border: `1px solid ${colors.border}`,
                      borderRadius: 16, padding: 16, zIndex: zIndex.dropdown,
                      boxShadow: shadow.picker, width: 220,
                    }}>
                      <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: colors.gray600, letterSpacing: letterSpacing.wider, textTransform: 'uppercase', marginBottom: 10 }}>
                        Detected colors
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                        {palette.map(color => {
                          const isOriginal = originalColors.current.includes(color)
                          const isCurrent = color === value
                          return (
                          <div
                            key={color}
                            onClick={() => { onChange(color); setActiveColorField(null) }}
                            title={isOriginal ? `${color} (detected)` : color}
                            style={{
                              width: 36, height: 36, borderRadius: radius.lg,
                              background: color,
                              border: isCurrent ? `3px solid ${colors.ink}` : isOriginal ? `2px solid ${colors.blackAlpha20}` : `1.5px solid ${colors.border}`,
                              cursor: 'pointer', transition: `transform ${transition.fast}`, flexShrink: 0, position: 'relative',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                          />
                          )
                        })}
                      </div>
                      <div style={{ borderTop: `1px solid ${colors.gray250}`, marginBottom: 12 }} />
                      <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: colors.gray600, letterSpacing: letterSpacing.wider, textTransform: 'uppercase', marginBottom: 8 }}>
                        Custom
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input
                          type="color"
                          value={value}
                          onChange={e => onChange(e.target.value)}
                          style={{
                            width: 36, height: 36, borderRadius: radius.md,
                            border: `1.5px solid ${colors.gray300}`, cursor: 'pointer',
                            padding: 2, background: 'none', flexShrink: 0,
                          }}
                        />
                        <input
                          type="text"
                          value={value.toUpperCase()}
                          onChange={e => {
                            const v = e.target.value
                            if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v)
                          }}
                          placeholder="#000000"
                          style={{
                            flex: 1, padding: '7px 10px',
                            border: `1.5px solid ${colors.gray300}`, borderRadius: radius.md,
                            fontSize: fontSize.caption, fontFamily: font.mono,
                            fontWeight: fontWeight.semibold, color: colors.ink, outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Vertical divider */}
          <div style={{ width: 1, alignSelf: 'stretch', background: colors.gray250, flexShrink: 0 }} />

          {/* Font */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: fontSize.sm, fontWeight: fontWeight.extrabold, letterSpacing: letterSpacing.widest, textTransform: 'uppercase', color: colors.brandGreen, marginBottom: 16 }}>Font</div>
            <input
              value={fontFamily}
              onChange={e => onFontChange(e.target.value)}
              placeholder="Barlow, Montserrat..."
              style={{ border: `2px solid ${colors.gray300}`, borderRadius: radius.xl, padding: '13px 16px', fontSize: fontSize.lg, fontWeight: fontWeight.bold, width: '100%', maxWidth: 260, outline: 'none', fontFamily: fontFamily || 'inherit', color: colors.ink, background: colors.gray100 }}
              onFocus={e => { e.target.style.borderColor = colors.ink }}
              onBlur={e => {
                e.target.style.borderColor = colors.gray300
                if (!e.target.value) return
                const link = document.createElement('link')
                link.rel = 'stylesheet'
                link.href = `https://fonts.googleapis.com/css2?family=${e.target.value.replace(/ /g, '+')}:wght@400;700;800;900&display=swap`
                document.head.appendChild(link)
              }}
            />
            {fontFamily && (
              <div style={{ fontSize: fontSize.md, color: colors.gray750, marginTop: 10, fontFamily, fontWeight: fontWeight.semibold }}>The quick brown fox jumps</div>
            )}
          </div>

          {/* Save button */}
          <div style={{ marginLeft: 'auto', flexShrink: 0, alignSelf: 'center' }}>
            <button onClick={onSave} disabled={saving} style={{
              background: colors.ink, color: colors.accent,
              fontFamily: font.heading, fontWeight: fontWeight.extrabold, fontSize: fontSize.base,
              padding: '14px 28px', borderRadius: radius.pill, border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1, whiteSpace: 'nowrap',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)', // TODO: tokenize
              transition: `opacity ${transition.normal}`,
            }}>
              {saving ? 'Saving...' : 'Save to brand →'}
            </button>
          </div>
        </div>

        {/* Logo + Images section */}
        {(logoUrl || allImageUrls.length > 0) && (
          <div style={{ padding: '28px 40px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Logo row */}
            {logoUrl && (
              <div>
                <div style={{ fontSize: fontSize.sm, fontWeight: fontWeight.extrabold, letterSpacing: letterSpacing.widest, textTransform: 'uppercase', color: colors.brandGreen, marginBottom: 12 }}>
                  Logo
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: primaryColor || colors.darkCard, border: `2px solid ${colors.gray300}`,
                  borderRadius: radius['2xl'], padding: 16, width: 96, height: 96,
                }}>
                  <img src={logoUrl} alt="Logo" style={{
                    maxWidth: 64, maxHeight: 64, objectFit: 'contain', display: 'block',
                  }} onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none' }} />
                </div>
              </div>
            )}

            {/* Product images row */}
            {filteredProductUrls.length > 0 && (
              <div>
                <div style={{ fontSize: fontSize.sm, fontWeight: fontWeight.extrabold, letterSpacing: letterSpacing.widest, textTransform: 'uppercase', color: colors.brandGreen, marginBottom: 12 }}>
                  Product ({filteredProductUrls.length})
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {filteredProductUrls.slice(0, 6).map((url, i) => imageThumb(url, i, 'p'))}
                  {addImageBtn}
                </div>
              </div>
            )}

            {/* Lifestyle images row */}
            {filteredLifestyleUrls.length > 0 && (
              <div>
                <div style={{ fontSize: fontSize.sm, fontWeight: fontWeight.extrabold, letterSpacing: letterSpacing.widest, textTransform: 'uppercase', color: colors.brandGreen, marginBottom: 12 }}>
                  Lifestyle ({filteredLifestyleUrls.length})
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {filteredLifestyleUrls.slice(0, 6).map((url, i) => imageThumb(url, i, 'l'))}
                  {addImageBtn}
                </div>
              </div>
            )}

            {/* Fallback — no tagged images, show all */}
            {filteredProductUrls.length === 0 && filteredLifestyleUrls.length === 0 && (
              <div>
                <div style={{ fontSize: fontSize.sm, fontWeight: fontWeight.extrabold, letterSpacing: letterSpacing.widest, textTransform: 'uppercase', color: colors.brandGreen, marginBottom: 12 }}>
                  Images ({allImageUrls.filter(url => !isLogoUrl(url)).length})
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {allImageUrls
                    .filter(url => !isLogoUrl(url))
                    .slice(0, 10)
                    .map((url, i) => imageThumb(url, i, 'a'))}
                  {addImageBtn}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
