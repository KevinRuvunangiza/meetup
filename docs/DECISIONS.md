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
