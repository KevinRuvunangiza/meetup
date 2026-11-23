/**
 * DESIGN TOKENS
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the SINGLE source of truth for all visual values.
 * Change a value here → it updates everywhere (Tailwind utilities, CSS vars,
 * and any Motion keyframes that reference CSS variables).
 *
 * Rules enforced here:
 *  • Yellow (#FFD60A) is NEVER used as text color on light backgrounds.
 *  • Text placed ON a yellow background MUST use `ink` (#0B0B0C).
 *  • Page backgrounds use `paper` or `ink`, never pure black (#000) or white (#fff).
 */

export const colors = {
  // Base surfaces
  ink: '#0B0B0C',      // darkest — dark section backgrounds, headings on light
  charcoal: '#1A1A1C', // slightly lighter dark — card backgrounds in dark sections
  paper: '#FAFAF7',    // off-white — main page background (never pure white)
  white: '#FFFFFF',    // pure white — used for text on dark, and card surfaces

  // Accent — use sparingly
  signal: '#FFD60A',       // primary CTA background, key highlights
  signalHover: '#F2C700',  // button hover state
  signalSoft: '#FFF4B8',   // very light yellow tint for subtle highlights

  // Typography shades
  textMuted: '#5B5B60',   // secondary body text, captions
  border: '#E6E4DD',      // dividers, input borders on light backgrounds
  borderDark: '#2E2E32',  // dividers on dark backgrounds
} as const

export const fonts = {
  // We use system fonts for now — zero network cost, good rendering on Android.
  // Google Fonts can be swapped in by changing these two values.
  sans: '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
} as const

export const fontSize = {
  // Mobile-first scale (rem). Desktop sizes via Tailwind responsive prefixes.
  xs:   ['0.75rem',  { lineHeight: '1rem' }],
  sm:   ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem',     { lineHeight: '1.6rem' }],
  lg:   ['1.125rem', { lineHeight: '1.75rem' }],
  xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem',  { lineHeight: '2rem' }],
  '3xl': ['1.875rem',{ lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  '5xl': ['3rem',    { lineHeight: '1.1' }],
  '6xl': ['3.75rem', { lineHeight: '1.05' }],
} as const

export const borderRadius = {
  none: '0',
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  '2xl': '24px',
  full: '9999px',
} as const

export const spacing = {
  // Section vertical padding — large and generous for premium feel
  sectionY: '5rem',      // py-20 on mobile
  sectionYLg: '7rem',   // md:py-28
  containerPx: '1.25rem', // px-5 on mobile
  containerPxLg: '2rem',  // md:px-8
} as const

/** CSS custom properties injected into :root by App.tsx */
export const cssVars = {
  '--color-ink':          colors.ink,
  '--color-charcoal':     colors.charcoal,
  '--color-paper':        colors.paper,
  '--color-white':        colors.white,
  '--color-signal':       colors.signal,
  '--color-signal-hover': colors.signalHover,
  '--color-signal-soft':  colors.signalSoft,
  '--color-muted':        colors.textMuted,
  '--color-border':       colors.border,
  '--color-border-dark':  colors.borderDark,
  '--font-sans':          fonts.sans,
} as const
