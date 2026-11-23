/**
 * WAITLIST FORM
 * ─────────────────────────────────────────────────────────────────────────────
 * Architecture decisions:
 *
 * 1. NO form library (react-hook-form etc.) — we have two forms with ~15 fields
 *    each. A custom hook is simpler, easier to understand, and saves ~10 KB.
 *
 * 2. Validation is intentionally simple — required, phone format, email format,
 *    URL format. We validate on submit + show inline errors.
 *
 * 3. Honeypot field: a visually hidden input named "website_url". Bots fill it.
 *    Humans never see it. If it's filled, we silently pretend success.
 *
 * 4. The form posts JSON to the Apps Script URL via fetch().
 *    On success → show Success screen with WhatsApp share button.
 *    On duplicate → show friendly message.
 *    On error → show error message, let them retry.
 *
 * 5. Role preselection: parent (App) passes `initialRole` which the Hero sets
 *    when user clicks "I'm a brand" / "I'm a creator".
 */
import { useState, type FormEvent, type ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Chip } from '@/components/ui/Chip'
import { useTranslation } from '@/hooks/useTranslation'
import { siteConfig } from '@/config/site.config'
import type {
  Role,
  BrandFields,
  CreatorFields,
  Sector,
  CreatorNeed,
  BudgetRange,
  CreatorType,
  Niche,
  FollowerRange,
  RateRange,
} from '@/types/form'

// ─── Validation helpers ───────────────────────────────────────────────────────

const PHONE_RE = /^\+\d{7,15}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_RE = /^https?:\/\/.+/

type Errors = Record<string, string>

// ─── Initial state factories ──────────────────────────────────────────────────

function brandDefaults(role: Role = 'brand'): BrandFields {
  return {
    role: role as 'brand',
    fullName: '',
    whatsapp: '+243',
    email: '',
    city: '',
    consent: false,
    honeypot: '',
    source: new URLSearchParams(window.location.search).get('utm_source') ?? 'direct',
    businessName: '',
    sector: '',
    creatorNeed: '',
    budget: '',
    workedBefore: '',
    websiteOrInsta: '',
  }
}

