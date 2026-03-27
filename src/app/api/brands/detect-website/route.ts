import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ name: null, colors: [], font: null, ogImage: null, logo: null })

    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    let html: string
    try {
      const res = await fetch(normalizedUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
      })
      html = await res.text()
    } catch {
      return NextResponse.json({ name: null, colors: [], font: null, ogImage: null, logo: null })
    } finally {
      clearTimeout(timeout)
    }

    // ── Brand Name ──────────────────────────────────────────────────
    let name: string | null = null
    const ogSiteName = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i)?.[1]
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i)?.[1]
    if (ogSiteName) {
      name = ogSiteName.trim()
    } else {
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]
      if (titleMatch) {
        name = titleMatch
          .replace(/\s*[\|–—\-]\s*(Home|Official Site|Welcome|Shop|Store|Online).*$/i, '')
          .replace(/\s*[\|–—\-]\s*$/, '')
          .trim()
      }
    }

    // ── Colors ──────────────────────────────────────────────────────
    const colorCounts = new Map<string, number>()

    // Extract all style content
    const styleBlocks = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || []
    const inlineStyles = html.match(/style=["']([^"']+)["']/gi) || []
    const allCSS = [...styleBlocks, ...inlineStyles].join(' ')

    // Find hex colors
    const hexMatches = allCSS.match(/#[0-9a-fA-F]{3,8}/g) || []
    for (const raw of hexMatches) {
      let hex = raw.toLowerCase()
      // Expand 3-char to 6-char
      if (hex.length === 4) hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
      if (hex.length !== 7) continue

      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)

      // Skip whites
      if (r > 240 && g > 240 && b > 240) continue
      // Skip blacks
      if (r < 35 && g < 35 && b < 35) continue
      // Skip grays (r≈g≈b within 20)
      if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && Math.abs(r - b) < 20) continue

      colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1)
    }

    // Check CSS custom properties
    const cssVarPatterns = ['--primary', '--color-primary', '--brand-color', '--accent', '--secondary', '--color-accent', '--color-secondary']
    for (const varName of cssVarPatterns) {
      const match = allCSS.match(new RegExp(`${varName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*:\\s*(#[0-9a-fA-F]{3,8})`, 'i'))
      if (match) {
        let hex = match[1].toLowerCase()
        if (hex.length === 4) hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
        if (hex.length === 7) colorCounts.set(hex, (colorCounts.get(hex) || 0) + 100) // boost CSS var colors
      }
    }

    const colors = Array.from(colorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hex]) => hex)

    // ── Font ────────────────────────────────────────────────────────
    let font: string | null = null
    const systemFonts = new Set(['arial', 'helvetica', 'verdana', 'georgia', 'times', 'times new roman', 'courier', 'courier new', 'sans-serif', 'serif', 'monospace', 'system-ui', '-apple-system', 'blinkmacsystemfont', 'segoe ui', 'roboto', 'inherit', 'initial'])

    // Google Fonts link
    const gfLink = html.match(/fonts\.googleapis\.com\/css2?\?family=([^&"']+)/i)?.[1]
    if (gfLink) {
      font = decodeURIComponent(gfLink.split('&')[0]).replace(/\+/g, ' ').split(':')[0]
    }

    // @import Google Fonts
    if (!font) {
      const importMatch = allCSS.match(/@import\s+url\(['"]?[^)]*fonts\.googleapis\.com\/css2?\?family=([^&"')]+)/i)?.[1]
      if (importMatch) font = decodeURIComponent(importMatch.split('&')[0]).replace(/\+/g, ' ').split(':')[0]
    }

    // font-family in CSS
    if (!font) {
      const ffMatches = allCSS.match(/font-family\s*:\s*["']?([^;"'}\n]+)/gi) || []
      for (const m of ffMatches) {
        const families = m.replace(/font-family\s*:\s*/i, '').split(',')
        for (const f of families) {
          const clean = f.trim().replace(/["']/g, '').toLowerCase()
          if (!systemFonts.has(clean) && clean.length > 1) {
            font = f.trim().replace(/["']/g, '')
            break
          }
        }
        if (font) break
      }
    }

    // ── OG Image ────────────────────────────────────────────────────
    const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1]
      || null

    // ── Logo ────────────────────────────────────────────────────────
    let logo: string | null = null
    if (ogImage && /logo/i.test(ogImage)) {
      logo = ogImage
    }
    if (!logo) {
      const logoImg = html.match(/<img[^>]+(?:src|alt)=["'][^"']*logo[^"']*["'][^>]*>/i)
      if (logoImg) {
        const srcMatch = logoImg[0].match(/src=["']([^"']+)["']/i)
        if (srcMatch) {
          logo = srcMatch[1]
          // Resolve relative URLs
          if (logo.startsWith('/')) {
            try {
              const u = new URL(normalizedUrl)
              logo = u.origin + logo
            } catch {}
          }
        }
      }
    }

    // ── Platform detection ────────────────────────────────────────
    const isShopify = /Shopify\.shop|cdn\.shopify\.com|myshopify\.com/i.test(html)
    const platform = isShopify ? 'shopify' : 'other'

    // ── Product detection ──────────────────────────────────────────
    type DetectedProduct = { name: string; description: string | null; price: string | null; image: string | null }
    let products: DetectedProduct[] = []

    // Try Shopify products.json
    if (isShopify) {
      try {
        const baseUrl = normalizedUrl.replace(/\/+$/, '')
        const prodRes = await fetch(`${baseUrl}/products.json?limit=6`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
          signal: AbortSignal.timeout(3000),
        })
        if (prodRes.ok) {
          const prodData = await prodRes.json()
          if (Array.isArray(prodData?.products)) {
            products = prodData.products.slice(0, 6).map((p: any) => ({
              name: p.title || '',
              description: p.body_html ? p.body_html.replace(/<[^>]*>/g, ' ').trim().slice(0, 200) : null,
              price: p.variants?.[0]?.price || null,
              image: p.images?.[0]?.src || null,
            }))
          }
        }
      } catch {}
    }

    // Fallback: JSON-LD Product schema
    if (products.length === 0) {
      const ldJsonBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || []
      for (const block of ldJsonBlocks) {
        try {
          const content = block.replace(/<\/?script[^>]*>/gi, '')
          const parsed = JSON.parse(content)
          const items = Array.isArray(parsed) ? parsed : [parsed]
          for (const item of items) {
            if (item?.['@type'] === 'Product' && item?.name) {
              products.push({
                name: item.name,
                description: typeof item.description === 'string' ? item.description.replace(/<[^>]*>/g, ' ').trim().slice(0, 200) : null,
                price: item.offers?.price?.toString() || item.offers?.lowPrice?.toString() || null,
                image: typeof item.image === 'string' ? item.image : Array.isArray(item.image) ? item.image[0] : null,
              })
            }
            if (products.length >= 4) break
          }
        } catch {}
        if (products.length >= 4) break
      }
    }

    return NextResponse.json({ name, colors, font, ogImage, logo, platform, products })
  } catch {
    return NextResponse.json({ name: null, colors: [], font: null, ogImage: null, logo: null, platform: 'other', products: [] })
  }
}
