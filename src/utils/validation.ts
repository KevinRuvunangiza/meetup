/**
 * VALIDATION UTILITIES
 * ─────────────────────────────────────────────────────────────────────────────
 * Strict client-side and server-side validation for form submissions.
 * Both WhatsApp number and Email are required.
 */

// Accepts +243..., 243..., 08..., or any valid international phone with 8-15 digits
const PHONE_CLEAN_RE = /[\s\-().]/g
const PHONE_RE = /^(\+?[0-9]{8,15})$/

// Standard RFC 5322 compliant regex for email validation
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export function normalizePhone(raw: string): string {
  if (!raw) return ''
  return raw.replace(PHONE_CLEAN_RE, '')
}

export function isValidPhone(raw: string): boolean {
  const cleaned = normalizePhone(raw)
  return PHONE_RE.test(cleaned)
}

export function isValidEmail(raw: string): boolean {
  if (!raw) return false
  const trimmed = raw.trim().toLowerCase()
  return EMAIL_RE.test(trimmed)
}

export function validateStep1(data: {
  fullName: string
  whatsapp: string
  email: string
  role?: string
}): { ok: boolean; error?: string } {
  if (!data.fullName || !data.fullName.trim()) {
    return { ok: false, error: 'Veuillez renseigner votre nom complet ou le nom de votre marque.' }
  }

  if (!data.whatsapp || !isValidPhone(data.whatsapp)) {
    return {
      ok: false,
      error: 'Numéro WhatsApp invalide (ex: +243 812 345 678 ou 0812345678).',
    }
  }

  if (!data.email || !isValidEmail(data.email)) {
    return {
      ok: false,
      error: 'Veuillez renseigner une adresse email valide (ex: contact@domaine.com).',
    }
  }

  return { ok: true }
}
