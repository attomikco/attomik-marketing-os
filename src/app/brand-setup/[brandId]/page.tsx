import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BrandSetupClient from './BrandSetupClient'

export default async function BrandSetupPage({ params }: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await params
  const supabase = await createClient()

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('id', brandId)
    .single()

  if (!brand) notFound()

  const { data: brandImages } = await supabase
    .from('brand_images')
    .select('*')
    .eq('brand_id', brandId)
    .order('created_at')

  return <BrandSetupClient brand={brand} brandImages={brandImages || []} />
}
