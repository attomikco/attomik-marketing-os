'use client'
import { useState } from 'react'

export default function EmailActions({ campaignId, content }: { campaignId: string; content: string }) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  let html = '', subject = ''
  try {
    const parsed = JSON.parse(content)
    html = parsed.html || ''
    subject = parsed.subject || ''
  } catch {}

  async function sendToKlaviyo() {
    setSending(true)
    setError('')
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/email/klaviyo`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setSent(true)
        setTimeout(() => setSent(false), 3000)
      } else {
        setError(data.error || 'Failed')
      }
    } catch {
      setError('Something went wrong')
    }
    setSending(false)
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {error && <span style={{ fontSize: 11, color: '#ef4444' }}>{error}</span>}
      <a
        href={`data:text/html;charset=utf-8,${encodeURIComponent(html)}`}
        download={`${subject || 'email'}.html`}
        style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textDecoration: 'none', padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 999 }}
      >
        ↓ HTML
      </a>
      <button
        onClick={sendToKlaviyo}
        disabled={sending}
        style={{ fontSize: 12, fontWeight: 700, color: '#000', background: sent ? '#00ff97' : '#f0f0f0', padding: '6px 14px', borderRadius: 999, border: 'none', cursor: sending ? 'wait' : 'pointer' }}
      >
        {sent ? '✓ Sent' : sending ? '...' : 'Klaviyo →'}
      </button>
    </div>
  )
}
