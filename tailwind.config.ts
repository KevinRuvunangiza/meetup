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
        ink:            colors.ink,
        charcoal:       colors.charcoal,
        cream:          colors.cream,
        creamCard:      colors.creamCard,
        'cream-card':   colors.creamCard,
        creamDarker:    colors.creamDarker,
        'cream-darker': colors.creamDarker,
        paper:          colors.cream,
        saffron:        colors.saffron,
        saffronHover:   colors.saffronHover,
        'saffron-hover':colors.saffronHover,
        saffronSoft:    colors.saffronSoft,
        'saffron-soft': colors.saffronSoft,
        signal:         colors.saffron,
        'signal-hover': colors.saffronHover,
        'signal-soft':  colors.saffronSoft,
        muted:          colors.textMuted,
        textMuted:      colors.textMuted,
        textOffWhite:   colors.textOffWhite,
        'off-white':    colors.textOffWhite,
        textMutedDark:  colors.textMutedDark,
        'muted-dark':   colors.textMutedDark,
        border:         colors.border,
        borderDark:     colors.borderDark,
        'border-dark':  colors.borderDark,
      },
      fontFamily: {
        display: fonts.display,
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
