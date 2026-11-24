import { useTranslation } from '@/hooks/useTranslation'
import { useWhatsAppModal } from '@/context/WhatsAppModalContext'
import { PiChatDots, PiHandshake, PiArrowRight } from 'react-icons/pi'

export function HumanTouch() {
  const { t } = useTranslation()
  const { openWhatsAppChooser } = useWhatsAppModal()

  return (
    <section className="bg-ink text-cream py-16 md:py-20 border-b border-borderDark relative overflow-hidden">
      <div className="container-site">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 max-w-5xl mx-auto">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron">
              <PiHandshake size={18} />
              <span>Vérification humaine & Choix direct</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-cream tracking-tight">
              {t('humanTouch.title')}
            </h2>

            <p className="text-base text-textOffWhite/80 leading-relaxed">
              {t('humanTouch.desc')}
            </p>
          </div>

          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={() => openWhatsAppChooser()}
              className="inline-flex items-center gap-3 rounded-2xl bg-saffron px-6 py-4 text-sm font-bold text-ink hover:bg-saffronHover transition-all shadow-md group"
            >
              <PiChatDots size={20} className="text-ink" />
              <span>{t('humanTouch.cta')}</span>
              <PiArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
