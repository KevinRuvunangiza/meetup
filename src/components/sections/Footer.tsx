/**
 * FOOTER
 */
import { useTranslation } from '@/hooks/useTranslation'
import { siteConfig } from '@/config/site.config'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-charcoal text-white border-t border-white/10">
      <div className="container-site py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="mb-2 text-xl font-bold text-white">{siteConfig.name}</p>
            <p className="text-sm text-white/50">{t('footer.tagline')}</p>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/40">
              {t('footer.contact')}
            </p>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-sm text-white/70 hover:text-signal transition-colors"
            >
              {siteConfig.contactEmail}
            </a>
          </div>

          {/* Privacy */}
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/40">
              Données personnelles
            </p>
            <p className="text-sm text-white/50 leading-relaxed">
              {t('footer.privacy')}
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col gap-1 md:flex-row md:justify-between">
          <p className="text-xs text-white/30">
            © {year} {t('footer.rights')}
          </p>
          <p className="text-xs text-white/30">{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  )
}
