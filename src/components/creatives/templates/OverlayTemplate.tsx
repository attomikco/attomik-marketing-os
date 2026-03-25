import { TemplateProps, positionStyles } from './types'

export default function OverlayTemplate({ imageUrl, headline, bodyText, ctaText, brandColor, width, height, textPosition, showCta, headlineColor, bodyColor, headlineFont, bodyFont, headlineSizeMul, bodySizeMul, showOverlay, overlayOpacity }: TemplateProps) {
  const pos = positionStyles(textPosition)

  return (
    <div className="relative overflow-hidden" style={{ width, height, fontFamily: bodyFont || 'Barlow, sans-serif' }}>
      {imageUrl ? (
        <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[#e0e0e0]" />
      )}
      {showOverlay && (
        <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlayOpacity})` }} />
      )}
      <div
        className="absolute inset-0 flex flex-col"
        style={{ justifyContent: pos.justifyContent }}
      >
        <div style={{ padding: '6%', textAlign: pos.textAlign }}>
          {headline && (
            <div className="font-bold leading-tight mb-[2%]" style={{ fontSize: width * 0.05 * headlineSizeMul, color: headlineColor, fontFamily: headlineFont || undefined }}>
              {headline}
            </div>
          )}
          {bodyText && (
            <div className="leading-snug mb-[3%]" style={{ fontSize: width * 0.032 * bodySizeMul, color: bodyColor, opacity: 0.85 }}>
              {bodyText}
            </div>
          )}
          {showCta && (
            <div
              className="inline-block font-bold rounded-[6px]"
              style={{ background: brandColor, color: '#000', fontSize: width * 0.03 * bodySizeMul, padding: `${width * 0.015}px ${width * 0.035}px` }}
            >
              {ctaText || 'CTA'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
