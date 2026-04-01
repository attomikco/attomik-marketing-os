// Generates a static HTML email preview from config + brand data.
// No AI calls — this is a deterministic template for the live preview.

export interface EmailConfig {
  blocks: {
    hero: boolean
    products: boolean
    cta: boolean
    testimonials: boolean
    promo: boolean
    experience: boolean
    faq: boolean
    blog: boolean
    referral: boolean
    subscribeBar: boolean
  }
  primaryColor: string
  accentColor: string
  bgColor: string
  headingFont: string
  testimonials: Array<{ quote: string; author: string }>
  faq: Array<{ question: string; answer: string }>
  footerAddress: string
  unsubscribeText: string
}

export const DEFAULT_EMAIL_CONFIG: EmailConfig = {
  blocks: {
    hero: true,
    products: true,
    cta: true,
    testimonials: true,
    promo: true,
    experience: true,
    faq: true,
    blog: false,
    referral: true,
    subscribeBar: true,
  },
  primaryColor: '#000000',
  accentColor: '#00ff97',
  bgColor: '#f5f5f5',
  headingFont: 'Arial, sans-serif',
  testimonials: [
    { quote: 'This completely changed my routine. I can\'t imagine going back to what I was using before.', author: 'Sarah M.' },
    { quote: 'Finally something that actually delivers on its promise. Worth every penny.', author: 'James R.' },
  ],
  faq: [
    { question: 'How does shipping work?', answer: 'We ship orders within 1-2 business days. Free shipping on orders over $50.' },
    { question: 'What\'s your return policy?', answer: 'Full refund within 30 days if you\'re not completely satisfied. No questions asked.' },
    { question: 'How is this different?', answer: 'We use premium ingredients and our proprietary process to deliver results you can actually feel.' },
  ],
  footerAddress: '',
  unsubscribeText: 'Unsubscribe',
}

interface BrandPreviewData {
  name: string
  website: string
  logoUrl: string
  products: Array<{ name: string; price: string; image: string }>
  lifestyleImages?: string[]
}

