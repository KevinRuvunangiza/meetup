import type { CreatorCard } from '@/data/creatorCards'
import { DuotoneAvatar } from '@/components/ui/DuotoneAvatar'
import { PiSealCheck, PiInstagramLogo, PiTiktokLogo, PiYoutubeLogo } from 'react-icons/pi'

interface CreatorVerticalCardProps {
  card: CreatorCard
  className?: string
  priority?: boolean
}

export function CreatorVerticalCard({ card, className = '', priority = false }: CreatorVerticalCardProps) {
  return (
    <article
      className={`group relative flex w-64 sm:w-72 flex-col overflow-hidden rounded-2xl border border-creamDarker/40 bg-ink text-white shadow-2xl transition-all duration-300 hover:shadow-saffron/10 ${className}`}
      style={{
        boxShadow: priority
          ? '0 25px 50px -12px rgba(14, 14, 14, 0.45), 0 0 0 1px rgba(242, 169, 0, 0.25)'
          : '0 20px 35px -10px rgba(14, 14, 14, 0.35)',
      }}
    >
      {/* Visual Header / Avatar */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal">
        <DuotoneAvatar card={card} />

        {/* Top Floating Chips */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
          {/* Niche Badge */}
          <span className="rounded-full bg-ink/75 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[11px] font-medium text-off-white tracking-wide">
            {card.niche}
          </span>

          {/* Verification Chip */}
          <span className="inline-flex items-center gap-1 rounded-full bg-saffron text-ink px-2.5 py-1 text-[11px] font-bold tracking-tight shadow-sm">
            <PiSealCheck size={13} className="text-ink" />
            <span>Vérifié</span>
          </span>
        </div>

        {/* Creator Identity Overlay */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10">
          <p className="text-xl font-bold font-display tracking-tight text-white leading-tight">
            {card.name}
          </p>
          <div className="flex items-center justify-between text-xs text-textMutedDark mt-0.5">
            <span>{card.handle}</span>
            <span className="text-white/60">• {card.city}</span>
          </div>
        </div>
      </div>

      {/* Card Body & Metrics */}
      <div className="flex flex-col gap-3 p-4 bg-ink/95 border-t border-white/10">
        {/* Deliverable focus */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-textMutedDark uppercase tracking-wider text-[10px] font-semibold">
            Spécialité
          </span>
          <span className="text-xs font-medium text-white/90">{card.highlight}</span>
        </div>

        {/* Platform stats */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          {card.platforms.map((p) => (
            <div
              key={p.platform}
              className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-xs text-white/90 border border-white/5"
            >
              {p.platform === 'instagram' && <PiInstagramLogo size={13} className="text-saffron" />}
              {p.platform === 'tiktok' && <PiTiktokLogo size={13} className="text-saffron" />}
              {p.platform === 'youtube' && <PiYoutubeLogo size={13} className="text-saffron" />}
              <span className="font-semibold text-[11px]">{p.followers}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
