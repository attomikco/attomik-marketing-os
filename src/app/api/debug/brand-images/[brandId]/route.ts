import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await params
  const supabase = await createClient()

  const { data: images } = await supabase.from('brand_images').select('*').eq('brand_id', brandId)

  const results = await Promise.all((images || []).map(async img => {
    const { data } = supabase.storage.from('brand-images').getPublicUrl(img.storage_path)
    let status = 0
    try { const res = await fetch(data.publicUrl, { method: 'HEAD' }); status = res.status } catch { status = 0 }
    return { id: img.id, tag: img.tag, file_name: img.file_name, storage_path: img.storage_path, constructed_url: data.publicUrl, http_status: status, loads: status === 200 }
  }))

  return NextResponse.json({
    brand_id: brandId, total: results.length, loading: results.filter(r => r.loads).length, failing: results.filter(r => !r.loads).length, images: results, supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL, bucket: 'brand-images',
  })
}
