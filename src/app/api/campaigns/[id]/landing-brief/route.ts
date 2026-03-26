import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildBrandSystemPrompt } from '@/lib/anthropic'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*, brand:brands(*)')
    .eq('id', id)
    .single()

  if (!campaign || !campaign.brand) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  const brand = campaign.brand
  const systemPrompt = buildBrandSystemPrompt(brand)

  const audience = campaign.audience_notes || brand.target_audience || 'their target audience'
  const angle = campaign.angle ? `Campaign angle/concept: ${campaign.angle}` : ''

  const userPrompt = `Write a structured landing page brief for ${brand.name}.

CAMPAIGN BRIEF:
- Campaign: ${campaign.name}
${angle}
- Offer/product: ${campaign.offer || 'Not specified'}
- Key message: ${campaign.key_message || 'Not specified'}
- Goal: ${campaign.goal || 'Conversions'}
- Audience: ${audience}

Generate a complete landing page content brief with these exact sections. Use the JSON format below.

Respond ONLY with valid JSON, no other text:
{
  "hero": {
    "headline": "...",
    "subheadline": "...",
    "cta_text": "..."
  },
  "problem": {
    "headline": "...",
    "body": "2-3 sentences describing the pain point"
  },
  "solution": {
    "headline": "...",
    "body": "2-3 sentences on how the product solves it"
  },
  "benefits": [
    { "headline": "...", "body": "1 sentence" },
    { "headline": "...", "body": "1 sentence" },
    { "headline": "...", "body": "1 sentence" }
  ],
  "social_proof": {
    "headline": "...",
    "testimonial": "A realistic customer quote",
    "attribution": "Name, title or descriptor",
    "stat": "A compelling stat with number"
  },
  "faq": [
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." }
  ],
  "final_cta": {
    "headline": "...",
    "body": "1-2 sentences of urgency or reinforcement",
    "cta_text": "..."
  }
}`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2500,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = response.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('')

  const clean = text.replace(/```json|```/g, '').trim()

  try {
    const parsed = JSON.parse(clean)

    // Save to generated_content
    await supabase.from('generated_content').insert({
      campaign_id: id,
      brand_id: brand.id,
      type: 'landing_brief',
      content: JSON.stringify(parsed),
    })

    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })
  }
}