function creatorDefaults(role: Role = 'creator'): CreatorFields {
  return {
    role: role as 'creator',
    fullName: '',
    whatsapp: '+243',
    email: '',
    city: '',
    consent: false,
    honeypot: '',
    source: new URLSearchParams(window.location.search).get('utm_source') ?? 'direct',
    creatorName: '',
    creatorType: '',
    niches: [],
    instagramHandle: '',
    instagramFollowers: '',
    tiktokHandle: '',
    tiktokFollowers: '',
    youtubeHandle: '',
    youtubeFollowers: '',
    portfolioLink: '',
    paidBefore: '',
    rateRange: '',
  }
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen() {
  const { t } = useTranslation()

  const shareUrl = siteConfig.url
  const shareText = t('form.success.shareMessage', { url: shareUrl })
  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="rounded-2xl bg-white border border-border p-8 text-center max-w-md mx-auto"
    >
      {/* Yellow check */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-signal text-3xl font-bold text-ink">
        ✓
      </div>

      <h3 className="mb-3 text-2xl font-bold text-ink">{t('form.success.title')}</h3>
      <p className="mb-6 text-muted">{t('form.success.body')}</p>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-base font-semibold text-white min-h-[44px] transition-opacity hover:opacity-90"
      >
        <span aria-hidden="true">📲</span>
        {t('form.success.share')}
      </a>
    </motion.div>
  )
}

// ─── MAIN FORM COMPONENT ──────────────────────────────────────────────────────

interface WaitlistFormProps {
  initialRole?: Role
}

export function WaitlistForm({ initialRole }: WaitlistFormProps) {
  const { t } = useTranslation()

  const [role, setRole] = useState<Role | ''>(initialRole ?? '')
  const [brand, setBrand] = useState<BrandFields>(brandDefaults())
  const [creator, setCreator] = useState<CreatorFields>(creatorDefaults())
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  // Update role and reset errors
  const handleRoleChange = (r: Role) => {
    setRole(r)
    setErrors({})
    setServerError('')
  }

  // Update brand field
  const setBrandField = <K extends keyof BrandFields>(key: K, val: BrandFields[K]) => {
    setBrand((prev) => ({ ...prev, [key]: val }))
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n })
  }

  // Update creator field
  const setCreatorField = <K extends keyof CreatorFields>(key: K, val: CreatorFields[K]) => {
    setCreator((prev) => ({ ...prev, [key]: val }))
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n })
  }

  // Toggle niche chip
  const toggleNiche = (niche: Niche) => {
    setCreator((prev) => ({
      ...prev,
      niches: prev.niches.includes(niche)
        ? prev.niches.filter((n) => n !== niche)
        : [...prev.niches, niche],
    }))
    if (errors.niches) setErrors((e) => { const n = { ...e }; delete n.niches; return n })
  }

  // ─── Validation ──────────────────────────────────────────────────────────

  const validate = (): Errors => {
    const e: Errors = {}
    const req = t('form.errors.required')

    if (!role) { e.role = t('form.errors.roleRequired'); return e }

    const shared = role === 'brand' ? brand : creator
    if (!shared.fullName.trim()) e.fullName = req
    if (!shared.whatsapp.trim() || !PHONE_RE.test(shared.whatsapp.replace(/\s/g, '')))
      e.whatsapp = t('form.errors.invalidPhone')
    if (shared.email && !EMAIL_RE.test(shared.email)) e.email = t('form.errors.invalidEmail')
    if (!shared.city.trim()) e.city = req
    if (!shared.consent) e.consent = t('form.errors.consentRequired')

    if (role === 'brand') {
      if (!brand.businessName.trim()) e.businessName = req
      if (!brand.sector) e.sector = req
      if (!brand.creatorNeed) e.creatorNeed = req
      if (!brand.budget) e.budget = req
      if (!brand.workedBefore) e.workedBefore = req
      if (brand.websiteOrInsta && !URL_RE.test(brand.websiteOrInsta) && !brand.websiteOrInsta.startsWith('@'))
        e.websiteOrInsta = t('form.errors.invalidUrl')
    }

    if (role === 'creator') {
      if (!creator.creatorName.trim()) e.creatorName = req
      if (!creator.creatorType) e.creatorType = req
      if (creator.niches.length === 0) e.niches = t('form.errors.selectAtLeastOne')
      if (!creator.paidBefore) e.paidBefore = req
      if (creator.portfolioLink && !URL_RE.test(creator.portfolioLink))
        e.portfolioLink = t('form.errors.invalidUrl')
      // Require at least one platform handle
      const hasHandle = creator.instagramHandle || creator.tiktokHandle || creator.youtubeHandle
      if (!hasHandle) e.instagramHandle = t('form.errors.required')
    }

    return e
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Honeypot check — if filled, pretend success silently
    const honeypotValue = role === 'brand' ? brand.honeypot : creator.honeypot
    if (honeypotValue) {
      setSubmitted(true)
      return
    }

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // Scroll to first error
      const firstKey = Object.keys(errs)[0]
      document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    setServerError('')

    const payload = {
      timestamp: new Date().toISOString(),
      data: role === 'brand' ? brand : creator,
    }

    try {
      if (!siteConfig.appsScriptUrl) {
        // Dev mode — log and fake success
        console.log('📋 Form payload (no Apps Script URL set):', payload)
        await new Promise((r) => setTimeout(r, 800))
        setSubmitted(true)
        return
      }

      try {
        const res = await fetch(siteConfig.appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        })

        if (res.ok) {
          const json = await res.json()
          if (json.duplicate) {
            setServerError(t('form.errors.duplicate'))
            return
          }
        }
        setSubmitted(true)
      } catch {
        // Fallback for Google Apps Script redirect CORS quirk
        await fetch(siteConfig.appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        })
        setSubmitted(true)
      }
    } catch {
      setServerError(t('form.errors.serverError'))
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Option lists (read from translation) ────────────────────────────────

  const sectorOptions = Object.entries(
    t('form.sectors') as unknown as Record<string, string>,
  ).map(([value, label]) => ({ value, label }))

  const needOptions = Object.entries(
    t('form.creatorNeeds') as unknown as Record<string, string>,
  ).map(([value, label]) => ({ value, label }))

  const budgetOptions = Object.entries(
    t('form.budgets') as unknown as Record<string, string>,
  ).map(([value, label]) => ({ value, label }))

  const creatorTypeOptions = Object.entries(
    t('form.creatorTypes') as unknown as Record<string, string>,
  ).map(([value, label]) => ({ value, label }))

  const followerOptions = Object.entries(
    t('form.followerRanges') as unknown as Record<string, string>,
  ).map(([value, label]) => ({ value, label }))

  const rateOptions = Object.entries(
    t('form.rateRanges') as unknown as Record<string, string>,
  ).map(([value, label]) => ({ value, label }))

  const nicheKeys: Niche[] = [
    'fashion','beauty','food','lifestyle','fitness','tech',
    'auto','travel','parenting','finance','music','comedy','other',
  ]

  const nicheLabels = t('form.nicheOptions') as unknown as Record<string, string>

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Section id="waitlist" dark>
      <SectionHeader
        label=""
        title={t('form.title')}
        subtitle={t('form.subtitle')}
        light
      />

      <AnimatePresence mode="wait">
        {submitted ? (
          <SuccessScreen key="success" />
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            noValidate
            aria-label={t('form.title')}
            className="max-w-2xl"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* ── Honeypot (hidden from humans) ── */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="website_url">Leave this empty</label>
              <input
                id="website_url"
                name="website_url"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={role === 'brand' ? brand.honeypot : creator.honeypot}
                onChange={(e) =>
                  role === 'brand'
                    ? setBrandField('honeypot', e.target.value)
                    : setCreatorField('honeypot', e.target.value)
                }
              />
            </div>

            {/* ── Role selector ── */}
            <fieldset className="mb-8">
              <legend className="mb-3 text-sm font-medium text-white">
                {t('form.roleLabel')} <span className="text-white/50" aria-hidden="true">*</span>
              </legend>
              {errors.role && (
                <p role="alert" className="mb-2 text-xs text-red-400">{errors.role}</p>
              )}
              <div className="flex flex-col gap-3 sm:flex-row">
                {(['brand', 'creator'] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    role="radio"
                    aria-checked={role === r}
                    onClick={() => handleRoleChange(r)}
                    className={[
                      'flex-1 rounded-xl border-2 p-4 text-left transition-colors duration-150 min-h-[64px]',
                      role === r
                        ? 'border-signal bg-signal/10 text-white'
                        : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40',
                    ].join(' ')}
                  >
                    <span className="font-semibold">
                      {r === 'brand' ? t('form.roleBrand') : t('form.roleCreator')}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* ── Shared fields ── */}
            {role && (
              <div className="flex flex-col gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    id="fullName"
                    label={t('form.fullName')}
                    value={role === 'brand' ? brand.fullName : creator.fullName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      role === 'brand'
                        ? setBrandField('fullName', e.target.value)
                        : setCreatorField('fullName', e.target.value)
                    }
                    required
                    autoComplete="name"
                    error={errors.fullName}
                  />
                  <Input
                    id="whatsapp"
                    label={t('form.whatsapp')}
                    type="tel"
                    placeholder={t('form.whatsappPlaceholder')}
                    value={role === 'brand' ? brand.whatsapp : creator.whatsapp}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      role === 'brand'
                        ? setBrandField('whatsapp', e.target.value)
                        : setCreatorField('whatsapp', e.target.value)
                    }
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    error={errors.whatsapp}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    id="email"
                    label={t('form.email')}
                    type="email"
                    placeholder={t('form.emailPlaceholder')}
                    value={role === 'brand' ? brand.email : creator.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      role === 'brand'
                        ? setBrandField('email', e.target.value)
                        : setCreatorField('email', e.target.value)
                    }
                    autoComplete="email"
                    error={errors.email}
                  />
                  <Input
                    id="city"
                    label={t('form.city')}
                    placeholder={t('form.cityPlaceholder')}
                    value={role === 'brand' ? brand.city : creator.city}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      role === 'brand'
                        ? setBrandField('city', e.target.value)
                        : setCreatorField('city', e.target.value)
                    }
                    required
                    autoComplete="address-level2"
                    error={errors.city}
                  />
                </div>

                {/* ── Brand-specific fields ── */}
                {role === 'brand' && (
                  <>
                    <Input
                      id="businessName"
                      label={t('form.businessName')}
                      value={brand.businessName}
                      onChange={(e) => setBrandField('businessName', e.target.value)}
                      required
                      error={errors.businessName}
                    />
                    <div className="grid gap-5 md:grid-cols-2">
                      <Select
                        id="sector"
                        label={t('form.sector')}
                        value={brand.sector}
                        onChange={(e) => setBrandField('sector', e.target.value as Sector)}
                        placeholder={t('form.sectorPlaceholder')}
                        options={sectorOptions}
                        required
                        error={errors.sector}
                      />
                      <Select
                        id="creatorNeed"
                        label={t('form.creatorNeed')}
                        value={brand.creatorNeed}
                        onChange={(e) => setBrandField('creatorNeed', e.target.value as CreatorNeed)}
                        placeholder={t('form.creatorNeedPlaceholder')}
                        options={needOptions}
                        required
                        error={errors.creatorNeed}
                      />
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <Select
                        id="budget"
                        label={t('form.budget')}
                        value={brand.budget}
                        onChange={(e) => setBrandField('budget', e.target.value as BudgetRange)}
                        placeholder={t('form.budgetPlaceholder')}
                        options={budgetOptions}
                        required
                        error={errors.budget}
                      />
                      <Select
                        id="workedBefore"
                        label={t('form.workedBefore')}
                        value={brand.workedBefore}
                        onChange={(e) => setBrandField('workedBefore', e.target.value as 'yes' | 'no')}
                        placeholder={t('form.workedBeforePlaceholder')}
                        options={[
                          { value: 'yes', label: t('form.yes') },
                          { value: 'no', label: t('form.no') },
                        ]}
                        required
                        error={errors.workedBefore}
                      />
                    </div>
                    <Input
                      id="websiteOrInsta"
                      label={t('form.websiteOrInsta')}
                      placeholder={t('form.websiteOrInstaPlaceholder')}
                      value={brand.websiteOrInsta}
                      onChange={(e) => setBrandField('websiteOrInsta', e.target.value)}
                      error={errors.websiteOrInsta}
                    />
                  </>
                )}

                {/* ── Creator-specific fields ── */}
                {role === 'creator' && (
                  <>
                    <div className="grid gap-5 md:grid-cols-2">
                      <Input
                        id="creatorName"
                        label={t('form.creatorName')}
                        value={creator.creatorName}
                        onChange={(e) => setCreatorField('creatorName', e.target.value)}
                        required
                        error={errors.creatorName}
                      />
                      <Select
                        id="creatorType"
                        label={t('form.creatorType')}
                        value={creator.creatorType}
                        onChange={(e) => setCreatorField('creatorType', e.target.value as CreatorType)}
                        placeholder={t('form.creatorTypePlaceholder')}
                        options={creatorTypeOptions}
                        required
                        error={errors.creatorType}
                      />
                    </div>

                    {/* Niches multi-select */}
                    <fieldset>
                      <legend className="mb-3 text-sm font-medium text-ink">
                        {t('form.niches')} <span className="text-muted" aria-hidden="true">*</span>
                      </legend>
                      {errors.niches && (
                        <p role="alert" className="mb-2 text-xs text-red-600">{errors.niches}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {nicheKeys.map((niche) => (
                          <Chip
                            key={niche}
                            label={nicheLabels[niche] ?? niche}
                            selected={creator.niches.includes(niche)}
                            onToggle={() => toggleNiche(niche)}
                          />
                        ))}
                      </div>
                    </fieldset>

                    {/* Platform handles */}
                    {(['instagram', 'tiktok', 'youtube'] as const).map((platform) => {
                      const handleKey = `${platform}Handle` as keyof CreatorFields
                      const followersKey = `${platform}Followers` as keyof CreatorFields
                      const handleLabel = t(`form.${platform}Handle` as Parameters<typeof t>[0])
                      const handlePlaceholder = t(`form.${platform}HandlePlaceholder` as Parameters<typeof t>[0])

                      return (
                        <div key={platform} className="grid gap-3 md:grid-cols-2">
                          <Input
                            id={handleKey}
                            label={`${t(`form.${platform}` as Parameters<typeof t>[0])} — ${handleLabel}`}
                            placeholder={handlePlaceholder}
                            value={creator[handleKey] as string}
                            onChange={(e) => setCreatorField(handleKey, e.target.value)}
                            error={platform === 'instagram' ? errors.instagramHandle : undefined}
                          />
                          <Select
                            id={followersKey}
                            label={t('form.followerRange')}
                            value={creator[followersKey] as string}
                            onChange={(e) =>
                              setCreatorField(followersKey, e.target.value as FollowerRange)
                            }
                            placeholder={t('form.followerRangePlaceholder')}
                            options={followerOptions}
                          />
                        </div>
                      )
                    })}

                    <div className="grid gap-5 md:grid-cols-2">
                      <Input
                        id="portfolioLink"
                        label={t('form.portfolioLink')}
                        placeholder={t('form.portfolioLinkPlaceholder')}
                        type="url"
                        value={creator.portfolioLink}
                        onChange={(e) => setCreatorField('portfolioLink', e.target.value)}
                        error={errors.portfolioLink}
                      />
                      <Select
                        id="paidBefore"
                        label={t('form.paidBefore')}
                        value={creator.paidBefore}
                        onChange={(e) => setCreatorField('paidBefore', e.target.value as 'yes' | 'no')}
                        placeholder={t('form.workedBeforePlaceholder')}
                        options={[
                          { value: 'yes', label: t('form.yes') },
                          { value: 'no', label: t('form.no') },
                        ]}
                        required
                        error={errors.paidBefore}
                      />
                    </div>

                    <Select
                      id="rateRange"
                      label={t('form.rateRange')}
                      value={creator.rateRange}
                      onChange={(e) => setCreatorField('rateRange', e.target.value as RateRange)}
                      placeholder={t('form.rateRangePlaceholder')}
                      options={rateOptions}
                    />
                  </>
                )}

                {/* ── Consent ── */}
                <div className="flex items-start gap-3">
                  <input
                    id="consent"
                    type="checkbox"
                    className="mt-1 h-5 w-5 flex-shrink-0 rounded border-border accent-signal cursor-pointer"
                    checked={role === 'brand' ? brand.consent : creator.consent}
                    onChange={(e) =>
                      role === 'brand'
                        ? setBrandField('consent', e.target.checked)
                        : setCreatorField('consent', e.target.checked)
                    }
                    aria-describedby={errors.consent ? 'consent-error' : undefined}
                    aria-invalid={errors.consent ? 'true' : undefined}
                  />
                  <div>
                    <label htmlFor="consent" className="text-sm text-muted cursor-pointer">
                      {t('form.consent')}
                    </label>
                    {errors.consent && (
                      <p id="consent-error" role="alert" className="mt-1 text-xs text-red-600">
                        {errors.consent}
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Server error ── */}
                {serverError && (
                  <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {serverError}
                  </div>
                )}

                {/* ── Submit ── */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={submitting}
                >
                  {submitting ? t('form.submitting') : t('form.submit')}
                </Button>
              </div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </Section>
  )
}
