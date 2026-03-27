'use client'
import { useEffect, useState } from 'react'

export default function DebugPanel({ campaignId, brandId, adVariations, landingBrief, brand }: { campaignId: string; brandId: string; adVariations: any[]; landingBrief: any; brand: any }) {
  const [imageDebug, setImageDebug] = useState<any>(null)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    fetch(`/api/debug/brand-images/${brandId}`).then(r => r.json()).then(setImageDebug)
  }, [brandId])

  if (!open) return (
    <button onClick={() => setOpen(true)} className="fixed bottom-4 right-4 z-[999] bg-black text-[#00ff97] text-xs font-mono font-bold px-3 py-2 rounded-full border border-[#00ff97]/30">debug</button>
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] bg-black border-t border-white/10 font-mono text-xs text-white/70 max-h-[40vh] overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 sticky top-0 bg-black">
        <span className="text-[#00ff97] font-bold">🛠 Debug Panel — ?debug=1</span>
        <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white">✕ hide</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-x divide-white/10">
        <div className="p-4">
          <div className="text-[#00ff97] font-bold mb-2">IMAGES ({imageDebug?.loading}/{imageDebug?.total} loading)</div>
          {imageDebug?.images?.map((img: any) => (
            <div key={img.id} className="mb-2">
              <div className="flex items-center gap-2">
                <span className={img.loads ? 'text-green-400' : 'text-red-400'}>{img.loads ? '✓' : '✗'}</span>
                <span className="text-white/50">{img.tag}</span>
                <span>{img.file_name?.slice(0, 20)}...</span>
              </div>
              <div className="text-white/30 text-[10px] break-all pl-4">{img.constructed_url?.slice(0, 80)}...</div>
              <div className={`text-[10px] pl-4 ${img.loads ? 'text-green-400/60' : 'text-red-400/60'}`}>HTTP {img.http_status}</div>
            </div>
          ))}
          {!imageDebug && <div className="text-white/30">Loading...</div>}
        </div>
        <div className="p-4">
          <div className="text-[#00ff97] font-bold mb-2">AD COPY ({adVariations?.length || 0} variations)</div>
          {adVariations?.length > 0 ? adVariations.map((v: any, i: number) => (
            <div key={i} className="mb-3">
              <div className="text-white/50 mb-1">Variation {i + 1}</div>
              <div className="text-white/80">{v.headline}</div>
              <div className="text-white/30 text-[10px] mt-1">{v.primary_text?.slice(0, 60)}...</div>
            </div>
          )) : <div className="text-red-400">✗ No variations</div>}
        </div>
        <div className="p-4">
          <div className="text-[#00ff97] font-bold mb-2">BRAND CONTEXT</div>
          <div className="space-y-1 text-[10px]">
            <div>name: <span className="text-white">{brand.name}</span></div>
            <div>primary_color: <span className="text-white ml-1">{brand.primary_color}</span><span className="inline-block w-3 h-3 rounded ml-1" style={{ background: brand.primary_color || '#fff' }} /></div>
            <div>secondary_color: <span className="text-white ml-1">{brand.secondary_color}</span></div>
            <div>font_primary: <span className="text-white ml-1">{brand.font_primary || 'none'}</span></div>
            <div>font_heading.transform: <span className="text-white ml-1">{brand.font_heading?.transform || 'none'}</span></div>
          </div>
          <div className="text-[#00ff97] font-bold mt-4 mb-2">LANDING BRIEF</div>
          {landingBrief ? (
            <div className="space-y-1 text-[10px]">
              <div className="text-green-400">✓ Generated</div>
              <div>hero: <span className="text-white">{landingBrief.hero?.headline?.slice(0, 30)}...</span></div>
              <div>benefits: <span className="text-white">{landingBrief.benefits?.length || 0} items</span></div>
            </div>
          ) : <div className="text-red-400">✗ Not generated</div>}
        </div>
      </div>
    </div>
  )
}
