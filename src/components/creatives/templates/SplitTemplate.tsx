import { TemplateProps, ff, px } from './types'

// ── Easy-to-edit design tokens (all values at 1080px reference) ──────
const IMAGE_RATIO     = 0.50     // left side image width
const BAR_W           = 6        // brand color vertical bar
const PANEL_PAD       = 56       // padding inside text panel
const BRAND_SIZE      = 16
const HEADLINE_SIZE   = 76       // big and bold
const BODY_SIZE       = 30
const CTA_SIZE        = 26
const CTA_PAD         = 22
const DIVIDER_W       = 48
const DIVIDER_H       = 3
const GAP_BRAND_HEAD  = 20
const GAP_HEAD_DIV    = 24
const GAP_DIV_BODY    = 20
const GAP_BODY_CTA    = 28

export default function SplitTemplate({
  imageUrl, headline, bodyText, ctaText, brandColor, brandName, width, height,
  showCta, headlineFont, headlineWeight, headlineTransform,
  bodyFont, bodyWeight, bodyTransform, bgColor, headlineSizeMul, bodySizeMul,
  headlineColor, bodyColor, ctaColor, ctaFontColor,
}: TemplateProps) {
  const imgW = Math.round(width * IMAGE_RATIO)
  const bar = px(BAR_W, width)
  const panelW = width - imgW - bar
  const pad = px(PANEL_PAD, width)

  return (
    <div style={{ display: 'flex', overflow: 'hidden', width, height, fontFamily: ff(bodyFont) }}>
      {/* Image — left side */}
      <div style={{ position: 'relative', width: imgW, height: '100%', flexShrink: 0 }}>
        {imageUrl ? (
          <img src={imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#e0e0e0' }} />
        )}
      </div>

      {/* Brand color vertical bar */}
      <div style={{ width: bar, background: brandColor, flexShrink: 0 }} />

      {/* Text panel — centered vertically and horizontally */}
      <div style={{
        width: panelW, display: 'flex', flexDirection: 'column' as const,
        alignItems: 'center', justifyContent: 'center',
        background: bgColor || '#ffffff', padding: pad,
        textAlign: 'center' as const,
      }}>
        {/* Brand name label */}
        <div style={{
          fontSize: px(BRAND_SIZE, width),
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          color: brandColor,
          fontFamily: ff(headlineFont),
        }}>
          {brandName}
        </div>

        {/* Headline */}
        {headline && (
          <div style={{
            fontSize: px(HEADLINE_SIZE, width) * headlineSizeMul,
            fontWeight: parseInt(headlineWeight) || 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: headlineColor || '#000',
            fontFamily: ff(headlineFont),
            textTransform: headlineTransform as any,
            marginTop: px(GAP_BRAND_HEAD, width),
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {headline}
          </div>
        )}

        {/* Divider line */}
        <div style={{
          width: px(DIVIDER_W, width), height: px(DIVIDER_H, width),
          background: brandColor, borderRadius: 2,
          margin: `${px(GAP_HEAD_DIV, width)}px 0 ${px(GAP_DIV_BODY, width)}px`,
        }} />

        {/* Body */}
        {bodyText && (
          <div style={{
            fontSize: px(BODY_SIZE, width) * bodySizeMul,
            fontWeight: parseInt(bodyWeight) || 400,
            lineHeight: 1.55,
            color: bodyColor || '#555',
            fontFamily: ff(bodyFont),
            textTransform: bodyTransform as any,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {bodyText}
          </div>
        )}

        {/* CTA — full width */}
        {showCta && (
          <div style={{
            marginTop: px(GAP_BODY_CTA, width),
            background: ctaColor || brandColor,
            color: ctaFontColor || '#000',
            fontSize: px(CTA_SIZE, width) * bodySizeMul,
            fontWeight: 700,
            padding: `${px(CTA_PAD, width)}px ${px(CTA_PAD * 2, width)}px`,
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
