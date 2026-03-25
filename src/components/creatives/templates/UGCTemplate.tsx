import { TemplateProps, positionStyles } from './types'

export default function UGCTemplate({ imageUrl, headline, bodyText, ctaText, brandColor, width, height, textPosition, showCta, headlineColor, bodyColor, headlineFont, bodyFont, headlineSizeMul, bodySizeMul, showOverlay, overlayOpacity }: TemplateProps) {
  const pos = positionStyles(textPosition)
  const isBottom = textPosition.startsWith('bottom')

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
        style={{ justifyContent: pos.justifyContent, padding: '5%' }}
      >
        <div style={{ textAlign: pos.textAlign }}>
          {headline && (
            <div
              className="inline-block font-bold leading-tight rounded-[4px]"
              style={{ fontSize: width * 0.035 * headlineSizeMul, color: headlineColor, fontFamily: headlineFont || undefined }}
            >
              {headline}
            </div>
          )}
          {bodyText && (
            <div
              className="inline-block leading-snug rounded-[4px] mt-[1.5%]"
              style={{ fontSize: width * 0.026 * bodySizeMul, color: bodyColor }}
            >
              {bodyText}
            </div>
          )}
        </div>
      </div>
      {showCta && (
        <div className="absolute" style={{ [isBottom ? 'top' : 'bottom']: '5%', right: '5%' }}>
          <div
            className="font-bold rounded-[6px]"
            style={{ background: brandColor, color: '#000', fontSize: width * 0.026 * bodySizeMul, padding: `${width * 0.01}px ${width * 0.025}px` }}
          >
            {ctaText || 'CTA'}
          </div>
        </div>
      )}
    </div>
  )
}
