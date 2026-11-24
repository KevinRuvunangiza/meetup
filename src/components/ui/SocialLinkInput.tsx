import { useState } from 'react'
import {
  PiInstagramLogo,
  PiTiktokLogo,
  PiYoutubeLogo,
  PiFacebookLogo,
  PiGlobe,
  PiLink,
  PiCheck,
  PiWarningCircle,
} from 'react-icons/pi'
import {
  normalizeInstagram,
  normalizeTikTok,
  normalizeYouTube,
  normalizeFacebook,
  normalizeWebsite,
  type NormalizedResult,
} from '@/utils/socialLinks'

export type SocialInputType = 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'website' | 'portfolio'

interface SocialLinkInputProps {
  type: SocialInputType
  label: string
  placeholder: string
  value: string
  onChange: (raw: string, normalized: string) => void
}

export function SocialLinkInput({
  type,
  label,
  placeholder,
  value,
  onChange,
}: SocialLinkInputProps) {
  const [error, setError] = useState<string | undefined>()
  const [normalizedPreview, setNormalizedPreview] = useState<string | undefined>()

  const getIcon = () => {
    switch (type) {
      case 'instagram': return <PiInstagramLogo size={17} className="text-pink-600" />
      case 'tiktok': return <PiTiktokLogo size={17} className="text-ink" />
      case 'youtube': return <PiYoutubeLogo size={17} className="text-red-600" />
      case 'facebook': return <PiFacebookLogo size={17} className="text-blue-600" />
      case 'website': return <PiGlobe size={17} className="text-saffron" />
      case 'portfolio': return <PiLink size={17} className="text-textMuted" />
    }
  }

  const handleInputChange = (raw: string) => {
    if (!raw.trim()) {
      setError(undefined)
      setNormalizedPreview(undefined)
      onChange('', '')
      return
    }

    let res: NormalizedResult
    switch (type) {
      case 'instagram': res = normalizeInstagram(raw); break
      case 'tiktok': res = normalizeTikTok(raw); break
      case 'youtube': res = normalizeYouTube(raw); break
      case 'facebook': res = normalizeFacebook(raw); break
      case 'website':
      case 'portfolio': res = normalizeWebsite(raw); break
    }

    if (!res.ok) {
      setError(res.error)
      setNormalizedPreview(undefined)
      onChange(raw, '')
    } else {
      setError(undefined)
      setNormalizedPreview(res.normalized)
      onChange(raw, res.normalized)
    }
  }

  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-ink">
        {label}
      </label>

      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center pointer-events-none">
          {getIcon()}
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-cream pl-10 pr-4 py-2.5 text-xs sm:text-sm text-ink placeholder:text-textMuted/60 focus:bg-creamCard focus:outline-none transition-all ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-border focus:border-saffron focus:ring-2 focus:ring-saffron/20'
          }`}
        />
      </div>

      {/* Validation feedback / normalized preview */}
      {error && (
        <div className="flex items-center gap-1.5 text-[11px] text-red-600 pt-0.5">
          <PiWarningCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!error && normalizedPreview && (
        <div className="flex items-center gap-1.5 text-[11px] text-textMuted pt-0.5 truncate">
          <PiCheck size={13} className="text-green-600 flex-shrink-0" />
          <span className="font-mono text-[10px] text-textMutedDark truncate">
            {normalizedPreview}
          </span>
        </div>
      )}
    </div>
  )
}
