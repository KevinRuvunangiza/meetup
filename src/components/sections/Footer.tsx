/**
 * FOOTER — MOSALA
 * ─────────────────────────────────────────────────────────────────────────────
 * Clean typographic footer.
 *
 * Anti-spam rule:
 *  Email address is TEMPORARY (personal address during initial launch) and is
 *  NEVER rendered as plain text in the HTML markup. It is accessed strictly at
 *  runtime via EmailActionButton to deter web scrapers.
 */
import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { brandConfig } from '@/config/brand'
import { Wordmark } from '@/components/ui/Wordmark'
import { EmailActionButton } from '@/components/ui/EmailActionButton'
import { PrivacyModal } from '@/components/ui/PrivacyModal'
import { useWhatsAppModal } from '@/context/WhatsAppModalContext'
import { PiChatDots, PiShieldCheck } from 'react-icons/pi'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  const { openWhatsAppChooser } = useWhatsAppModal()
  const [showPrivacy, setShowPrivacy] = useState(false)

  return (
    <footer className="bg-ink text-cream border-t border-borderDark">
      <div className="container-site py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand & Meaning */}
          <div className="md:col-span-2 space-y-3">
            <Wordmark size="md" className="text-cream" />
            <p className="text-sm text-textOffWhite/80 max-w-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
            <p className="text-xs text-textMutedDark font-medium">
              {brandConfig.meaningFull}
            </p>
          </div>

          {/* Contact (No plain text email in HTML) */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-saffron">
              {t('footer.contact')}
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => openWhatsAppChooser()}
                className="flex items-center gap-2 text-xs font-semibold text-textOffWhite/90 hover:text-saffron transition-colors"
              >
                <PiChatDots size={16} className="text-saffron" />
                <span>Écrire à l'équipe sur WhatsApp</span>
              </button>

              {/* Dynamic runtime email buttons (prevents scraper harvesting) */}
              <EmailActionButton variant="stacked" />
            </div>
          </div>

          {/* Privacy */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-saffron">
              Données personnelles
            </p>
            <p className="text-xs text-textMutedDark leading-relaxed">
              {t('footer.privacy')}
            </p>
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-textOffWhite hover:text-saffron transition-colors pt-1"
            >
              <PiShieldCheck size={14} className="text-saffron" />
              <span>Consulter la politique complète</span>
            </button>
          </div>
        </div>

        <div className="mt-12 border-t border-borderDark/80 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-textMutedDark">
          <p>
            © {year} <span className="text-cream font-semibold">{brandConfig.name}</span>. {t('footer.rights')}
          </p>
          <p>{t('footer.madeWith')}</p>
        </div>
      </div>

      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </footer>
  )
}
