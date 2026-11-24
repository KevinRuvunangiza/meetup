/**
 * SITE CONFIG ALIAS
 * ─────────────────────────────────────────────────────────────────────────────
 * Re-exports brandConfig from brand.ts to maintain backward compatibility.
 * All brand values live in brand.ts.
 */
import { brandConfig } from './brand'

export { brandConfig }
export const siteConfig = brandConfig
export type SiteConfig = typeof brandConfig
