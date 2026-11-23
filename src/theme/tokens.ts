/**
 * DESIGN TOKENS
 * ─────────────────────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH for all visual values across the project.
 *
 * Rules:
 *  • Ink (#0E0E0E) is the primary dark tone; Cream (#F4EFE6) is the light base.
 *  • Saffron (#F2A900, hover #D99700) is the ~5% accent.
 *  • Text on saffron MUST always be ink (#0E0E0E).
 *  • Headings use Bricolage Grotesque; body text uses Hanken Grotesk.
 *  • On dark backgrounds, text is off-white (#E8E4DD), never low-contrast gray-500.
 */

export const colors = {
  // Base surfaces
  ink: '#0E0E0E',           // deep black/ink
  charcoal: '#1A1918',      // cards on dark backgrounds
  cream: '#F4EFE6',         // warm cream base surface (replaces sterile white)
  creamCard: '#FFFFFF',     // crisp elevated card surfaces on cream
  creamDarker: '#EAE4D8',   // subtle chips / borders
  paper: '#F4EFE6',         // backwards-compatibility alias for cream
  white: '#FFFFFF',

  // Saffron Accent (~5% of surface)
  saffron: '#F2A900',       // primary CTA & verified highlight
  saffronHover: '#D99700',  // button hover state
  saffronSoft: '#FDF3DA',   // subtle tinted accent pill background
  signal: '#F2A900',        // backwards-compatibility alias
  signalHover: '#D99700',   // backwards-compatibility alias
  signalSoft: '#FDF3DA',    // backwards-compatibility alias

  // Typography shades
  textMuted: '#5F5B54',     // secondary body text on cream
  textOffWhite: '#E8E4DD',  // readable body text on ink
  textMutedDark: '#A49F96', // secondary captions on ink

  // Borders
  border: '#E2DCD2',        // dividers and input borders on cream
  borderDark: '#282624',    // dividers on dark backgrounds
} as const

export const fonts = {
  display: '"Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  sans: '"Hanken Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
} as const

export const fontSize = {
  // Mobile-first scale (rem). Desktop sizes via Tailwind responsive prefixes.
  xs:   ['0.75rem',  { lineHeight: '1rem' }],
  sm:   ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem',     { lineHeight: '1.65rem' }],
  lg:   ['1.125rem', { lineHeight: '1.75rem' }],
  xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem',  { lineHeight: '1.3' }],
  '3xl': ['1.875rem',{ lineHeight: '1.2' }],
  '4xl': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
  '5xl': ['3rem',    { lineHeight: '1.05', letterSpacing: '-0.03em' }],
  '6xl': ['3.75rem', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
  '7xl': ['4.5rem',  { lineHeight: '0.98', letterSpacing: '-0.04em' }],
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
  sectionY: '4.5rem',     // py-18 on mobile
  sectionYLg: '6.5rem',   // md:py-26
  containerPx: '1.25rem', // px-5 on mobile
  containerPxLg: '2rem',  // md:px-8
} as const

/** CSS custom properties injected into :root by App.tsx */
export const cssVars = {
  '--color-ink':          colors.ink,
  '--color-charcoal':     colors.charcoal,
  '--color-cream':        colors.cream,
  '--color-cream-card':   colors.creamCard,
  '--color-cream-darker': colors.creamDarker,
  '--color-paper':        colors.cream,
  '--color-white':        colors.white,
  '--color-saffron':      colors.saffron,
  '--color-saffron-hover':colors.saffronHover,
  '--color-saffron-soft': colors.saffronSoft,
  '--color-signal':       colors.saffron,
  '--color-signal-hover': colors.saffronHover,
  '--color-signal-soft':  colors.saffronSoft,
  '--color-muted':        colors.textMuted,
  '--color-offwhite':     colors.textOffWhite,
  '--color-muted-dark':   colors.textMutedDark,
  '--color-border':       colors.border,
  '--color-border-dark':  colors.borderDark,
  '--font-display':       fonts.display,
  '--font-sans':          fonts.sans,
} as const
