/**
 * FAQ SECTION
 * 8 questions, accordion-style.
 * Uses native <details>/<summary> — zero JS, fully accessible,
 * works on slow connections, keyboard navigable.
 * We add a Motion transition for the open animation.
 */
import { Section, SectionHeader } from '@/components/ui/Section'
import { useTranslation } from '@/hooks/useTranslation'

interface FaqItem {
  q: string
  a: string
}

function FaqItem({ q, a }: FaqItem) {
  return (
    <details className="group border-b border-border last:border-b-0">
      <summary className="flex cursor-pointer items-start justify-between gap-4 py-5 text-left">
        <span className="font-semibold text-ink group-open:text-ink">{q}</span>
        {/* Chevron rotates on open */}
        <span
          className="mt-0.5 flex-shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        >
          ▾
        </span>
      </summary>
      <div className="pb-5 pr-8 text-sm leading-relaxed text-muted">{a}</div>
    </details>
  )
}

export function FAQ() {
  const { t } = useTranslation()
  const items = t('faq.items') as unknown as FaqItem[]
  const list = Array.isArray(items) ? items : []

  return (
    <Section id="faq">
      <SectionHeader
        label={t('faq.label')}
        title={t('faq.title')}
      />

      <div className="max-w-2xl rounded-xl border border-border bg-white divide-y divide-border overflow-hidden">
        {list.map((item) => (
          <FaqItem key={item.q} q={item.q} a={item.a} />
        ))}
      </div>
    </Section>
  )
}
