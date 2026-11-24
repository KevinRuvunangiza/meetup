import { useTranslation } from '@/hooks/useTranslation'
import {
  PiIdentificationCard,
  PiFilmReel,
  PiCheckCircleFill,
  PiInfo,
} from 'react-icons/pi'

export function Vetting() {
  const { t } = useTranslation()

  const levels = t<Array<{ level: string; name: string; desc: string }>>('vetting.levels')
  const icons = [PiIdentificationCard, PiFilmReel, PiCheckCircleFill]

  return (
    <section className="bg-cream py-16 md:py-24 border-b border-border">
      <div className="container-site">
        <div className="max-w-2xl mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-saffron bg-ink px-3 py-1 rounded-full mb-3">
            {t('vetting.label')}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mb-4">
            {t('vetting.title')}
          </h2>
          <p className="text-base text-textMuted leading-relaxed">
            {t('vetting.subtitle')}
          </p>
        </div>

        {/* 3 Verification Levels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Array.isArray(levels) &&
            levels.map((lvl, idx) => {
              const Icon = icons[idx] ?? PiCheckCircleFill
              return (
                <div
                  key={idx}
                  className="relative rounded-2xl border border-creamDarker bg-creamCard p-8 shadow-sm hover:border-saffron/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="rounded-full bg-saffronSoft border border-saffron/30 px-3 py-1 text-xs font-bold text-ink">
                        {lvl.level}
                      </span>
                      <div className="h-10 w-10 rounded-xl bg-ink text-saffron flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                    </div>

                    <h3 className="font-display text-xl font-bold text-ink mb-3">
                      {lvl.name}
                    </h3>
                    <p className="text-sm text-textMuted leading-relaxed">
                      {lvl.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-creamDarker/50 text-[11px] font-semibold text-textMuted uppercase tracking-wider">
                    Contrôle humain individuel
                  </div>
                </div>
              )
            })}
        </div>

        {/* Honest Note Callout */}
        <div className="rounded-xl bg-creamDarker/50 border border-border p-4 flex items-start gap-3 max-w-3xl">
          <PiInfo size={18} className="text-textMuted mt-0.5 flex-shrink-0" />
          <p className="text-xs text-textMuted leading-relaxed font-medium">
            {t('vetting.disclaimer')}
          </p>
        </div>
      </div>
    </section>
  )
}
