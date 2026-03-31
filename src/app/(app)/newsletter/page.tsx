import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import EmailActions from '@/components/email/EmailActions'

export default async function EmailPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>
}) {
  const { brand: brandParam } = await searchParams
  const supabase = await createClient()

  const { data: brands } = await supabase
    .from('brands').select('id')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const activeBrandId = brandParam || brands?.[0]?.id

  let emails: any[] | null = null
  if (activeBrandId) {
    const { data } = await supabase
      .from('generated_content')
      .select('*, campaign:campaigns(id, name, goal)')
      .eq('brand_id', activeBrandId)
      .eq('type', 'email')
      .order('created_at', { ascending: false })
    emails = data
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Email</div>
          <h1 style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 900, fontSize: 28, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>Campaign emails.</h1>
        </div>
        <Link href="/campaigns/new" style={{ background: '#000', color: '#00ff97', fontFamily: 'Barlow, sans-serif', fontWeight: 800, fontSize: 13, padding: '10px 24px', borderRadius: 999, textDecoration: 'none' }}>+ New campaign email</Link>
      </div>

      {!emails?.length && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>✉</div>
          <div style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 900, fontSize: 22, textTransform: 'uppercase', marginBottom: 8 }}>No emails yet.</div>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>Create a campaign and generate its email from the preview page.</div>
          <Link href="/campaigns/new" style={{ background: '#000', color: '#00ff97', fontFamily: 'Barlow, sans-serif', fontWeight: 800, fontSize: 13, padding: '10px 24px', borderRadius: 999, textDecoration: 'none' }}>Create campaign →</Link>
        </div>
      )}

      {emails && emails.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          {emails.map((e: any, i: number) => {
            let subject = ''
            let hasHtml = false
            try {
              const parsed = JSON.parse(e.content)
              subject = parsed.subject || parsed.emailContent?.subject || ''
              hasHtml = !!parsed.html
            } catch {}

            return (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', gap: 16, borderBottom: i < emails.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.campaign?.name || 'Campaign email'}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', gap: 8, alignItems: 'center' }}>
                    {subject && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>&quot;{subject}&quot;</span>}
                    {subject && <span>·</span>}
                    <span>{new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {e.campaign?.id && (
                    <Link href={`/preview/${e.campaign.id}`} style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textDecoration: 'none', padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 999, background: '#fff' }}>View →</Link>
                  )}
                  {hasHtml && e.campaign?.id && <EmailActions campaignId={e.campaign.id} content={e.content} />}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
