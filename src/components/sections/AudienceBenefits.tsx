import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useTranslation } from '@/hooks/useTranslation'
import {
  PiBuildings,
  PiUser,
  PiListChecks,
  PiFileText,
  PiChatsCircle,
  PiCoins,
  PiScroll,
  PiHandCoins,
  PiArrowRight,
} from 'react-icons/pi'
import type { Role } from '@/types/form'

interface AudienceBenefitsProps {
  onSelectRole?: (role: Role) => void
}

export function AudienceBenefits({ onSelectRole }: AudienceBenefitsProps) {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const [activeTab, setActiveTab] = useState<Role>('brand')

  const brandIcons = [PiListChecks, PiFileText, PiChatsCircle]
  const creatorIcons = [PiCoins, PiScroll, PiHandCoins]

  const brandBenefits = t<Array<{ title: string; desc: string }>>('audienceBenefits.brand')
  const creatorBenefits = t<Array<{ title: string; desc: string }>>('audienceBenefits.creator')

  const currentBenefits = activeTab === 'brand' ? brandBenefits : creatorBenefits
  const currentIcons = activeTab === 'brand' ? brandIcons : creatorIcons

  const handleCtaClick = () => {
    onSelectRole?.(activeTab)
    const formElement = document.getElementById('hero-quick-form') ?? document.getElementById('waitlist')
    formElement?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="bg-cream py-16 md:py-24 border-b border-border">
      <div className="container-site">
        {/* Header with Segmented Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-saffron bg-ink px-3 py-1 rounded-full mb-3">
              {t('audienceBenefits.label')}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight">
              {t('audienceBenefits.title')}
            </h2>
          </div>

          {/* Tab Switcher */}
          <div className="inline-flex rounded-xl bg-creamDarker/60 p-1.5 border border-border self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('brand')}
              className={`relative flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-colors ${
                activeTab === 'brand' ? 'text-ink' : 'text-textMuted hover:text-ink'
              }`}
            >
              {activeTab === 'brand' && (
                <motion.div
                  layoutId="activeAudienceTab"
                  className="absolute inset-0 rounded-lg bg-creamCard shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <PiBuildings className="relative z-10 text-base" />
              <span className="relative z-10">{t('audienceBenefits.tabBrand')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('creator')}
              className={`relative flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-colors ${
                activeTab === 'creator' ? 'text-ink' : 'text-textMuted hover:text-ink'
              }`}
            >
              {activeTab === 'creator' && (
                <motion.div
                  layoutId="activeAudienceTab"
                  className="absolute inset-0 rounded-lg bg-creamCard shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <PiUser className="relative z-10 text-base" />
              <span className="relative z-10">{t('audienceBenefits.tabCreator')}</span>
            </button>
          </div>
        </div>

        {/* Benefits Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {Array.isArray(currentBenefits) &&
              currentBenefits.map((b, idx) => {
                const IconComponent = currentIcons[idx] ?? PiListChecks
                return (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-2xl border border-creamDarker bg-creamCard p-8 shadow-sm hover:border-saffron/40 hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="h-12 w-12 rounded-xl bg-saffronSoft flex items-center justify-center text-saffron mb-6">
                        <IconComponent size={24} />
                      </div>
                      <h3 className="font-display text-xl font-bold text-ink mb-3 leading-snug">
                        {b.title}
                      </h3>
                      <p className="text-sm text-textMuted leading-relaxed">
                        {b.desc}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-creamDarker/60 flex items-center text-xs font-semibold text-textMuted">
                      <span>Étape {idx + 1} de votre expérience</span>
                    </div>
                  </div>
                )
              })}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-textMuted text-center sm:text-left">
            {activeTab === 'brand'
              ? 'Vous avez une campagne ou un lancement en vue ?'
              : 'Vous cherchez des partenariats réguliers et rémunérés ?'}
          </p>
          <button
            type="button"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-saffron transition-colors"
          >
            <span>{activeTab === 'brand' ? 'Inscrire ma marque' : 'Inscrire mon profil créateur'}</span>
            <PiArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
