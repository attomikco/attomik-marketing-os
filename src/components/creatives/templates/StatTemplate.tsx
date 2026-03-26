import { TemplateProps, TEXT_SHADOW, ff } from './types'

export default function StatTemplate({
  imageUrl, headline, bodyText, brandColor, brandName, width, height,
  headlineFont, headlineWeight, headlineTransform,
  bodyFont, bodyWeight, bodyTransform, headlineSizeMul, bodySizeMul,
  headlineColor,
}: TemplateProps) {
  const pad = Math.max(width * 0.04, 32)
  // Use brand color for the big stat number, fall back to accent green
  const statColor = (headlineColor === '#ffffff' || headlineColor === '#fff') ? brandColor : headlineColor

  return (
    <div style={{ position: 'relative', overflow: 'hidden', width, height, fontFamily: ff(bodyFont) }}>
      {/* Full-bleed image */}
      {imageUrl ? (
        <img src={imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: '#e0e0e0' }} />
      )}

      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />

      {/* Centered content */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' as const,
        alignItems: 'center', justifyContent: 'center', padding: pad, textAlign: 'center' as const,
      }}>
        {/* Big stat number */}
        {headline && (
          <div style={{
            fontSize: width * 0.072 * headlineSizeMul,
            fontWeight: parseInt(headlineWeight) || 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: statColor || brandColor,
            textShadow: TEXT_SHADOW,
            fontFamily: ff(headlineFont),
            textTransform: headlineTransform as any,
          }}>
            {headline}
          </div>
        )}

        {/* Stat label */}
        {bodyText && (
          <div style={{
            fontSize: width * 0.017 * bodySizeMul,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            lineHeight: 1.4,
            color: '#fff',
            textShadow: TEXT_SHADOW,
            fontFamily: ff(bodyFont),
            marginTop: width * 0.015,
          }}>
            {bodyText}
          </div>
        )}
      </div>

      {/* Brand name — bottom center */}
      <div style={{
        position: 'absolute', bottom: pad, left: 0, right: 0,
        textAlign: 'center' as const,
        fontSize: width * 0.012,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        color: 'rgba(255,255,255,0.5)',
        fontFamily: ff(headlineFont),
      }}>
        {brandName}
      </div>
    </div>
  )
}
