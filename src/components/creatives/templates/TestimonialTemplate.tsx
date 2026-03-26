import { TemplateProps, ff, px } from './types'

// ── Easy-to-edit design tokens (all values at 1080px reference) ──────
const IMAGE_RATIO     = 0.45     // top image height
const PANEL_PAD       = 56
const QUOTE_MARK_SIZE = 100      // giant typographic element
const QUOTE_SIZE      = 34       // quote text — big and readable
const NAME_SIZE       = 22
const HANDLE_SIZE     = 17
const STAR_SIZE       = 24
const AVATAR_SIZE     = 48
const CTA_SIZE        = 24
const CTA_PAD_V       = 16
const CTA_PAD_H       = 40
const DIVIDER_GAP     = 24

export default function TestimonialTemplate({
  imageUrl, headline, bodyText, ctaText, brandColor, brandName, width, height,
  showCta, headlineFont, headlineWeight, headlineTransform,
  bodyFont, bodyWeight, bodyTransform, bgColor, headlineSizeMul, bodySizeMul,
  headlineColor, bodyColor, ctaColor, ctaFontColor,
}: TemplateProps) {
  const imgH = Math.round(height * IMAGE_RATIO)
  const pad = px(PANEL_PAD, width)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, overflow: 'hidden', width, height, fontFamily: ff(bodyFont) }}>
      {/* Image — top */}
      <div style={{ position: 'relative', height: imgH, flexShrink: 0 }}>
        {imageUrl ? (
          <img src={imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#e0e0e0' }} />
        )}
      </div>

      {/* White panel — bottom, fills remaining space */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column' as const,
        background: bgColor || '#ffffff', padding: pad,
      }}>
        {/* Giant quotation mark */}
        <div style={{
          fontSize: px(QUOTE_MARK_SIZE, width),
          fontWeight: 800,
          lineHeight: 0.6,
          color: brandColor,
          fontFamily: ff(headlineFont),
          userSelect: 'none' as const,
          marginBottom: px(12, width),
        }}>
          &ldquo;
        </div>

        {/* Quote text — big and readable */}
        {bodyText && (
          <div style={{
            fontSize: px(QUOTE_SIZE, width) * bodySizeMul,
            fontWeight: 600,
            fontStyle: 'italic',
            lineHeight: 1.45,
            color: bodyColor || '#000',
            fontFamily: ff(bodyFont),
            textTransform: bodyTransform as any,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {bodyText}
          </div>
        )}

        {/* Divider */}
        <div style={{
          width: '100%', height: 1,
          background: '#e0e0e0',
          margin: `${px(DIVIDER_GAP, width)}px 0`,
        }} />

        {/* Attribution row — avatar + name + stars inline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: px(14, width) }}>
          {/* Avatar circle */}
          <div style={{
            width: px(AVATAR_SIZE, width), height: px(AVATAR_SIZE, width),
            borderRadius: '50%', background: brandColor, flexShrink: 0,
          }} />

          {/* Name + handle */}
          <div style={{ flex: 1 }}>
            {headline && (
              <div style={{
                fontSize: px(NAME_SIZE, width) * headlineSizeMul,
                fontWeight: parseInt(headlineWeight) || 700,
                color: headlineColor || '#000',
                fontFamily: ff(headlineFont),
                textTransform: headlineTransform as any,
                lineHeight: 1.2,
              }}>
                {headline}
              </div>
            )}
            <div style={{
              fontSize: px(HANDLE_SIZE, width),
              fontWeight: 400, color: '#888',
              fontFamily: ff(bodyFont), marginTop: 2,
            }}>
              Verified buyer
            </div>
          </div>

          {/* Stars — right side */}
          <div style={{ display: 'flex', gap: px(3, width), flexShrink: 0 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width={px(STAR_SIZE, width)} height={px(STAR_SIZE, width)} viewBox="0 0 20 20" fill={brandColor}>
                <path d="M10 1l2.39 4.84L17.82 6.9l-3.91 3.81.92 5.39L10 13.47l-4.83 2.63.92-5.39L2.18 6.9l5.43-.79L10 1z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* CTA */}
        {showCta && (
          <div style={{
            marginTop: px(20, width),
            display: 'inline-block',
            alignSelf: 'flex-start',
            background: ctaColor || brandColor,
            color: ctaFontColor || '#000',
            fontSize: px(CTA_SIZE, width) * bodySizeMul,
            fontWeight: 700,
            padding: `${px(CTA_PAD_V, width)}px ${px(CTA_PAD_H, width)}px`,
            borderRadius: 6,
            fontFamily: ff(headlineFont),
          }}>
            {ctaText || 'Shop Now'}
          </div>
        )}
      </div>
    </div>
  )
}
