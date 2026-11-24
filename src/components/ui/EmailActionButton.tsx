import { useState } from "react";
import { getContactEmail } from "@/config/contact";
import { PiEnvelopeSimple, PiCopy, PiCheck } from "react-icons/pi";

interface EmailActionButtonProps {
  className?: string;
  variant?: "inline" | "stacked";
}

export function EmailActionButton({
  className = "",
  variant = "inline",
}: EmailActionButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    const email = getContactEmail();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const handleMailto = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = getContactEmail();
    window.location.href = `mailto:${email}?subject=Question%20Mosala`;
  };

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <button
          type="button"
          onClick={handleMailto}
          className="inline-flex items-center gap-2 text-xs font-semibold text-textOffWhite hover:text-saffron transition-colors"
        >
          <PiEnvelopeSimple size={16} />
          <span>Écrire un email</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 text-[11px] text-textMutedDark hover:text-textOffWhite transition-colors"
        >
          {copied ? (
            <>
              <PiCheck size={14} className="text-saffron" />
              <span className="text-saffron font-bold">Adresse copiée !</span>
            </>
          ) : (
            <>
              <PiCopy size={14} />
              <span>Copier l'adresse email</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleMailto}
        className="inline-flex items-center gap-2 rounded-lg bg-creamDarker/60 hover:bg-creamDarker px-3 py-1.5 text-xs font-bold text-ink transition-colors"
      >
        <PiEnvelopeSimple size={15} />
        <span>Écrire un email</span>
      </button>

      <button
        type="button"
        onClick={handleCopy}
        title="Copier l'adresse email"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-textMuted hover:text-ink hover:border-ink transition-colors"
      >
        {copied ? (
          <>
            <PiCheck size={14} className="text-saffron" />
            <span className="text-saffron font-bold">Copiée !</span>
          </>
        ) : (
          <>
            <PiCopy size={14} />
            <span>Copier</span>
          </>
        )}
      </button>
    </div>
  );
}
