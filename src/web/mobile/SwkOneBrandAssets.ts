import { COMMUNITIES, DEVELOPERS, RERA_FORMS } from '../swk/uae'

/**
 * Official SWK ONE Brand Architecture Assets & Color Palette Registry
 * Powered by the official SWK ONE Brand Assets package:
 *   - 01_SWK_ONE_Primary_Logo
 *   - 02_SWK_ONE_Master_Lockup
 *   - 03_SWK_ONE_Portal_Arch_Emblem
 *   - 04a_SWK_ONE_App_Icon_Dark_Labeled / 04b_SWK_ONE_App_Icon_Light_Labeled
 *   - 05_SWK_ONE_Horizontal_Portal_Lockup
 *   - 06_SWK_ONE_Portal_Map_Pin
 *   - 07_SWK_ONE_Portal_Arch_With_Wordmark
 *   - 08_SWK_ONE_Script_Logo_Compact
 *   - 09a_SWK_ONE_App_Icon_Light_Unlabeled / 09b_SWK_ONE_App_Icon_Dark_Unlabeled
 *
 * Official Brand Color Palette:
 *   - Deep Emerald Background:       #041615 (RGB: 4, 22, 21)
 *   - Champagne Gold Highlight:      #E0C1A3 (RGB: 224, 193, 163)
 *   - Brushed Bronze / Rose Gold:    #B68F70 (RGB: 182, 143, 112)
 *   - Deep Bronze Shadow:            #6F513B (RGB: 111, 81, 59)
 *   - App Icon Warm Ivory Surface:   #F3EFE6 (RGB: 243, 239, 230)
 */
export const SWK_ONE_PALETTE = {
  deepEmerald: '#041615',
  emeraldRaised: '#0a2e2c',
  emeraldRoyal: '#11423e',
  champagneGold: '#E0C1A3',
  brushedBronze: '#B68F70',
  deepBronze: '#6F513B',
  warmIvory: '#F3EFE6',
} as const

export const SWK_BRAND = {
  // Official SWK ONE 11-asset brand suite (Transparent & Solid variants)
  primaryLogo: '/brand/one/primary-logo.png',
  primaryLogoSolid: '/brand/one/primary-logo-solid.png',
  masterLockup: '/brand/one/master-lockup.png',
  masterLockupSolid: '/brand/one/master-lockup-solid.png',
  portalArchEmblem: '/brand/one/portal-arch-emblem.png',
  portalArchEmblemSolid: '/brand/one/portal-arch-emblem-solid.png',
  appIconDarkLabeled: '/brand/one/app-icon-dark-labeled.png',
  appIconLightLabeled: '/brand/one/app-icon-light-labeled.png',
  horizontalLockup: '/brand/one/horizontal-lockup.png',
  horizontalLockupSolid: '/brand/one/horizontal-lockup-solid.png',
  portalMapPin: '/brand/one/portal-map-pin.png',
  portalMapPinSolid: '/brand/one/portal-map-pin-solid.png',
  portalArchWordmark: '/brand/one/portal-arch-wordmark.png',
  portalArchWordmarkSolid: '/brand/one/portal-arch-wordmark-solid.png',
  scriptLogoCompact: '/brand/one/script-logo-compact.png',
  scriptLogoCompactSolid: '/brand/one/script-logo-compact-solid.png',
  appIconLightUnlabeled: '/brand/one/app-icon-light-unlabeled.png',
  appIconDarkUnlabeled: '/brand/one/app-icon-dark-unlabeled.png',
  masterSheetComplete: '/brand/one/sheet-complete-brand-system.png',
  masterSheetAppIcons: '/brand/one/sheet-app-icon-suite.png',
  masterSheetCoreIdentity: '/brand/one/sheet-core-identity-lockups.png',

  // Standardized aliases used across Web, Shell, Studio, Reception & Mobile UI
  logoWhite: '/brand/swk-logo-white.png',
  logoInk: '/brand/swk-logo-ink.png',
  logoDark: '/brand/swk-logo-dark.png',
  logoGold: '/brand/swk-logo.png',
  fullLogoDark: '/brand/swk-full-logo-dark.png',
  fullLogoLight: '/brand/swk-full-logo-light.png',
  mark: '/brand/swk-mark.png',
  markLight: '/brand/swk-mark-light.png',
  markBlack: '/brand/swk-mark-black.png',
  signageLogo: '/brand/swk-signage-logo.png',
  signageIcon: '/brand/swk-signage-icon.png',
  emblemSvg: '/brand/swk-os-emblem.svg',
  wordmarkSvg: '/brand/swk-os-wordmark.svg',
  horizontalLogoSvg: '/brand/swk-os-horizontal.svg',
  stackedLogoSvg: '/brand/swk-os-stacked.svg',
  masterSvg: '/brand/swk-os-master.svg',
  skylineFront: '/brand/skyline-front.svg',
  skylineBack: '/brand/skyline-back.svg',
  heroDubai: '/brand/swk-signage-logo.png',
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
