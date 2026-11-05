import { COMMUNITIES, DEVELOPERS, RERA_FORMS } from '../swk/uae'

/**
 * Official SWK Properties OS Brand Assets & High-Resolution Media Registry
 * Powered by the official SWK_OS brand package (Emblem, Wordmark, Horizontal, Stacked, Master & Favicons).
 */
export const SWK_BRAND = {
  logoWhite: '/brand/one/Logo/SWK_One_Wordmark_ForDark.png',
  logoInk: '/brand/one/Logo/SWK_One_Wordmark_ForLight.png',
  logoDark: '/brand/one/Logo/SWK_One_Wordmark_ForDark.png',
  logoGold: '/brand/one/Logo/SWK_One_Wordmark_ForDark.png',
  fullLogoDark: '/brand/one/Logo/SWK_One_Horizontal_ForDark.png',
  fullLogoLight: '/brand/one/Logo/SWK_One_Horizontal_ForLight.png',
  mark: '/brand/one/Icon/SWK_One_Crest_ForDark.png',
  markLight: '/brand/one/Icon/SWK_One_Crest_ForLight.png',
  markBlack: '/brand/one/Icon/SWK_One_Crest_ForLight.png',
  signageLogo: '/brand/one/Logo/SWK_One_Stacked_ForDark.png',
  signageIcon: '/brand/one/Icon/SWK_One_Crest_ForDark.png',
  emblemSvg: '/brand/one/Icon/SWK_One_Crest_ForLight.svg',
  emblemDarkSvg: '/brand/one/Icon/SWK_One_Crest_ForDark.svg',
  wordmarkSvg: '/brand/one/Logo/SWK_One_Wordmark_ForLight.svg',
  wordmarkDarkSvg: '/brand/one/Logo/SWK_One_Wordmark_ForDark.svg',
  horizontalLogoSvg: '/brand/one/Logo/SWK_One_Horizontal_ForLight.svg',
  horizontalDarkSvg: '/brand/one/Logo/SWK_One_Horizontal_ForDark.svg',
  stackedLogoSvg: '/brand/one/Logo/SWK_One_Stacked_ForDark.svg',
  stackedLightSvg: '/brand/one/Logo/SWK_One_Stacked_ForLight.svg',
  masterSvg: '/brand/one/Master/SWK_One_Master_Satin_ForDark.svg',
  masterLightSvg: '/brand/one/Master/SWK_One_Master_Satin_ForLight.svg',
  appDarkSvg: '/brand/one/App_Icon/SWK_One_App_Dark.svg',
  appLightSvg: '/brand/one/App_Icon/SWK_One_App_Light.svg',
  skylineFront: '/brand/skyline-front.svg',
  skylineBack: '/brand/skyline-back.svg',
  heroDubai: '/brand/one/Logo/SWK_One_Stacked_ForDark.png',
  appIcon512: '/app-icon-512.png',
  appIcon192: '/app-icon-192.png',
} as const

export const SWK_PROPERTY_PHOTOS = [
  '/media/properties/marina-sky-penthouse-1.webp',
  '/media/properties/hills-estate-golf-mansion-1.webp',
  '/media/properties/palm-garden-homes-1.webp',
  '/media/properties/creek-harbour-waterside-townhouse-1.webp',
  '/media/properties/business-bay-executive-tower-2.webp',
  '/media/properties/arabian-ranches-courtyard-villa-2.webp',
  '/media/properties/villa-sanctuary-6.webp',
  '/media/properties/river-cove-residences-1.webp',
  '/media/properties/jvc-boulevard-residences-2.webp',
  '/media/properties/golf-fields-1.webp',
  '/media/properties/islands-2-1.webp',
  '/media/properties/raw-district-2-3.webp',
] as const

/**
 * Resolves the highest-quality matching SWK property photograph based on title, building, or index.
 */
export function resolvePropertyPhoto(titleOrBuilding?: string | null, fallbackIndex = 0): string {
  const s = (titleOrBuilding || '').toLowerCase()
  if (s.includes('marina')) return '/media/properties/marina-sky-penthouse-1.webp'
  if (s.includes('hills') || s.includes('golf')) return '/media/properties/hills-estate-golf-mansion-1.webp'
  if (s.includes('palm')) return '/media/properties/palm-garden-homes-1.webp'
  if (s.includes('creek') || s.includes('harbour')) return '/media/properties/creek-harbour-waterside-townhouse-1.webp'
  if (s.includes('business bay') || s.includes('downtown') || s.includes('burj') || s.includes('executive')) {
    return '/media/properties/business-bay-executive-tower-2.webp'
  }
  if (s.includes('arabian') || s.includes('ranches') || s.includes('courtyard')) {
    return '/media/properties/arabian-ranches-courtyard-villa-2.webp'
  }
  if (s.includes('jvc') || s.includes('boulevard') || s.includes('village')) {
    return '/media/properties/jvc-boulevard-residences-2.webp'
  }
  if (s.includes('villa') || s.includes('sanctuary')) return '/media/properties/villa-sanctuary-6.webp'
  if (s.includes('island')) return '/media/properties/islands-2-1.webp'
  if (s.includes('river') || s.includes('cove')) return '/media/properties/river-cove-residences-1.webp'
  return SWK_PROPERTY_PHOTOS[Math.abs(fallbackIndex) % SWK_PROPERTY_PHOTOS.length]!
}

/**
 * Resolves community metadata & high-resolution community photography from SWK OS.
 */
export function resolveCommunityMedia(text?: string | null, fallbackIndex = 0) {
  const s = (text || '').toLowerCase()
  const match = COMMUNITIES.find(
    c => s.includes(c.name.toLowerCase()) || s.includes(c.id.replace(/-/g, ' '))
  )
  return match || COMMUNITIES[Math.abs(fallbackIndex) % COMMUNITIES.length]!
}

/**
 * Resolves official UAE Developer partner logo from `/media/developers/logo-*.png`
 */
export function resolveDeveloperBrand(text?: string | null, fallbackIndex = 0) {
  const s = (text || '').toLowerCase()
  const match = DEVELOPERS.find(d => s.includes(d.name.split(' ')[0]!.toLowerCase()))
  return match || DEVELOPERS[Math.abs(fallbackIndex) % DEVELOPERS.length]!
}

export { COMMUNITIES, DEVELOPERS, RERA_FORMS }
