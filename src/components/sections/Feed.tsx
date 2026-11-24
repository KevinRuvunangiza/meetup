import { useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useTranslation } from '@/hooks/useTranslation'
import {
  feedCategories,
  campaignExamples,
  creatorExamples,
  type CategoryId,
  type CampaignItem,
} from '@/data/examples'
import { CampaignCard } from '@/components/ui/CampaignCard'
import { CreatorCard } from '@/components/ui/CreatorCard'
import { CampaignPreviewModal } from '@/components/ui/CampaignPreviewModal'
import {
  PiMegaphone,
  PiUsers,
  PiCaretLeft,
  PiCaretRight,
} from 'react-icons/pi'

interface FeedProps {
  onJoinWaitlist?: () => void
}

export function Feed({ onJoinWaitlist }: FeedProps) {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const [selectedFeedType, setSelectedFeedType] = useState<'campaigns' | 'creators'>('campaigns')
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('tout')
  const [activePreview, setActivePreview] = useState<CampaignItem | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const filteredCampaigns = campaignExamples.filter((c) =>
    selectedCategory === 'tout' ? true : c.category === selectedCategory,
  )

  const filteredCreators = creatorExamples.filter((c) =>
    selectedCategory === 'tout' ? true : c.category === selectedCategory,
  )

  const handleScrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleScrollToWaitlist = () => {
    onJoinWaitlist?.()
    const formElement = document.getElementById('hero-quick-form') ?? document.getElementById('waitlist')
    formElement?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="feed" className="bg-cream py-16 md:py-24 border-b border-border">
      <div className="container-site">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-saffron bg-ink px-3 py-1 rounded-full mb-3">
              {t('feed.label')}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight leading-tight">
              {t('feed.title')}
            </h2>
            <p className="mt-3 text-base text-textMuted max-w-xl leading-relaxed">
              {t('feed.subtitle')}
            </p>
          </div>

          {/* Feed Type Switcher (Campaigns vs Creators) */}
          <div className="flex items-center rounded-xl bg-creamDarker/60 p-1 self-start md:self-end border border-border">
            <button
              type="button"
              onClick={() => setSelectedFeedType('campaigns')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedFeedType === 'campaigns'
                  ? 'bg-creamCard text-ink shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <PiMegaphone size={16} />
              <span>Campagnes ({campaignExamples.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFeedType('creators')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedFeedType === 'creators'
                  ? 'bg-creamCard text-ink shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <PiUsers size={16} />
              <span>Créateurs ({creatorExamples.length})</span>
            </button>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
            {feedCategories.map((cat) => {
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-ink font-bold'
                      : 'text-muted hover:text-ink bg-creamCard/70 border border-border/60 hover:border-border'
                  }`}
                >
                  {isActive && !shouldReduceMotion && (
                    <motion.div
                      layoutId="activeFeedFilterPill"
                      className="absolute inset-0 rounded-full bg-saffron shadow-sm"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  {isActive && shouldReduceMotion && (
                    <div className="absolute inset-0 rounded-full bg-saffron" />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              )
            })}
          </div>

          {/* Mobile carousel arrows */}
          <div className="hidden sm:flex md:hidden items-center gap-1 flex-shrink-0">
            <button
              type="button"
              onClick={() => handleScrollCarousel('left')}
              aria-label="Défiler vers la gauche"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-creamCard text-ink hover:bg-creamDarker transition-colors cursor-pointer"
            >
              <PiCaretLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleScrollCarousel('right')}
              aria-label="Défiler vers la droite"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-creamCard text-ink hover:bg-creamDarker transition-colors cursor-pointer"
            >
              <PiCaretRight size={16} />
            </button>
          </div>
        </div>

        {/* Carousel / Grid Content */}
        <AnimatePresence mode="wait">
          {selectedFeedType === 'campaigns' ? (
            <motion.div
              key={`camp-${selectedCategory}`}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {filteredCampaigns.length === 0 ? (
                <div className="rounded-2xl border border-border bg-creamCard p-12 text-center text-muted">
                  <p className="text-sm font-medium">Aucune campagne dans cette catégorie pour le moment.</p>
                </div>
              ) : (
                <>
                  {/* Mobile Swipeable Track */}
                  <div
                    ref={carouselRef}
                    className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 px-1 overscroll-x-contain scrollbar-none"
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Campagnes disponibles"
                  >
                    {filteredCampaigns.map((camp, i) => (
                      <div
                        key={camp.id}
                        className="w-[85vw] max-w-[320px] flex-shrink-0 snap-start"
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} sur ${filteredCampaigns.length}`}
                      >
                        <CampaignCard
                          campaign={camp}
                          onOpenPreview={(c) => setActivePreview(c)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Desktop Responsive Grid */}
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-1">
                    {filteredCampaigns.map((camp) => (
                      <CampaignCard
                        key={camp.id}
                        campaign={camp}
                        onOpenPreview={(c) => setActivePreview(c)}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`creat-${selectedCategory}`}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {filteredCreators.length === 0 ? (
                <div className="rounded-2xl border border-border bg-creamCard p-12 text-center text-muted">
                  <p className="text-sm font-medium">Aucun créateur dans cette catégorie pour le moment.</p>
                </div>
              ) : (
                <>
                  {/* Mobile Swipeable Track */}
                  <div
                    ref={carouselRef}
                    className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 px-1 overscroll-x-contain scrollbar-none"
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Créateurs vérifiés"
                  >
                    {filteredCreators.map((creator, i) => (
                      <div
                        key={creator.id}
                        className="w-[85vw] max-w-[320px] flex-shrink-0 snap-start"
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} sur ${filteredCreators.length}`}
                      >
                        <CreatorCard creator={creator} />
                      </div>
                    ))}
                  </div>

                  {/* Desktop Responsive Grid */}
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-1">
                    {filteredCreators.map((creator) => (
                      <CreatorCard key={creator.id} creator={creator} />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Discreet Honest Illustration Disclaimer */}
        <p className="text-center text-xs text-textMuted mt-10 font-medium">
          {t('feed.disclaimer')}
        </p>

        {/* Campaign Preview Modal */}
        <CampaignPreviewModal
          campaign={activePreview}
          onClose={() => setActivePreview(null)}
          onJoinWaitlist={handleScrollToWaitlist}
        />
      </div>
    </section>
  )
}
