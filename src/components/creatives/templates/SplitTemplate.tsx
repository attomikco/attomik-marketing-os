import { TemplateProps, ff } from './types'

export default function SplitTemplate({
  imageUrl, headline, bodyText, ctaText, brandColor, brandName, width, height,
  showCta, headlineFont, headlineWeight, headlineTransform,
  bodyFont, bodyWeight, bodyTransform, bgColor, headlineSizeMul, bodySizeMul,
  headlineColor, bodyColor, ctaColor, ctaFontColor,
}: TemplateProps) {
  const imgW = width * 0.58
  const panelW = width - imgW
  const pad = Math.max(panelW * 0.12, 32)
  const barW = 4

  return (
    <div style={{ display: 'flex', overflow: 'hidden', width, height, fontFamily: ff(bodyFont) }}>
      {/* Image — left 58% */}
      <div style={{ position: 'relative', width: imgW, height: '100%', flexShrink: 0 }}>
        {imageUrl ? (
          <img src={imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#e0e0e0' }} />
        )}
      </div>

      {/* Brand color bar */}
      <div style={{ width: barW, background: brandColor, flexShrink: 0 }} />

      {/* Text panel — right 42% minus bar */}
      <div style={{
        width: panelW - barW, display: 'flex', flexDirection: 'column' as const,
        justifyContent: 'center', background: bgColor || '#ffffff',
        padding: pad,
      }}>
        {/* Brand label */}
        <div style={{
          fontSize: width * 0.012,
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          color: '#999',
          marginBottom: pad * 0.6,
          fontFamily: ff(headlineFont),
        }}>
          {brandName}
        </div>

        {/* Headline */}
        {headline && (
          <div style={{
            fontSize: width * 0.028 * headlineSizeMul,
            fontWeight: parseInt(headlineWeight) || 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            color: headlineColor || '#000',
            fontFamily: ff(headlineFont),
            textTransform: headlineTransform as any,
            maxWidth: '100%',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {headline}
          </div>
        )}

        {/* Body */}
        {bodyText && (
          <div style={{
            fontSize: width * 0.014 * bodySizeMul,
            fontWeight: parseInt(bodyWeight) || 400,
            lineHeight: 1.6,
            color: bodyColor || '#666',
            fontFamily: ff(bodyFont),
            textTransform: bodyTransform as any,
            marginTop: pad * 0.4,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {bodyText}
          </div>
        )}

        {/* CTA — full width of panel */}
        {showCta && (
          <div style={{
            marginTop: pad * 0.7,
            background: ctaColor || brandColor,
            color: ctaFontColor || '#000',
            fontSize: width * 0.015 * bodySizeMul,
            fontWeight: 700,
            padding: `${width * 0.012}px ${width * 0.028}px`,
            borderRadius: 6,
            textAlign: 'center' as const,
            fontFamily: ff(headlineFont),
          }}>
            {ctaText || 'Shop Now'}
          </div>
        )}
      </div>
    </div>
  )
}
