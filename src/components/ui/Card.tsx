/**
 * CARD COMPONENT
 * General-purpose card with optional signal yellow accent bar on top.
 */
import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  accent?: boolean    // signal yellow top border
  dark?: boolean      // charcoal bg (for use inside dark sections)
  className?: string
}

export function Card({ children, accent = false, dark = false, className = '' }: CardProps) {
  const bg = dark ? 'bg-charcoal text-white' : 'bg-white text-ink'
  const border = dark ? 'border-border-dark' : 'border-border'

  return (
    <div
      className={[
        'rounded-xl border overflow-hidden',
        bg,
        border,
        accent ? 'border-t-4 border-t-signal' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

/**
 * EXAMPLE CREATOR CARD
 * Used in the "examples" section.
 * ALWAYS shows the "Example" badge — clearly labelled as fictional.
 * No real photos: uses a geometric placeholder avatar.
 */
interface ExampleCreatorCardProps {
  badge: string
  name: string
  type: string
  niches: string[]
  bio: string
  platforms: { name: string; followers: string }[]
  verified: string[]
}

export function ExampleCreatorCard({
  badge,
  name = '',
  type,
  niches = [],
  bio,
  platforms = [],
  verified = [],
}: ExampleCreatorCardProps) {
  return (
    <Card accent>
      <div className="p-6">
        {/* Badge — always shown */}
        <span className="inline-block rounded-full bg-signal-soft border border-signal px-3 py-1 text-xs font-semibold text-ink mb-4">
          {badge}
        </span>

        {/* Avatar placeholder — geometric, no photo */}
        <div className="flex items-center gap-4 mb-4">
          <div
            aria-hidden="true"
            className="h-14 w-14 rounded-full bg-ink flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
          >
            {name?.charAt(0) ?? ''}
          </div>
          <div>
            <p className="font-bold text-lg text-ink">{name}</p>
            <p className="text-sm text-muted">{type}</p>
          </div>
        </div>

        {/* Niches */}
        <div className="flex flex-wrap gap-2 mb-4">
          {niches?.map((n) => (
            <span
              key={n}
              className="rounded-full bg-paper border border-border px-3 py-1 text-xs font-medium text-ink"
            >
              {n}
            </span>
          ))}
        </div>

        {/* Bio */}
        <p className="text-sm text-muted mb-4">{bio}</p>

        {/* Platforms */}
        <div className="flex flex-col gap-1 mb-4">
          {platforms?.map((p) => (
            <div key={p.name} className="flex justify-between text-sm">
              <span className="font-medium text-ink">{p.name}</span>
              <span className="text-muted">{p.followers}</span>
            </div>
          ))}
        </div>

        {/* Verification levels */}
        <div className="border-t border-border pt-4 flex flex-col gap-1">
          {verified?.map((v) => (
            <div key={v} className="flex items-center gap-2 text-sm text-ink">
              <span className="text-signal font-bold" aria-hidden="true">✓</span>
              {v}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

/**
 * EXAMPLE CAMPAIGN CARD
 * Illustrates what a brand brief looks like. Always shows "Example" badge.
 */
interface ExampleCampaignCardProps {
  badge: string
  brandName: string
  sector: string
  need: string
  deliverables: string
  deadline: string
  budget: string
  usage: string
  note: string
}

export function ExampleCampaignCard({
  badge,
  brandName,
  sector,
  need,
  deliverables,
  deadline,
  budget,
  usage,
  note,
}: ExampleCampaignCardProps) {
  const rows = [
    { label: need, value: null, isHeading: true },
    { label: 'Livrables', value: deliverables },
    { label: 'Délai', value: deadline },
    { label: 'Budget', value: budget },
    { label: 'Droits', value: usage },
  ]

  return (
    <Card>
      <div className="p-6">
        {/* Badge */}
        <span className="inline-block rounded-full bg-signal-soft border border-signal px-3 py-1 text-xs font-semibold text-ink mb-4">
          {badge}
        </span>

        <div className="mb-4">
          <p className="font-bold text-lg text-ink">{brandName}</p>
          <p className="text-sm text-muted">{sector}</p>
        </div>

        <div className="flex flex-col gap-3">
          {rows.map(({ label, value }) =>
            value ? (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {label}
                </span>
                <span className="text-sm text-ink">{value}</span>
              </div>
            ) : null,
          )}
        </div>

        <p className="mt-4 border-t border-border pt-4 text-xs text-muted">
          {note}
        </p>
      </div>
    </Card>
  )
}
