'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function usePreviewImages(brandId: string) {
  const [productImageUrl, setProductImageUrl] = useState<string | null>(null)
  const [lifestyleImageUrl, setLifestyleImageUrl] = useState<string | null>(null)
  const [allImageUrls, setAllImageUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!brandId) return
    const supabase = createClient()

    const fetchImages = () => {
      supabase.from('brand_images').select('*').eq('brand_id', brandId).order('created_at')
        .then(({ data: images, error }) => {
          if (error) { console.error('[Images] Fetch failed:', error); setLoading(false); return }
          console.log('[Images] Found:', images?.length, 'images')

          const getUrl = (path: string) => {
            const cleanPath = path.replace(/^brand-images\//, '')
            const { data } = supabase.storage.from('brand-images').getPublicUrl(cleanPath)
            return data.publicUrl
          }

          const product = images?.find(i => i.tag === 'product')
          const lifestyle = images?.find(i => i.tag === 'lifestyle' || i.tag === 'background')
          const all = images?.map(i => getUrl(i.storage_path)) || []

          if (product) setProductImageUrl(getUrl(product.storage_path))
          else if (images?.length) setProductImageUrl(getUrl(images[0].storage_path))
          if (lifestyle) setLifestyleImageUrl(getUrl(lifestyle.storage_path))
          else if (product) setLifestyleImageUrl(getUrl(product.storage_path))
          else if (images?.length) setLifestyleImageUrl(getUrl(images[0].storage_path))

          setAllImageUrls(all)
          setLoading(false)
        })
    }

    fetchImages()
    // Retry after 3s for newly uploaded images
    const timer = setTimeout(fetchImages, 3000)
    return () => clearTimeout(timer)
  }, [brandId])

  return { productImageUrl, lifestyleImageUrl, allImageUrls, loading }
}
