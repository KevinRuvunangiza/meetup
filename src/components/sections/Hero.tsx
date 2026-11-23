import { useEffect, useState } from 'react'
import { LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react'
import { siteConfig } from '@/config/site.config'
import { useTranslation } from '@/hooks/useTranslation'
import type { Role } from '@/types/form'
import { featuredCreatorCards } from '@/data/creatorCards'
import { CreatorVerticalCard } from '@/components/ui/CreatorVerticalCard'
import { HeroWaitlistForm } from '@/components/sections/HeroWaitlistForm'
import { PiSealCheck, PiCheck, PiArrowRight } from 'react-icons/pi'

interface HeroProps {
  onRoleSelect?: (role: Role) => void
  initialRole?: Role
}

export function Hero({ onRoleSelect, initialRole }: HeroProps) {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const [showStickyMobileCta, setShowStickyMobileCta] = useState(false)

  // Listen to scroll to reveal the sticky mobile "Join waitlist" CTA
  useEffect(() => {
    const handleScroll = () => {
      const heroForm = document.getElementById('hero-quick-form')
      if (heroForm) {
        const rect = heroForm.getBoundingClientRect()
        // If the bottom of the form has scrolled out of view, show sticky bar
        setShowStickyMobileCta(rect.bottom < 0)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToHeroForm = () => {
    document.getElementById('hero-quick-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <LazyMotion features={domAnimation}>
      <section className="relative overflow-hidden bg-cream pt-10 pb-16 md:pt-14 md:pb-24 border-b border-border">
        {/* Subtle radial warmth in background */}
        <div
          className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-saffron/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/2 -left-40 h-[500px] w-[500px] rounded-full bg-creamDarker/60 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-site relative z-10">
          {/* Top trust strip / pill */}
          <m.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex flex-wrap items-center gap-2"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-creamDarker/80 border border-border px-3 py-1 text-xs font-semibold text-ink">
              <span className="h-2 w-2 rounded-full bg-saffron" aria-hidden="true" />
              <span>{siteConfig.name} · RDC</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-textMuted">
              <span>Kinshasa</span>
              <span>•</span>
              <span>Lubumbashi</span>
              <span>•</span>
              <span>Goma</span>
            </span>
          </m.div>

          {/* 2-Column Hero Grid: Left Content & Quick Form, Right Interactive Product Collage */}
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 lg:items-start">
            {/* Left Column (Editorial Headline + Form) */}
            <div className="lg:col-span-7 flex flex-col">
              {/* Main Headline with Tight Leading */}
              <m.h1
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
                className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold tracking-tight text-ink leading-[1.04] mb-5"
              >
                Finis les deals par DM.{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-ink">Collaborez</span>
                  <span
                    className="absolute bottom-1.5 left-0 -right-1 h-3 sm:h-3.5 bg-saffron/80 -rotate-1 z-0 rounded-sm"
                    aria-hidden="true"
                  />
                </span>{' '}
                en toute confiance.
              </m.h1>

              {/* Subtitle */}
              <m.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: 0.12 }}
                className="text-base sm:text-lg text-textMuted max-w-xl leading-relaxed mb-8"
              >
                {t('hero.subtitle')}
              </m.p>

              {/* 3 Quick Value Anchors (No emojis, thin stroke checks) */}
              <m.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.18 }}
                className="flex flex-wrap gap-y-2 gap-x-4 mb-8 text-xs sm:text-sm font-medium text-ink"
              >
                <div className="flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-saffron/30 text-ink">
                    <PiCheck size={11} />
                  </span>
                  <span>{t('hero.trustTag1')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-saffron/30 text-ink">
                    <PiCheck size={11} />
                  </span>
                  <span>{t('hero.trustTag2')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-saffron/30 text-ink">
                    <PiSealCheck size={13} className="text-saffron" />
                  </span>
                  <span>{t('hero.trustTag3')}</span>
                </div>
              </m.div>

              {/* Interactive Waitlist Form right in the Hero */}
              <div id="hero-quick-form" className="max-w-xl">
                <HeroWaitlistForm
                  initialRole={initialRole}
                  onSubmitted={() => {
                    onRoleSelect?.('brand')
                  }}
                />
              </div>
            </div>

            {/* Right Column: The Product Visual (Floating Tilted Creator Cards Collage) */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0 flex flex-col items-center justify-center">
              {/* Product Label */}
              <div className="w-full flex items-center justify-between mb-4 px-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-textMuted">
                  Aperçu de la sélection vérifiée
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink bg-creamDarker px-2 py-0.5 rounded-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-saffron animate-pulse" />
                  <span>3 profils illustratifs</span>
                </span>
              </div>

              {/* Cards Container with depth perspective */}
              <div className="relative w-full min-h-[460px] sm:min-h-[520px] flex items-center justify-center py-4">
                {/* Background decorative card (Card 3: Syntyche B. - Goma) */}
                <m.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -20, rotate: -6 }}
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1, rotate: -6 }
                      : {
                          opacity: 1,
                          x: 0,
                          rotate: -6,
                          y: [0, -6, 0],
                        }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0.3 : 0.6,
                    y: {
                      repeat: Infinity,
                      duration: 4.8,
                      ease: 'easeInOut',
                    },
                  }}
                  className="absolute left-0 sm:left-2 top-10 sm:top-8 z-0 hidden sm:block opacity-60 hover:opacity-100 transition-opacity"
                >
                  <CreatorVerticalCard card={featuredCreatorCards[2]} />
                </m.div>

                {/* Secondary card (Card 2: Christian M. - Lubumbashi) */}
                <m.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 25, rotate: 6 }}
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1, rotate: 6 }
                      : {
                          opacity: 1,
                          x: 0,
                          rotate: 6,
                          y: [0, -10, 0],
                        }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0.3 : 0.6,
                    y: {
                      repeat: Infinity,
                      duration: 5.4,
                      ease: 'easeInOut',
                      delay: 0.4,
                    },
                  }}
                  className="absolute right-0 sm:right-2 top-4 sm:top-2 z-10 hidden sm:block opacity-85 hover:opacity-100 hover:z-30 transition-all"
                >
                  <CreatorVerticalCard card={featuredCreatorCards[1]} />
                </m.div>

                {/* Foreground Hero card (Card 1: Amara K. - Kinshasa) */}
                <m.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20, rotate: -1.5 }}
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1, rotate: -1.5 }
                      : {
                          opacity: 1,
                          rotate: -1.5,
                          y: [0, -8, 0],
                        }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0.3 : 0.5,
                    delay: 0.1,
                    y: {
                      repeat: Infinity,
                      duration: 4.2,
                      ease: 'easeInOut',
                    },
                  }}
                  className="relative z-20 hover:scale-105 hover:rotate-0 transition-transform duration-300"
                >
                  <CreatorVerticalCard card={featuredCreatorCards[0]} priority />
                </m.div>
              </div>
             
            </div>
          </div>
        </div>

        {/* Sticky Mobile "Join the Waitlist" Bar (Mobile only, visible on scroll) */}
        {showStickyMobileCta && (
          <m.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-cream/95 backdrop-blur-md border-t border-border shadow-2xl md:hidden"
          >
            <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
              <div className="flex flex-col">
                <span className="font-display font-bold text-xs text-ink">{siteConfig.name}</span>
                <span className="text-[11px] text-muted">Accès prioritaire gratuit</span>
              </div>
              <button
                type="button"
                onClick={scrollToHeroForm}
                className="flex items-center gap-1.5 rounded-xl bg-saffron px-4 py-2.5 text-xs font-bold text-ink shadow-md active:scale-95 cursor-pointer"
              >
                <span>Rejoindre la liste</span>
                <PiArrowRight size={14} />
              </button>
            </div>
          </m.div>
        )}
      </section>
    </LazyMotion>
  )
}
