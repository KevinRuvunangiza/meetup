/**
 * NAV — sticky top bar with language toggle and CTA
 */
import { LangToggle } from '@/components/ui/LangToggle'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/hooks/useTranslation'
import { siteConfig } from '@/config/site.config'

export function Nav() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-sm border-b border-border">
      <div className="container-site flex items-center justify-between py-4 min-h-[64px]">
        {/* Wordmark */}
        <span className="text-xl font-bold tracking-tight text-ink">
          {siteConfig.name}
        </span>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <LangToggle />
          <Button
            size="sm"
            variant="primary"
            onClick={() =>
              document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            {t('nav.cta')}
          </Button>
        </div>
      </div>
    </header>
  )
}
