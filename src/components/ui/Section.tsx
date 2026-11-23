/**
 * SECTION COMPONENT
 * Consistent section wrapper with optional dark/light variant.
 * Handles container width, vertical padding, and background color.
 *
 * Usage:
 *   <Section dark label="Comment ça marche" title="...">
 *     ...children
 *   </Section>
 */
import { type ReactNode } from 'react'

interface SectionProps {
  id?: string
  children: ReactNode
  dark?: boolean         // ink background, white text
  signal?: boolean       // signal yellow background, ink text — use sparingly
  className?: string
  innerClassName?: string
  noPad?: boolean
}

export function Section({
  id,
  children,
  dark = false,
  signal: signalBg = false,
  className = '',
  innerClassName = '',
  noPad = false,
}: SectionProps) {
  const bg = dark
    ? 'bg-ink text-white'
    : signalBg
    ? 'bg-signal text-ink'
    : 'bg-paper text-ink'

  return (
    <section
      id={id}
      className={[bg, !noPad && 'section-y', className].filter(Boolean).join(' ')}
    >
      <div className={['container-site', innerClassName].filter(Boolean).join(' ')}>
        {children}
      </div>
    </section>
  )
}

/**
 * SECTION HEADER
 * Label (small caps above), title, optional subtitle.
 * Reused across all sections.
 */
interface SectionHeaderProps {
  label?: string
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean // white text (for dark sections)
}

export function SectionHeader({
  label,
  title,
  subtitle,
  centered = false,
  light = false,
}: SectionHeaderProps) {
  const align = centered ? 'text-center mx-auto' : ''
  const textColor = light ? 'text-white' : 'text-ink'
  const mutedColor = light ? 'text-white/60' : 'text-muted'

  return (
    <div className={['mb-12 max-w-prose', align].filter(Boolean).join(' ')}>
      {label && (
        <p className={['mb-3 text-xs font-semibold uppercase tracking-widest', mutedColor].join(' ')}>
          {label}
        </p>
      )}
      <h2 className={['text-3xl md:text-4xl font-bold leading-tight', textColor].join(' ')}>
        {title}
      </h2>
      {subtitle && (
        <p className={['mt-4 text-lg leading-relaxed', mutedColor].join(' ')}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
