/**
 * CONTACT CONFIG — MOSALA
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all human team contacts.
 *
 * NOTE: The email address is TEMPORARY and personal for the early launch phase.
 * It should later be replaced by a dedicated company mailbox (e.g. contact@mosala.io).
 *
 * Anti-scraping rule:
 *  Do not print this email as static plain text in HTML.
 *  Use runtime buttons (copy address / mailto trigger) to minimize bot harvesting.
 */

export interface TeamMemberContact {
  id: string
  name: string
  roleTitle: string
  displayPhone: string
  waMeNumber: string
}

export const contactConfig = {
  /**
   * Pre-filled message for WhatsApp inquiries.
   */
  defaultWhatsAppMessage: "Bonjour, j'ai une question sur Mosala.",

  /**
   * Team members available for direct WhatsApp conversation.
   * Edit phone numbers or add members directly in this array.
   */
  team: [
    {
      id: 'dan',
      name: 'Dan Ebondo',
      roleTitle: 'Équipe Mosala',
      displayPhone: '+243 896 124 415',
      waMeNumber: '243896124415',
    },
    {
      id: 'kevin',
      name: 'Kevin Ruvunangiza',
      roleTitle: 'Équipe Mosala',
      displayPhone: '+27 79 644 9946',
      waMeNumber: '27796449946',
    },
  ] as TeamMemberContact[],

  /**
   * Temporary personal email address.
   * Assembled dynamically at runtime to hinder automated crawlers.
   */
  email: {
    user: 'ruvunangizakev',
    host: 'gmail.com',
  },
} as const

/**
 * Build a WhatsApp direct conversation URL with pre-filled text.
 */
export function getWhatsAppUrl(waMeNumber: string, customMessage?: string): string {
  const msg = encodeURIComponent(customMessage ?? contactConfig.defaultWhatsAppMessage)
  return `https://wa.me/${waMeNumber}?text=${msg}`
}

/**
 * Safely returns the current contact email at runtime.
 */
export function getContactEmail(): string {
  return `${contactConfig.email.user}@${contactConfig.email.host}`
}
