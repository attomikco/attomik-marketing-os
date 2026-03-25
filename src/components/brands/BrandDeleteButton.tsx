'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

export default function BrandDeleteButton({ brandId, brandName }: { brandId: string; brandName: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    await supabase.from('brands').delete().eq('id', brandId)
    router.push('/brands')
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted">Delete {brandName}?</span>
        <button onClick={handleDelete} disabled={deleting}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-btn bg-danger text-white hover:opacity-90 transition-opacity disabled:opacity-50">
          {deleting ? <Loader2 size={12} className="animate-spin" /> : null}
          {deleting ? 'Deleting...' : 'Yes, delete'}
        </button>
        <button onClick={() => setConfirming(false)}
          className="text-xs text-muted hover:text-ink transition-colors px-2 py-1.5">
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 text-xs text-muted hover:text-danger transition-colors px-3 py-1.5 rounded-btn border border-border hover:border-danger">
      <Trash2 size={12} />
      Delete
    </button>
  )
}
