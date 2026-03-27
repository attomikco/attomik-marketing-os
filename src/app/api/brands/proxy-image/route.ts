import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { url } = await req.json()
  if (!url || !url.startsWith('http')) {
    return new Response('Invalid URL', { status: 400 })
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'image/*' },
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) return new Response('Failed', { status: 502 })

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    if (!contentType.startsWith('image/')) {
      return new Response('Not an image', { status: 400 })
    }

    const buffer = await res.arrayBuffer()
    return new Response(buffer, { headers: { 'Content-Type': contentType } })
  } catch {
    return new Response('Timeout', { status: 504 })
  }
}
