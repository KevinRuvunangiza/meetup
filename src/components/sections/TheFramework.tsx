import { useTranslation } from '@/hooks/useTranslation'
import { useWhatsAppModal } from '@/context/WhatsAppModalContext'
import {
  PiFileText,
  PiCheckCircle,
  PiShieldCheck,
  PiChatDots,
  PiArrowRight,
  PiPaperclip,
} from 'react-icons/pi'

export function TheFramework() {
  const { t } = useTranslation()
  const { openWhatsAppChooser } = useWhatsAppModal()

  const details = t<Array<{ label: string; value: string }>>('theFramework.details')

  return (
    <section className="bg-charcoal text-cream py-16 md:py-24 border-b border-borderDark relative overflow-hidden">
      {/* Subtle background ambient ring */}
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-saffron/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative Explanation */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-saffron bg-ink px-3 py-1 rounded-full border border-saffron/30">
              {t('theFramework.label')}
            </span>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream tracking-tight leading-tight">
              {t('theFramework.title')}
            </h2>

            <p className="text-base text-textOffWhite/80 leading-relaxed max-w-xl">
              {t('theFramework.subtitle')}
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 text-saffron">
                  <PiCheckCircle size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-cream">Zéro flou sur les droits d’auteur</h4>
                  <p className="text-xs text-textMutedDark mt-0.5">
                    La marque sait exactement combien de temps et sur quels canaux elle peut diffuser les contenus.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 text-saffron">
                  <PiShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-cream">Plafond clair des allers-retours</h4>
                  <p className="text-xs text-textMutedDark mt-0.5">
                    Le nombre de retouches est fixé dès le départ pour éviter les demandes imprévues.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 text-saffron">
                  <PiFileText size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-cream">Échéances de règlement consignées</h4>
                  <p className="text-xs text-textMutedDark mt-0.5">
                    Date de versement et mode de paiement prévus par écrit avant de lancer la production.
                  </p>
                </div>
              </div>
            </div>

            {/* Dual CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  (document.getElementById('hero-quick-form') ?? document.getElementById('waitlist'))?.scrollIntoView({
                    behavior: 'smooth',
                  })
                }
                className="inline-flex items-center gap-2 rounded-xl bg-saffron px-5 py-3 text-sm font-bold text-ink hover:bg-saffronHover transition-colors shadow-sm"
              >
                <span>Rejoindre la liste</span>
                <PiArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => openWhatsAppChooser()}
                className="inline-flex items-center gap-2 rounded-xl bg-ink/60 border border-borderDark px-5 py-3 text-sm font-bold text-cream hover:bg-ink hover:border-saffron/40 transition-colors"
              >
                <PiChatDots size={16} className="text-saffron" />
                <span>Poser une question sur WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual One-Page Agreement Summary Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl bg-cream text-ink p-6 sm:p-8 shadow-2xl border border-creamDarker">
              {/* Card Header Stamp */}
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-ink text-saffron flex items-center justify-center font-display font-extrabold text-sm">
                    M.
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-ink">
                      Accord de Collaboration
                    </div>
                    <div className="text-[10px] text-textMuted">Réf. MOSALA-ACCORD-2025-01</div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron/20 border border-saffron/40 px-3 py-1 text-[11px] font-bold text-ink">
                  <PiPaperclip size={12} className="text-ink" />
                  {t('theFramework.sampleBadge')}
                </span>
              </div>

              {/* Parties summary */}
              <div className="grid grid-cols-2 gap-4 pb-4 mb-4 border-b border-border/60 text-xs">
                <div>
                  <div className="text-[10px] font-bold uppercase text-textMuted">Partie A (Marque)</div>
                  <div className="font-bold text-ink text-sm mt-0.5">Maison Beauté Kinshasa</div>
                  <div className="text-textMuted text-[11px]">Secteur Cosmétique</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-textMuted">Partie B (Créateur)</div>
                  <div className="font-bold text-ink text-sm mt-0.5">Grace M. (@gracestyle)</div>
                  <div className="text-textMuted text-[11px]">Identité vérifiée · Niveau 2</div>
                </div>
              </div>

              {/* Agreement points */}
              <div className="space-y-3.5 mb-6">
                {Array.isArray(details) &&
                  details.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 rounded-lg bg-creamDarker/40 p-2.5 text-xs border border-border/50"
                    >
                      <span className="font-bold text-textMuted">{item.label}</span>
                      <span className="font-semibold text-ink sm:text-right">{item.value}</span>
                    </div>
                  ))}
              </div>

              {/* Card Footer Note */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-textMuted">
                <span>Validation conjointe avant production</span>
                <span className="font-bold text-ink">Signature numérique horodatée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
