import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useTranslation } from '@/hooks/useTranslation'
import { useWhatsAppModal } from '@/context/WhatsAppModalContext'
import {
  PiPlus,
  PiMinus,
  PiBuildings,
  PiUser,
  PiInfo,
  PiChatDots,
  PiArrowRight,
} from 'react-icons/pi'

type FaqTab = 'brands' | 'creators' | 'general'

interface FaqItem {
  q: string
  a: string
}

export function FAQ() {
  const { t } = useTranslation()
  const { openWhatsAppChooser } = useWhatsAppModal()
  const shouldReduceMotion = useReducedMotion()
  const [activeTab, setActiveTab] = useState<FaqTab>('brands')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const tabOptions: Array<{ key: FaqTab; label: string; icon: typeof PiBuildings }> = [
    { key: 'brands', label: t('faq.tabBrands'), icon: PiBuildings },
    { key: 'creators', label: t('faq.tabCreators'), icon: PiUser },
    { key: 'general', label: t('faq.tabGeneral'), icon: PiInfo },
  ]

  const items = t<FaqItem[]>(`faq.items.${activeTab}`)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const handleTabChange = (tab: FaqTab) => {
    setActiveTab(tab)
    setOpenIndex(0)
  }

  return (
    <section id="faq" className="bg-cream py-16 md:py-24 border-b border-border">
      <div className="container-site max-w-4xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-saffron bg-ink px-3 py-1 rounded-full mb-3">
            {t('faq.label')}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mb-4">
            {t('faq.title')}
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-2xl bg-creamDarker/60 p-1.5 border border-border">
            {tabOptions.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors ${
                    isActive ? 'text-ink' : 'text-textMuted hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFaqTab"
                      className="absolute inset-0 rounded-xl bg-creamCard shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={18}
                    className={`relative z-10 ${isActive ? 'text-saffron' : 'text-textMuted'}`}
                  />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 mb-14">
          {Array.isArray(items) &&
            items.map((item, idx) => {
              const isOpen = openIndex === idx
              const headerId = `faq-header-${activeTab}-${idx}`
              const panelId = `faq-panel-${activeTab}-${idx}`

              return (
                <div
                  key={`${activeTab}-${idx}`}
                  className="rounded-2xl border border-creamDarker bg-creamCard overflow-hidden transition-all shadow-sm hover:border-border"
                >
                  <button
                    type="button"
                    id={headerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => handleToggle(idx)}
                    className="flex w-full items-center justify-between gap-4 p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                  >
                    <span className="font-display text-lg sm:text-xl font-bold text-ink pr-2">
                      {item.q}
                    </span>
                    <span
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                        isOpen ? 'bg-saffron text-ink rotate-180' : 'bg-cream text-textMuted'
                      }`}
                    >
                      {isOpen ? <PiMinus size={18} /> : <PiPlus size={18} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={headerId}
                        initial={
                          shouldReduceMotion
                            ? { opacity: 1, height: 'auto' }
                            : { opacity: 0, height: 0 }
                        }
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={
                          shouldReduceMotion
                            ? { opacity: 0, height: 0 }
                            : { opacity: 0, height: 0 }
                        }
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-textMuted leading-relaxed border-t border-creamDarker/40 mt-1">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
        </div>

        {/* WhatsApp Card at bottom */}
        <div className="rounded-2xl bg-charcoal text-cream p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-borderDark">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-cream">
              {t('faq.whatsappTitle')}
            </h3>
            <p className="text-sm text-textOffWhite/80">
              {t('faq.whatsappSubtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openWhatsAppChooser()}
            className="flex-shrink-0 inline-flex items-center gap-2.5 rounded-xl bg-saffron px-6 py-3.5 text-sm font-bold text-ink hover:bg-saffronHover transition-all shadow-md group"
          >
            <PiChatDots size={20} className="text-ink" />
            <span>{t('faq.whatsappCta')}</span>
            <PiArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  )
}
