import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { Language } from '@/types/form'
import fr from '@/i18n/fr.json'
import en from '@/i18n/en.json'

/**
 * TRANSLATION HOOK
 * ─────────────────────────────────────────────────────────────────────────────
 * Why no library (react-i18next, etc.)?
 *   • The site has two languages and static text. A full i18n library
 *     would add ~25 KB to the bundle for a feature we can build in ~40 lines.
 *   • If we ever need plurals, date formatting, or more languages, we can
 *     swap this hook's internals for a library without changing call sites.
 *
 * Usage:
 *   const { t, lang, setLang } = useTranslation()
 *   t('hero.title')           → string
 *   t('hero.subtitle', { name: 'KOLAB' }) → interpolated string
 */

// Accept any string key — the function returns the key itself if not found,
// which is a reasonable dev-time hint. This keeps call sites simple and allows
// passing object-valued paths (arrays, nested objects) cast to `unknown`.
export type TranslationKey = string

const catalogs: Record<Language, Record<string, unknown>> = { fr, en }

/** Resolve a dot-notation key against a nested object */
function resolve(obj: Record<string, unknown>, key: string): unknown {
  const parts = key.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return key
    current = (current as Record<string, unknown>)[part]
  }
  return current !== undefined ? current : key
}

/** Replace {placeholder} tokens in a string */
function interpolate(str: string, vars?: Record<string, string>): string {
  if (!vars) return str
  return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`)
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface I18nContextValue {
  lang: Language
  setLang: (l: Language) => void
  t: <T = string>(key: TranslationKey, vars?: Record<string, string>) => T
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('fr')

  const setLang = useCallback((l: Language) => {
    setLangState(l)
    // Update html[lang] for screen readers and SEO crawlers
    document.documentElement.lang = l
  }, [])

  const t = useCallback(
    <T = string>(key: TranslationKey, vars?: Record<string, string>): T => {
      const catalog = catalogs[lang] as Record<string, unknown>
      const val = resolve(catalog, key)
      if (typeof val === 'string') {
        return interpolate(val, vars) as unknown as T
      }
      return val as T
    },
    [lang],
  )

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be used inside LanguageProvider')
  return ctx
}
