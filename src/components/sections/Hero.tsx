/**
 * HERO SECTION
 * ─────────────────────────────────────────────────────────────────────────────
 * One strong sentence + subline + two CTAs.
 * Clicking a CTA scrolls to #waitlist AND preselects the role in the form.
 * We use a callback pattern: Hero calls onRoleSelect which App passes down
 * to the form. No global state library needed.
 *
 * Animation: text fades in on load (Motion). Purposeful and brief — 
 * does not block interaction or slow perceived load.
 */
import { motion } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/hooks/useTranslation'
import type { Role } from '@/types/form'
import { siteConfig } from '@/config/site.config'

interface HeroProps {
  onRoleSelect: (role: Role) => void
}

export function Hero({ onRoleSelect }: HeroProps) {
  const { t } = useTranslation()

  const scrollToForm = (role: Role) => {
    onRoleSelect(role)
    // Small delay so state updates before scroll
    setTimeout(() => {
      document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  return (
    <section className="bg-ink text-white section-y">
      <div className="container-site">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-6 text-xs font-semibold uppercase tracking-widest text-white/50"
        >
          {siteConfig.name} · RDC
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 }}
          className="mb-6 max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
        >
          {/* Signal yellow accent on the first word for visual anchor */}
          <span className="text-signal">{t('hero.title').split(' ')[0]}</span>{' '}
          {t('hero.title').split(' ').slice(1).join(' ')}
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.16 }}
          className="mb-10 max-w-xl text-lg leading-relaxed text-white/70"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.26 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            variant="primary"
            onClick={() => scrollToForm('brand')}
          >
            {t('hero.ctaBrand')}
          </Button>
          <Button
            size="lg"
            variant="ghost-light"
            onClick={() => scrollToForm('creator')}
          >
            {t('hero.ctaCreator')}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
