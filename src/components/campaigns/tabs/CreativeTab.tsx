'use client'
import { Brand, Campaign, CampaignAsset } from '@/types'
import CreativeBuilder from '@/components/creatives/CreativeBuilder'

function buildBrief(campaign: Campaign): string {
  const parts = []
  if (campaign.angle) parts.push(`Angle: ${campaign.angle}`)
  if (campaign.offer) parts.push(`Offer/product: ${campaign.offer}`)
  if (campaign.key_message) parts.push(`Key message: ${campaign.key_message}`)
  if (campaign.goal) parts.push(`Goal: ${campaign.goal}`)
  if (campaign.audience_notes) parts.push(`Audience: ${campaign.audience_notes}`)
  return parts.join('\n')
}

export default function CreativeTab({
  brand,
  brands,
  campaign,
  assets,
}: {
  brand: Brand
  brands: Brand[]
  campaign: Campaign
  assets: CampaignAsset[]
}) {
  return (
    <div>
      <CreativeBuilder
        brands={brands}
        defaultBrandId={brand.id}
        campaignId={campaign.id}
        campaignBrief={buildBrief(campaign)}
      />

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
