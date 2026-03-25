import { TemplateProps, positionStyles } from './types'

export default function StatTemplate({ imageUrl, headline, bodyText, ctaText, brandColor, width, height, textPosition, showCta, headlineColor, bodyColor, headlineFont, bodyFont, headlineSizeMul, bodySizeMul }: TemplateProps) {
  const pos = positionStyles(textPosition)

  return (
    <div className="relative overflow-hidden flex flex-col" style={{ width, height, fontFamily: bodyFont || 'Barlow, sans-serif', justifyContent: pos.justifyContent }}>
      {imageUrl ? (
        <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[#e0e0e0]" />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10" style={{ padding: '8%', textAlign: pos.textAlign }}>
        {headline && (
          <div className="font-bold leading-none" style={{ fontSize: width * 0.12 * headlineSizeMul, color: headlineColor === '#ffffff' ? brandColor : headlineColor, fontFamily: headlineFont || undefined }}>
            {headline}
          </div>
        )}
        {bodyText && (
          <div className="leading-snug mt-[3%]" style={{ fontSize: width * 0.035 * bodySizeMul, color: bodyColor, opacity: 0.9 }}>
            {bodyText}
          </div>
        )}
        {showCta && (
          <div
            className="inline-block font-bold rounded-[6px] mt-[5%]"
            style={{ background: brandColor, color: '#000', fontSize: width * 0.028 * bodySizeMul, padding: `${width * 0.012}px ${width * 0.03}px` }}
          >
            {ctaText || 'CTA'}
          </div>
        )}
      </div>
    </div>
  )
}
