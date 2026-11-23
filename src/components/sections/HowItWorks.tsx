/**
 * HOW IT WORKS SECTION
 * Two columns: Brands (3 steps) and Creators (3 steps).
 * Dark background to visually separate from Problem section.
 */
import { motion } from 'motion/react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { useTranslation } from '@/hooks/useTranslation'

interface Step {
  step: string
  heading: string
  body: string
}

function StepList({ steps, light }: { steps: Step[]; light: boolean }) {
  return (
    <ol className="flex flex-col gap-8">
      {steps.map((s, i) => (
        <motion.li
          key={s.step}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
          className="flex gap-5"
        >
          {/* Step number */}
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-signal text-ink font-bold text-sm"
            aria-hidden="true"
          >
            {s.step}
          </div>

          <div>
            <h4 className={['font-bold mb-1', light ? 'text-white' : 'text-ink'].join(' ')}>
              {s.heading}
            </h4>
            <p className={['text-sm leading-relaxed', light ? 'text-white/60' : 'text-muted'].join(' ')}>
              {s.body}
            </p>
          </div>
        </motion.li>
      ))}
    </ol>
  )
}

export function HowItWorks() {
  const { t } = useTranslation()

  const brandSteps = t('howItWorks.brand') as unknown as Step[]
  const creatorSteps = t('howItWorks.creator') as unknown as Step[]

  return (
    <Section id="how-it-works" dark>
      <SectionHeader
        label={t('howItWorks.label')}
        title=""
        light
      />

      <div className="grid gap-16 md:grid-cols-2">
        {/* Brands */}
        <div>
          <h3 className="mb-8 text-xl font-bold text-white border-b border-white/10 pb-4">
            {t('howItWorks.brandTitle')}
          </h3>
          <StepList steps={brandSteps} light />
        </div>

        {/* Creators */}
        <div>
          <h3 className="mb-8 text-xl font-bold text-white border-b border-white/10 pb-4">
            {t('howItWorks.creatorTitle')}
          </h3>
          <StepList steps={creatorSteps} light />
        </div>
      </div>
    </Section>
  )
}
