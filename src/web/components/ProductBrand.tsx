export function ProductBrand({ compact = false }: { compact?: boolean }) {
  return (
    <a href="https://swkpropertiesuae.com" target="_blank" rel="noopener noreferrer"
      className={compact ? 'product-brand product-brand-compact' : 'product-brand'}
      aria-label="SWK ONE · Business Workspace">
      <img src="/brand/one/Icon/SWK_One_Crest_ForLight.svg?v=swk-one" alt="" width={compact ? 28 : 34} height={compact ? 28 : 34} style={{ height: compact ? 28 : 34, width: compact ? 28 : 34, objectFit: 'contain' }} />
      <img src="/brand/one/Logo/SWK_One_Wordmark_ForLight.svg?v=swk-one" alt="SWK ONE" width={compact ? 84 : 104} height={compact ? 36 : 44} style={{ height: compact ? 26 : 32, width: 'auto', objectFit: 'contain' }} />
      <span className="swk-os-badge">{compact ? 'ONE' : 'Business Workspace'}</span>
    </a>
  )
}
