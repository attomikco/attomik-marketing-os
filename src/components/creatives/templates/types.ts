export type TextPosition = 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface TemplateProps {
  imageUrl: string | null
  headline: string
  bodyText: string
  ctaText: string
  brandColor: string
  width: number
  height: number
  textPosition: TextPosition
  showCta: boolean
  headlineColor: string
  bodyColor: string
  headlineFont: string
  bodyFont: string
  bgColor: string
  /** Multiplier relative to the template default, e.g. 1 = 100%, 1.5 = 150% */
  headlineSizeMul: number
  bodySizeMul: number
  showOverlay: boolean
  overlayOpacity: number
  /** Text banner: 'none' | 'top' | 'bottom' */
  textBanner: 'none' | 'top' | 'bottom'
  textBannerColor: string
}

/** Banner style for text bar at top or bottom */
export function bannerStyle(banner: 'none' | 'top' | 'bottom', bannerColor: string, height: number): React.CSSProperties | null {
  if (banner === 'none') return null
  return {
    position: 'absolute' as const,
    left: 0, right: 0,
    [banner]: 0,
    height: height * 0.22,
    background: bannerColor,
  }
}

/** CSS alignment helpers derived from TextPosition */
export function positionStyles(pos: TextPosition) {
  const v = pos.startsWith('top') ? 'flex-start' : pos.startsWith('bottom') ? 'flex-end' : 'center'
  const h = pos.endsWith('left') ? 'flex-start' : pos.endsWith('right') ? 'flex-end' : 'center'
  return { justifyContent: v, alignItems: h, textAlign: (h === 'center' ? 'center' : h === 'flex-end' ? 'right' : 'left') as 'left' | 'center' | 'right' }
}
