import { TemplateProps, ff } from './types'

export default function TestimonialTemplate({
  imageUrl, headline, bodyText, ctaText, brandColor, brandName, width, height,
  showCta, headlineFont, headlineWeight, headlineTransform,
  bodyFont, bodyWeight, bodyTransform, bgColor, headlineSizeMul, bodySizeMul,
  headlineColor, bodyColor, ctaColor, ctaFontColor,
}: TemplateProps) {
  const imgH = height * 0.55
  const panelH = height - imgH
  const pad = Math.max(width * 0.05, 32)
  const starSize = width * 0.018

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, overflow: 'hidden', width, height, fontFamily: ff(bodyFont) }}>
      {/* Image — top 55% */}
      <div style={{ position: 'relative', height: imgH, flexShrink: 0 }}>
        {imageUrl ? (
          <img src={imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#e0e0e0' }} />
        )}
      </div>

      {/* White panel — bottom 45% */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column' as const, position: 'relative',
        background: bgColor || '#ffffff', padding: pad, paddingTop: pad * 0.8,
        justifyContent: 'center',
      }}>
        {/* Large quotation mark */}
        <div style={{
          position: 'absolute', top: pad * 0.4, left: pad,
          fontSize: width * 0.06,
          fontWeight: 800,
          lineHeight: 1,
          color: brandColor,
          fontFamily: ff(headlineFont),
          userSelect: 'none' as const,
        }}>
          &ldquo;
        </div>

        {/* Star rating */}
        <div style={{ display: 'flex', gap: starSize * 0.2, marginBottom: pad * 0.3 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width={starSize} height={starSize} viewBox="0 0 20 20" fill={brandColor}>
              <path d="M10 1l2.39 4.84L17.82 6.9l-3.91 3.81.92 5.39L10 13.47l-4.83 2.63.92-5.39L2.18 6.9l5.43-.79L10 1z" />
            </svg>
          ))}
        </div>

        {/* Quote text */}
        {bodyText && (
          <div style={{
            fontSize: width * 0.016 * bodySizeMul,
            fontWeight: 600,
            fontStyle: 'italic',
            lineHeight: 1.5,
            color: bodyColor || '#000',
            fontFamily: ff(bodyFont),
            textTransform: bodyTransform as any,
            maxWidth: '90%',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {bodyText}
          </div>
        )}

        {/* Attribution */}
        {headline && (
          <div style={{ marginTop: pad * 0.35 }}>
            <div style={{
              fontSize: width * 0.014 * headlineSizeMul,
              fontWeight: parseInt(headlineWeight) || 700,
              letterSpacing: '-0.02em',
              color: headlineColor || '#000',
              fontFamily: ff(headlineFont),
              textTransform: headlineTransform as any,
            }}>
              {headline}
            </div>
            <div style={{
              fontSize: width * 0.012,
              fontWeight: 400,
              color: '#999',
              marginTop: 2,
              fontFamily: ff(bodyFont),
            }}>
              Verified buyer
            </div>
          </div>
        )}

        {/* CTA */}
        {showCta && (
          <div style={{
            marginTop: pad * 0.4,
            background: ctaColor || brandColor,
            color: ctaFontColor || '#000',
            fontSize: width * 0.014 * bodySizeMul,
            fontWeight: 700,
            padding: `${width * 0.012}px ${width * 0.028}px`,
            borderRadius: 6,
            textAlign: 'center' as const,
            alignSelf: 'flex-start',
            fontFamily: ff(headlineFont),
          }}>
            {ctaText || 'Shop Now'}
          </div>
        )}
      </div>
    </div>
  )
}
