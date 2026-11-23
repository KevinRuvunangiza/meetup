/**
 * COLLABORATION TYPES SECTION
 * Four cards: UGC, Influencer, Hybrid, Gifting.
 * Gifting card is visually distinct (unpaid tag, lighter treatment).
 * Note at bottom: terms are always agreed before work starts.
 */
import { motion } from 'motion/react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { useTranslation } from '@/hooks/useTranslation'

interface CollabItem {
  type: string
  heading: string
  body: string
  tag: string
}

export function CollabTypes() {
  const { t } = useTranslation()

  const items = t('collabTypes.items') as unknown as CollabItem[]

  return (
    <Section id="collab-types">
      <SectionHeader
        label={t('collabTypes.label')}
        title={t('collabTypes.title')}
        subtitle={t('collabTypes.subtitle')}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const isPaid = item.tag !== 'Non payé' && item.tag !== 'Unpaid'

          return (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
              className={[
                'rounded-xl border p-6 flex flex-col',
                isPaid ? 'bg-white border-border' : 'bg-paper border-border',
              ].join(' ')}
            >
              {/* Tag */}
              <span
                className={[
                  'mb-4 self-start rounded-full px-3 py-1 text-xs font-semibold',
                  isPaid
                    ? 'bg-signal text-ink'
                    : 'bg-border text-muted',
                ].join(' ')}
              >
                {item.tag}
              </span>

              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                {item.type}
              </p>
              <h3 className="mb-3 text-base font-bold text-ink leading-snug">
                {item.heading}
              </h3>
              <p className="text-sm leading-relaxed text-muted flex-1">{item.body}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Important note */}
      <div className="mt-10 rounded-xl bg-ink/5 border border-border px-6 py-4">
        <p className="text-sm font-medium text-ink">{t('collabTypes.note')}</p>
      </div>
    </Section>
  )
}
