/**
 * SITE CONFIG
 * ─────────────────────────────────────────────────────────────────────────────
 * Change the brand name, URLs, and feature flags here.
 * Nothing else needs to be touched for a rebrand.
 */

export const siteConfig = {
  /**
   * Working name shown across the site.
   * Centralized here — change this one value when final brand name is selected.
   */
  name: 'KOLAB',

  /** Short tagline used in meta description */
  tagline: 'La plateforme de référence qui connecte marques et créateurs.',

  /** Domain — update when you have a real domain */
  url: 'https://kolab-waitlist.netlify.app',

  /** Contact email shown in footer (no country suffix) */
  contactEmail: 'contact@kolab.co',

  /** WhatsApp share prefill — {url} is replaced at runtime */
  whatsappShareTemplate:
    "Je viens de m'inscrire sur la liste prioritaire — découvrez la plateforme ici : {url}",

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
    title: 'KOLAB — Marques & Créateurs',
    description:
      'La plateforme de référence qui connecte les marques sérieuses et les créateurs de contenu vérifiés.',
    image: '/og-image.png',
  },
} as const

export type SiteConfig = typeof siteConfig
