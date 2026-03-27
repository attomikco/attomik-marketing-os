'use client'
import { useState, useRef, useCallback } from 'react'

interface AdVariation { primary_text: string; headline: string; description: string }
interface LandingBrief {
  hero: { headline: string; subheadline: string; cta_text: string }
  problem: { headline: string; body: string }
  solution: { headline: string; body: string }
  benefits: { headline: string; body: string }[]
  social_proof: { headline: string; testimonial: string; attribution: string; stat: string }
  faq?: { question: string; answer: string }[]
  final_cta: { headline: string; body: string; cta_text: string }
}

export function usePreviewGeneration(campaignId: string) {
  const [adVariations, setAdVariations] = useState<AdVariation[]>([])
  const [landingBrief, setLandingBrief] = useState<LandingBrief | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState<'idle' | 'adcopy' | 'landing' | 'done'>('idle')
  const continueResolverRef = useRef<(() => void) | null>(null)

  function waitForContinue(): Promise<void> {
    return new Promise(resolve => { continueResolverRef.current = resolve })
  }

  function handleContinue() {
    continueResolverRef.current?.()
    continueResolverRef.current = null
  }

  const generate = useCallback(async () => {
    setIsGenerating(true)

    setCurrentStep('adcopy')
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/ad-copy`, { method: 'POST' })
      const data = await res.json()
      if (data?.variations?.length) {
        setAdVariations(data.variations)
        console.log('[Generation] Ad copy OK:', data.variations.length, 'variations')
      } else { console.error('[Generation] Ad copy empty:', data) }
    } catch (e) { console.error('[Generation] Ad copy failed:', e) }

    await waitForContinue()

    setCurrentStep('landing')
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/landing-brief`, { method: 'POST' })
      const data = await res.json()
      if (data?.hero) {
        setLandingBrief(data)
        console.log('[Generation] Landing brief OK')
      } else { console.error('[Generation] Landing brief empty:', data) }
    } catch (e) { console.error('[Generation] Landing brief failed:', e) }

    await waitForContinue()

    setCurrentStep('done')
    setIsGenerating(false)
  }, [campaignId])

  return { adVariations, landingBrief, isGenerating, currentStep, generate, handleContinue }
}
