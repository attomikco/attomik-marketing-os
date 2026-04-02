import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: brandId } = await params
  const supabase = await createClient()

  const {
    logoUrl,
    productImageUrls,
    scrapedImages,
  } = await req.json()

  const imageRows: {
    brand_id: string; file_name: string; storage_path: string;
    tag: string; mime_type: string; alt_text?: string | null
  }[] = []

  async function proxyAndUpload(
    url: string,
    path: string,
    bucket: string = 'brand-images'
  ) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'image/*',
        },
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) return null
      const blob = await res.arrayBuffer()
      const contentType = res.headers.get('content-type') || 'image/jpeg'

      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, blob, { contentType, upsert: true })

      if (error) return null

      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      return { publicUrl: data.publicUrl, contentType }
    } catch {
      return null
    }
  }

  const tasks: Promise<void>[] = []

  // Logo — store in brand-assets, update brands.logo_url
  if (logoUrl) {
    tasks.push((async () => {
      const ext = logoUrl.split('.').pop()?.split('?')[0]?.slice(0, 4) || 'png'
      const result = await proxyAndUpload(
        logoUrl,
        `${brandId}/logo_dark.${ext}`,
        'brand-assets'
      )
      if (result) {
        await supabase.from('brands')
          .update({ logo_url: result.publicUrl })
          .eq('id', brandId)
      } else {
        await supabase.from('brands')
          .update({ logo_url: logoUrl })
          .eq('id', brandId)
      }
    })())
  }

  // Product images from detected products (typically Shopify product API)
  ;(productImageUrls || []).forEach((url: string, idx: number) => {
    tasks.push((async () => {
      const ext = url.split('.').pop()?.split('?')[0]?.slice(0, 4) || 'jpg'
      const isShopify = /cdn\.shopify\.com|myshopify/i.test(url)
      const prefix = isShopify ? 'shopify' : 'product'
      const path = `${brandId}/${prefix}_${idx}_${Date.now()}.${ext}`
      const result = await proxyAndUpload(url, path)
      if (result) {
        imageRows.push({
          brand_id: brandId,
          file_name: `${prefix}_${idx}.${ext}`,
          storage_path: path,
          tag: 'product',
          mime_type: result.contentType,
        })
      }
    })())
  })

  // Scraped images — preserve tag and alt_text from detection
  ;(scrapedImages || []).slice(0, 25).forEach(
    (img: { url: string; tag: string; alt?: string | null }, idx: number) => {
      tasks.push((async () => {
        const ext = img.url.split('.').pop()?.split('?')[0]?.slice(0, 4) || 'jpg'
        const prefix = img.tag === 'logo' ? 'logo' : img.tag === 'shopify' ? 'shopify' : img.tag === 'product' ? 'product' : img.tag === 'lifestyle' ? 'lifestyle' : 'scraped'
        const path = `${brandId}/${prefix}_${idx}_${Date.now()}.${ext}`
        const isLogo = img.tag === 'logo'
        const bucket = isLogo ? 'brand-assets' : 'brand-images'
        const result = await proxyAndUpload(img.url, path, bucket)
        if (result && !isLogo) {
          // Non-logo images go to brand_images (logos are handled via brands.logo_url)
          imageRows.push({
            brand_id: brandId,
            file_name: `${prefix}_${idx}.${ext}`,
            storage_path: path,
            tag: img.tag,
            mime_type: result.contentType,
            alt_text: img.alt || null,
          })
        }
      })())
    }
  )

  // Run in batches of 10
  const BATCH_SIZE = 10
  for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
    await Promise.allSettled(tasks.slice(i, i + BATCH_SIZE))
  }

  // Map tags to DB-allowed values (check constraint: product, lifestyle, background, ugc, seasonal, other)
  const ALLOWED_TAGS = new Set(['product', 'lifestyle', 'background', 'ugc', 'seasonal', 'other'])
  const TAG_MAP: Record<string, string> = { shopify: 'product', press: 'other', logo: 'other' }
  for (const row of imageRows) {
    if (!ALLOWED_TAGS.has(row.tag)) {
      row.tag = TAG_MAP[row.tag] || 'other'
    }
  }

  // Batch insert
  if (imageRows.length > 0) {
    const { error: insertErr } = await supabase.from('brand_images').insert(imageRows)
    if (insertErr) {
      console.error('[upload-scraped-images] batch insert failed:', insertErr.message)
      // Fallback: insert one by one to salvage what we can
      for (const row of imageRows) {
        await supabase.from('brand_images').insert(row)
      }
    }
  }

  return NextResponse.json({ success: true, uploaded: imageRows.length })
}
