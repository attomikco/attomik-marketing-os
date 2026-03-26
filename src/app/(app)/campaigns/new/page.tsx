import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import NewCampaignForm from '@/components/campaigns/NewCampaignForm'

export default async function NewCampaignPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>
}) {
  const { brand: brandParam } = await searchParams
  const supabase = await createClient()
  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, primary_color, products, target_audience')
    .eq('status', 'active')
    .order('name')

  return (
    <div className="p-4 md:p-10 max-w-2xl">
      <Link href="/campaigns" className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-6">
        <ArrowLeft size={14} /> All campaigns
      </Link>
      <h1 className="mb-2">New campaign</h1>
      <p className="text-muted mb-8">Create a campaign to tie together creatives, ad copy, and landing page briefs.</p>
      <NewCampaignForm brands={brands ?? []} defaultBrandId={brandParam} />
    </div>
  )
}
