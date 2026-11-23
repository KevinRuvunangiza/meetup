import { motion } from 'motion/react'
import type { CreatorItem } from '@/data/examples'
import {
  PiSealCheck,
  PiInstagramLogo,
  PiTiktokLogo,
  PiYoutubeLogo,
} from 'react-icons/pi'

interface CreatorCardProps {
  creator: CreatorItem
  onSelectCreator?: (creator: CreatorItem) => void
}

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <motion.article
      layout="position"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-creamDarker bg-creamCard text-ink shadow-sm hover:shadow-xl hover:border-border transition-all flex-shrink-0"
    >
      {/* 4:5 Portrait Image Slot with explicit width & height */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal">
        {creator.portraitImageUrl ? (
          <img
            src={creator.portraitImageUrl}
            alt={creator.name}
            width={400}
            height={500}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <svg
            viewBox="0 0 400 500"
            width={400}
            height={500}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`creat-grad-${creator.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={creator.duotone.accent} stopOpacity="0.8" />
                <stop offset="100%" stopColor={creator.duotone.bg} stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <rect width="400" height="500" fill={creator.duotone.bg} />
            <polygon points="0,0 400,60 300,500 0,440" fill={`url(#creat-grad-${creator.id})`} opacity="0.45" />
            <circle cx="280" cy="180" r="130" fill={creator.duotone.accent} opacity="0.25" />
            <path d="M-20,380 Q100,260 220,380 T420,320" stroke={creator.duotone.accent} strokeWidth="2" fill="none" opacity="0.4" />
          </svg>
        )}

        {/* Top Floating Badge (Verification chip) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <span className="rounded-full bg-ink/75 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[11px] font-medium text-white tracking-wide">
            {creator.city}
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-saffron text-ink px-2.5 py-1 text-[11px] font-bold tracking-tight shadow-sm">
            <PiSealCheck size={13} />
            <span>{creator.levelChip}</span>
          </span>
        </div>

        {/* Identity Overlay on portrait base */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <p className="text-xl font-bold font-display tracking-tight text-white leading-tight">
            {creator.name}
          </p>
          <p className="text-xs text-white/70 mt-0.5">{creator.handle}</p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent pointer-events-none" />
      </div>

      {/* Creator Metadata */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {/* Highlight note */}
          <p className="text-xs font-medium text-muted line-clamp-1 mb-3">
            {creator.highlight}
          </p>

          {/* Niche Chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {creator.niches.map((n) => (
              <span
                key={n}
                className="rounded-md bg-creamDarker/60 px-2 py-0.5 text-[11px] font-medium text-ink"
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Platform reach */}
        <div className="pt-2.5 border-t border-creamDarker/80 flex items-center gap-2">
          {creator.platforms.map((p) => (
            <div
              key={p.platform}
              className="flex items-center gap-1.5 rounded-lg bg-cream px-2 py-1 text-xs text-ink border border-border"
            >
              {p.platform === 'instagram' && <PiInstagramLogo size={13} className="text-saffron" />}
              {p.platform === 'tiktok' && <PiTiktokLogo size={13} className="text-saffron" />}
              {p.platform === 'youtube' && <PiYoutubeLogo size={13} className="text-saffron" />}
              <span className="font-semibold text-[11px]">{p.followers}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  )
}
