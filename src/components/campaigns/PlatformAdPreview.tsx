'use client'
import { useState } from 'react'
import { Brand } from '@/types'

interface Creative {
  imageUrl: string | null
  headline: string
  primaryText: string
  ctaText: string
}

interface PlatformAdPreviewProps {
  brand: Brand
  creative: Creative
  TemplateComponent: React.ComponentType<any>
  templateProps: Record<string, any>
  defaultPlatform?: 'facebook' | 'instagram' | 'story'
}

const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', icon: '📘' },
  { id: 'instagram', label: 'Instagram', icon: '📷' },
  { id: 'story', label: 'Story', icon: '◻' },
] as const

const sysFont = '-apple-system, "Helvetica Neue", Arial, sans-serif'

function FacebookFrame({ brand, creative, TemplateComponent, templateProps }: PlatformAdPreviewProps) {
  const accent = brand.primary_color || '#1877f2'
  return (
    <div style={{ maxWidth: 400, fontFamily: sysFont, background: '#fff', borderRadius: 12, border: '1px solid #ddd', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
          {brand.name?.[0] || 'B'}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#050505' }}>{brand.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#65676b' }}>
            <span>Sponsored</span>
            <span>·</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="#65676b"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13zM7 3.5v5l4.25 2.5.75-1.23-3.5-2.08V3.5H7z"/></svg>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', color: '#65676b', fontSize: 20, letterSpacing: 2 }}>···</div>
      </div>

      {/* Primary text */}
      <div style={{ padding: '0 16px 12px', fontSize: 14, color: '#050505', lineHeight: 1.34 }}>
        {creative.primaryText.length > 125 ? creative.primaryText.slice(0, 125) + '...' : creative.primaryText}
        {creative.primaryText.length > 125 && <span style={{ color: '#65676b' }}>more</span>}
      </div>

      {/* Creative */}
      <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', position: 'relative' }}>
        <div style={{ width: 1080, height: 1080, transform: `scale(${400 / 1080})`, transformOrigin: 'top left' }}>
          <TemplateComponent {...templateProps} width={1080} height={1080} />
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: '#050505', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
          {creative.headline}
        </div>
        <div style={{ borderRadius: 4, padding: '6px 12px', background: '#e4e6eb', color: '#050505', fontWeight: 600, fontSize: 13 }}>
          {creative.ctaText || 'Shop Now'}
        </div>
      </div>

      {/* Reactions */}
      <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex' }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#1877f2', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>👍</span>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#f33e58', border: '2px solid #fff', marginLeft: -4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>❤️</span>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#f7b125', border: '2px solid #fff', marginLeft: -4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>😮</span>
          </div>
          <span style={{ fontSize: 13, color: '#65676b', marginLeft: 4 }}>1.2K</span>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#65676b', fontWeight: 600 }}>Comment</span>
          <span style={{ fontSize: 13, color: '#65676b', fontWeight: 600 }}>Share</span>
        </div>
      </div>
    </div>
  )
}

function InstagramFrame({ brand, creative, TemplateComponent, templateProps }: PlatformAdPreviewProps) {
  const accent = brand.primary_color || '#e4405f'
  return (
    <div style={{ maxWidth: 400, fontFamily: sysFont, background: '#fff' }}>
      {/* Top bar */}
      <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', padding: 2, flexShrink: 0 }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 10 }}>{brand.name?.[0] || 'B'}</span>
          </div>
        </div>
        <span style={{ fontWeight: 600, fontSize: 14, color: '#262626' }}>{brand.name}</span>
        <span style={{ fontSize: 12, color: '#8e8e8e', marginLeft: 4 }}>Sponsored</span>
        <div style={{ marginLeft: 'auto', color: '#262626', fontSize: 18 }}>···</div>
      </div>

      {/* Creative */}
      <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', position: 'relative' }}>
        <div style={{ width: 1080, height: 1080, transform: `scale(${400 / 1080})`, transformOrigin: 'top left' }}>
          <TemplateComponent {...templateProps} width={1080} height={1080} />
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '10px 12px 4px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2" style={{ marginLeft: 'auto' }}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </div>

      {/* Likes */}
      <div style={{ padding: '4px 12px', fontWeight: 600, fontSize: 14, color: '#262626' }}>2,451 likes</div>

      {/* Caption */}
      <div style={{ padding: '0 12px 8px', fontSize: 14, color: '#262626' }}>
        <span style={{ fontWeight: 600 }}>{brand.name}</span>{' '}
        {creative.primaryText.slice(0, 80)}{creative.primaryText.length > 80 && '...'}
      </div>

      {/* CTA strip */}
      <div style={{ margin: '0 12px 12px', padding: 12, borderRadius: 8, background: '#fafafa', border: '1px solid #dbdbdb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#262626', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{creative.headline}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#0095f6' }}>{creative.ctaText || 'Shop Now'}</span>
      </div>
    </div>
  )
}

function StoryFrame({ brand, creative, TemplateComponent, templateProps }: PlatformAdPreviewProps) {
  return (
    <div style={{ maxWidth: 260, marginLeft: 'auto', marginRight: 'auto', aspectRatio: '9/16', position: 'relative', overflow: 'hidden', borderRadius: 16, background: '#000' }}>
      {/* Creative fills frame */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ width: 1080, height: 1920, transform: `scale(${260 / 1080})`, transformOrigin: 'top left' }}>
          <TemplateComponent {...templateProps} width={1080} height={1920} />
        </div>
      </div>

      {/* Top overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 12, zIndex: 10 }}>
        <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.3)', borderRadius: 1, marginBottom: 12 }}>
          <div style={{ width: '33%', height: '100%', background: '#fff', borderRadius: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>
            {brand.name?.[0] || 'B'}
          </div>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{brand.name}</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginLeft: 4 }}>Sponsored</span>
        </div>
      </div>

      {/* Bottom overlay */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, zIndex: 10, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}>
        <div style={{ width: '100%', padding: '12px 0', borderRadius: 9999, background: '#fff', textAlign: 'center', fontWeight: 600, fontSize: 14, color: '#262626', marginBottom: 8 }}>
          ↑ {creative.ctaText || 'Shop Now'}
        </div>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Swipe up</div>
      </div>
    </div>
  )
}

export default function PlatformAdPreview(props: PlatformAdPreviewProps) {
  const [platform, setPlatform] = useState<'facebook' | 'instagram' | 'story'>(props.defaultPlatform || 'facebook')
  const hideSwitch = !!props.defaultPlatform

  return (
    <div>
      {/* Platform switcher — hidden when defaultPlatform is set */}
      {!hideSwitch && (
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
        {PLATFORMS.map(p => (
          <button key={p.id} onClick={() => setPlatform(p.id)}
            className="text-xs font-semibold px-4 py-2 rounded-full border transition-all"
            style={platform === p.id
              ? { background: '#111', color: '#fff', borderColor: '#111' }
              : { borderColor: '#ddd', color: '#888' }}>
            {p.icon} {p.label}
          </button>
        ))}
      </div>
      )}

      {/* Frame */}
      {platform === 'facebook' && <FacebookFrame {...props} />}
      {platform === 'instagram' && <InstagramFrame {...props} />}
      {platform === 'story' && <StoryFrame {...props} />}
    </div>
  )
}
