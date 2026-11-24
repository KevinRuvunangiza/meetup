/**
 * NAV — sticky top bar with brand wordmark, language toggle and CTA
 */
import { LangToggle } from '@/components/ui/LangToggle'
import { Button } from '@/components/ui/Button'
import { Wordmark } from '@/components/ui/Wordmark'
import { useTranslation } from '@/hooks/useTranslation'

export function Nav() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-border">
      <div className="container-site flex items-center justify-between py-3.5 min-h-[64px]">
        {/* Wordmark */}
        <div className="flex items-center gap-2.5">
          <Wordmark size="md" />
          <span className="hidden sm:inline-block rounded-full bg-saffron/20 border border-saffron/40 px-2.5 py-0.5 text-[10px] font-bold text-ink tracking-wider uppercase">
            Accès prioritaire
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <LangToggle />
          <Button
            size="sm"
            variant="primary"
            onClick={() =>
              (document.getElementById('hero-quick-form') ?? document.getElementById('waitlist'))?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {t('nav.cta')}
          </Button>
        </div>
      </div>
    </header>
  )
}
