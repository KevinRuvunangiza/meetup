import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useTranslation } from '@/hooks/useTranslation'
import {
  PiVideoCamera,
  PiMegaphone,
  PiShuffle,
  PiGift,
  PiBroadcast,
  PiCoins,
  PiFileText,
} from 'react-icons/pi'

type CollabKey = 'ugc' | 'influence' | 'hybrid' | 'gifting'

export function CollabTypes() {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const [activeType, setActiveType] = useState<CollabKey>('ugc')

  const tabList: Array<{ key: CollabKey; label: string; icon: typeof PiVideoCamera }> = [
    { key: 'ugc', label: 'UGC', icon: PiVideoCamera },
    { key: 'influence', label: 'Influence', icon: PiMegaphone },
    { key: 'hybrid', label: 'Hybride', icon: PiShuffle },
    { key: 'gifting', label: 'Gifting (Dotation)', icon: PiGift },
  ]

  const typeData = t<{
    name: string
    tag: string
    summary: string
    publisher: string
    agreed: string
    compensation: string
  }>(`collabTypes.types.${activeType}`)

  return (
    <section className="bg-cream py-16 md:py-24 border-b border-border">
      <div className="container-site">
        <div className="max-w-2xl mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-saffron bg-ink px-3 py-1 rounded-full mb-3">
            {t('collabTypes.label')}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mb-4">
            {t('collabTypes.title')}
          </h2>
          <p className="text-base text-textMuted leading-relaxed">
            {t('collabTypes.subtitle')}
          </p>
        </div>

        {/* Interactive Segmented Control Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-2xl bg-creamDarker/60 border border-border inline-flex">
          {tabList.map((item) => {
            const Icon = item.icon
            const isActive = activeType === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveType(item.key)}
                className={`relative flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
                  isActive ? 'text-ink' : 'text-textMuted hover:text-ink'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCollabTypeTab"
                    className="absolute inset-0 rounded-xl bg-creamCard shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Icon
                  size={18}
                  className={`relative z-10 ${isActive ? 'text-saffron' : 'text-textMuted'}`}
                />
                <span className="relative z-10">{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Detailed Swapped Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeType}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className={`rounded-2xl border p-8 md:p-10 shadow-sm transition-all ${
              activeType === 'gifting'
                ? 'bg-creamCard border-saffron/40'
                : 'bg-creamCard border-creamDarker'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-creamDarker">
              <div>
                <span
                  className={`inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 ${
                    activeType === 'gifting'
                      ? 'bg-saffronSoft text-ink border border-saffron/40'
                      : 'bg-ink text-cream'
                  }`}
                >
                  {typeData?.tag}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
                  {typeData?.name}
                </h3>
              </div>

              {activeType === 'gifting' && (
                <div className="rounded-xl bg-saffronSoft/80 border border-saffron/30 px-4 py-2 text-xs font-bold text-ink max-w-xs">
                  Pas de transaction financière : produit offert pour test libre.
                </div>
              )}
            </div>

            <p className="text-base text-textMuted leading-relaxed mb-8 max-w-3xl">
              {typeData?.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl bg-cream p-5 border border-creamDarker">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-textMuted mb-2">
                  <PiBroadcast size={16} className="text-saffron" />
                  <span>Qui publie le contenu ?</span>
                </div>
                <p className="text-sm font-semibold text-ink leading-snug">
                  {typeData?.publisher}
                </p>
              </div>

              <div className="rounded-xl bg-cream p-5 border border-creamDarker">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-textMuted mb-2">
                  <PiFileText size={16} className="text-saffron" />
                  <span>Ce qui est convenu d’avance</span>
                </div>
                <p className="text-sm font-semibold text-ink leading-snug">
                  {typeData?.agreed}
                </p>
              </div>

              <div className="rounded-xl bg-cream p-5 border border-creamDarker">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-textMuted mb-2">
                  <PiCoins size={16} className="text-saffron" />
                  <span>Modèle de rémunération</span>
                </div>
                <p className="text-sm font-semibold text-ink leading-snug">
                  {typeData?.compensation}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
