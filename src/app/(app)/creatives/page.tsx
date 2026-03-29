import { createClient } from '@/lib/supabase/server'
import CreativeBuilder from '@/components/creatives/CreativeBuilder'

export default async function CreativesPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; campaign?: string }>
}) {
  const { brand: brandParam, campaign: campaignId } = await searchParams
  const supabase = await createClient()
  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('status', 'active')
    .order('name')

  let campaignBrief = ''
  let preloadedCopy: { headline?: string; primary_text?: string; description?: string } | null = null

  if (campaignId) {
    const { data: content } = await supabase
      .from('generated_content')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('type', 'fb_ad')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (content) {
      try {
        const parsed = JSON.parse(content.content)
        preloadedCopy = parsed.variations?.[0] || parsed
      } catch {}
    }

    const { data: campaign } = await supabase
      .from('campaigns')
      .select('name, key_message, goal')
      .eq('id', campaignId)
      .single()

    campaignBrief = campaign?.key_message || campaign?.name || ''
  }

  return (
    <div className="p-4 md:p-10 max-w-[1600px] overflow-x-hidden">
      <CreativeBuilder
        brands={brands ?? []}
        defaultBrandId={brandParam}
        campaignId={campaignId}
        campaignBrief={campaignBrief}
        preloadedCopy={preloadedCopy}
      />
    </div>
  )
}
