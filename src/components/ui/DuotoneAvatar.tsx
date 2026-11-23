import type { CreatorCard } from '@/data/creatorCards'

interface DuotoneAvatarProps {
  card: CreatorCard
  className?: string
}

/**
 * DUOTONE AVATAR / PORTRAIT PLACEHOLDER
 * Premium editorial placeholder graphics for creator profiles.
 * Pure SVG vectors with rich depth, subtle noise, and zero human facial depictions.
 * When card.photoUrl is supplied, renders the real photograph automatically.
 */
export function DuotoneAvatar({ card, className = '' }: DuotoneAvatarProps) {
  if (card.photoUrl) {
    return (
      <img
        src={card.photoUrl}
        alt={card.name}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    )
  }

  const { bg, accent, patternType } = card.duotone

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ backgroundColor: bg }}
      aria-label={`Visual abstrait pour ${card.name}`}
      role="img"
    >
      {patternType === 'geometric' && (
        <svg
          viewBox="0 0 240 320"
          className="absolute inset-0 h-full w-full opacity-90 transition-transform duration-700 group-hover:scale-105"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`grad-geo-${card.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.8" />
              <stop offset="100%" stopColor={bg} stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="240" height="320" fill={bg} />
          {/* Layered architectural facets */}
          <polygon points="0,0 240,40 160,200 0,160" fill={`url(#grad-geo-${card.id})`} opacity="0.6" />
          <polygon points="80,120 240,160 200,320 40,280" fill={accent} opacity="0.35" />
          <circle cx="170" cy="90" r="50" fill={accent} opacity="0.2" />
          <path d="M-20,240 Q60,180 140,260 T260,200" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.5" />
          <path d="M-10,260 Q70,200 150,280 T270,220" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.3" />
        </svg>
      )}

      {patternType === 'topography' && (
        <svg
          viewBox="0 0 240 320"
          className="absolute inset-0 h-full w-full opacity-90 transition-transform duration-700 group-hover:scale-105"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`grad-topo-${card.id}`} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.7" />
              <stop offset="100%" stopColor={bg} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <rect width="240" height="320" fill={bg} />
          <path
            d="M-20,80 C40,40 100,120 180,60 C220,30 260,70 280,100 L280,320 L-20,320 Z"
            fill={`url(#grad-topo-${card.id})`}
            opacity="0.5"
          />
          <path d="M0,70 Q60,130 140,90 T260,110" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.6" />
          <path d="M0,110 Q80,170 160,130 T260,150" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.45" />
          <path d="M0,150 Q100,210 180,170 T260,190" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.3" />
          <path d="M0,190 Q120,250 200,210 T260,230" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.2" />
        </svg>
      )}

      {patternType === 'concentric' && (
        <svg
          viewBox="0 0 240 320"
          className="absolute inset-0 h-full w-full opacity-90 transition-transform duration-700 group-hover:scale-105"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id={`grad-conc-${card.id}`} cx="60%" cy="40%" r="70%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.65" />
              <stop offset="100%" stopColor={bg} stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <rect width="240" height="320" fill={bg} />
          <circle cx="150" cy="130" r="120" fill={`url(#grad-conc-${card.id})`} opacity="0.6" />
          <circle cx="150" cy="130" r="90" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.5" />
          <circle cx="150" cy="130" r="65" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.4" />
          <circle cx="150" cy="130" r="40" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.3" />
          <circle cx="150" cy="130" r="18" fill={accent} opacity="0.25" />
        </svg>
      )}

      {/* Subtle bottom vignette gradient to ensure metadata readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
    </div>
  )
}
