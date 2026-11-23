/**
 * HONEST PROMISE SECTION
 * Four direct statements about what early stage means.
 * Light background — visual break after two dark sections.
 */
import { motion } from 'motion/react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { useTranslation } from '@/hooks/useTranslation'

interface PromiseItem {
  heading: string
  body: string
}

export function Promise() {
  const { t } = useTranslation()
  const items = t('promise.items') as unknown as PromiseItem[]
  const list = Array.isArray(items) ? items : []

  return (
    <Section id="promise">
      <SectionHeader
        label={t('promise.label')}
        title={t('promise.title')}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {list.map((item, i) => (
          <motion.div
            key={item.heading}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
            className="flex gap-4 rounded-xl border border-border bg-white p-6"
          >
            {/* Yellow accent bar */}
            <div
              className="mt-1 h-6 w-1 flex-shrink-0 rounded-full bg-signal"
              aria-hidden="true"
            />
            <div>
              <h3 className="mb-2 font-bold text-ink">{item.heading}</h3>
              <p className="text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
