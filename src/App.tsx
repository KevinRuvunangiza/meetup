import { useEffect, useState } from "react";
import { cssVars } from "@/theme/tokens";
import { LanguageProvider } from "@/hooks/useTranslation";
import { WhatsAppModalProvider } from "@/context/WhatsAppModalContext";
import type { Role } from "@/types/form";

// Sections
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { AudienceBenefits } from "@/components/sections/AudienceBenefits";
import { Feed } from "@/components/sections/Feed";
import { TheFramework } from "@/components/sections/TheFramework";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CollabTypes } from "@/components/sections/CollabTypes";
import { Vetting } from "@/components/sections/Vetting";
import { HumanTouch } from "@/components/sections/HumanTouch";
import { Roadmap } from "@/components/sections/Roadmap";
import { FAQ } from "@/components/sections/FAQ";
import { WaitlistForm } from "@/components/sections/WaitlistForm";
import { Footer } from "@/components/sections/Footer";

/**
 * APP ROOT — MOSALA
 * ─────────────────────────────────────────────────────────────────────────────
 * High-end editorial waitlist experience for brands and content creators.
 */
export default function App() {
  const [selectedRole, setSelectedRole] = useState<Role>("brand");

  // Inject CSS variables from tokens.ts into :root on mount
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, []);

  return (
    <LanguageProvider>
      <WhatsAppModalProvider>
        <Nav />
        <main>
          {/* 1. Hero */}
          <Hero onRoleSelect={setSelectedRole} initialRole={selectedRole} />

          {/* 2. Audience Toggle: Marques | Créateurs */}
          <AudienceBenefits onSelectRole={setSelectedRole} />

          {/* 3. Feed: Aperçu de la plateforme */}
          <Feed onJoinWaitlist={() => setSelectedRole("creator")} />

          {/* 4. Le Cadre: Visual Agreement Summary */}
          <TheFramework />

          {/* 5. Comment ça marche */}
          <HowItWorks />

          {/* 6. Types de collaboration */}
          <CollabTypes />

          {/* 7. Confiance & Niveaux de vérification */}
          <Vetting />

          {/* 8. Vérification humaine, choix direct */}
          <HumanTouch />

          {/* 9. En préparation (Roadmap) & Premiers membres */}
          <Roadmap />

          {/* 10. Questions fréquentes (Tabs + Accordion) */}
          <FAQ />

          {/* 11. Formulaire prioritaire (2-Step Progressive) */}
          <WaitlistForm initialRole={selectedRole} />
        </main>
        <Footer />
      </WhatsAppModalProvider>
    </LanguageProvider>
  );
}
