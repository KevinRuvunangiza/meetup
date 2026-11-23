/**
 * VETTING SECTION
 * Honest breakdown of what is and isn't verified.
 * No single "verified" badge — separate levels with clear labels.
 */
import { motion } from 'motion/react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { useTranslation } from '@/hooks/useTranslation'

interface VettingLevel {
  heading: string
  body: string
}

const icons = ['🪪', '🗂️', '📱']

export function Vetting() {
  const { t } = useTranslation()
  const levels = t('vetting.levels') as unknown as VettingLevel[]

  return (
    <Section id="vetting" dark>
      <SectionHeader
        label={t('vetting.label')}
        title={t('vetting.title')}
        subtitle={t('vetting.subtitle')}
        light
      />

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        {levels.map((level, i) => (
          <motion.div
            key={level.heading}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
            className="rounded-xl border border-white/10 bg-charcoal p-6"
          >
            <div className="mb-4 text-3xl" role="img" aria-label={level.heading}>
              {icons[i]}
            </div>
            <h3 className="mb-2 font-bold text-white">{level.heading}</h3>
            <p className="text-sm leading-relaxed text-white/60">{level.body}</p>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer — important honesty note */}
      <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4">
        <p className="text-sm text-white/70">{t('vetting.disclaimer')}</p>
      </div>
    </Section>
  )
}
