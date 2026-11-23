/**
 * PROBLEM SECTION
 * Three honest pain points, specific and respectful.
 */
import { motion } from 'motion/react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { useTranslation } from '@/hooks/useTranslation'

export function Problem() {
  const { t } = useTranslation()

  // Translation returns an array for problem.items
  const items = t('problem.items') as unknown as Array<{
    heading: string
    body: string
  }>

  // Pull array from translation — safely
  const rawItems = Array.isArray(items) ? items : []

  return (
    <Section id="problem">
      <SectionHeader
        label={t('problem.label')}
        title={t('problem.title')}
        subtitle={t('problem.intro')}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {rawItems.map((item, i) => (
          <motion.div
            key={item.heading}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
            className="rounded-xl border border-border bg-white p-6"
          >
            <div className="mb-3 h-1 w-10 rounded-full bg-signal" aria-hidden="true" />
            <h3 className="mb-2 text-lg font-bold text-ink">{item.heading}</h3>
            <p className="text-sm leading-relaxed text-muted">{item.body}</p>
          </motion.div>
        ))}
      </div>

      <p className="mt-10 max-w-prose text-base font-medium text-ink">
        {t('problem.closing')}
      </p>
    </Section>
  )
}
