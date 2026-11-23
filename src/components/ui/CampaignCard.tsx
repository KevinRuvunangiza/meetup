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
                <stop offset="0%" stopColor={campaign.duotone.accent} stopOpacity="0.8" />
                <stop offset="100%" stopColor={campaign.duotone.bg} stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <rect width="640" height="400" fill={campaign.duotone.bg} />
            {/* Duotone architectural / abstract facets */}
            <polygon points="0,0 640,80 480,400 0,360" fill={`url(#camp-grad-${campaign.id})`} opacity="0.45" />
            <polygon points="200,160 640,240 520,400 120,380" fill={campaign.duotone.accent} opacity="0.3" />
            <circle cx="480" cy="120" r="140" fill={campaign.duotone.accent} opacity="0.15" />
            <path d="M0,280 Q200,200 400,320 T640,260" stroke={campaign.duotone.accent} strokeWidth="2" fill="none" opacity="0.4" />
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
