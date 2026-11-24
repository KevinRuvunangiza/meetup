import { useTranslation } from '@/hooks/useTranslation'
import {
  PiClockCountdown,
  PiStarHalf,
  PiSignature,
  PiKanban,
  PiDeviceMobile,
  PiSparkle,
} from 'react-icons/pi'

export function Roadmap() {
  const { t } = useTranslation()

  const items = t<Array<{ title: string; desc: string }>>('roadmap.items')
  const icons = [PiStarHalf, PiSignature, PiKanban, PiDeviceMobile]

  return (
    <section className="bg-cream py-16 md:py-24 border-b border-border">
      <div className="container-site">
        <div className="max-w-2xl mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink bg-saffronSoft border border-saffron/40 px-3 py-1 rounded-full mb-3">
            <PiClockCountdown size={14} className="text-saffron" />
            {t('roadmap.label')}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mb-4">
            {t('roadmap.title')}
          </h2>
          <p className="text-base text-textMuted leading-relaxed">
            {t('roadmap.subtitle')}
          </p>
        </div>

        {/* Roadmap Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Array.isArray(items) &&
            items.map((item, idx) => {
              const Icon = icons[idx] ?? PiClockCountdown
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-creamDarker bg-creamCard p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="h-10 w-10 rounded-xl bg-cream flex items-center justify-center text-saffron border border-creamDarker mb-4">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-display text-lg font-bold text-ink mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-textMuted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-creamDarker/40 text-[10px] font-bold text-textMuted uppercase tracking-wider">
                    En développement
                  </div>
                </div>
              )
            })}
        </div>

        {/* Founding Members Box */}
        <div className="rounded-2xl bg-creamDarker/60 border border-border p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-ink text-saffron flex items-center justify-center flex-shrink-0">
              <PiSparkle size={24} />
            </div>
            <div>
              <h4 className="font-display text-lg font-bold text-ink mb-1">
                Les premiers membres comptent plus
              </h4>
              <p className="text-sm text-textMuted max-w-2xl leading-relaxed">
                {t('roadmap.founding')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              (document.getElementById('hero-quick-form') ?? document.getElementById('waitlist'))?.scrollIntoView({
                behavior: 'smooth',
              })
            }
            className="flex-shrink-0 rounded-xl bg-ink px-5 py-2.5 text-xs font-bold text-cream hover:bg-charcoal transition-colors"
          >
            Rejoindre en pionnier
          </button>
        </div>
      </div>
    </section>
  )
}
