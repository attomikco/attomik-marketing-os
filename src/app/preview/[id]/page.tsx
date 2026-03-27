import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PreviewClient from '@/components/campaigns/PreviewClient'

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: campaign }, { data: generatedContent }] = await Promise.all([
    supabase.from('campaigns').select('*, brand:brands(*)').eq('id', id).single(),
    supabase.from('generated_content').select('*').eq('campaign_id', id).order('created_at', { ascending: false }),
  ])

  if (!campaign) notFound()

  const brand = campaign.brand

  const { data: brandImages } = await supabase
    .from('brand_images')
    .select('*')
    .eq('brand_id', brand.id)
    .order('created_at')

  return (
    <PreviewClient
      campaign={campaign}
      brand={brand}
      generatedContent={generatedContent ?? []}
      brandImages={brandImages ?? []}
    />
  )
}
