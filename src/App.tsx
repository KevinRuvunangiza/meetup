import { useEffect, useState } from 'react'
import { cssVars } from '@/theme/tokens'
import { LanguageProvider } from '@/hooks/useTranslation'
import type { Role } from '@/types/form'

// Sections
import { Nav } from '@/components/sections/Nav'
import { Hero } from '@/components/sections/Hero'
import { Problem } from '@/components/sections/Problem'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { CollabTypes } from '@/components/sections/CollabTypes'
import { Vetting } from '@/components/sections/Vetting'
import { Promise } from '@/components/sections/Promise'
import { Examples } from '@/components/sections/Examples'
import { FAQ } from '@/components/sections/FAQ'
import { WaitlistForm } from '@/components/sections/WaitlistForm'
import { Footer } from '@/components/sections/Footer'

/**
 * APP ROOT
 * ─────────────────────────────────────────────────────────────────────────────
 * State managed here:
 *   • CSS vars injected on mount from tokens.ts
 *   • selectedRole: set by Hero CTA clicks, passed to WaitlistForm as initialRole
 *     This allows the form to preselect "brand" or "creator" when the user
 *     clicks the Hero button. No global state library needed.
 */
export default function App() {
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined)

  // Inject CSS variables from tokens.ts into :root on mount
  useEffect(() => {
    const root = document.documentElement
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [])

  return (
    <LanguageProvider>
      <Nav />
      <main>
        <Hero onRoleSelect={setSelectedRole} />
        <Problem />
        <HowItWorks />
        <CollabTypes />
        <Vetting />
        <Promise />
        <Examples />
        <FAQ />
        <WaitlistForm initialRole={selectedRole} />
      </main>
      <Footer />
    </LanguageProvider>
  )
}
