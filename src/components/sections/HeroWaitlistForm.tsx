import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { brandConfig } from '@/config/brand'
import { useTranslation } from '@/hooks/useTranslation'
import type { Role } from '@/types/form'
import { validateStep1, normalizePhone } from '@/utils/validation'
import { SocialLinkInput } from '@/components/ui/SocialLinkInput'
import {
  PiBuildings,
  PiUser,
  PiArrowRight,
  PiCheck,
  PiSpinnerGap,
  PiWarningCircle,
  PiPlus,
  PiInfo,
} from 'react-icons/pi'

interface HeroWaitlistFormProps {
  initialRole?: Role
  onSubmitted?: () => void
}

export function HeroWaitlistForm({ initialRole = 'brand', onSubmitted }: HeroWaitlistFormProps) {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  const [role, setRole] = useState<Role>(initialRole)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Form Fields
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const city = 'Kinshasa'

  // Optional Social Fields
  const [showSocials, setShowSocials] = useState(false)

  // Brand optional links
  const [brandWebsiteRaw, setBrandWebsiteRaw] = useState('')
  const [brandWebsiteNorm, setBrandWebsiteNorm] = useState('')
  const [brandInstaRaw, setBrandInstaRaw] = useState('')
  const [brandInstaNorm, setBrandInstaNorm] = useState('')
  const [brandFbRaw, setBrandFbRaw] = useState('')
  const [brandFbNorm, setBrandFbNorm] = useState('')

  // Creator optional links
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

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole)
    setErrorMsg('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (honeypot) {
      setSubmitted(true)
      return
    }

    const validation = validateStep1({
      fullName: name,
      whatsapp,
      email,
      role,
    })

    if (!validation.ok) {
      setErrorMsg(validation.error || 'Veuillez vérifier les champs obligatoires.')
      return
    }

    setSubmitting(true)

    const payload = {
      timestamp: new Date().toISOString(),
      data: {
        role,
        fullName: name.trim(),
        whatsapp: normalizePhone(whatsapp),
        email: email.trim(),
        city: city.trim() || 'Kinshasa',
        source: 'hero_form',
        website: role === 'brand' ? (brandWebsiteNorm || brandWebsiteRaw) : '',
        instagram: role === 'brand' ? (brandInstaNorm || brandInstaRaw) : (creatorInstaNorm || creatorInstaRaw),
        facebook: role === 'brand' ? (brandFbNorm || brandFbRaw) : (creatorFbNorm || creatorFbRaw),
        tiktok: role === 'creator' ? (creatorTiktokNorm || creatorTiktokRaw) : '',
        youtube: role === 'creator' ? (creatorYoutubeNorm || creatorYoutubeRaw) : '',
        portfolioLink: role === 'creator' ? (creatorPortfolioNorm || creatorPortfolioRaw) : '',
      },
    }

    try {
      if (brandConfig.appsScriptUrl) {
        await fetch(brandConfig.appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      setSubmitting(false)
      setSubmitted(true)
      onSubmitted?.()
    } catch (err) {
      console.warn('Hero form fallback applied:', err)
      setSubmitting(false)
      setSubmitted(true)
      onSubmitted?.()
    }
  }

  return (
    <div
      id="hero-quick-form"
      className="relative rounded-2xl border border-creamDarker bg-creamCard p-6 sm:p-7 shadow-xl shadow-ink/5"
    >
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="submitted"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-saffron text-ink">
              <PiCheck size={28} />
            </div>
            <h3 className="font-display text-xl font-bold text-ink mb-2">
              Vous êtes sur la liste !
            </h3>
            <p className="text-xs text-textMuted max-w-xs mx-auto mb-6 leading-relaxed">
              Votre place prioritaire est enregistrée. Nous vous contacterons sur WhatsApp dès l'ouverture des accès.
            </p>
            <button
              type="button"
              onClick={() => {
                const waitlistSection = document.getElementById('waitlist')
                waitlistSection?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-ink hover:text-saffron transition-colors"
            >
              <span>Découvrir le formulaire complet</span>
              <PiArrowRight size={14} />
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={false}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Honeypot field */}
            <input
              type="text"
              name="hp_hero"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Role Pill Switcher */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-textMuted mb-2">
                Je souhaite rejoindre en tant que :
              </div>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-cream border border-border">
                <button
                  type="button"
                  onClick={() => handleRoleChange('brand')}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                    role === 'brand'
                      ? 'bg-creamCard text-ink shadow-sm'
                      : 'text-textMuted hover:text-ink'
                  }`}
                >
                  <PiBuildings size={15} className={role === 'brand' ? 'text-saffron' : ''} />
                  <span>Marque</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('creator')}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                    role === 'creator'
                      ? 'bg-creamCard text-ink shadow-sm'
                      : 'text-textMuted hover:text-ink'
                  }`}
                >
                  <PiUser size={15} className={role === 'creator' ? 'text-saffron' : ''} />
                  <span>Créateur</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-700 flex items-center gap-2">
                <PiWarningCircle size={16} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                {role === 'brand' ? 'Nom de la marque / entreprise' : 'Nom ou pseudo de créateur'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'brand' ? 'Ex: Maison Beauté Kin' : 'Ex: Patrick K.'}
                className="w-full rounded-xl border border-border bg-cream px-3.5 py-2.5 text-xs sm:text-sm text-ink placeholder:text-textMuted/60 focus:border-saffron focus:bg-creamCard focus:outline-none focus:ring-2 focus:ring-saffron/20 transition-all"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Numéro WhatsApp (avec indicatif)
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+243 812 345 678"
                className="w-full rounded-xl border border-border bg-cream px-3.5 py-2.5 text-xs sm:text-sm text-ink placeholder:text-textMuted/60 focus:border-saffron focus:bg-creamCard focus:outline-none focus:ring-2 focus:ring-saffron/20 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Adresse email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@exemple.com"
                className="w-full rounded-xl border border-border bg-cream px-3.5 py-2.5 text-xs sm:text-sm text-ink placeholder:text-textMuted/60 focus:border-saffron focus:bg-creamCard focus:outline-none focus:ring-2 focus:ring-saffron/20 transition-all"
              />
            </div>

            {/* Optional Social Links Accordion */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowSocials(!showSocials)}
                className="flex items-center gap-1.5 text-xs font-semibold text-textMuted hover:text-ink transition-colors py-1 cursor-pointer"
              >
                <PiPlus
                  size={13}
                  className={`transition-transform duration-200 text-saffron ${showSocials ? 'rotate-45' : ''}`}
                />
                <span>
                  {showSocials
                    ? 'Masquer les réseaux sociaux'
                    : '+ Ajouter vos réseaux sociaux / portfolio (facultatif)'}
                </span>
              </button>

              <AnimatePresence>
                {showSocials && (
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={shouldReduceMotion ? { opacity: 0, height: 0 } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden pt-3 space-y-3"
                  >
                    <div className="rounded-xl bg-cream border border-border p-3 flex items-center gap-2 text-[11px] text-textMuted">
                      <PiInfo size={15} className="text-saffron flex-shrink-0" />
                      <span>{t('form.socialLinksHelper')}</span>
                    </div>

                    {role === 'brand' ? (
                      <div className="space-y-2.5">
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
                    ) : (
                      <div className="space-y-2.5">
                        <SocialLinkInput
                          type="instagram"
                          label={t('form.instagram')}
                          placeholder="@votre_compte ou lien Instagram"
                          value={creatorInstaRaw}
                          onChange={(raw, norm) => {
                            setCreatorInstaRaw(raw)
                            setCreatorInstaNorm(norm)
                          }}
                        />
                        <SocialLinkInput
                          type="tiktok"
                          label={t('form.tiktok')}
                          placeholder="@votre_compte ou lien TikTok"
                          value={creatorTiktokRaw}
                          onChange={(raw, norm) => {
                            setCreatorTiktokRaw(raw)
                            setCreatorTiktokNorm(norm)
                          }}
                        />
                        <SocialLinkInput
                          type="youtube"
                          label={t('form.youtube')}
                          placeholder="Nom de chaîne ou lien YouTube"
                          value={creatorYoutubeRaw}
                          onChange={(raw, norm) => {
                            setCreatorYoutubeRaw(raw)
                            setCreatorYoutubeNorm(norm)
                          }}
                        />
                        <SocialLinkInput
                          type="facebook"
                          label={t('form.facebook')}
                          placeholder="Page créateur ou profil Facebook"
                          value={creatorFbRaw}
                          onChange={(raw, norm) => {
                            setCreatorFbRaw(raw)
                            setCreatorFbNorm(norm)
                          }}
                        />
                        <SocialLinkInput
                          type="portfolio"
                          label={t('form.portfolio')}
                          placeholder="https://behance.net/... ou lien portfolio"
                          value={creatorPortfolioRaw}
                          onChange={(raw, norm) => {
                            setCreatorPortfolioRaw(raw)
                            setCreatorPortfolioNorm(norm)
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-saffron py-3.5 text-xs sm:text-sm font-extrabold text-ink hover:bg-saffronHover transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <PiSpinnerGap className="animate-spin text-base" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <span>Réserver mon accès prioritaire</span>
                  <PiArrowRight size={15} />
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-textMuted">
              Accès gratuit · Vos données restent strictement confidentielles.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
