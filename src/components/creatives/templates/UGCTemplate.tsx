import { TemplateProps, ff, px } from './types'

const EDGE_PAD        = 80
const HEADLINE_SIZE   = 96
const BODY_SIZE       = 30
const CTA_SIZE        = 26
const CTA_PAD_V       = 18
const CTA_PAD_H       = 48
const DIVIDER_W       = 48
const DIVIDER_H       = 3
const GAP_HEAD_DIV    = 28
const GAP_DIV_BODY    = 22
const GAP_BODY_CTA    = 36
const BRAND_SIZE      = 16

export default function MinimalTemplate({
  headline, bodyText, ctaText, brandColor, brandName, width, height,
  showCta, headlineFont, headlineWeight, headlineTransform, headlineColor,
  bodyFont, bodyWeight, bodyTransform, bodyColor, headlineSizeMul, bodySizeMul,
  ctaColor, ctaFontColor, bgColor,
}: TemplateProps) {
  const p = px(EDGE_PAD, width)

  return (
    <div style={{ position: 'relative', overflow: 'hidden', width, height, fontFamily: ff(bodyFont), background: bgColor || '#000' }}>
      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' as const,
        alignItems: 'center', justifyContent: 'center', padding: p,
        textAlign: 'center' as const,
      }}>
        {headline && (
          <div style={{
            fontSize: px(HEADLINE_SIZE, width) * headlineSizeMul,
            fontWeight: parseInt(headlineWeight) || 800,
            letterSpacing: '-0.03em', lineHeight: 1.05,
            color: headlineColor, fontFamily: ff(headlineFont),
            textTransform: headlineTransform as any,
            maxWidth: '90%',
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
          }}>
            {headline}
          </div>
        )}

        {headline && bodyText && (
          <div style={{
            width: px(DIVIDER_W, width), height: px(DIVIDER_H, width),
            background: headlineColor, borderRadius: 2,
            margin: `${px(GAP_HEAD_DIV, width)}px auto ${px(GAP_DIV_BODY, width)}px`,
          }} />
        )}

        {bodyText && (
          <div style={{
            fontSize: px(BODY_SIZE, width) * bodySizeMul,
            fontWeight: parseInt(bodyWeight) || 400,
            lineHeight: 1.55, color: bodyColor,
            fontFamily: ff(bodyFont), textTransform: bodyTransform as any,
            maxWidth: '80%',
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
          }}>
            {bodyText}
          </div>
        )}

        {showCta && (
          <div style={{
            marginTop: px(GAP_BODY_CTA, width), display: 'inline-block',
            background: ctaColor || brandColor, color: ctaFontColor || '#000',
            fontSize: px(CTA_SIZE, width) * bodySizeMul, fontWeight: 700,
            padding: `${px(CTA_PAD_V, width)}px ${px(CTA_PAD_H, width)}px`,
            borderRadius: 6, fontFamily: ff(headlineFont),
          }}>
            {ctaText || 'Shop Now'}
          </div>
        )}
      </div>

      {/* Brand watermark */}
      <div style={{
        position: 'absolute', bottom: px(32, width), left: 0, right: 0,
        textAlign: 'center' as const, fontSize: px(BRAND_SIZE, width),
        fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
        color: headlineColor, opacity: 0.3, fontFamily: ff(headlineFont),
      }}>
        {brandName}
      </div>
    </div>
  )
}
