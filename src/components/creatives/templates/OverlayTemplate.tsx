import { TemplateProps, TEXT_SHADOW, ff } from './types'

export default function OverlayTemplate({
  imageUrl, headline, bodyText, ctaText, brandColor, brandName, width, height,
  showCta, headlineFont, headlineWeight, headlineTransform,
  bodyFont, bodyWeight, bodyTransform, headlineSizeMul, bodySizeMul,
  ctaColor, ctaFontColor,
}: TemplateProps) {
  const pad = Math.max(width * 0.04, 32)

  return (
    <div style={{ position: 'relative', overflow: 'hidden', width, height, fontFamily: ff(bodyFont) }}>
      {/* Full-bleed image */}
      {imageUrl ? (
        <img src={imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: '#e0e0e0' }} />
      )}

      {/* Bottom gradient — transparent → dark over bottom 45% */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: height * 0.45,
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.72) 100%)',
      }} />

      {/* Brand name — top left */}
      <div style={{
        position: 'absolute', top: pad, left: pad,
        color: '#fff', fontSize: width * 0.018, fontWeight: 600,
        letterSpacing: '0.08em', textTransform: 'uppercase' as const,
        opacity: 0.8, textShadow: TEXT_SHADOW,
        fontFamily: ff(headlineFont),
      }}>
        {brandName}
      </div>

      {/* Text block — bottom left */}
      <div style={{
        position: 'absolute', bottom: pad, left: pad, right: pad,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: pad * 0.5,
      }}>
        <div style={{ maxWidth: '80%', minWidth: 0 }}>
          {headline && (
            <div style={{
              fontSize: width * 0.036 * headlineSizeMul,
              fontWeight: parseInt(headlineWeight) || 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: '#fff',
              textShadow: TEXT_SHADOW,
              fontFamily: ff(headlineFont),
              textTransform: headlineTransform as any,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}>
              {headline}
            </div>
          )}
          {bodyText && (
            <div style={{
              fontSize: width * 0.016 * bodySizeMul,
              fontWeight: parseInt(bodyWeight) || 400,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.7)',
              textShadow: TEXT_SHADOW,
              fontFamily: ff(bodyFont),
              textTransform: bodyTransform as any,
              marginTop: width * 0.008,
            }}>
              {bodyText}
            </div>
          )}
        </div>

        {/* CTA — bottom right */}
        {showCta && (
          <div style={{
            flexShrink: 0,
            background: ctaColor || brandColor,
            color: ctaFontColor || '#000',
            fontSize: width * 0.016 * bodySizeMul,
            fontWeight: 700,
            padding: `${width * 0.012}px ${width * 0.028}px`,
            borderRadius: 6,
            whiteSpace: 'nowrap' as const,
            fontFamily: ff(headlineFont),
          }}>
            {ctaText || 'Shop Now'}
          </div>
        )}
      </div>
    </div>
  )
}
