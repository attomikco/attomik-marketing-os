import { TemplateProps, positionStyles } from './types'

export default function SplitTemplate({ imageUrl, headline, bodyText, ctaText, brandColor, width, height, textPosition, showCta, headlineColor, bodyColor, headlineFont, bodyFont }: TemplateProps) {
  const pos = positionStyles(textPosition)

  return (
    <div className="flex overflow-hidden" style={{ width, height, fontFamily: bodyFont || 'Barlow, sans-serif', background: '#fff' }}>
      <div className="relative" style={{ width: '60%', height: '100%' }}>
        {imageUrl ? (
          <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[#e0e0e0]" />
        )}
      </div>
      <div className="flex flex-col" style={{ width: '40%', padding: '6%', justifyContent: pos.justifyContent, textAlign: pos.textAlign }}>
        {headline && (
          <div className="font-bold leading-tight mb-[6%]" style={{ fontSize: width * 0.04, color: headlineColor === '#ffffff' ? '#000' : headlineColor, fontFamily: headlineFont || undefined }}>
            {headline}
          </div>
        )}
        {bodyText && (
          <div className="leading-snug mb-[8%]" style={{ fontSize: width * 0.026, color: bodyColor === '#ffffff' ? '#666' : bodyColor }}>
            {bodyText}
          </div>
        )}
        {showCta && (
          <div
            className="inline-block font-bold rounded-[6px]"
            style={{
              background: brandColor, color: '#000', fontSize: width * 0.026,
              padding: `${width * 0.012}px ${width * 0.03}px`,
              alignSelf: pos.alignItems,
            }}
          >
            {ctaText || 'CTA'}
          </div>
        )}
      </div>
    </div>
  )
}
