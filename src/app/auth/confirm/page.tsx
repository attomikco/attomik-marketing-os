'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthConfirmPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()

    // Check for errors in hash
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const errorDesc = params.get('error_description')
      if (errorDesc) {
        router.push(`/login?error=${encodeURIComponent(errorDesc.replace(/\+/g, ' '))}`)
        return
      }
    }

    // With implicit flow, Supabase client auto-detects tokens in the URL hash
    // and sets the session. We just listen for it.
    function getPostAuthRedirect() {
      const demoCampaignId = sessionStorage.getItem('attomik_demo_campaign_id')
      if (demoCampaignId) {
        sessionStorage.removeItem('attomik_demo_campaign_id')
        sessionStorage.removeItem('attomik_demo_brand_id')
        return `/preview/${demoCampaignId}`
      }
      return '/'
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push(getPostAuthRedirect())
      }
    })

    // Also check if session is already set
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push(getPostAuthRedirect())
      }
    })

    // Timeout fallback
    const timeout = setTimeout(() => {
      router.push('/login?error=' + encodeURIComponent('Login failed. Please try again.'))
    }, 8000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-lg font-bold mb-2">Signing you in...</h2>
        <p className="text-muted text-sm">Please wait.</p>
      </div>
    </div>
  )
}
