/**
 * LANGUAGE TOGGLE
 * Simple two-state toggle: FR | EN
 * Placed in the navbar/top of page.
 */
import { useTranslation } from '@/hooks/useTranslation'

export function LangToggle() {
  const { lang, setLang } = useTranslation()
  const other = lang === 'fr' ? 'en' : 'fr'
  const label = lang === 'fr' ? 'EN' : 'FR'

  return (
    <button
      type="button"
      onClick={() => setLang(other)}
      className={[
        'rounded-md border-2 border-ink px-3 py-1.5 text-sm font-semibold text-ink',
        'hover:bg-ink hover:text-white transition-colors duration-150 min-h-[44px]',
      ].join(' ')}
      aria-label={`Switch to ${other === 'en' ? 'English' : 'French'}`}
    >
      {label}
    </button>
  )
}
