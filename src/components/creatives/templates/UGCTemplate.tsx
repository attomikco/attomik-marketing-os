import { TemplateProps, TEXT_SHADOW, ff } from './types'

export default function UGCTemplate({
  imageUrl, headline, bodyText, brandName, width, height,
  headlineFont, headlineWeight, headlineTransform,
  bodyFont, bodyWeight, bodyTransform, headlineSizeMul, bodySizeMul,
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

      {/* Subtle bottom gradient for text readability */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: height * 0.35,
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 100%)',
      }} />

      {/* Brand pill — top left */}
      <div style={{
        position: 'absolute', top: pad, left: pad,
        background: '#fff',
        borderRadius: 20,
        padding: `${width * 0.005}px ${width * 0.012}px`,
        fontSize: width * 0.013,
        fontWeight: 600,
        color: '#000',
        fontFamily: ff(headlineFont),
        boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
      }}>
        {brandName}
      </div>

      {/* Headline — bottom left, organic feel */}
      <div style={{
        position: 'absolute', bottom: pad, left: pad, right: pad,
        maxWidth: '80%',
      }}>
        {headline && (
          <div style={{
            fontSize: width * 0.02 * headlineSizeMul,
            fontWeight: parseInt(headlineWeight) || 700,
            lineHeight: 1.3,
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
            fontSize: width * 0.013 * bodySizeMul,
            fontWeight: parseInt(bodyWeight) || 400,
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.7)',
            textShadow: TEXT_SHADOW,
            fontFamily: ff(bodyFont),
            textTransform: bodyTransform as any,
            marginTop: width * 0.005,
          }}>
            {bodyText}
          </div>
        )}
      </div>
    </div>
  )
}
