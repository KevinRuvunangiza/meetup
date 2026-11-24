import { motion } from 'motion/react'
import type { CampaignItem } from '@/data/examples'
import {
  PiVideoCamera,
  PiMegaphone,
  PiShuffle,
  PiGift,
  PiClock,
  PiArrowRight,
  PiUsers,
} from 'react-icons/pi'

interface CampaignCardProps {
  campaign: CampaignItem
  onOpenPreview: (campaign: CampaignItem) => void
}

export function CampaignCard({ campaign, onOpenPreview }: CampaignCardProps) {
  const getCollabIcon = (type: CampaignItem['collabType']) => {
    switch (type) {
      case 'UGC': return <PiVideoCamera size={13} className="text-saffron" />
      case 'Influence': return <PiMegaphone size={13} className="text-saffron" />
      case 'Hybride': return <PiShuffle size={13} className="text-saffron" />
      case 'Gifting': return <PiGift size={13} className="text-saffron" />
    }
  }

  return (
    <motion.article
      layout="position"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-creamDarker bg-creamCard text-ink shadow-sm hover:shadow-xl hover:border-border transition-all flex-shrink-0"
    >
      {/* Cover Image Slot — 16:10 Aspect Ratio with explicit width & height to prevent CLS */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-charcoal">
        {campaign.coverImageUrl ? (
          <img
            src={campaign.coverImageUrl}
            alt={campaign.title}
            width={640}
            height={400}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <svg
            viewBox="0 0 640 400"
            width={640}
            height={400}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`camp-grad-${campaign.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={campaign.duotone.accent} stopOpacity="0.85" />
                <stop offset="100%" stopColor={campaign.duotone.secondary || campaign.duotone.bg} stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <rect width="640" height="400" fill={campaign.duotone.bg} />

            {/* Unique abstract compositions per niche */}
            {campaign.duotone.patternType === 'mode' && (
              <g>
                <path d="M-50,100 C150,0 250,400 450,200 S650,500 700,300" stroke={campaign.duotone.accent} strokeWidth="80" fill="none" opacity="0.3" />
                <polygon points="50,0 280,0 420,400 120,400" fill={campaign.duotone.secondary || campaign.duotone.accent} opacity="0.22" />
                <circle cx="520" cy="110" r="120" fill={campaign.duotone.accent} opacity="0.25" />
                <line x1="0" y1="360" x2="640" y2="160" stroke={campaign.duotone.secondary || campaign.duotone.accent} strokeWidth="2" opacity="0.4" strokeDasharray="8,8" />
              </g>
            )}

            {campaign.duotone.patternType === 'beaute' && (
              <g>
                <circle cx="320" cy="200" r="160" fill={`url(#camp-grad-${campaign.id})`} opacity="0.35" />
                <circle cx="320" cy="200" r="110" fill="none" stroke={campaign.duotone.accent} strokeWidth="3" opacity="0.5" />
                <circle cx="320" cy="200" r="55" fill={campaign.duotone.secondary || campaign.duotone.accent} opacity="0.3" />
                <path d="M100,380 C180,220 460,220 540,380" fill="none" stroke={campaign.duotone.accent} strokeWidth="4" opacity="0.4" />
                <path d="M160,390 C220,260 420,260 480,390" fill="none" stroke={campaign.duotone.secondary || campaign.duotone.accent} strokeWidth="2" opacity="0.3" />
              </g>
            )}

            {campaign.duotone.patternType === 'auto' && (
              <g>
                <polygon points="0,0 480,0 640,400 160,400" fill={campaign.duotone.accent} opacity="0.18" />
                <polygon points="180,60 640,60 500,340 40,340" fill={`url(#camp-grad-${campaign.id})`} opacity="0.35" />
                <line x1="0" y1="90" x2="640" y2="190" stroke={campaign.duotone.accent} strokeWidth="3" opacity="0.6" />
                <line x1="0" y1="150" x2="640" y2="250" stroke={campaign.duotone.secondary || campaign.duotone.accent} strokeWidth="2" opacity="0.5" />
                <line x1="0" y1="210" x2="640" y2="310" stroke={campaign.duotone.accent} strokeWidth="1.5" opacity="0.4" />
                <circle cx="500" cy="260" r="85" fill={campaign.duotone.secondary || campaign.duotone.accent} opacity="0.25" />
              </g>
            )}

            {campaign.duotone.patternType === 'food' && (
              <g>
                <path d="M-20,300 Q150,120 320,260 T660,180" fill="none" stroke={campaign.duotone.accent} strokeWidth="60" opacity="0.25" />
                <path d="M0,380 Q180,200 360,340 T640,240" fill="none" stroke={campaign.duotone.secondary || campaign.duotone.accent} strokeWidth="36" opacity="0.2" />
                <circle cx="180" cy="130" r="90" fill={campaign.duotone.accent} opacity="0.25" />
                <circle cx="480" cy="270" r="120" fill={`url(#camp-grad-${campaign.id})`} opacity="0.35" />
              </g>
            )}

            {campaign.duotone.patternType === 'hotels' && (
              <g>
                <rect x="70" y="80" width="80" height="320" rx="40" fill={campaign.duotone.accent} opacity="0.25" />
                <rect x="190" y="50" width="80" height="350" rx="40" fill={campaign.duotone.secondary || campaign.duotone.accent} opacity="0.2" />
                <rect x="310" y="100" width="80" height="300" rx="40" fill={campaign.duotone.accent} opacity="0.3" />
                <rect x="430" y="60" width="80" height="340" rx="40" fill={`url(#camp-grad-${campaign.id})`} opacity="0.35" />
                <circle cx="530" cy="90" r="75" fill={campaign.duotone.secondary || campaign.duotone.accent} opacity="0.2" />
              </g>
            )}

            {campaign.duotone.patternType === 'tech' && (
              <g>
                <rect x="120" y="160" width="16" height="180" rx="8" fill={campaign.duotone.accent} opacity="0.6" />
                <rect x="160" y="100" width="16" height="240" rx="8" fill={campaign.duotone.secondary || campaign.duotone.accent} opacity="0.5" />
                <rect x="200" y="60" width="16" height="280" rx="8" fill={campaign.duotone.accent} opacity="0.7" />
                <rect x="240" y="120" width="16" height="220" rx="8" fill={campaign.duotone.secondary || campaign.duotone.accent} opacity="0.6" />
                <rect x="280" y="80" width="16" height="260" rx="8" fill={campaign.duotone.accent} opacity="0.8" />
                <rect x="320" y="140" width="16" height="200" rx="8" fill={campaign.duotone.secondary || campaign.duotone.accent} opacity="0.5" />
                <rect x="360" y="90" width="16" height="250" rx="8" fill={campaign.duotone.accent} opacity="0.7" />
                <rect x="400" y="170" width="16" height="170" rx="8" fill={campaign.duotone.secondary || campaign.duotone.accent} opacity="0.5" />
                <circle cx="480" cy="180" r="130" fill="none" stroke={campaign.duotone.secondary || campaign.duotone.accent} strokeWidth="2" opacity="0.3" strokeDasharray="4,8" />
              </g>
            )}

            {/* Fallback pattern if none specified */}
            {!campaign.duotone.patternType && (
              <g>
                <polygon points="0,0 640,80 480,400 0,360" fill={`url(#camp-grad-${campaign.id})`} opacity="0.45" />
                <polygon points="200,160 640,240 520,400 120,380" fill={campaign.duotone.accent} opacity="0.3" />
                <circle cx="480" cy="120" r="140" fill={campaign.duotone.accent} opacity="0.15" />
              </g>
            )}
          </svg>
        )}

        {/* Floating Pills (Collaboration Type + Status) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/80 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-white">
            {getCollabIcon(campaign.collabType)}
            <span>{campaign.collabType}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-tight shadow-sm ${
              campaign.status === 'Ouvert'
                ? 'bg-saffron text-ink'
                : 'bg-ink/80 text-white/90 border border-white/10'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                campaign.status === 'Ouvert' ? 'bg-ink animate-pulse' : 'bg-saffron'
              }`}
            />
            <span>{campaign.status}</span>
          </span>
        </div>

        {/* Subtle bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Brand header */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink text-[11px] font-bold text-white font-display">
              {campaign.brandInitials}
            </span>
            <span className="text-xs font-bold text-ink">{campaign.brandName}</span>
            <span className="text-muted text-xs">•</span>
            <span className="text-[11px] text-muted capitalize">{campaign.category}</span>
          </div>

          {/* Title */}
          <h3 className="font-display text-lg font-bold text-ink leading-snug mb-1.5 group-hover:text-black">
            {campaign.title}
          </h3>

          {/* 2-line Description with line clamp */}
          <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4">
            {campaign.description}
          </p>

          {/* Deliverable Chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {campaign.deliverables.map((d) => (
              <span
                key={d}
                className="rounded-md bg-creamDarker/60 px-2 py-0.5 text-[11px] font-medium text-ink"
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Meta & Aperçu Button */}
        <div className="pt-3 border-t border-creamDarker/80 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-ink text-sm tracking-tight">{campaign.budget}</span>
            <div className="flex items-center gap-3 text-muted text-[11px]">
              <span className="flex items-center gap-1">
                <PiClock size={12} className="text-saffron" />
                <span>{campaign.deadline}</span>
              </span>
              <span className="flex items-center gap-1">
                <PiUsers size={12} className="text-saffron" />
                <span>{campaign.creatorsNeeded}</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenPreview(campaign)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-creamDarker/60 hover:bg-ink hover:text-white px-3.5 py-2.5 text-xs font-bold text-ink transition-all cursor-pointer"
          >
            <span>Aperçu de la campagne</span>
            <PiArrowRight size={13} />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
