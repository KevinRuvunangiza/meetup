/**
 * SITE CONFIG
 * ─────────────────────────────────────────────────────────────────────────────
 * Change the brand name, URLs, and feature flags here.
 * Nothing else needs to be touched for a rebrand.
 */

export const siteConfig = {
  /** Working name shown across the site */
  name: 'MEETUP',

  /** Short tagline used in meta description */
  tagline: 'La plateforme qui connecte les marques et les créateurs en RDC.',

  /** Domain — update when you have a real domain */
  url: 'https://meetup-waitlist.netlify.app',

  /** Contact email shown in footer */
  contactEmail: 'hello@meetup-drc.com',

  /** WhatsApp share prefill — {url} is replaced at runtime */
  whatsappShareTemplate:
    "Je viens de m'inscrire sur MEETUP — la plateforme qui connecte marques et créateurs en RDC. Inscris-toi ici : {url}",

  /** Google Apps Script endpoint — set after deploying Code.gs */
  /** Google Apps Script endpoint — set after deploying Code.gs */
  appsScriptUrl: import.meta.env.VITE_APPS_SCRIPT_URL ?? '',

  /**
   * Feature flags
   * Set to true only when you have confirmed the claim externally.
   */
  flags: {
    /** Show "founding spots are limited" messaging */
    foundingSpots: false,
    /** FAQ answer: creators pay nothing at launch */
    creatorsPayNothing: false,
  },

  /** Open Graph / social preview */
  og: {
    title: 'MEETUP — Marques & Créateurs, RDC',
    description:
      'La première plateforme de confiance qui met en relation les marques et les créateurs de contenu en République Démocratique du Congo.',
    image: '/og-image.png',
  },
} as const

export type SiteConfig = typeof siteConfig