export function buildPreviewHtml(config: EmailConfig, brand: BrandPreviewData): string {
  const { primaryColor, accentColor, bgColor, headingFont } = config
  const textOnPrimary = isLight(primaryColor) ? '#000' : '#fff'
  const blocks: string[] = []

  const lifestyleImgs = brand.lifestyleImages || []
  const products = brand.products.length > 0
    ? brand.products
    : [{ name: 'Product One', price: '$29', image: '' }, { name: 'Product Two', price: '$34', image: '' }, { name: 'Product Three', price: '$24', image: '' }]

  // Top banner
  blocks.push(`
    <tr><td style="background:${primaryColor};padding:10px 20px;text-align:center;font-size:12px;font-weight:600;color:${textOnPrimary};letter-spacing:0.06em;text-transform:uppercase">
      Free Shipping On Orders Over $50
    </td></tr>`)

  // Hero
  if (config.blocks.hero) {
    const heroBg = lifestyleImgs[0]
      ? `background:linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url(${lifestyleImgs[0]});background-size:cover;background-position:center`
      : `background:${primaryColor}`
    const heroTextColor = lifestyleImgs[0] ? '#fff' : textOnPrimary
    blocks.push(`
      <tr><td style="${heroBg};padding:48px 32px;text-align:center">
        ${brand.logoUrl ? `<img src="${brand.logoUrl}" alt="${brand.name}" style="height:28px;margin-bottom:20px;display:inline-block" />` : `<div style="font-family:${headingFont};font-size:20px;font-weight:900;color:${heroTextColor};margin-bottom:20px">${brand.name}</div>`}
        <div style="font-family:${headingFont};font-size:32px;font-weight:900;color:${heroTextColor};line-height:1.1;margin-bottom:12px">Your Campaign<br>Headline Here</div>
        <div style="font-size:15px;color:${heroTextColor};opacity:0.8;margin-bottom:24px;max-width:400px;margin-left:auto;margin-right:auto;line-height:1.5">Your hero subheadline goes here. This is where the campaign message will appear.</div>
        <a href="${brand.website}" style="display:inline-block;background:${accentColor};color:${isLight(accentColor) ? '#000' : '#fff'};font-family:${headingFont};font-weight:800;font-size:14px;padding:14px 32px;border-radius:999px;text-decoration:none">Shop Now</a>
      </td></tr>`)
  }

  // Products
  if (config.blocks.products) {
    const productCells = products.slice(0, 3).map(p => `
      <td style="width:33%;padding:8px;text-align:center;vertical-align:top">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:100%;border-radius:8px;margin-bottom:8px" />` : `<div style="width:100%;height:120px;background:#e0e0e0;border-radius:8px;margin-bottom:8px"></div>`}
        <div style="font-family:${headingFont};font-size:13px;font-weight:700;color:#000;margin-bottom:2px">${p.name}</div>
        ${p.price ? `<div style="font-size:12px;color:#888">${p.price}</div>` : ''}
      </td>`).join('')
    blocks.push(`
      <tr><td style="padding:32px">
        <div style="font-family:${headingFont};font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#999;margin-bottom:16px;text-align:center">Featured Products</div>
        <table width="100%" cellpadding="0" cellspacing="0"><tr>${productCells}</tr></table>
      </td></tr>`)
  }

  // CTA Banner
  if (config.blocks.cta) {
    blocks.push(`
      <tr><td style="padding:16px 32px 32px">
        <div style="background:${primaryColor};border-radius:12px;padding:36px;text-align:center">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${textOnPrimary};opacity:0.5;margin-bottom:10px">Limited Time</div>
          <div style="font-family:${headingFont};font-size:24px;font-weight:900;color:${textOnPrimary};margin-bottom:10px">Free Shipping On All Orders</div>
          <div style="font-size:14px;color:${textOnPrimary};opacity:0.7;margin-bottom:24px;max-width:380px;margin-left:auto;margin-right:auto;line-height:1.5">Elevate your routine with ${brand.name}. Order today and enjoy free shipping — no minimum.</div>
          <a href="${brand.website}" style="display:inline-block;background:${accentColor};color:${isLight(accentColor) ? '#000' : '#fff'};font-weight:800;font-size:14px;padding:14px 32px;border-radius:999px;text-decoration:none">Order Now</a>
        </div>
      </td></tr>`)
  }

  // Testimonials
  if (config.blocks.testimonials) {
    const testimonials = config.testimonials.length > 0
      ? config.testimonials
      : [{ quote: 'Add testimonials in the template editor.', author: 'Customer Name' }]
    const testimonialCells = testimonials.slice(0, 2).map(t => `
      <td style="width:50%;padding:8px;vertical-align:top">
        <div style="background:#f9f9f9;border-radius:10px;padding:20px">
          <div style="font-size:18px;color:${primaryColor};margin-bottom:8px">★★★★★</div>
          <div style="font-size:13px;color:#444;line-height:1.6;margin-bottom:10px;font-style:italic">"${t.quote}"</div>
          <div style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.06em">${t.author}</div>
        </div>
      </td>`).join('')
    blocks.push(`
      <tr><td style="padding:32px">
        <div style="font-family:${headingFont};font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#999;margin-bottom:16px;text-align:center">What Customers Say</div>
        <table width="100%" cellpadding="0" cellspacing="0"><tr>${testimonialCells}</tr></table>
      </td></tr>`)
  }

  // Promo
  if (config.blocks.promo) {
    blocks.push(`
      <tr><td style="padding:0 32px 32px">
        <div style="border:2px dashed ${accentColor};border-radius:12px;padding:32px;text-align:center;background:${bgColor}">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;margin-bottom:12px">Your Exclusive Code</div>
          <div style="font-family:${headingFont};font-size:48px;font-weight:900;color:${primaryColor};line-height:1;margin-bottom:4px">20%</div>
          <div style="font-family:${headingFont};font-size:16px;font-weight:700;color:${primaryColor};margin-bottom:16px">Off Your First Order</div>
          <div style="font-family:monospace;font-size:22px;font-weight:900;color:${primaryColor};letter-spacing:0.1em;background:#fff;display:inline-block;padding:10px 28px;border-radius:8px;border:1px solid #eee;margin-bottom:12px">WELCOME20</div>
          <div style="font-size:13px;color:#888">Apply at checkout · Expires in 7 days</div>
        </div>
      </td></tr>`)
  }

  // Experience
  if (config.blocks.experience) {
    const expImg = lifestyleImgs[1] || lifestyleImgs[0]
    blocks.push(`
      <tr><td style="padding:32px">
        ${expImg ? `<img src="${expImg}" alt="Lifestyle" style="width:100%;border-radius:12px;margin-bottom:24px;display:block" />` : `<div style="width:100%;height:240px;background:linear-gradient(135deg,${primaryColor}15,${accentColor}15);border-radius:12px;margin-bottom:24px"></div>`}
        <div style="text-align:center">
          <div style="font-family:${headingFont};font-size:24px;font-weight:900;color:${primaryColor};margin-bottom:14px">The ${brand.name} Experience</div>
          <div style="font-size:15px;color:#666;line-height:1.7;max-width:460px;margin:0 auto">${brand.name} helps you feel your best. Every product is crafted with intention — designed to fit seamlessly into your daily routine and elevate the moments that matter.</div>
        </div>
      </td></tr>`)
  }

  // FAQ
  if (config.blocks.faq) {
    const faqs = config.faq.length > 0
      ? config.faq
      : [{ question: 'Add your FAQs in the template editor.', answer: 'Answers will appear here.' }]
    const faqRows = faqs.slice(0, 4).map(f => `
      <div style="border-bottom:1px solid #eee;padding:14px 0">
        <div style="font-size:14px;font-weight:700;color:#000;margin-bottom:4px">${f.question}</div>
        <div style="font-size:13px;color:#666;line-height:1.5">${f.answer}</div>
      </div>`).join('')
    blocks.push(`
      <tr><td style="padding:32px">
        <div style="font-family:${headingFont};font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#999;margin-bottom:16px;text-align:center">Frequently Asked</div>
        ${faqRows}
      </td></tr>`)
  }

  // Subscribe bar
  if (config.blocks.subscribeBar) {
    blocks.push(`
      <tr><td style="padding:0 32px 32px">
        <div style="background:${bgColor};border-radius:14px;padding:28px;text-align:center;border:1px solid #eee">
          <div style="font-family:${headingFont};font-size:18px;font-weight:900;color:#000;margin-bottom:8px">Stay in the loop</div>
          <div style="font-size:14px;color:#888;margin-bottom:16px;line-height:1.5">Get early access to drops, exclusive offers, and ${brand.name} news.</div>
          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto"><tr>
            <td style="background:#fff;border:1.5px solid #ddd;border-radius:8px 0 0 8px;padding:12px 16px;font-size:13px;color:#bbb;min-width:180px;text-align:left">your@email.com</td>
            <td style="background:${primaryColor};border-radius:0 8px 8px 0;padding:12px 20px;font-size:13px;font-weight:700;color:${textOnPrimary};white-space:nowrap">Subscribe →</td>
          </tr></table>
        </div>
      </td></tr>`)
  }

  // Referral
  if (config.blocks.referral) {
    blocks.push(`
      <tr><td style="padding:0 32px 32px">
        <div style="background:${primaryColor};border-radius:14px;padding:32px;text-align:center">
          <div style="font-family:${headingFont};font-size:20px;font-weight:900;color:${textOnPrimary};margin-bottom:10px">Give $10, Get $10</div>
          <div style="font-size:14px;color:${textOnPrimary};opacity:0.7;margin-bottom:20px;max-width:360px;margin-left:auto;margin-right:auto;line-height:1.5">Share ${brand.name} with a friend. They get $10 off their first order, and you get $10 credit.</div>
          <a href="${brand.website}" style="display:inline-block;background:${accentColor};color:${isLight(accentColor) ? '#000' : '#fff'};font-weight:800;font-size:14px;padding:14px 28px;border-radius:999px;text-decoration:none">Share Your Link</a>
        </div>
      </td></tr>`)
  }

  // Blog
  if (config.blocks.blog) {
    blocks.push(`
      <tr><td style="padding:32px;text-align:center">
        <div style="font-family:${headingFont};font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#999;margin-bottom:16px">From the Journal</div>
        <div style="font-family:${headingFont};font-size:18px;font-weight:800;color:#000;margin-bottom:8px">Your Latest Blog Post Title</div>
        <div style="font-size:13px;color:#666;line-height:1.6;max-width:400px;margin:0 auto 14px">A brief excerpt of the blog post will appear here when the email is generated for a campaign.</div>
        <a href="${brand.website}" style="font-size:13px;font-weight:700;color:${primaryColor};text-decoration:underline">Read more →</a>
      </td></tr>`)
  }

  // Footer
  const footer = `
    <tr><td style="padding:36px 32px;text-align:center;background:${primaryColor}">
      ${brand.logoUrl ? `<img src="${brand.logoUrl}" alt="${brand.name}" style="height:24px;margin-bottom:16px;display:inline-block;opacity:0.6" />` : `<div style="font-family:${headingFont};font-size:16px;font-weight:800;color:${textOnPrimary};opacity:0.6;margin-bottom:16px">${brand.name}</div>`}
      <div style="margin-bottom:16px">
        <a href="${brand.website}" style="font-size:12px;color:${textOnPrimary};opacity:0.4;text-decoration:none;margin:0 8px">Shop</a>
        <a href="${brand.website}" style="font-size:12px;color:${textOnPrimary};opacity:0.4;text-decoration:none;margin:0 8px">About</a>
        <a href="${brand.website}" style="font-size:12px;color:${textOnPrimary};opacity:0.4;text-decoration:none;margin:0 8px">Contact</a>
      </div>
      <div style="font-size:11px;color:${textOnPrimary};opacity:0.25;margin-bottom:8px">${config.footerAddress || brand.website}</div>
      <a href="#" style="font-size:11px;color:${textOnPrimary};opacity:0.3;text-decoration:underline">${config.unsubscribeText || 'Unsubscribe'}</a>
    </td></tr>`

  // Build Google Fonts link if not a system font
  const systemFonts = ['arial', 'helvetica', 'verdana', 'georgia', 'times new roman', 'courier new']
  const fontName = headingFont.split(',')[0].trim()
  const needsGoogleFont = fontName && !systemFonts.includes(fontName.toLowerCase())
  const fontLink = needsGoogleFont
    ? `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;600;700;800;900&display=swap" rel="stylesheet">`
    : ''

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${fontLink}</head>
<body style="margin:0;padding:0;background:${bgColor};font-family:Arial,sans-serif">
<center><table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff">
${blocks.join('\n')}
${footer}
</table></center></body></html>`
}

function isLight(hex: string): boolean {
  const c = (hex || '').replace('#', '')
  if (c.length < 6) return false
  return (parseInt(c.slice(0, 2), 16) * 299 + parseInt(c.slice(2, 4), 16) * 587 + parseInt(c.slice(4, 6), 16) * 114) / 1000 > 128
}
