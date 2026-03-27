'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Brand } from '@/types'
import { createClient } from '@/lib/supabase/client'
import PlatformAdPreview from './PlatformAdPreview'
import OverlayTemplate from '@/components/creatives/templates/OverlayTemplate'

interface AdVariation {
  primary_text: string
  headline: string
  description: string
}

interface LandingBrief {
  hero: { headline: string; subheadline: string; cta_text: string }
  problem: { headline: string; body: string }
  solution: { headline: string; body: string }
  benefits: { headline: string; body: string }[]
  social_proof: { headline: string; testimonial: string; attribution: string; stat: string }
  final_cta: { headline: string; body: string; cta_text: string }
}

interface FunnelPreviewProps {
  adVariation: AdVariation | null
  landingBrief: LandingBrief | null
  brand: Brand
  onDismiss: () => void
}

const skeleton = "animate-pulse bg-cream rounded"
const APP_ACCENT = '#00ff97'

export default function FunnelPreview({ adVariation, landingBrief, brand, onDismiss }: FunnelPreviewProps) {
  const router = useRouter()
  const supabase = createClient()
  const [brandImageUrl, setBrandImageUrl] = useState<string | null>(null)
  const brandAccent = brand.primary_color || '#000'
  const fh = brand.font_heading
  const fontFamily = fh?.family || brand.font_primary?.split('|')[0] || ''

  // Load Google Font
  useEffect(() => {
    if (!fontFamily) return
    const id = 'funnel-preview-font'
    let link = document.getElementById(id) as HTMLLinkElement | null
    if (!link) { link = document.createElement('link'); link.id = id; link.rel = 'stylesheet'; document.head.appendChild(link) }
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400;500;600;700;800;900&display=swap`
  }, [fontFamily])

  // Fetch first brand image
  useEffect(() => {
    supabase.from('brand_images').select('storage_path').eq('brand_id', brand.id).limit(1)
      .then(({ data }) => {
        if (data?.[0]) {
          const url = supabase.storage.from('brand-images').getPublicUrl(data[0].storage_path).data.publicUrl
          setBrandImageUrl(url)
        }
      })
  }, [brand.id])
  const headingStyle: React.CSSProperties = {
    fontFamily: fontFamily ? `${fontFamily}, sans-serif` : undefined,
    textTransform: (fh?.transform || 'none') as any,
    letterSpacing: fh?.letterSpacing === 'wide' ? '0.12em' : fh?.letterSpacing === 'tight' ? '-0.02em' : 'normal',
  }

  // Build template props for the creative preview
  const templateProps = adVariation ? {
    imageUrl: brandImageUrl,
    headline: adVariation.headline,
    bodyText: adVariation.primary_text.slice(0, 100),
    ctaText: landingBrief?.hero?.cta_text || 'Shop Now',
    brandColor: brandAccent,
    brandName: brand.name,
    headlineFont: fontFamily,
    headlineWeight: brand.font_heading?.weight || '800',
    headlineTransform: brand.font_heading?.transform || 'none',
    headlineColor: '#ffffff',
    bodyFont: fontFamily,
    bodyWeight: '400',
    bodyTransform: 'none',
    bodyColor: 'rgba(255,255,255,0.85)',
    bgColor: brandImageUrl ? '#000' : brandAccent,
    headlineSizeMul: 1,
    bodySizeMul: 1,
    showOverlay: !!brandImageUrl,
    overlayOpacity: brandImageUrl ? 0.3 : 0,
    textBanner: 'none' as const,
    textBannerColor: '#000',
    textPosition: 'center' as const,
    showCta: true,
    ctaColor: brand.accent_color || brandAccent,
    ctaFontColor: '#ffffff',
    imagePosition: 'center',
  } : null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top banner — APP CHROME */}
      <div className="bg-ink rounded-card p-6 flex items-center justify-between gap-4" style={{ color: '#fff' }}>
        <div>
          <div className="font-bold text-xl">✦ Your funnel is ready.</div>
          <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Built from your brand in seconds. Now make it yours.
          </div>
        </div>
        <button onClick={onDismiss}
          className="text-sm font-bold px-5 py-2.5 rounded-btn transition-opacity hover:opacity-90 flex-shrink-0"
          style={{ background: APP_ACCENT, color: '#000' }}>
          Edit &amp; customize →
        </button>
      </div>

      {/* Two column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Ad Creative with platform frames */}
        <div>
          <div className="label mb-3">Ad Creative</div>
          {adVariation && templateProps ? (
            <PlatformAdPreview
              brand={brand}
              creative={{
                imageUrl: null,
                headline: adVariation.headline,
                primaryText: adVariation.primary_text,
                ctaText: landingBrief?.hero?.cta_text || 'Shop Now',
              }}
              TemplateComponent={OverlayTemplate}
              templateProps={templateProps}
            />
          ) : (
            <div className="bg-paper border border-border rounded-card p-6 space-y-4">
              <div className={skeleton + ' h-8 w-2/3'} />
              <div className={skeleton + ' h-48 w-full'} />
              <div className={skeleton + ' h-4 w-full'} />
              <div className={skeleton + ' h-4 w-3/4'} />
              <div className={skeleton + ' h-5 w-1/2'} />
              <p className="text-muted text-xs mt-2">Generating ad copy...</p>
            </div>
          )}
        </div>

        {/* Right: Landing Page */}
        <div>
          <div className="label mb-3">Landing Page</div>
          {landingBrief ? (
            <div className="border border-border rounded-card overflow-hidden" style={{ maxHeight: 520, overflowY: 'auto' }}>
              {/* Hero — uses brand colors inside preview */}
              <div className="p-6 bg-ink text-white">
                <div className="text-xl font-black" style={headingStyle}>{landingBrief.hero.headline}</div>
                <div className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.6)' }}>{landingBrief.hero.subheadline}</div>
                <button className="text-sm font-bold mt-4 px-4 py-2 rounded-btn" style={{ background: brandAccent, color: '#000' }}>
                  {landingBrief.hero.cta_text}
                </button>
              </div>
              {/* Benefits strip */}
              {landingBrief.benefits?.length > 0 && (
                <div className="p-4 bg-paper border-b border-border">
                  <div className="flex flex-wrap gap-2">
                    {landingBrief.benefits.slice(0, 3).map((b, i) => (
                      <span key={i} className="rounded-full border border-border px-3 py-1 text-xs font-semibold">{b.headline}</span>
                    ))}
                  </div>
                </div>
              )}
              {/* Social proof */}
              {landingBrief.social_proof && (
                <div className="p-5 bg-cream">
                  <div className="text-2xl font-black">{landingBrief.social_proof.stat}</div>
                  <p className="text-sm italic text-muted mt-2 leading-relaxed">
                    {landingBrief.social_proof.testimonial?.length > 120
                      ? landingBrief.social_proof.testimonial.slice(0, 120) + '...'
                      : landingBrief.social_proof.testimonial}
                  </p>
                  <p className="text-xs text-muted mt-1">{landingBrief.social_proof.attribution}</p>
                </div>
              )}
              {/* Problem / Solution */}
              <div className="p-4 bg-paper">
                {landingBrief.problem && (
                  <div className="mb-3">
                    <div className="font-semibold text-sm" style={headingStyle}>{landingBrief.problem.headline}</div>
                    <div className="text-xs text-muted mt-1">{landingBrief.problem.body}</div>
                  </div>
                )}
                {landingBrief.solution && (
                  <div className="mb-3">
                    <div className="font-semibold text-sm" style={headingStyle}>{landingBrief.solution.headline}</div>
                    <div className="text-xs text-muted mt-1">{landingBrief.solution.body}</div>
                  </div>
                )}
                <p className="text-xs text-muted mt-3">+ 2 more sections</p>
              </div>
              {/* Final CTA — brand colors inside preview */}
              <div className="p-5 bg-ink text-white text-center">
                <div className="font-bold" style={headingStyle}>{landingBrief.final_cta.headline}</div>
                <button className="text-sm font-bold mt-3 px-4 py-2 rounded-btn" style={{ background: brandAccent, color: '#000' }}>
                  {landingBrief.final_cta.cta_text}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-paper border border-border rounded-card p-6 space-y-4">
              <div className={skeleton + ' h-10 w-3/4'} />
              <div className={skeleton + ' h-4 w-full'} />
              <div className={skeleton + ' h-8 w-1/3'} />
              <div className={skeleton + ' h-24 w-full'} />
              <div className={skeleton + ' h-16 w-full'} />
              <div className={skeleton + ' h-4 w-2/3'} />
              <p className="text-muted text-xs mt-2">Generating landing brief...</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA — APP CHROME */}
      <div className="bg-paper border border-border rounded-card p-6 text-center">
        <div className="font-bold text-base mb-1">✦ This entire funnel was built from your brand context.</div>
        <p className="text-muted text-sm mb-4">Add more context, upload images, and refine the copy to make it perfectly on-brand.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={onDismiss}
            className="text-sm font-bold px-5 py-2.5 rounded-btn transition-opacity hover:opacity-90"
            style={{ background: APP_ACCENT, color: '#000' }}>
            Edit campaign brief
          </button>
          <button onClick={() => router.push(`/brands/${brand.id}`)}
            className="text-sm font-bold px-5 py-2.5 rounded-btn border border-border hover:border-ink transition-colors">
            Add brand images
          </button>
        </div>
      </div>
    </div>
  )
}
