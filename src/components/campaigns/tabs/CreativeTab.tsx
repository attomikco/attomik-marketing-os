'use client'
import { Brand, CampaignAsset } from '@/types'
import CreativeBuilder from '@/components/creatives/CreativeBuilder'

export default function CreativeTab({
  brand,
  brands,
  campaignId,
  assets,
}: {
  brand: Brand
  brands: Brand[]
  campaignId: string
  assets: CampaignAsset[]
}) {
  return (
    <div>
      <CreativeBuilder brands={brands} defaultBrandId={brand.id} campaignId={campaignId} />

      {/* Saved campaign creatives */}
      {assets.length > 0 && (
        <div className="bg-paper border border-border rounded-card p-5 mt-6">
          <div className="label mb-3">Saved creatives ({assets.length})</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {assets.map(a => (
              <div key={a.id} className="rounded-btn overflow-hidden border border-border">
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaign-assets/${a.storage_path}`}
                  alt={a.file_name}
                  className="w-full aspect-square object-cover"
                />
                <div className="px-2 py-1.5">
                  <div className="text-xs text-muted truncate">{a.file_name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
