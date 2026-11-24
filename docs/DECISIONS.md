# DECISIONS.md

This file records every significant technical decision made during the build.
The goal: you understand **what** was built, **why**, and **what alternatives were considered**.

---

## 1. Build tool: Vite

**Decision:** Vite (not Create React App, not Next.js)

**Why:** CRA is deprecated. Next.js is a full framework with server-side rendering — overkill for a static waitlist page. Vite is fast, minimal, and produces a static build that deploys to Netlify with no configuration.

**Consequence:** The site is a Single Page Application (SPA). There is no server. All logic runs in the browser.

---

## 2. Styling: Tailwind CSS (utility-first)

**Decision:** Tailwind CSS, not plain CSS, not CSS Modules, not styled-components.

**Why:** Tailwind makes it easy to stay consistent with the design token system. All spacing, color, and typography values come from one place (`tokens.ts` → `tailwind.config.ts`). The bundle size after purging unused classes is small.

**Consequence:** You will see many class names in the JSX. This is intentional — the styling is in the component file, not a separate CSS file. If you want to refactor later, every component is self-contained.

---

## 3. Animation: Motion (Framer Motion)

**Decision:** Motion, not CSS animations, not GSAP.

**Why:** Motion integrates with React and handles enter/exit animations cleanly (AnimatePresence for the form → success screen transition). We use it sparingly: fade-in-on-scroll for section cards, nothing that runs continuously or on hover.

**Tradeoff:** Motion adds ~90 KB to the bundle (gzipped: ~30 KB). This is acceptable given the value. GSAP would be similar or heavier. CSS animations would be lighter but can't handle the form exit transition cleanly.

---

## 4. i18n: Custom hook, no library

**Decision:** A custom `useTranslation` hook reading from `fr.json` and `en.json`. No react-i18next, no i18next.

**Why:** Two languages, all static text. A full i18n library would add 25–40 KB for features we don't need (plurals, namespaces, lazy loading). Our hook is ~50 lines and does exactly what we need: dot-notation key lookup + `{placeholder}` interpolation.

**Future:** If you add a third language or need pluralisation, swap the hook internals for a library without changing call sites.

---

## 5. Forms: Custom state, no library

**Decision:** Plain `useState` for form state, manual validation on submit. No react-hook-form, no Formik, no Zod.

**Why:** Two forms with ~15 fields each. react-hook-form is excellent but adds ~10 KB and a learning curve. Our validation is simple: required, phone regex, email regex, URL regex. Manual state makes the logic transparent and easy to follow.

**Consequence:** Validation only runs on submit (not on every keystroke). This is intentional — validating on every keystroke is frustrating on mobile.

---

## 6. Form submission: Google Apps Script

**Decision:** Fetch POST to a Google Apps Script web app URL. Data stored in Google Sheets.

**Why:** Free, requires no backend infrastructure, and your partner can read the spreadsheet directly.

**How it works:**

1. Browser collects form data, formats it as JSON
2. `fetch(appsScriptUrl, { method: 'POST', body: JSON.stringify(payload) })`
3. Apps Script receives the POST, validates it, appends a row to the correct sheet tab

**Content-Type is `text/plain` (not `application/json`):** This avoids a CORS preflight request. Apps Script does not handle preflight OPTIONS requests well. Using `text/plain` skips the preflight, and Apps Script still receives the JSON body fine.

**Known weaknesses:**

- The endpoint URL is public → anyone who finds it can POST fake data
  - Mitigation: honeypot field (bots fill it → ignored server-side)
  - There is no rate limiting in Apps Script
- No authentication → easy to spam
- Apps Script daily quotas: 20,000 reads/day on free tier (not a concern for a waitlist)
- No real-time deduplication across concurrent requests (edge case)

**Future migration to Supabase:**

1. Create a Supabase project, add `brands` and `creators` tables matching the current column structure
2. Add a Supabase Edge Function for server-side validation
3. Add Row Level Security so only your service account can read
4. Update `siteConfig.appsScriptUrl` to point to the Edge Function URL
5. No other frontend changes needed

---

## 7. OG image: Static PNG in /public

**Decision:** A single static `og-image.png` placed in `public/`. Generated manually or with a script.

**Why:** Dynamic OG image generation (e.g. with a Netlify Function + Satori) is complex and overkill at this stage. A static image that looks great when pasted into WhatsApp is enough.

**What to put on it:** The site name in bold, the tagline, signal yellow accent, dark background. 1200×630 pixels.

---

## 8. Translation key type: `string` (not deep dot-notation)

