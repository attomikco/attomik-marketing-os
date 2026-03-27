import { TemplateProps, ff, px, autoSize } from './types'

const LABEL_SIZE = 28
const ITEM_SIZE = 26
const ICON_SIZE = 30
const EDGE_PAD = 48
const GAP = 24

export default function ComparisonTemplate({
  headline, brandColor, brandName, width, height,
  headlineFont, headlineWeight, headlineColor,
  bodyFont, bodyWeight, bodyColor, headlineSizeMul, bodySizeMul,
  bgColor, oldWayItems, newWayItems, brandLogoUrl, imageUrl, imagePosition,
}: TemplateProps) {
  const panelW = width / 2
  const p = px(EDGE_PAD, width)
  const gap = px(GAP, width)
  const oldItems = oldWayItems?.slice(0, 3) || []
  const newItems = newWayItems?.slice(0, 3) || []

  return (
    <div style={{ display: 'flex', overflow: 'hidden', width, height, fontFamily: ff(bodyFont) }}>
      {/* Left: The Old Way */}
      <div style={{
        width: panelW, height, background: '#e8e8e8',
        display: 'flex', flexDirection: 'column' as const,
        padding: `${p * 1.5}px ${p}px ${p}px`,
      }}>
        <div style={{
          fontSize: px(LABEL_SIZE, width) * headlineSizeMul, fontWeight: 800,
          letterSpacing: '0.08em', textTransform: 'uppercase' as const,
          color: '#333', fontFamily: ff(headlineFont),
          marginBottom: gap * 1.5,
        }}>
          The Old Way
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', gap: gap * 1.2 }}>
          {(oldItems.length > 0 ? oldItems : ['Artificial ingredients', 'Sugary mixers', 'Next-day regret']).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: px(14, width) }}>
              <span style={{ fontSize: px(ICON_SIZE, width), lineHeight: 1, color: '#cc3333', flexShrink: 0, fontWeight: 700 }}>
                &#x2717;
              </span>
              <span style={{
                fontSize: autoSize(px(ITEM_SIZE, width), item, 40) * bodySizeMul,
                fontWeight: parseInt(bodyWeight) || 400, lineHeight: 1.35, color: '#333',
              }}>
                {item || '\u00A0'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: The Brand Way — image bg with overlay */}
      <div style={{ width: panelW, height, position: 'relative', overflow: 'hidden' }}>
        {/* Image or solid bg */}
        {imageUrl ? (
          <>
            <img crossOrigin="anonymous" src={imageUrl} alt="" style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: `center ${imagePosition || 'center'}`,
            }} />
            <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,0.55)` }} />
          </>
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: bgColor || brandColor || '#000' }} />
        )}

        {/* Text content */}
        <div style={{
          position: 'relative', zIndex: 1, height: '100%',
          display: 'flex', flexDirection: 'column' as const,
          padding: `${p * 1.5}px ${p}px ${p}px`,
        }}>
          <div style={{
            fontSize: px(LABEL_SIZE, width) * headlineSizeMul, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase' as const,
            color: headlineColor || '#fff', fontFamily: ff(headlineFont),
            marginBottom: gap * 1.5,
          }}>
            The {brandName} Way
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', gap: gap * 1.2 }}>
            {(newItems.length > 0 ? newItems : ['All natural', 'Zero sugar', 'Feel great tomorrow']).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: px(14, width) }}>
                <span style={{ fontSize: px(ICON_SIZE, width), lineHeight: 1, color: '#4ade80', flexShrink: 0, fontWeight: 700 }}>
                  &#x2713;
                </span>
                <span style={{
                  fontSize: autoSize(px(ITEM_SIZE, width), item, 40) * bodySizeMul,
                  fontWeight: parseInt(bodyWeight) || 400, lineHeight: 1.35, color: '#fff',
                }}>
                  {item || '\u00A0'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
