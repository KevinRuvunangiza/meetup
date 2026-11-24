import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { contactConfig, getWhatsAppUrl } from "@/config/contact";
import { PiWhatsappLogo, PiX, PiArrowSquareOut, PiUser } from "react-icons/pi";

interface WhatsAppChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  customMessage?: string;
}

export function WhatsAppChooserModal({
  isOpen,
  onClose,
  customMessage,
}: WhatsAppChooserModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Escape key and body scroll lock
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
          aria-labelledby="whatsapp-chooser-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-creamDarker bg-cream p-6 sm:p-8 shadow-2xl text-ink z-10"
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
            <div className="mb-6 pr-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 mb-3 border border-green-200">
                <PiWhatsappLogo size={24} />
              </div>
              <h3
                id="whatsapp-chooser-title"
                className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight"
              >
                Parler à l'équipe sur WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-textMuted mt-1 leading-relaxed">
                Choisissez un membre de notre équipe pour poser vos questions en
                direct :
              </p>
            </div>

            {/* Contacts List */}
            <div className="space-y-3 mb-6">
              {contactConfig.team.map((member) => {
                const waUrl = getWhatsAppUrl(member.waMeNumber, customMessage);
                return (
                  <div
                    key={member.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border bg-cream p-4 hover:border-saffron/40 hover:bg-creamDarker/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-ink font-display text-sm font-bold text-cream">
                        <PiUser size={18} className="text-saffron" />
                      </div>
                      <div>
                        <div className="font-display font-bold text-ink text-sm sm:text-base leading-snug">
                          {member.name}
                        </div>
                        <div className="text-[11px] text-textMuted font-medium">
                          {member.roleTitle} · {member.displayPhone}
                        </div>
                      </div>
                    </div>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-green-700 transition-colors shadow-sm self-start sm:self-auto"
                    >
                      <PiWhatsappLogo size={16} />
                      <span>Écrire sur WhatsApp</span>
                      <PiArrowSquareOut size={13} />
                    </a>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-center text-textMuted">
              Message pré-rempli : « Bonjour, j'ai une question sur Mosala. »
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
