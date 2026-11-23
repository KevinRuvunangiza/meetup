/**
 * CREATOR CARDS DATA
 * ─────────────────────────────────────────────────────────────────────────────
 * Central data source for creator cards shown in the Hero stack and gallery.
 *
 * HOW TO SWAP FOR REAL CREATOR PHOTOS:
 * Simply set `photoUrl` to the path or URL of the real photo (e.g. '/creators/amara.jpg').
 * When `photoUrl` is provided, it replaces the abstract duotone graphic automatically.
 * No code changes needed in components.
 */

export interface CreatorPlatform {
  platform: 'instagram' | 'tiktok' | 'youtube'
  handle: string
  followers: string
}

export interface CreatorCard {
  id: string
  name: string
  handle: string
  city: string
  niche: string
  verifiedLevel: string
  highlight: string
  platforms: CreatorPlatform[]
  photoUrl: string | null
  duotone: {
    bg: string
    accent: string
    patternType: 'geometric' | 'topography' | 'concentric'
  }
}

export const featuredCreatorCards: CreatorCard[] = [
  {
    id: 'creator-1',
    name: 'Amara K.',
    handle: '@amara.creates',
    city: 'Kinshasa',
    niche: 'Mode & Lifestyle',
    verifiedLevel: 'Identité vérifiée',
    highlight: 'UGC & Storytelling',
    photoUrl: null, // Set to '/creators/amara.jpg' when real photo is ready
    duotone: {
      bg: '#1A1815',
      accent: '#F2A900',
      patternType: 'geometric',
    },
    platforms: [
      { platform: 'instagram', handle: '@amara.creates', followers: '14.2K' },
      { platform: 'tiktok', handle: '@amara.k', followers: '28.5K' },
    ],
  },
  {
    id: 'creator-2',
    name: 'Christian M.',
    handle: '@chrism.tech',
    city: 'Lubumbashi',
    niche: 'Tech & Mobilité',
    verifiedLevel: 'Identité vérifiée',
    highlight: 'Tests & Vidéo 4K',
    photoUrl: null,
    duotone: {
      bg: '#25211D',
      accent: '#E59900',
      patternType: 'topography',
    },
    platforms: [
      { platform: 'youtube', handle: 'ChrisTech DRC', followers: '19.8K' },
      { platform: 'tiktok', handle: '@chrism.tech', followers: '42.1K' },
    ],
  },
  {
    id: 'creator-3',
    name: 'Syntyche B.',
    handle: '@syntyche.art',
    city: 'Goma',
    niche: 'Beauté & Bien-être',
    verifiedLevel: 'Identité vérifiée',
    highlight: 'Revues authentiques',
    photoUrl: null,
    duotone: {
      bg: '#151412',
      accent: '#D99700',
      patternType: 'concentric',
    },
    platforms: [
      { platform: 'instagram', handle: '@syntyche.art', followers: '11.6K' },
      { platform: 'tiktok', handle: '@syntyche.glow', followers: '34.0K' },
    ],
  },
]