**Decision:** `TranslationKey = string` in the translation hook.

**Why we tried deep dot-notation:** TypeScript can generate all valid dot-notation paths from the JSON structure, giving compile-time safety (you can't mistype a key).

**Why we dropped it:** Some calls need to pass object-valued paths (e.g. `t('problem.items')` returns an array, not a string). The deep dot-notation type only includes leaf-string paths. Making it work for both string leaves and object values requires complex conditional types that make the code harder to read.

**Consequence:** A mistyped key returns the key itself as the display value (e.g. `"problem.itmes"`). Easy to spot in the browser. If you want compile-time safety on string-leaf paths, we can re-add it — the hook internals don't change, only the type export.

---

## 9. Duplicate protection: WhatsApp number

**Decision:** Deduplicate by WhatsApp number, in Apps Script.

**Why WhatsApp, not email:** Email is optional. WhatsApp is required. Everyone has one WhatsApp number per phone.

**How:** When a submission arrives, the script scans the WhatsApp column for a matching value. If found → returns `{ duplicate: true }`. The frontend shows a friendly message.

**Weakness:** This scan is O(n) — it reads every row every time. For a waitlist of thousands of entries, this is fine. For tens of thousands, switch to Supabase with a unique index.

---

## 10. No analytics

**Decision:** No analytics at launch.

**Why:** The brief says no. We will ask before adding anything.

**Future options (when ready):** Plausible (privacy-first, no cookies), Fathom, or Google Analytics 4. All can be added in one line in `index.html`.

---

## 11. Favicon: SVG placeholder

**Decision:** A minimal SVG favicon.

**Why:** A proper favicon set (16×16, 32×32, 180×180 Apple Touch, etc.) should be generated from your final logo. The placeholder keeps the browser tab from showing a broken icon during development. Replace with real assets before launch.

---

## 12. CSS custom properties injected from tokens.ts

**Decision:** `App.tsx` reads `cssVars` from `tokens.ts` and injects them as `style` attributes on `document.documentElement` on mount.

**Why:** This makes the tokens available to both Tailwind (via the config) and to any vanilla CSS or Motion keyframes that need them. It's a bridge between the two systems.

**Alternative considered:** Defining CSS variables only in `index.css`. Rejected because it would create a second source of truth for color values.

---

## 13. Native `<details>/<summary>` for FAQ

**Decision:** No custom accordion component. The FAQ uses native HTML `<details>` and `<summary>`.

**Why:** Zero JavaScript, fully keyboard-navigable, accessible to screen readers, works on the slowest connections, and renders correctly even if JavaScript fails. We style it with Tailwind's `group-open:` modifier.

**Tradeoff:** No animated height transition (browsers don't animate `height: auto`). Acceptable for a FAQ — the content appears immediately on click, which is fast and clear.

---

## 14. Redesign Direction: Editorial Startup Aesthetic & Hero Architecture

**Decision:** Transform the waitlist from a generic black-and-white template into a confident, premium, editorial startup experience.

### Key Architectural Choices:

1. **Typography — Bricolage Grotesque (Display) & Hanken Grotesk (Body)**
   - _Why:_ Bricolage Grotesque has bold, distinctive proportions and personality without looking quirky. Hanken Grotesk provides neutral, highly legible body copy (16–18px). Both are loaded as modern variable fonts with `font-display: swap` and `font-size-adjust: from-font` for visual stability without layout shifts.
   - _Alternatives rejected:_ Default Inter (looks like an unbranded SaaS template), serif fonts (too traditional for a creator tech platform).

2. **Color Palette — Cream, Ink, and Saffron**
   - _Surface:_ Cream (`#F4EFE6`) replaces sterile `#FFFFFF` as the foundational canvas, giving an tactile, editorial tone.
   - _Dark drama:_ Deep Ink (`#0E0E0E`) is used selectively for cards, navigation highlights, and high-impact areas with off-white text (`#E8E4DD`), eliminating low-contrast `gray-500` illegibility.
   - _Accent:_ Saffron (`#F2A900`, hover `#D99700`) covers ~5% of the visual space (CTAs, verified badges). Contrast rule enforced: text placed on Saffron is strictly `#0E0E0E`.

3. **Product Visual & Abstract Duotone Portraits (`src/data/creatorCards.ts`)**
   - _Why:_ A waitlist must show what the actual platform experience looks like. We built vertical creator cards displaying platform stats, verified status chips, niches, and sample deliverables.
   - _Honesty constraint:_ Zero fake AI people or stock faces. Until verified creators provide written consent, cards display abstract duotone architectural/geometric motifs. Swapping to real photos requires editing only `photoUrl` in `src/data/creatorCards.ts`.

4. **Above-the-Fold Form Integration (`HeroWaitlistForm.tsx`)**
   - _Why:_ Burying the form at the bottom of a long scroll severely hurts conversion. The Hero now features an instant role toggle (Brand vs. Creator) with 3 essential fields and an optional expandable drawer for deeper information.
   - _Motion:_ Smooth tab switching with layout animations (`layoutId="heroFormRolePill"`), animated validation, and instant feedback.

5. **Motion Budget & Low-End Android Performance**
   - _Engine:_ `LazyMotion` with `domAnimation` from `motion/react` reduces initial bundle weight.
   - _Compositor constraints:_ Only `transform` and `opacity` are animated to ensure 60fps on mobile.
   - _Accessibility:_ Full `prefers-reduced-motion` compliance — all float and tilt animations collapse to elegant static offsets when requested.

6. **Iconography — Native Thin-Stroke SVGs**
   - _Decision:_ Replaced all emojis and heavy icon libraries with a dedicated set of 1.75px stroke SVG components in `src/components/ui/Icons.tsx`.

### How to Test:

- **Hero & Form:** Visit `http://localhost:5173/`. Test toggling between _Je suis une marque_ and _Je suis un créateur_. Submit with invalid or valid details and verify immediate feedback.
- **Card Collage:** Hover over or tap the creator cards in desktop/tablet view to observe gentle floating and interactive tilt responses.
- **Mobile Sticky CTA:** Shrink browser to mobile width (< 768px), scroll down past the hero form, and observe the sticky "Rejoindre la liste" bar appear at the bottom. Tapping it smoothly scrolls back up to the form.
- **Reduced Motion:** Enable "Reduce Motion" in system settings and confirm animations stop smoothly.

---

## 15. Brand Name Centralization: MOSALA

**Decision:** Official platform name is **MOSALA** (meaning "work / job" in Lingala).

- The brand name and all global parameters live solely in `src/config/brand.ts` (`brandConfig`).
- All metadata, open graph tags, social share strings, and footers reference `brandConfig.name`.
- Contact email (`contact@mosala.io`) and URL placeholder (`https://mosala.io`) use generic top-level domains with zero country tags (no `-rdc`).
- Wordmark is typographic, rendered via `Wordmark.tsx` using Bricolage Grotesque with a Saffron accent period.
- Positioning: French-first platform for Central Africa with initial launch in the DRC ("lancement en RDC" in copy, never in brand name).
- Strict honesty: strictly banned claims include "garanti", "paiement garanti", "paiement sécurisé/protégé", "escrow", "IA", "AI-powered", "algorithme", "ROI", "premier d'Afrique", "numéro 1", or any invented metrics/logos.

---

## 18. Mandatory WhatsApp and Email with Two-Step Progressive Disclosure

**Decision:** Both WhatsApp number AND Email are required for registration.

- **Step 1 (Immediate Save):** Full name, WhatsApp, Email, City. Immediately saved and acknowledged.
- **Step 2 (Optional Enrichment):** Sector, budget, niches, social handles, portfolio. Gracefully updates the existing row in Google Sheets without rejecting as duplicate.
- **Client validation:** Strict format checking (`src/utils/validation.ts`) verified by automated unit tests (`vitest`).

---

## 16. Iconography: Phosphor Icons (`react-icons/pi`)

**Decision:** Adopted Phosphor Icons (`react-icons/pi`) across the entire codebase.

- _Why:_ Phosphor offers a cohesive 1.75px stroke design system with excellent visual balance for editorial UI.
- _Bundle safety:_ All icons are imported individually (e.g. `import { PiSealCheck } from 'react-icons/pi'`) so tree-shaking discards unused icons.
- _No emojis:_ Zero emojis across the site, elevating the tone from hobbyist to serious venture.

---

## 17. Feed Section & Campaign/Creator Listings (`src/data/examples.ts`)

**Decision:** Implemented a realistic platform preview featuring authentic-feeling listings.

- **`CampaignCard`:** 16:10 cover image ratio with explicit `width={640}` and `height={400}` to prevent layout shifts (CLS), brand monogram avatar, collaboration type badge (UGC, Influence, Hybride, Gifting), status pill, deliverables chips, budget range, and an _Aperçu_ button.
- **`CreatorCard`:** 4:5 portrait ratio with explicit `width={400}` and `height={500}`, city pill, verified chip, niche chips, and platform follower counts.
- **Illustration rule:** All listings use fictional brands and abstract vector duotones (no faces, no fake logos). Replaceable in a single file (`src/data/examples.ts`). Marked with a discreet line: _"Aperçu illustratif, aucune marque réelle représentée"_.
- **Mobile Swipeable Carousel:** Native CSS scroll-snap (`scroll-snap-type: x mandatory`, `overscroll-behavior-x: contain`) ensures smooth touch interaction on mobile without third-party carousel library bloat.
- **`CampaignPreviewModal`:** Native accessible overlay with light dismiss, escape key handling, overscroll containment, and direct waitlist conversion flow.

---

## 19. Architecture éditoriale et flux narratif complet

**Décision :** Remplacement des blocs répétitifs par une séquence éditoriale asymétrique et rythmée.

- **Audience Toggle (`AudienceBenefits.tsx`) :** Switcher segmenté Marques | Créateurs présentant 3 piliers concrets chacun avec icônes Phosphor dédiées.
- **Feed / Aperçu de la plateforme (`Feed.tsx`) :** Filtres animés (Mode, Beauté, Auto, Food, Hôtels, Tech), carrousel scroll-snap sur mobile, grille sur desktop, modale d'aperçu de campagne.
- **Le Cadre (`TheFramework.tsx`) :** Fiche visuelle d'accord type (livrables, droits d'usage, exclusivité, retouches, règlement) labellisée comme exemple avec explications claires et double CTA.
- **Comment ça marche (`HowItWorks.tsx`) :** 3 étapes rythmées avec bascule Marques / Créateurs.
- **Types de collaboration (`CollabTypes.tsx`) :** Contrôle segmenté (UGC, Influence, Hybride, Gifting) avec panneau détaillant la diffusion, l'accord préalable et le modèle de rémunération.
- **Niveaux de vérification (`Vetting.tsx`) :** 3 tiers transparents (Identité vérifiée, Portfolio examiné, Comptes sociaux confirmés) avec mention honnête sur les statistiques tierces.
- **Des humains, pas un algorithme (`HumanTouch.tsx`) :** Bandeau affirmé avec bouton direct vers l'équipe sur WhatsApp.
- **En préparation & Premiers membres (`Roadmap.tsx`) :** Fonctionnalités à venir présentées sans fausse promesse de date, avec valorisation des membres pionniers.
- **FAQ complète (`FAQ.tsx`) :** Onglets Marques, Créateurs et Général avec accordéons animés accessibles (ARIA) et carte de contact WhatsApp.


---

## 20. Addendum v2.1 : Contacts Centralisés, Sélecteur WhatsApp et Anti-Scraping Email

**Décision :** Centralisation absolue de tous les contacts de l'équipe dans `src/config/contact.ts`.
- **Dan Ebondo** (WhatsApp : `+243 896 124 415` / `243896124415`).
- **Kevin Ruvunangiza** (WhatsApp : `+27 79 644 9946` / `27796449946`).
- **Modal de sélection WhatsApp (`WhatsAppChooserModal.tsx`) :** Tout bouton d'action invitant à échanger avec l'équipe ouvre une modale accessible proposant le choix entre les deux contacts avec le message pré-rempli : *« Bonjour, j'ai une question sur Mosala. »*.
- **Protection anti-scraping de l'email :** L'adresse email (`ruvunangizakev@gmail.com`) est temporaire pour la phase de lancement. Elle n'est **jamais** rendue en texte brut dans le HTML statique. Elle est assemblée dynamiquement au moment de l'interaction via le composant `EmailActionButton.tsx` avec actions « Écrire un email » et « Copier l'adresse » (avec confirmation visuelle).

---

## 21. Liens Sociaux : Normalisation Automatique et Règle Future

**Décision :**
- **Sur la liste d'attente :** Tous les liens (Instagram, TikTok, YouTube, Facebook, Site web, Portfolio) sont **facultatifs**, accompagnés de la mention incitative bienveillante : *« Ajoutez au moins un lien pour accélérer votre vérification. »*.
- **Normalisation automatique (`src/utils/socialLinks.ts`) :** Les saisies sous forme d'identifiant (`@compte` ou `compte`) ou d'URL collée contenant des balises de tracking (`?igsh=...`, `?utm_...`, `?fbclid=...`, `?si=...`) sont automatiquement nettoyées et formatées vers l'URL canonique propre de la plateforme. Validé par 7 tests unitaires Vitest automatisés.
- **Règle pour la future plateforme en production (Documentée) :**
  - *Créateurs :* Fourniture obligatoire d'au moins un compte de réseau social actif ou d'un lien de portfolio avant le déclenchement de la procédure de vérification d'identité.
  - *Marques :* Fourniture obligatoire d'un site web officiel ou d'une page professionnelle vérifiable avant la publication d'une première campagne.

---

## 22. Suppression du Modèle Shortlist & Passage au Modèle Self-Service v2

**Décision :** Élimination définitive de l'ancien vocabulaire d'intermédiation lourde (« shortlist », « matching humain », « des humains, pas un algorithme »).
- **Modèle officiel Mosala v2 :**
  1. La marque publie sa campagne directement avec son budget indicatif et ses critères.
  2. Les créateurs vérifiés intéressés postulent librement avec leur portfolio.
  3. La marque choisit souverainement avec qui collaborer.
  4. L'intervention humaine de l'équipe Mosala est dédiée à la **vérification rigoureuse des profils** et à la médiation des accords écrits.
- **Audit de conformité des allégations proscrites :** Zéro occurrence de termes interdits (*garanti, protégé, sécurisé pour les paiements, escrow, algorithme, IA, ROI, numéro 1, premier d'Afrique*).

---

## 23. Validation Finale v2.1, Audits Lighthouse & Checklist Pré-Lancement

**Résultats des tests et contrôles qualité :**
- **Linter TypeScript / ESLint :** 0 erreur, 0 avertissement (`npm run lint --report-unused-disable-directives --max-warnings 0`).
- **Tests unitaires (Vitest) :** 11/11 tests passés avec succès (validation des formulaires + normalisation des URLs de réseaux sociaux).
- **Compilation de production Vite :** Succès total (`dist/index.html` 2.37 kB, `dist/assets/*.css` 32.66 kB, bundle JS 128.2 kB gzippé, 415 modules transformés).
- **Scores d'audit Lighthouse Mobile (sur build de production) :**
  - **Performance :** 86%
  - **Accessibilité :** 98%
  - **Bonnes pratiques :** 100%
  - **SEO :** 91%
- **Vérification responsive multi-résolution :** Captures d'écran pleine page générées et vérifiées sans overflow horizontal :
  - Desktop 1440 × 900 px
  - Mobile iPhone 390 × 844 px
  - Mobile Android compact 360 × 800 px
- **Illustrations abstraites diversifiées :** 6 cartes d'exemple avec motifs SVG et palettes chromatiques uniques selon la thématique (Mode, Beauté, Auto, Food, Hôtels, Tech).
- **Protection anti-scraping :** Zéro email en texte brut dans le DOM. Déclenchement via composant interactif.
- **Modale de confidentialité :** Intégrée en FR et EN avec 4 sections claires.

---

## 24. Résolution des Régressions Visuelles & Formulaires

**1. Compatibilité Tailwind pour les classes `bg-creamCard` et variantes :**
- `tailwind.config.ts` ne déclarait initialement que la notation kebab-case (`'cream-card'`), ce qui neutralisait toutes les classes écrites en camelCase (`bg-creamCard`, `border-creamDarker`, etc.), laissant les cartes sans fond blanc distinct (confondu avec le `bg-cream` de la page).
- Ajout des alias directs (`creamCard`, `creamDarker`, `borderDark`, `textMuted`, etc.) dans la configuration Tailwind pour garantir le support des deux syntaxes.

**2. Présence des champs de réseaux sociaux (facultatifs) :**
- **Formulaire Hero (`HeroWaitlistForm.tsx`) :** Intégration d'un panneau accordéon fluide `+ Ajouter vos réseaux sociaux / portfolio (facultatif)` directement sous les champs essentiels. Les marques peuvent renseigner Site web, Instagram et Facebook ; les créateurs peuvent renseigner Instagram, TikTok, YouTube, Facebook et Portfolio. Tous les champs bénéficient de la normalisation d'URL en direct (`SocialLinkInput`).
- **Formulaire principal (`WaitlistForm.tsx`) :** Ajout d'onglets de navigation entre l'Étape 1 et l'Étape 2, permettant d'accéder et de visualiser les champs de réseaux sociaux immédiatement sans devoir soumettre préalablement.

**3. Visibilité de la marque dans le Footer :**
- Le composant `Wordmark.tsx` appliquait en dur la classe `text-ink` (`#0E0E0E`), ce qui provoquait un texte noir invisible sur le fond sombre (`bg-ink`) du pied de page.
- Détection intelligente de la couleur passée en prop : si une classe `text-*` explicite est fournie (ex: `text-cream`), `text-ink` est omis pour laisser primer la couleur désirée.


