import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { brandConfig } from '@/config/brand'
import { useTranslation } from '@/hooks/useTranslation'
import type { Role } from '@/types/form'
import { validateStep1, normalizePhone } from '@/utils/validation'
import { SocialLinkInput } from '@/components/ui/SocialLinkInput'
import {
  PiBuildings,
  PiUser,
  PiCheckCircle,
  PiArrowRight,
  PiShareNetwork,
  PiCheck,
  PiWarningCircle,
  PiSpinnerGap,
  PiInfo,
} from 'react-icons/pi'

interface WaitlistFormProps {
  initialRole?: Role
}

export function WaitlistForm({ initialRole = 'brand' }: WaitlistFormProps) {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  const [step, setStep] = useState<1 | 2 | 'success'>(1)
  const [role, setRole] = useState<Role>(initialRole)

  // Step 1 Essential Fields (Both WhatsApp & Email mandatory)
  const [fullName, setFullName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('Kinshasa')
  const [honeypot, setHoneypot] = useState('')

  // Step 2 Optional Fields — Brand
  const [sector, setSector] = useState('')
  const [budget, setBudget] = useState('')
  const [brandWebsiteRaw, setBrandWebsiteRaw] = useState('')
  const [brandWebsiteNorm, setBrandWebsiteNorm] = useState('')
  const [brandInstaRaw, setBrandInstaRaw] = useState('')
  const [brandInstaNorm, setBrandInstaNorm] = useState('')
  const [brandFbRaw, setBrandFbRaw] = useState('')
  const [brandFbNorm, setBrandFbNorm] = useState('')

  // Step 2 Optional Fields — Creator
  const [niches, setNiches] = useState<string[]>([])
  const [creatorInstaRaw, setCreatorInstaRaw] = useState('')
  const [creatorInstaNorm, setCreatorInstaNorm] = useState('')
  const [creatorTiktokRaw, setCreatorTiktokRaw] = useState('')
  const [creatorTiktokNorm, setCreatorTiktokNorm] = useState('')
  const [creatorYoutubeRaw, setCreatorYoutubeRaw] = useState('')
  const [creatorYoutubeNorm, setCreatorYoutubeNorm] = useState('')
  const [creatorFbRaw, setCreatorFbRaw] = useState('')
  const [creatorFbNorm, setCreatorFbNorm] = useState('')
  const [creatorPortfolioRaw, setCreatorPortfolioRaw] = useState('')
  const [creatorPortfolioNorm, setCreatorPortfolioNorm] = useState('')

  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole)
    }
  }, [initialRole])

  const handleRoleToggle = (newRole: Role) => {
    setRole(newRole)
    setErrorMsg('')
  }

  const toggleNiche = (nicheId: string) => {
    setNiches((prev) =>
      prev.includes(nicheId) ? prev.filter((id) => id !== nicheId) : [...prev, nicheId]
    )
  }

  // Submit Step 1: Saves essential contact info immediately
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (honeypot) {
      setStep('success')
      return
    }

    const validation = validateStep1({ fullName, whatsapp, email, role })
    if (!validation.ok) {
      setErrorMsg(validation.error || 'Veuillez vérifier les informations renseignées.')
      return
    }

    setSubmitting(true)

    const payload = {
      timestamp: new Date().toISOString(),
      data: {
        role,
        fullName: fullName.trim(),
        whatsapp: normalizePhone(whatsapp),
        email: email.trim(),
        city: city.trim() || 'Kinshasa',
        source: 'waitlist_step1',
      },
    }

    try {
      if (brandConfig.appsScriptUrl) {
        await fetch(brandConfig.appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        })
      }
      setSubmitting(false)
      setStep(2)
    } catch (err) {
      console.warn('Submission fallback applied:', err)
      setSubmitting(false)
      setStep(2)
    }
  }

  // Submit Step 2: Enriches existing record
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!fullName.trim() || !whatsapp.trim() || !email.trim()) {
      setErrorMsg('Veuillez d’abord renseigner vos coordonnées (nom, WhatsApp et email) à l’étape 1.')
      setStep(1)
      return
    }

    setSubmitting(true)

    const payload = {
      timestamp: new Date().toISOString(),
      data: {
        role,
        fullName: fullName.trim(),
        whatsapp: normalizePhone(whatsapp),
        email: email.trim(),
        city: city.trim() || 'Kinshasa',
        sector: role === 'brand' ? sector : '',
        budget: role === 'brand' ? budget : '',
        website: role === 'brand' ? (brandWebsiteNorm || brandWebsiteRaw) : '',
        instagram: role === 'brand' ? (brandInstaNorm || brandInstaRaw) : (creatorInstaNorm || creatorInstaRaw),
        facebook: role === 'brand' ? (brandFbNorm || brandFbRaw) : (creatorFbNorm || creatorFbRaw),
        niches: role === 'creator' ? niches : [],
        tiktok: role === 'creator' ? (creatorTiktokNorm || creatorTiktokRaw) : '',
        youtube: role === 'creator' ? (creatorYoutubeNorm || creatorYoutubeRaw) : '',
        portfolioLink: role === 'creator' ? (creatorPortfolioNorm || creatorPortfolioRaw) : '',
        source: 'waitlist_step2_enrichment',
      },
    }

    try {
      if (brandConfig.appsScriptUrl) {
        await fetch(brandConfig.appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        })
      }
      setSubmitting(false)
      setStep('success')
    } catch (err) {
      console.warn('Enrichment fallback applied:', err)
      setSubmitting(false)
      setStep('success')
    }
  }

  const handleCopyShare = async () => {
    const shareUrl = window.location.origin
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 3000)
      }
    } catch {
      // Fallback
    }
  }

  return (
    <section id="waitlist" className="bg-cream py-16 md:py-24 border-b border-border scroll-mt-12">
      <div className="container-site max-w-2xl">
        <div className="rounded-3xl border border-creamDarker bg-creamCard p-8 md:p-12 shadow-xl">
          {/* Honeypot field (hidden from screen) */}
          <input
            type="text"
            name="hp_field"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Step Indicator Tabs */}
          {step !== 'success' && (
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-cream border border-border mb-8">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  step === 1
                    ? 'bg-creamCard text-ink shadow-sm'
                    : 'text-textMuted hover:text-ink'
                }`}
              >
                <span>1. Coordonnées</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  step === 2
                    ? 'bg-creamCard text-ink shadow-sm'
                    : 'text-textMuted hover:text-ink'
                }`}
              >
                <span>2. Réseaux & Liens (facultatif)</span>
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ─── STEP 1 ─── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-center mb-8">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-saffron bg-ink px-3 py-1 rounded-full mb-3">
                    Liste d'attente prioritaire
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
                    {t('form.step1Title')}
                  </h2>
                  <p className="text-sm text-textMuted mt-2">
                    {t('form.step1Subtitle')}
                  </p>
                </div>

                {/* Role Switcher */}
                <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-cream border border-border mb-8">
                  <button
                    type="button"
                    onClick={() => handleRoleToggle('brand')}
                    className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                      role === 'brand'
                        ? 'bg-creamCard text-ink shadow-sm'
                        : 'text-textMuted hover:text-ink'
                    }`}
                  >
                    <PiBuildings size={18} className={role === 'brand' ? 'text-saffron' : ''} />
                    <span>{t('form.roleBrand')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleToggle('creator')}
                    className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                      role === 'creator'
                        ? 'bg-creamCard text-ink shadow-sm'
                        : 'text-textMuted hover:text-ink'
                    }`}
                  >
                    <PiUser size={18} className={role === 'creator' ? 'text-saffron' : ''} />
                    <span>{t('form.roleCreator')}</span>
                  </button>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700 flex items-center gap-2.5 mb-6">
                    <PiWarningCircle size={18} className="flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleStep1Submit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                      {t('form.fullName')} <span className="text-saffron">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t('form.fullNamePlaceholder')}
                      className="w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm text-ink placeholder:text-textMuted/60 focus:border-saffron focus:bg-creamCard focus:outline-none focus:ring-2 focus:ring-saffron/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                      {t('form.whatsapp')} <span className="text-saffron">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder={t('form.whatsappPlaceholder')}
                      className="w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm text-ink placeholder:text-textMuted/60 focus:border-saffron focus:bg-creamCard focus:outline-none focus:ring-2 focus:ring-saffron/20 transition-all"
                    />
                    <p className="text-[11px] text-textMuted mt-1">
                      Numéro utilisé pour vous notifier de l'ouverture de votre accès.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                      {t('form.email')} <span className="text-saffron">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('form.emailPlaceholder')}
                      className="w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm text-ink placeholder:text-textMuted/60 focus:border-saffron focus:bg-creamCard focus:outline-none focus:ring-2 focus:ring-saffron/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                      {t('form.city')}
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={t('form.cityPlaceholder')}
                      className="w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm text-ink placeholder:text-textMuted/60 focus:border-saffron focus:bg-creamCard focus:outline-none focus:ring-2 focus:ring-saffron/20 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-saffron py-4 text-sm font-extrabold text-ink hover:bg-saffronHover transition-all shadow-md flex items-center justify-center gap-2 mt-6 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <PiSpinnerGap className="animate-spin text-lg" />
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <span>{t('form.step1Submit')}</span>
                        <PiArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ─── STEP 2 (Optional Enrichment with Social Auto-Normalization) ─── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="rounded-xl bg-saffronSoft border border-saffron/40 p-4 mb-6 flex items-center gap-3">
                  <PiCheckCircle size={24} className="text-saffron flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-ink">Place prioritaire réservée !</div>
                    <div className="text-[11px] text-textMuted">
                      Complétez ces informations pour nous aider à vérifier votre profil plus vite.
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="font-display text-2xl font-extrabold text-ink tracking-tight">
                    {t('form.step2Title')}
                  </h2>
                  <p className="text-xs text-textMuted mt-1">
                    {t('form.step2Subtitle')}
                  </p>
                </div>

                {/* Gentle line helper */}
                <div className="rounded-xl bg-cream border border-border p-3.5 flex items-center gap-2.5 mb-6 text-xs text-textMuted">
                  <PiInfo size={16} className="text-saffron flex-shrink-0" />
                  <span>{t('form.socialLinksHelper')}</span>
                </div>

                <form onSubmit={handleStep2Submit} className="space-y-5">
                  {role === 'brand' ? (
                    <>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                          {t('form.sector')}
                        </label>
                        <select
                          value={sector}
                          onChange={(e) => setSector(e.target.value)}
                          className="w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm text-ink focus:border-saffron focus:bg-creamCard focus:outline-none focus:ring-2 focus:ring-saffron/20 transition-all"
                        >
                          <option value="">{t('form.sectorPlaceholder')}</option>
                          <option value="fashion">{t('form.sectors.fashion')}</option>
                          <option value="beauty">{t('form.sectors.beauty')}</option>
                          <option value="food">{t('form.sectors.food')}</option>
                          <option value="hospitality">{t('form.sectors.hospitality')}</option>
                          <option value="auto">{t('form.sectors.auto')}</option>
                          <option value="tech">{t('form.sectors.tech')}</option>
                          <option value="finance">{t('form.sectors.finance')}</option>
                          <option value="other">{t('form.sectors.other')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                          {t('form.budget')}
                        </label>
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm text-ink focus:border-saffron focus:bg-creamCard focus:outline-none focus:ring-2 focus:ring-saffron/20 transition-all"
                        >
                          <option value="">{t('form.budgetPlaceholder')}</option>
                          <option value="under_200">{t('form.budgets.under_200')}</option>
                          <option value="200_500">{t('form.budgets.200_500')}</option>
                          <option value="500_1000">{t('form.budgets.500_1000')}</option>
                          <option value="1000_plus">{t('form.budgets.1000_plus')}</option>
                          <option value="gifting_only">{t('form.budgets.gifting_only')}</option>
                        </select>
                      </div>

                      {/* Brand Links with Auto-Normalization */}
                      <div className="space-y-3 pt-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-textMuted">
                          Présence en ligne (facultatif)
                        </div>

                        <SocialLinkInput
                          type="website"
                          label={t('form.website')}
                          placeholder="https://votre-marque.com ou votre-marque.com"
                          value={brandWebsiteRaw}
                          onChange={(raw, norm) => {
                            setBrandWebsiteRaw(raw)
                            setBrandWebsiteNorm(norm)
                          }}
                        />

                        <SocialLinkInput
                          type="instagram"
                          label={t('form.instagram')}
                          placeholder="@votre_marque ou lien Instagram"
                          value={brandInstaRaw}
                          onChange={(raw, norm) => {
                            setBrandInstaRaw(raw)
                            setBrandInstaNorm(norm)
                          }}
                        />

                        <SocialLinkInput
                          type="facebook"
                          label={t('form.facebook')}
                          placeholder="Nom de page ou lien Facebook"
                          value={brandFbRaw}
                          onChange={(raw, norm) => {
                            setBrandFbRaw(raw)
                            setBrandFbNorm(norm)
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2">
                          {t('form.niches')}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['Mode', 'Beauté', 'Food', 'Lifestyle', 'Tech', 'Auto', 'Voyage', 'Comédie'].map(
                            (n) => {
                              const isChecked = niches.includes(n)
                              return (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => toggleNiche(n)}
                                  className={`rounded-lg px-3 py-1.5 text-xs font-bold border transition-all ${
                                    isChecked
                                      ? 'bg-ink text-cream border-ink'
                                      : 'bg-cream text-textMuted border-border hover:border-ink'
                                  }`}
                                >
                                  {n}
                                </button>
                              )
                            }
                          )}
                        </div>
                      </div>

                      {/* Creator Social Links with Auto-Normalization */}
                      <div className="space-y-3 pt-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-textMuted">
                          Vos liens (facultatif)
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <SocialLinkInput
                            type="instagram"
                            label={t('form.instagram')}
                            placeholder="@votrecompte ou lien"
                            value={creatorInstaRaw}
                            onChange={(raw, norm) => {
                              setCreatorInstaRaw(raw)
                              setCreatorInstaNorm(norm)
                            }}
                          />

                          <SocialLinkInput
                            type="tiktok"
                            label={t('form.tiktok')}
                            placeholder="@votrecompte ou lien"
                            value={creatorTiktokRaw}
                            onChange={(raw, norm) => {
                              setCreatorTiktokRaw(raw)
                              setCreatorTiktokNorm(norm)
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <SocialLinkInput
                            type="youtube"
                            label={t('form.youtube')}
                            placeholder="@votrechaine ou lien"
                            value={creatorYoutubeRaw}
                            onChange={(raw, norm) => {
                              setCreatorYoutubeRaw(raw)
                              setCreatorYoutubeNorm(norm)
                            }}
                          />

                          <SocialLinkInput
                            type="facebook"
                            label={t('form.facebook')}
                            placeholder="Page ou profil Facebook"
                            value={creatorFbRaw}
                            onChange={(raw, norm) => {
                              setCreatorFbRaw(raw)
                              setCreatorFbNorm(norm)
                            }}
                          />
                        </div>

                        <SocialLinkInput
                          type="portfolio"
                          label={t('form.portfolio')}
                          placeholder="Lien Drive, portfolio, ou vidéo modèle (ex: https://...)"
                          value={creatorPortfolioRaw}
                          onChange={(raw, norm) => {
                            setCreatorPortfolioRaw(raw)
                            setCreatorPortfolioNorm(norm)
                          }}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:flex-1 rounded-xl bg-saffron py-3.5 text-sm font-extrabold text-ink hover:bg-saffronHover transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <PiSpinnerGap className="animate-spin text-lg" />
                          <span>Mise à jour...</span>
                        </>
                      ) : (
                        <span>{t('form.step2Submit')}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto rounded-xl border border-border px-4 py-3.5 text-xs font-bold text-textMuted hover:text-ink hover:bg-cream transition-colors cursor-pointer"
                    >
                      ← Revenir à l'étape 1
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep('success')}
                      className="w-full sm:w-auto rounded-xl border border-border px-4 py-3.5 text-xs font-bold text-textMuted hover:text-ink hover:bg-cream transition-colors cursor-pointer"
                    >
                      {t('form.skipStep2')}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ─── SUCCESS STATE ─── */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-6"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-saffron text-ink shadow-lg">
                  <PiCheck size={32} />
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mb-3">
                  {t('form.successTitle')}
                </h2>

                <p className="text-sm text-textMuted max-w-md mx-auto leading-relaxed mb-8">
                  {t('form.successMessage')}
                </p>

                <div className="rounded-2xl bg-cream border border-border p-6 max-w-md mx-auto">
                  <div className="text-xs font-bold text-ink mb-3">
                    Partager l'accès prioritaire
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyShare}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink py-3 text-xs font-bold text-cream hover:bg-charcoal transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <PiCheck size={16} className="text-saffron" />
                        <span>{t('form.shareSuccess')}</span>
                      </>
                    ) : (
                      <>
                        <PiShareNetwork size={16} />
                        <span>{t('form.shareCta')}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
