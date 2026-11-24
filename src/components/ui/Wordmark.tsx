/**
 * WORDMARK COMPONENT
 * ─────────────────────────────────────────────────────────────────────────────
 * Clean typographic wordmark for MOSALA:
 *  • Bricolage Grotesque, bold display weight, tight tracking.
 *  • Signal saffron dot detail.
 *  • Pure SVG/HTML, scalable and accessible.
 */
import { brandConfig } from "@/config/brand";

interface WordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showDot?: boolean;
}

export function Wordmark({
  className = "",
  size = "md",
  showDot = true,
}: WordmarkProps) {
  const sizeClasses = {
    sm: "text-xl tracking-tight",
    md: "text-2xl sm:text-3xl tracking-tight",
    lg: "text-3xl sm:text-4xl tracking-tighter",
    xl: "text-4xl sm:text-5xl md:text-6xl tracking-tighter",
  };

  const hasExplicitTextColor = /\btext-(?!\[)/.test(className);
  const colorClass = hasExplicitTextColor ? "" : "text-ink";

  return (
    <span
      className={`font-black font-display inline-flex items-baseline select-none ${sizeClasses[size]} ${colorClass} ${className}`}
      aria-label={brandConfig.name}
    >
      <span>{brandConfig.name}</span>
      {showDot && (
        <span className="text-saffron ml-[1px]" aria-hidden="true">
          .
        </span>
      )}
    </span>
  );
}
