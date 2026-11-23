import type { Config } from 'tailwindcss'
import { colors, fonts, fontSize, borderRadius } from './src/theme/tokens'

/**
 * TAILWIND CONFIG
 * Imports all values from src/theme/tokens.ts so there is ONE source of truth.
 * Never hardcode a color or font here — change tokens.ts instead.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink:          colors.ink,
        charcoal:     colors.charcoal,
        paper:        colors.paper,
        signal:       colors.signal,
        'signal-hover':  colors.signalHover,
        'signal-soft':   colors.signalSoft,
        muted:        colors.textMuted,
        border:       colors.border,
        'border-dark': colors.borderDark,
      },
      fontFamily: {
        sans: fonts.sans,
        mono: fonts.mono,
      },
      fontSize: fontSize as Config['theme'] extends { fontSize?: infer F } ? F : never,
      borderRadius: borderRadius as Config['theme'] extends { borderRadius?: infer R } ? R : never,
      maxWidth: {
        // Consistent container width
        container: '72rem', // 1152px
        prose:     '65ch',
      },
      screens: {
        // Mobile-first breakpoints
        sm:  '480px',
        md:  '768px',
        lg:  '1024px',
        xl:  '1280px',
      },
    },
  },
  plugins: [],
}

export default config
