import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { CampaignItem } from "@/data/examples";
import { siteConfig } from "@/config/site.config";
import {
  PiX,
  PiVideoCamera,
  PiMegaphone,
  PiShuffle,
  PiGift,
  PiClock,
  PiSealCheck,
  PiArrowRight,
  PiUsers,
  PiCurrencyDollar,
} from "react-icons/pi";

interface CampaignPreviewModalProps {
  campaign: CampaignItem | null;
  onClose: () => void;
  onJoinWaitlist: () => void;
}

export function CampaignPreviewModal({
  campaign,
  onClose,
  onJoinWaitlist,
}: CampaignPreviewModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (campaign) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [campaign, onClose]);

  if (!campaign) return null;

  const getCollabIcon = (type: CampaignItem["collabType"]) => {
    switch (type) {
      case "UGC":
        return <PiVideoCamera className="text-saffron" size={16} />;
      case "Influence":
        return <PiMegaphone className="text-saffron" size={16} />;
      case "Hybride":
        return <PiShuffle className="text-saffron" size={16} />;
      case "Gifting":
        return <PiGift className="text-saffron" size={16} />;
    }
  };

  const handleCtaClick = () => {
    onClose();
    onJoinWaitlist();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-modal-title"
      >
        {/* Backdrop with light dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/75 backdrop-blur-sm"
          style={{ overscrollBehavior: "contain" }}
        />

        {/* Modal Window */}
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-creamDarker/80 bg-cream text-ink shadow-2xl"
          style={{ overscrollBehavior: "contain" }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border bg-cream/50 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-xs font-bold text-white font-display">
                {campaign.brandInitials}
              </span>
              <div>
                <p className="text-xs font-bold text-ink leading-none">
                  {campaign.brandName}
                </p>
                <p className="text-[11px] text-muted capitalize mt-0.5">
                  {campaign.category}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la fenêtre"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-creamDarker/60 hover:text-ink transition-colors cursor-pointer"
            >
              <PiX size={18} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-creamDarker px-2.5 py-1 text-xs font-semibold text-ink">
                {getCollabIcon(campaign.collabType)}
                <span>{campaign.collabType}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-saffronSoft border border-saffron/40 px-2.5 py-1 text-xs font-bold text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
                <span>{campaign.status}</span>
              </span>
            </div>

            <h3
              id="campaign-modal-title"
              className="text-xl font-bold font-display text-ink mb-2"
            >
              {campaign.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-5">
              {campaign.description}
            </p>

            {/* Structured Campaign Specs */}
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-cream/30 p-4 mb-5 text-xs">
              <div className="flex items-center gap-2">
                <PiCurrencyDollar className="text-saffron" size={18} />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-muted">
                    Budget
                  </span>
                  <span className="font-semibold text-ink">
                    {campaign.budget}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PiClock className="text-saffron" size={18} />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-muted">
                    Délai estimé
                  </span>
                  <span className="font-semibold text-ink">
                    {campaign.deadline}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PiUsers className="text-saffron" size={18} />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-muted">
                    Créateurs
                  </span>
                  <span className="font-semibold text-ink">
                    {campaign.creatorsNeeded} recherchés
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PiSealCheck className="text-saffron" size={18} />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-muted">
                    Cadre
                  </span>
                  <span className="font-semibold text-ink">Accord écrit</span>
                </div>
              </div>
            </div>

            {/* Deliverables tags */}
            <div className="mb-6">
              <span className="block text-[11px] uppercase font-bold tracking-wider text-muted mb-2">
                Livrables attendus
              </span>
              <div className="flex flex-wrap gap-1.5">
                {campaign.deliverables.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg bg-creamDarker/70 px-2.5 py-1 text-xs font-medium text-ink"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Honest Platform Launch Notice */}
            <div className="rounded-xl border border-saffron/30 bg-saffronSoft/50 p-4 mb-6">
              <p className="text-xs font-bold text-ink mb-1">
                Comment postuler à ces opportunités ?
              </p>
              <p className="text-xs text-muted leading-relaxed">
                {siteConfig.name} ouvre progressivement ses accès. Les créateurs
                et marques sur la liste prioritaire recevront les briefs
                détaillés et les premières mises en relation avant le lancement
                public.
              </p>
            </div>

            {/* Action CTA */}
            <button
              type="button"
              onClick={handleCtaClick}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-black active:scale-[0.98] cursor-pointer"
            >
              <span>Prendre ma place sur la liste</span>
              <PiArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
