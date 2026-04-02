import { type BrandImage } from '@/types'

/** Logo images — stored with tag 'other' but file_name starts with 'logo_' */
export function getLogoImages(images: BrandImage[]): BrandImage[] {
  return images.filter(img =>
    img.tag === 'logo' || /^logo_/i.test(img.file_name || '') || /logo/i.test(img.storage_path)
  )
}

/** Shopify product images — stored with tag 'product' but file_name starts with 'shopify_' */
export function getShopifyImages(images: BrandImage[]): BrandImage[] {
  return images.filter(img => /^shopify_/i.test(img.file_name || ''))
}

/** Non-Shopify product images */
export function getProductImages(images: BrandImage[]): BrandImage[] {
  return images.filter(img =>
    img.tag === 'product' && !/^shopify_/i.test(img.file_name || '') && !/^logo_/i.test(img.file_name || '')
  )
}

/** Lifestyle / background images */
export function getLifestyleImages(images: BrandImage[]): BrandImage[] {
  return images.filter(img => img.tag === 'lifestyle' || img.tag === 'background')
}

/** Press images — stored with tag 'other', not currently distinguishable */
export function getPressImages(images: BrandImage[]): BrandImage[] {
  return images.filter(img => img.tag === 'press')
}
