import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*, brand:brands(*)')
    .eq('id', id)
    .single()

  if (!campaign?.brand) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  const notesData = (() => {
    try { return campaign.brand.notes ? JSON.parse(campaign.brand.notes) : {} }
    catch { return {} }
  })()

  const klaviyoKey = notesData?.klaviyo_api_key
  if (!klaviyoKey) {
    return NextResponse.json(
      { error: 'No Klaviyo API key found. Add it in Brand Hub → Integrations.' },
      { status: 400 }
    )
  }

  const { data: emailContent } = await supabase
    .from('generated_content')
    .select('content')
    .eq('campaign_id', id)
    .eq('type', 'email')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!emailContent) {
    return NextResponse.json(
      { error: 'No email generated yet. Generate email first.' },
      { status: 400 }
    )
  }

  const { html, subject } = JSON.parse(emailContent.content)
  const templateName = `${campaign.brand.name} — ${campaign.name}`

  const klaviyoRes = await fetch('https://a.klaviyo.com/api/templates/', {
    method: 'POST',
    headers: {
      'Authorization': `Klaviyo-API-Key ${klaviyoKey}`,
      'Content-Type': 'application/json',
      'revision': '2024-02-15',
    },
    body: JSON.stringify({
      data: {
        type: 'template',
        attributes: {
          name: templateName,
          html: html,
          text: `${subject}\n\nView this email in your browser.`,
        },
      },
    }),
  })

  if (!klaviyoRes.ok) {
    const error = await klaviyoRes.text()
    return NextResponse.json(
      { error: `Klaviyo error: ${error}` },
      { status: klaviyoRes.status }
    )
  }

  const result = await klaviyoRes.json()

  return NextResponse.json({
    success: true,
    templateId: result.data?.id,
    templateName,
    message: `Template "${templateName}" created in Klaviyo successfully.`,
  })
}
