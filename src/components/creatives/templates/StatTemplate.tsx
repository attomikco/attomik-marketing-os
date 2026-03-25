import { TemplateProps, positionStyles, bannerStyle } from './types'

export default function StatTemplate({ imageUrl, headline, bodyText, ctaText, brandColor, width, height, textPosition, showCta, headlineColor, bodyColor, headlineFont, headlineWeight, headlineTransform, bodyFont, bodyWeight, bodyTransform, headlineSizeMul, bodySizeMul, showOverlay, overlayOpacity, textBanner, textBannerColor }: TemplateProps) {
  const pos = positionStyles(textPosition)
  const banner = bannerStyle(textBanner, textBannerColor, height)

  return (
    <div className="relative overflow-hidden flex flex-col" style={{ width, height, fontFamily: bodyFont || 'Barlow, sans-serif', justifyContent: pos.justifyContent }}>
      {imageUrl ? (
        <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[#e0e0e0]" />
      )}
      {showOverlay && (
        <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlayOpacity})` }} />
      )}
      {banner && <div style={banner} />}
      <div className="relative z-10" style={{ padding: '8%', textAlign: pos.textAlign }}>
        {headline && (
          <div className="leading-none" style={{ fontSize: width * 0.12 * headlineSizeMul, color: headlineColor === '#ffffff' ? brandColor : headlineColor, fontFamily: headlineFont || undefined, fontWeight: parseInt(headlineWeight), textTransform: headlineTransform as any }}>
            {headline}
          </div>
        )}
        {bodyText && (
          <div className="leading-snug mt-[3%]" style={{ fontSize: width * 0.035 * bodySizeMul, color: bodyColor, opacity: 0.9, fontWeight: parseInt(bodyWeight), textTransform: bodyTransform as any }}>
            {bodyText}
          </div>
        )}
        {showCta && (
          <div className="inline-block font-bold rounded-[6px] mt-[5%]"
            style={{ background: brandColor, color: '#000', fontSize: width * 0.028 * bodySizeMul, padding: `${width * 0.012}px ${width * 0.03}px` }}>
            {ctaText || 'CTA'}
          </div>
        )}
      </div>
    </div>
  )
}
