import { TemplateProps, positionStyles } from './types'

export default function TestimonialTemplate({ imageUrl, headline, bodyText, ctaText, brandColor, width, height, textPosition, showCta, headlineColor, bodyColor, headlineFont, bodyFont }: TemplateProps) {
  const pos = positionStyles(textPosition)
  const imgHeight = height * 0.5

  return (
    <div className="flex flex-col overflow-hidden" style={{ width, height, fontFamily: bodyFont || 'Barlow, sans-serif', background: '#fff' }}>
      <div className="relative flex-shrink-0" style={{ height: imgHeight }}>
        {imageUrl ? (
          <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[#e0e0e0]" />
        )}
      </div>
      <div className="flex-1 flex flex-col" style={{ padding: '5%', justifyContent: pos.justifyContent, textAlign: pos.textAlign }}>
        {bodyText && (
          <div className="italic leading-snug mb-[3%]" style={{ fontSize: width * 0.036, color: bodyColor === '#ffffff' ? '#000' : bodyColor }}>
            &ldquo;{bodyText}&rdquo;
          </div>
        )}
        {headline && (
          <div className="font-bold leading-tight mb-[2%]" style={{ fontSize: width * 0.028, color: headlineColor === '#ffffff' ? brandColor : headlineColor, fontFamily: headlineFont || undefined }}>
            {headline}
          </div>
        )}
        {showCta && (
          <div className="text-[#999]" style={{ fontSize: width * 0.024 }}>
            {ctaText || 'CTA'}
          </div>
        )}
      </div>
    </div>
  )
}
