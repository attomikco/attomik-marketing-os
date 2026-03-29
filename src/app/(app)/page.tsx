import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

function isLightColor(hex: string): boolean {
  const c = (hex || '').replace('#', '')
  if (c.length < 6) return false
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (!brands || brands.length === 0) {
    redirect('/onboarding')
  }

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*, brand:brands(name, primary_color)')
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: allImages } = await supabase
    .from('brand_images')
    .select('brand_id')

  // Group image counts by brand
  const imageCounts: Record<string, number> = {}
  allImages?.forEach(img => {
    imageCounts[img.brand_id] = (imageCounts[img.brand_id] || 0) + 1
  })

  // Find latest campaign per brand
  const latestCampaignByBrand: Record<string, string> = {}
  campaigns?.forEach(c => {
    if (!latestCampaignByBrand[c.brand_id]) {
      latestCampaignByBrand[c.brand_id] = c.id
    }
  })

  function getCompleteness(brand: any) {
    const fields = [
      { key: 'logo_url', label: 'Add your logo', step: 1 },
      { key: 'mission', label: 'Describe what your brand does', step: 1 },
      { key: 'target_audience', label: 'Define your target audience', step: 1 },
      { key: 'products', label: 'Add your hero product', step: 2, check: (v: any) => Array.isArray(v) && v.length > 0 },
      { key: 'brand_voice', label: 'Set your brand voice', step: 1 },
      { key: 'images', label: 'Upload product images', step: 3, check: () => (imageCounts[brand.id] || 0) > 0 },
    ]
    const completed = fields.filter(f => f.check ? f.check(brand[f.key]) : !!brand[f.key])
    const missing = fields.filter(f => !(f.check ? f.check(brand[f.key]) : !!brand[f.key]))
    return { completed: completed.length, total: fields.length, missing }
  }

  return (
    <div className="p-4 md:p-10 max-w-[960px]">
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          fontFamily: 'Barlow, sans-serif', fontWeight: 900, fontSize: 32,
          textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#000', marginBottom: 4,
        }}>
          Your workspace
        </div>
        <div style={{ fontSize: 15, color: '#888' }}>
          Everything you&apos;ve built for your brands.
        </div>
      </div>

      {/* Brand cards */}
      {brands.map((brand: any) => {
        const textColor = isLightColor(brand.primary_color || '#000') ? '#000' : '#fff'
        const mutedColor = isLightColor(brand.primary_color || '#000') ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)'
        const { completed, total, missing } = getCompleteness(brand)
        const pct = Math.round((completed / total) * 100)
        const latestCampaign = latestCampaignByBrand[brand.id]

        return (
          <div key={brand.id} style={{ marginBottom: 32 }}>
            {/* Brand card */}
            <div style={{
              background: brand.primary_color || '#000',
              borderRadius: 20, padding: '28px 32px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20, flexWrap: 'wrap',
              marginBottom: 16,
            }}>
              <div>
                {brand.logo_url && (
                  <img src={brand.logo_url} alt="" style={{ height: 36, marginBottom: 10, maxWidth: 200, objectFit: 'contain' }} />
                )}
                <div style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 900, fontSize: 24, color: textColor }}>
                  {brand.name}
                </div>
                {brand.website && (
                  <div style={{ fontSize: 13, color: mutedColor, marginTop: 4 }}>
                    {brand.website}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href={`/brand-setup/${brand.id}`} style={{
                  background: 'rgba(255,255,255,0.15)', color: textColor,
                  fontSize: 13, fontWeight: 700, padding: '10px 20px',
                  borderRadius: 999, textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  Edit brand →
                </Link>
                {latestCampaign && (
                  <Link href={`/preview/${latestCampaign}`} style={{
                    background: textColor, color: brand.primary_color || '#000',
                    fontSize: 13, fontWeight: 700, padding: '10px 20px',
                    borderRadius: 999, textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    View funnel →
                  </Link>
                )}
              </div>
            </div>

            {/* Completeness bar */}
            <div style={{
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 16, padding: '20px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>
                  Brand completeness: {completed}/{total}
                </span>
                {completed === total && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: 'rgba(0,255,151,0.1)', border: '1px solid rgba(0,255,151,0.3)',
                    borderRadius: 999, padding: '3px 12px',
                    fontSize: 11, fontWeight: 700, color: '#00cc7a',
                  }}>
                    ✦ Brand complete
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div style={{
                width: '100%', height: 6, borderRadius: 3,
                background: '#f0f0f0', marginBottom: missing.length > 0 ? 16 : 0,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${pct}%`, height: '100%', borderRadius: 3,
                  background: completed === total ? '#00ff97' : '#000',
                  transition: 'width 0.3s ease',
                }} />
              </div>

              {/* Missing fields */}
              {missing.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {missing.map((field, i) => (
                    <Link key={i} href={`/brand-setup/${brand.id}?step=${field.step}`} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      fontSize: 13, color: '#888', textDecoration: 'none',
                    }}>
                      <span style={{ color: '#ccc', fontSize: 14 }}>✗</span>
                      <span style={{ borderBottom: '1px dashed #ccc' }}>{field.label} →</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Campaigns section */}
      {campaigns && campaigns.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div style={{
            fontFamily: 'Barlow, sans-serif', fontWeight: 900, fontSize: 22,
            textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#000', marginBottom: 20,
          }}>
            Your campaigns
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {campaigns.map((c: any) => (
              <Link key={c.id} href={`/preview/${c.id}`} style={{
                background: '#fff', border: '1px solid var(--border)',
                borderRadius: 16, padding: '20px 24px',
                textDecoration: 'none', color: 'inherit',
                transition: 'border-color 0.15s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: c.brand?.primary_color || '#e0e0e0',
                  }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#999' }}>
                    {c.brand?.name}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#000', marginBottom: 4 }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#00cc7a', marginTop: 10 }}>
                  View preview →
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ marginTop: 48, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/campaigns/new" style={{
          background: '#000', color: '#00ff97',
          fontFamily: 'Barlow, sans-serif', fontWeight: 800, fontSize: 14,
          padding: '12px 24px', borderRadius: 999,
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          New campaign →
        </Link>
        <Link href="/onboarding" style={{
          background: '#fff', color: '#000',
          fontWeight: 700, fontSize: 14,
          padding: '12px 24px', borderRadius: 999,
          textDecoration: 'none', border: '1px solid #ddd',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          Add another brand →
        </Link>
      </div>
    </div>
  )
}
