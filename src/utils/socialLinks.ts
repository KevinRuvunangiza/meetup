/**
 * SOCIAL LINKS NORMALIZATION & VALIDATION
 * ─────────────────────────────────────────────────────────────────────────────
 * Accepts handles (@name) or pasted URLs, strips tracking parameters
 * (igsh, fbclid, utm_*, si, etc.), ensures correct platform prefix,
 * and validates the format.
 */

export interface NormalizedResult {
  ok: boolean
  normalized: string
  handle?: string
  error?: string
}

/**
 * Remove tracking parameters and clean trailing slashes
 */
function stripTrackingParams(rawUrl: string): string {
  try {
    const urlObj = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`)
    // Keep only clean pathname, discard query string and hash
    const path = urlObj.pathname.replace(/\/+$/, '')
    return `${urlObj.origin}${path}`
  } catch {
    // If not a valid URL yet, remove everything after ? or #
    return rawUrl.split(/[?#]/)[0].replace(/\/+$/, '')
  }
}

/**
 * Normalize an Instagram handle or link
 */
export function normalizeInstagram(raw: string): NormalizedResult {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: true, normalized: '' }

  // If URL pasted
  if (/instagram\.com/i.test(trimmed)) {
    const cleanUrl = stripTrackingParams(trimmed)
    const match = cleanUrl.match(/instagram\.com\/([a-zA-Z0-9._]+)/i)
    if (match && match[1]) {
      const handle = match[1]
      return {
        ok: true,
        handle: `@${handle}`,
        normalized: `https://instagram.com/${handle}`,
      }
    }
    return { ok: false, normalized: '', error: 'Lien Instagram invalide.' }
  }

  // If handle entered (@name or name)
  const cleanHandle = trimmed.replace(/^@/, '')
  if (/^[a-zA-Z0-9._]{1,30}$/.test(cleanHandle)) {
    return {
      ok: true,
      handle: `@${cleanHandle}`,
      normalized: `https://instagram.com/${cleanHandle}`,
    }
  }

  return {
    ok: false,
    normalized: '',
    error: 'Nom d’utilisateur Instagram invalide (lettres, chiffres, points, tirets bas).',
  }
}

/**
 * Normalize a TikTok handle or link
 */
export function normalizeTikTok(raw: string): NormalizedResult {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: true, normalized: '' }

  if (/tiktok\.com/i.test(trimmed)) {
    const cleanUrl = stripTrackingParams(trimmed)
    const match = cleanUrl.match(/tiktok\.com\/@?([a-zA-Z0-9._]+)/i)
    if (match && match[1]) {
      const handle = match[1]
      return {
        ok: true,
        handle: `@${handle}`,
        normalized: `https://www.tiktok.com/@${handle}`,
      }
    }
    return { ok: false, normalized: '', error: 'Lien TikTok invalide.' }
  }

  const cleanHandle = trimmed.replace(/^@/, '')
  if (/^[a-zA-Z0-9._]{1,24}$/.test(cleanHandle)) {
    return {
      ok: true,
      handle: `@${cleanHandle}`,
      normalized: `https://www.tiktok.com/@${cleanHandle}`,
    }
  }

  return {
    ok: false,
    normalized: '',
    error: 'Nom d’utilisateur TikTok invalide.',
  }
}

/**
 * Normalize a YouTube channel handle or URL
 */
export function normalizeYouTube(raw: string): NormalizedResult {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: true, normalized: '' }

  if (/youtube\.com|youtu\.be/i.test(trimmed)) {
    const cleanUrl = stripTrackingParams(trimmed)
    return {
      ok: true,
      normalized: cleanUrl,
    }
  }

  const cleanHandle = trimmed.replace(/^@/, '')
  if (/^[a-zA-Z0-9._-]{3,30}$/.test(cleanHandle)) {
    return {
      ok: true,
      handle: `@${cleanHandle}`,
      normalized: `https://youtube.com/@${cleanHandle}`,
    }
  }

  return {
    ok: false,
    normalized: '',
    error: 'Lien ou identifiant de chaîne YouTube invalide.',
  }
}

/**
 * Normalize a Facebook profile or page link
 */
export function normalizeFacebook(raw: string): NormalizedResult {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: true, normalized: '' }

  if (/facebook\.com|fb\.me|fb\.com/i.test(trimmed)) {
    const cleanUrl = stripTrackingParams(trimmed)
    return {
      ok: true,
      normalized: cleanUrl,
    }
  }

  const cleanHandle = trimmed.replace(/^@/, '').replace(/^\/+/, '')
  if (/^[a-zA-Z0-9.]{3,50}$/.test(cleanHandle)) {
    return {
      ok: true,
      handle: cleanHandle,
      normalized: `https://facebook.com/${cleanHandle}`,
    }
  }

  return {
    ok: false,
    normalized: '',
    error: 'Lien de page ou profil Facebook invalide.',
  }
}

/**
 * Normalize a generic Website or portfolio URL
 */
export function normalizeWebsite(raw: string): NormalizedResult {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: true, normalized: '' }

  let formatted = trimmed
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = `https://${formatted}`
  }

  try {
    const url = new URL(formatted)
    // Check for valid hostname containing at least one dot
    if (!url.hostname.includes('.') || url.hostname.endsWith('.')) {
      return { ok: false, normalized: '', error: 'Adresse web invalide (ex: https://monsite.com).' }
    }
    return {
      ok: true,
      normalized: url.href.replace(/\/+$/, ''),
    }
  } catch {
    return { ok: false, normalized: '', error: 'URL de site web invalide.' }
  }
}
