/**
 * CHIP COMPONENT
 * Used for multi-select niche tags.
 * Renders as a toggle button — selected = signal yellow bg, ink text.
 * Unselected = white bg, ink border.
 */
interface ChipProps {
  label: string
  selected: boolean
  onToggle: () => void
  disabled?: boolean
}

export function Chip({ label, selected, onToggle, disabled }: ChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      disabled={disabled}
      className={[
        'inline-flex items-center rounded-full px-4 py-2 text-sm font-medium',
        'border-2 transition-colors duration-150 min-h-[44px]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        selected
          ? 'bg-signal border-signal text-ink'
          : 'bg-white border-border text-ink hover:border-ink',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </button>
  )
}
