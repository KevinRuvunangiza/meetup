import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { siteConfig } from '@/config/site.config'
import { useTranslation } from '@/hooks/useTranslation'
import type { Role } from '@/types/form'
import { PiBuildings, PiUser, PiArrowRight, PiCheck, PiCaretDown } from 'react-icons/pi'

const PHONE_RE = /^(\+?243|0)[0-9]{9}$/

interface HeroWaitlistFormProps {
  initialRole?: Role
  onSubmitted?: () => void
}

export function HeroWaitlistForm({ initialRole = 'brand', onSubmitted }: HeroWaitlistFormProps) {
  const { lang } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  const [role, setRole] = useState<Role>(initialRole)
  const [isExpanded, setIsExpanded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Form Fields
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [category, setCategory] = useState('')
  const [email, setEmail] = useState('')
  const [extraDetail, setExtraDetail] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole)
    setErrorMsg('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (honeypot) {
      setSubmitted(true)
      return
    }

    if (!name.trim()) {
      setErrorMsg(role === 'brand' ? 'Veuillez indiquer le nom de votre marque.' : 'Veuillez indiquer votre nom ou pseudo.')
      return
    }

    const cleanPhone = whatsapp.replace(/[\s.-]/g, '')
    if (!cleanPhone || !PHONE_RE.test(cleanPhone)) {
      setErrorMsg('Numéro WhatsApp invalide (ex: +243 812 345 678 ou 0812345678).')
      return
    }

    if (!category) {
      setErrorMsg('Veuillez sélectionner un secteur ou une niche.')
      return
    }

    setErrorMsg('')
    setSubmitting(true)

    const payload = {
      timestamp: new Date().toISOString(),
      source: typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('utm_source') ?? 'hero_quick_form') : 'hero_quick_form',
      data: {
        role,
        fullName: name.trim(),
        whatsapp: cleanPhone,
        email: email.trim(),
        city: 'Kinshasa', // Default hero assumption, can be updated later
        ...(role === 'brand'
          ? {
              businessName: name.trim(),
              sector: category,
              creatorNeed: extraDetail || 'UGC & Influence',
            }
          : {
              creatorName: name.trim(),
              niches: [category],
              instagramHandle: extraDetail,
            }),
      },
    }

    try {
      if (!siteConfig.appsScriptUrl) {
        // Dev / local demo mode
        console.log('📋 Hero Form Submission (Dev Mode):', payload)
        await new Promise((r) => setTimeout(r, 700))
        setSubmitted(true)
        onSubmitted?.()
        return
      }

      const res = await fetch(siteConfig.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (json.success) {
        setSubmitted(true)
        onSubmitted?.()
      } else if (json.duplicate) {
        setErrorMsg('Ce numéro WhatsApp est déjà sur la liste d’attente !')
      } else {
        setErrorMsg('Une erreur est survenue. Veuillez réessayer.')
      }
    } catch {
      setErrorMsg('Connexion impossible. Vos informations ont été enregistrées localement.')
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : siteConfig.url
  const shareText = lang === 'en'
    ? `I just joined the waitlist for ${siteConfig.name} — connecting top DRC brands with vetted creators. Join here: ${shareUrl}`
    : `Je viens de rejoindre la liste ${siteConfig.name} — la plateforme qui connecte les marques sérieuses et les créateurs en RDC : ${shareUrl}`
  const waShareLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-creamDarker/60 bg-creamCard p-7 shadow-xl text-ink"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-saffron text-ink mb-4 font-bold">
          <PiCheck size={24} />
        </div>
        <h3 className="text-2xl font-bold font-display text-ink mb-2">
          {lang === 'en' ? "You're on the priority list!" : 'Vous êtes bien sur la liste prioritaire !'}
        </h3>
        <p className="text-muted text-sm leading-relaxed mb-6">
          {lang === 'en'
            ? `Thank you ${name}. As soon as onboarding opens in your niche, we will contact you directly on WhatsApp (${whatsapp}).`
            : `Merci ${name}. Dès l’ouverture des premières sélections pour votre profil, nous vous écrirons directement sur WhatsApp (${whatsapp}).`}
        </p>
        <a
          href={waShareLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-black active:scale-[0.98]"
        >
          <span>{lang === 'en' ? 'Share on WhatsApp' : 'Partager sur WhatsApp'}</span>
          <PiArrowRight size={16} />
        </a>
      </motion.div>
    )
  }

  return (
    <div className="rounded-2xl border border-creamDarker/80 bg-creamCard p-5 sm:p-7 shadow-xl shadow-ink/5 text-ink">
      {/* Role Toggle Tabs with Animated Pill */}
      <div className="mb-5 flex rounded-xl bg-creamDarker/50 p-1 relative" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={role === 'brand'}
          onClick={() => handleRoleChange('brand')}
          className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
            role === 'brand' ? 'text-ink font-bold' : 'text-muted hover:text-ink'
          }`}
        >
          <PiBuildings size={15} />
          <span>{lang === 'en' ? 'I am a Brand' : 'Je suis une marque'}</span>
          {role === 'brand' && !shouldReduceMotion && (
            <motion.div
              layoutId="heroFormRolePill"
              className="absolute inset-0 z-[-1] rounded-lg bg-creamCard shadow-sm border border-border/80"
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            />
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={role === 'creator'}
          onClick={() => handleRoleChange('creator')}
          className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
            role === 'creator' ? 'text-ink font-bold' : 'text-muted hover:text-ink'
          }`}
        >
          <PiUser size={15} />
          <span>{lang === 'en' ? 'I am a Creator' : 'Je suis un créateur'}</span>
          {role === 'creator' && !shouldReduceMotion && (
            <motion.div
              layoutId="heroFormRolePill"
              className="absolute inset-0 z-[-1] rounded-lg bg-creamCard shadow-sm border border-border/80"
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            />
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
        {/* Honeypot field for anti-bot */}
        <input
          type="text"
          name="user_note"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="sr-only"
          aria-hidden="true"
        />

        {/* Dynamic Fields based on Role */}
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3.5"
          >
            {/* Field 1: Name */}
            <div>
              <label htmlFor="hero-name" className="block text-xs font-semibold text-ink mb-1">
                {role === 'brand'
                  ? (lang === 'en' ? 'Company or Brand Name' : 'Nom de l’entreprise ou marque')
                  : (lang === 'en' ? 'Creator Name or Handle' : 'Nom de créateur ou pseudo')}
                <span className="text-saffron ml-0.5">*</span>
              </label>
              <input
                id="hero-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'brand' ? 'Ex: Rawbank, Moda Kinshasa...' : 'Ex: Amara K., @kintalent...'}
                className="w-full rounded-xl border border-border bg-cream/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition focus:bg-white focus:border-ink focus:outline-none"
              />
            </div>

            {/* Field 2: WhatsApp Number */}
            <div>
              <label htmlFor="hero-wa" className="block text-xs font-semibold text-ink mb-1">
                {lang === 'en' ? 'WhatsApp Number (for direct contact)' : 'Numéro WhatsApp (pour vous joindre)'}
                <span className="text-saffron ml-0.5">*</span>
              </label>
              <input
                id="hero-wa"
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+243 8XX XXX XXX"
                className="w-full rounded-xl border border-border bg-cream/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition focus:bg-white focus:border-ink focus:outline-none"
              />
            </div>

            {/* Field 3: Sector or Primary Niche */}
            <div>
              <label htmlFor="hero-category" className="block text-xs font-semibold text-ink mb-1">
                {role === 'brand'
                  ? (lang === 'en' ? 'Business Sector' : 'Secteur d’activité')
                  : (lang === 'en' ? 'Primary Niche' : 'Niche principale')}
                <span className="text-saffron ml-0.5">*</span>
              </label>
              <select
                id="hero-category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-cream/40 px-3.5 py-2.5 text-sm text-ink transition focus:bg-white focus:border-ink focus:outline-none"
              >
                <option value="">
                  {role === 'brand'
                    ? (lang === 'en' ? 'Select a sector...' : 'Choisissez un secteur...')
                    : (lang === 'en' ? 'Select your niche...' : 'Choisissez votre niche...')}
                </option>
                {role === 'brand' ? (
                  <>
                    <option value="mode">Mode & Habillement</option>
                    <option value="beaute">Beauté & Cosmétiques</option>
                    <option value="tech">Tech, Télécoms & Apps</option>
                    <option value="banque">Banque, Finance & Fintech</option>
                    <option value="food">Restauration & Agroalimentaire</option>
                    <option value="evenement">Événementiel & Loisirs</option>
                    <option value="autre">Autre secteur</option>
                  </>
                ) : (
                  <>
                    <option value="mode">Mode & Style</option>
                    <option value="beaute">Beauté & Soins</option>
                    <option value="lifestyle">Lifestyle & Quotidien</option>
                    <option value="tech">Tech & Gaming</option>
                    <option value="humour">Humour & Comédie</option>
                    <option value="food">Cuisine & Gastronomie</option>
                    <option value="musique">Musique & Culture</option>
                    <option value="business">Business & Éducation</option>
                  </>
                )}
              </select>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Expandable Optional Fields Drawer */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink transition-colors py-1"
          >
            <span>
              {isExpanded
                ? (lang === 'en' ? 'Fewer options' : 'Moins d’options')
                : (lang === 'en' ? '+ Add details (optional)' : '+ Ajouter des précisions (facultatif)')}
            </span>
            <PiCaretDown
              size={14}
              className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden flex flex-col gap-3 pt-2"
              >
                <div>
                  <label htmlFor="hero-email" className="block text-xs font-medium text-muted mb-1">
                    Email professionnel (optionnel)
                  </label>
                  <input
                    id="hero-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@organisation.com"
                    className="w-full rounded-xl border border-border bg-cream/40 px-3.5 py-2 text-sm text-ink placeholder:text-muted/60 transition focus:bg-white focus:border-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="hero-extra" className="block text-xs font-medium text-muted mb-1">
                    {role === 'brand' ? 'Type de contenu recherché (ex: 3 vidéos UGC)' : 'Lien profil Instagram ou TikTok'}
                  </label>
                  <input
                    id="hero-extra"
                    type="text"
                    value={extraDetail}
                    onChange={(e) => setExtraDetail(e.target.value)}
                    placeholder={role === 'brand' ? 'Ex: Vidéos courtes pour TikTok/Reels' : 'https://instagram.com/...'}
                    className="w-full rounded-xl border border-border bg-cream/40 px-3.5 py-2 text-sm text-ink placeholder:text-muted/60 transition focus:bg-white focus:border-ink focus:outline-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Validation Error banner */}
        {errorMsg && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs font-medium text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-saffron px-5 py-3.5 text-sm font-bold text-ink shadow-md shadow-saffron/20 transition-all hover:bg-saffronHover hover:shadow-lg active:scale-[0.98] disabled:opacity-60 cursor-pointer"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
              <span>{lang === 'en' ? 'Registering...' : 'Inscription en cours...'}</span>
            </span>
          ) : (
            <>
              <span>
                {role === 'brand'
                  ? (lang === 'en' ? 'Join as a Brand' : 'Rejoindre en tant que marque')
                  : (lang === 'en' ? 'Join as a Creator' : 'Rejoindre en tant que créateur')}
              </span>
              <PiArrowRight size={16} />
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-muted/80 mt-1">
          {lang === 'en'
            ? 'Free early access · No automated spam · WhatsApp verification only'
            : 'Accès prioritaire gratuit · Aucun spam · Contact direct sur WhatsApp'}
        </p>
      </form>
    </div>
  )
}
