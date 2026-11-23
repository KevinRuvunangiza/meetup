/**
 * BUTTON COMPONENT
 * ─────────────────────────────────────────────────────────────────────────────
 * Variants:
 *   primary  — signal yellow bg, ink text (main CTA)
 *   secondary — ink bg, white text (secondary CTA or dark-section CTA)
 *   ghost    — transparent, ink border (tertiary)
 *   ghost-light — transparent, white border (on dark backgrounds)
 *
 * Sizes: md (default), lg (hero CTA), sm (inline)
 *
 * Design rules enforced:
 *   • Yellow text on light bg is NEVER allowed → primary uses ink text on yellow
 *   • Minimum 44px height for tap targets
 *   • Focus ring always visible (handled by global CSS :focus-visible)
 */
import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'ghost-light'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  fullWidth?: boolean
  as?: 'button' | 'a'
  href?: string
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-signal hover:bg-signal-hover text-ink font-semibold border-2 border-transparent',
  secondary:
    'bg-ink hover:bg-charcoal text-white font-semibold border-2 border-transparent',
  ghost:
    'bg-transparent hover:bg-ink/5 text-ink font-semibold border-2 border-ink',
  'ghost-light':
    'bg-transparent hover:bg-white/10 text-white font-semibold border-2 border-white',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-md min-h-[44px]',
  md: 'px-6 py-3 text-base rounded-lg min-h-[44px]',
  lg: 'px-8 py-4 text-lg rounded-lg min-h-[52px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 transition-colors duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
