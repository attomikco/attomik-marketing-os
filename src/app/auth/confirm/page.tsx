'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthConfirmPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()

    // Get the code from the URL query params
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          router.push(`/login?error=${encodeURIComponent(error.message)}`)
        } else {
          router.push('/')
        }
      })
    } else {
      // Check hash fragments (implicit flow fallback)
      const hash = window.location.hash
      if (hash) {
        const hashParams = new URLSearchParams(hash.substring(1))
        const errorDesc = hashParams.get('error_description')
        if (errorDesc) {
          router.push(`/login?error=${encodeURIComponent(errorDesc)}`)
          return
        }
      }

      // Listen for auth state change (handles token in hash)
      supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          router.push('/')
        }
      })

      // Timeout fallback
      setTimeout(() => {
        router.push('/login?error=' + encodeURIComponent('Login failed. Please try again.'))
      }, 5000)
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
