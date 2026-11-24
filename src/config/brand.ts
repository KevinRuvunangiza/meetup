/**
 * BRAND CONFIG — MOSALA
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for brand identity, naming, and links.
 * All public-facing copies, meta tags, and templates consume this config.
 */

export const brandConfig = {
  /** Platform name: "MOSALA" (means "work / job" in Lingala) */
  name: 'MOSALA',

  /** Taglines */
  tagline: 'Des accords clairs entre marques et créateurs.',
  taglineEn: 'Clear agreements between brands and creators.',

  /** Origin & meaning note */
  meaning: 'Mosala signifie « travail » en lingala.',
  meaningFull: 'Mosala signifie travail en lingala. C’est exactement ce que nous valorisons : des collaborations professionnelles, respectées et clarifiées.',

  /** Subline for Hero */
  heroSubline: 'Mosala met les marques et les créateurs d’accord, par écrit, avec une équipe qui vérifie chaque collaboration.',
  heroSublineEn: 'Mosala aligns brands and creators with clear written agreements and human-vetted collaborations.',

  /** Production / placeholder domain (no country code suffix) */
  url: 'https://mosala.io',

  /** General contact email placeholder (no country code suffix) */
  contactEmail: 'contact@mosala.io',

  /** WhatsApp share prefill — {url} is replaced at runtime
   * NOTE: Team WhatsApp contacts live in src/config/contact.ts (not here).
   */
  whatsappShareTemplate:
    "Je viens de m'inscrire sur la liste prioritaire de MOSALA — découvrez la plateforme ici : {url}",

  /** Google Apps Script endpoint */
  appsScriptUrl: import.meta.env.VITE_APPS_SCRIPT_URL ?? '',

  /** Social media links */
  social: {
    instagram: 'https://instagram.com/mosala',
    twitter: 'https://twitter.com/mosala',
    linkedin: 'https://linkedin.com/company/mosala',
  },

  /** Open Graph / social preview */
  og: {
    title: 'MOSALA — Marques & Créateurs',
    description: "Des collaborations créatives cadrées, du brief jusqu'au paiement.",
    image: '/og-image.png',
  },

  /** Feature flags */
  flags: {
    foundingSpots: false,
    creatorsPayNothing: true,
  },
} as const

export type BrandConfig = typeof brandConfig
