'use client'
import { useState, useEffect } from 'react'
import { Sparkles, Image, Palette, Type, FileText } from 'lucide-react'
import AttomikLogo from '@/components/ui/AttomikLogo'

interface FunnelReadyModalProps {
  isOpen: boolean
  brandName: string
  onContinue: () => void
}

export default function FunnelReadyModal({ isOpen, brandName, onContinue }: FunnelReadyModalProps) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { if (isOpen) setTimeout(() => setVisible(true), 50); else setVisible(false) }, [isOpen])
  if (!isOpen) return null

  const improvements = [
    { icon: Image, title: 'Add better images', body: 'Upload high-quality product and lifestyle shots for sharper creatives.' },
    { icon: Palette, title: 'Refine your colors', body: 'Confirm your primary, secondary and accent colors are exactly right.' },
    { icon: Type, title: 'Set your fonts', body: 'Pick the exact typeface and case style your brand uses.' },
    { icon: FileText, title: 'Add brand context', body: 'The more voice, tone and product detail you add, the better the copy.' },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease', padding: 16 }}>
      <style>{`@keyframes progressFill { from { width: 15%; } to { width: 85%; } }`}</style>
      <div style={{ background: '#fff', borderRadius: 20, maxWidth: 520, width: '100%', overflow: 'hidden', transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)', transition: 'transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' }}>

        <div style={{ background: '#000', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <AttomikLogo height={20} color="rgba(255,255,255,0.4)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={14} color="#00ff97" />
            <span style={{ color: '#00ff97', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em' }}>FUNNEL READY</span>
          </div>
        </div>

        <div style={{ padding: '28px 28px 12px' }}>
          <div style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 800, fontSize: 22, color: '#000', marginBottom: 8, lineHeight: 1.2 }}>Importing your brand images...</div>
          <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 24 }}>
            We scraped <strong style={{ color: '#000' }}>{brandName}</strong> to build this funnel — but scraped images and colors are just a starting point. <strong style={{ color: '#000' }}>It looks dramatically better</strong> once you add your own images, confirm your colors, and fill in your brand voice.
          </div>

          {/* Image import indicator */}
          <div style={{ background: '#f5f5f5', border: '1px solid #eee', borderRadius: 12, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Image size={16} color="#00ff97" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#000', marginBottom: 4 }}>Importing brand images</div>
              <div style={{ height: 4, background: '#e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '70%', background: '#00ff97', borderRadius: 4, animation: 'progressFill 2s ease forwards' }} />
              </div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Scraping product images from your website...</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {improvements.map(({ icon: Icon, title, body }) => (
              <div key={title} style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={13} color="#00ff97" /></div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#000' }}>{title}</span>
                </div>
                <p style={{ fontSize: 11, color: '#888', lineHeight: 1.5, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 28px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onContinue} style={{ width: '100%', padding: 14, background: '#000', color: '#00ff97', fontFamily: 'Barlow, sans-serif', fontWeight: 800, fontSize: 15, border: 'none', borderRadius: 12, cursor: 'pointer', letterSpacing: '0.02em' }}>
            See my funnel — let&apos;s improve it →
          </button>
          <button onClick={onContinue} style={{ width: '100%', padding: 12, background: 'transparent', color: '#999', fontSize: 13, border: 'none', cursor: 'pointer' }}>
            Looks good for now
          </button>
        </div>
      </div>
    </div>
  )
}
