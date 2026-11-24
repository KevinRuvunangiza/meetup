import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useTranslation } from '@/hooks/useTranslation'
import {
  PiBuildings,
  PiUser,
  PiArrowRight,
  PiPencilSimpleLine,
  PiCards,
  PiCheckCircle,
  PiHandshake,
  PiFilmSlate,
  PiSealCheck,
} from 'react-icons/pi'
import type { Role } from '@/types/form'

export function HowItWorks() {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const [activeRole, setActiveRole] = useState<Role>('brand')

  const brandSteps = t<Array<{ step: string; title: string; desc: string }>>('howItWorks.brandSteps')
  const creatorSteps = t<Array<{ step: string; title: string; desc: string }>>('howItWorks.creatorSteps')

  const currentSteps = activeRole === 'brand' ? brandSteps : creatorSteps

  const brandIcons = [PiPencilSimpleLine, PiCards, PiHandshake]
  const creatorIcons = [PiSealCheck, PiCards, PiFilmSlate]
  const currentIcons = activeRole === 'brand' ? brandIcons : creatorIcons

  return (
    <section id="how-it-works" className="bg-cream py-16 md:py-24 border-b border-border">
      <div className="container-site">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-saffron bg-ink px-3 py-1 rounded-full mb-3">
              {t('howItWorks.label')}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight">
              {t('howItWorks.title')}
            </h2>
          </div>

          {/* Toggle Switch */}
          <div className="inline-flex rounded-xl bg-creamDarker/60 p-1.5 border border-border self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveRole('brand')}
              className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                activeRole === 'brand' ? 'text-ink' : 'text-textMuted hover:text-ink'
              }`}
            >
              {activeRole === 'brand' && (
                <motion.div
                  layoutId="activeHowRole"
                  className="absolute inset-0 rounded-lg bg-creamCard shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <PiBuildings className="relative z-10" />
              <span className="relative z-10">{t('howItWorks.tabBrand')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole('creator')}
              className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                activeRole === 'creator' ? 'text-ink' : 'text-textMuted hover:text-ink'
              }`}
            >
              {activeRole === 'creator' && (
                <motion.div
                  layoutId="activeHowRole"
                  className="absolute inset-0 rounded-lg bg-creamCard shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <PiUser className="relative z-10" />
              <span className="relative z-10">{t('howItWorks.tabCreator')}</span>
            </button>
          </div>
        </div>

        {/* Steps Row */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {Array.isArray(currentSteps) &&
              currentSteps.map((step, idx) => {
                const Icon = currentIcons[idx] ?? PiCheckCircle
                return (
                  <div
                    key={idx}
                    className="relative flex flex-col justify-between rounded-2xl border border-creamDarker bg-creamCard p-7 shadow-sm hover:border-border transition-all"
                  >
                    <div>
                      {/* Step Number + Icon Header */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink font-display text-sm font-bold text-cream">
                          0{idx + 1}
                        </span>
                        <div className="h-9 w-9 rounded-lg bg-saffronSoft flex items-center justify-center text-saffron">
                          <Icon size={20} />
                        </div>
                      </div>

                      <h3 className="font-display text-xl font-bold text-ink mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-textMuted leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-creamDarker/50 flex items-center justify-between text-xs font-semibold text-textMuted">
                      <span>{activeRole === 'brand' ? 'Engagement marque' : 'Accompagnement créateur'}</span>
                      <PiArrowRight className="text-saffron" />
                    </div>
                  </div>
                )
              })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
