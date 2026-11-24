import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "@/hooks/useTranslation";
import { PiShieldCheck, PiX } from "react-icons/pi";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/75 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl border border-creamDarker bg-cream p-6 sm:p-8 shadow-2xl text-ink z-10"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la fenêtre"
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-cream text-textMuted hover:text-ink hover:bg-creamDarker transition-colors"
            >
              <PiX size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pr-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-saffron">
                <PiShieldCheck size={22} />
              </div>
              <h3
                id="privacy-modal-title"
                className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight"
              >
                {t("privacy.title")}
              </h3>
            </div>

            {/* Content Sections */}
            <div className="space-y-5 text-xs sm:text-sm text-textMuted leading-relaxed">
              <div className="rounded-2xl bg-cream p-4 border border-creamDarker">
                <h4 className="font-display font-bold text-ink mb-1 text-sm">
                  1. {t("privacy.whatWeCollect")}
                </h4>
                <p>{t("privacy.whatWeCollectDesc")}</p>
              </div>

              <div className="rounded-2xl bg-cream p-4 border border-creamDarker">
                <h4 className="font-display font-bold text-ink mb-1 text-sm">
                  2. {t("privacy.why")}
                </h4>
                <p>{t("privacy.whyDesc")}</p>
              </div>

              <div className="rounded-2xl bg-cream p-4 border border-creamDarker">
                <h4 className="font-display font-bold text-ink mb-1 text-sm">
                  3. {t("privacy.whoSeesIt")}
                </h4>
                <p>{t("privacy.whoSeesItDesc")}</p>
              </div>

              <div className="rounded-2xl bg-cream p-4 border border-creamDarker">
                <h4 className="font-display font-bold text-ink mb-1 text-sm">
                  4. {t("privacy.deletion")}
                </h4>
                <p>{t("privacy.deletionDesc")}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-ink px-5 py-2.5 text-xs font-bold text-cream hover:bg-charcoal transition-colors"
              >
                J'ai compris
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
