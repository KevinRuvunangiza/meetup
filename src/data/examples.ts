/**
 * EXAMPLES DATA
 * ─────────────────────────────────────────────────────────────────────────────
 * Central data source for platform listings (Campaigns and Creators).
 * All brand names and profiles are fictional illustrations.
 *
 * TO SWAP FOR REAL PHOTOS/IMAGES:
 * Set `coverImageUrl` (for campaigns) or `portraitImageUrl` (for creators).
 * When provided, the real image replaces the duotone vector art automatically.
 */

export type CategoryId = 'tout' | 'mode' | 'beaute' | 'auto' | 'food' | 'hotels' | 'tech'
export type CollabType = 'UGC' | 'Influence' | 'Hybride' | 'Gifting'
export type CampaignStatus = 'Ouvert' | 'Bientôt'

export interface Category {
  id: CategoryId
  label: string
}

export const feedCategories: Category[] = [
  { id: 'tout', label: 'Tout' },
  { id: 'mode', label: 'Mode' },
  { id: 'beaute', label: 'Beauté' },
  { id: 'auto', label: 'Auto' },
  { id: 'food', label: 'Food' },
  { id: 'hotels', label: 'Hôtels' },
  { id: 'tech', label: 'Tech' },
]

export interface CampaignItem {
  id: string
  brandName: string
  brandInitials: string
  category: CategoryId
  collabType: CollabType
  status: CampaignStatus
  title: string
  description: string
  deliverables: string[]
  budget: string
  deadline: string
  creatorsNeeded: number
  coverImageUrl?: string
  duotone: {
    bg: string
    accent: string
    paletteId: number
  }
}

export interface CreatorItem {
  id: string
  name: string
  handle: string
  city: string
  category: CategoryId
  niches: string[]
  platforms: Array<{
    platform: 'instagram' | 'tiktok' | 'youtube'
    followers: string
  }>
  levelChip: string
  highlight: string
  portraitImageUrl?: string
  duotone: {
    bg: string
    accent: string
    paletteId: number
  }
}

export const campaignExamples: CampaignItem[] = [
  {
    id: 'camp-1',
    brandName: 'Maison Aethel',
    brandInitials: 'MA',
    category: 'mode',
    collabType: 'UGC',
    status: 'Ouvert',
    title: 'Campagne Linge & Prêt-à-porter Été',
    description: 'Vidéos immersives montrant la texture des tissus et des tenues portées au quotidien.',
    deliverables: ['3 vidéos 9:16 (UGC)', '4 photos lookbook HD'],
    budget: '$300 – $550',
    deadline: '20 jours',
    creatorsNeeded: 4,
    duotone: { bg: '#181715', accent: '#F2A900', paletteId: 1 },
  },
  {
    id: 'camp-2',
    brandName: 'Sora Botanicals',
    brandInitials: 'SB',
    category: 'beaute',
    collabType: 'Influence',
    status: 'Ouvert',
    title: 'Routine éclat & soins naturels',
    description: 'Partage d’expérience honnête sur 14 jours d’application du sérum illuminateur visage.',
    deliverables: ['1 Reel Instagram', '2 Stories sponsorisées'],
    budget: '$250 – $400',
    deadline: '3 semaines',
    creatorsNeeded: 3,
    duotone: { bg: '#1A1817', accent: '#E09200', paletteId: 2 },
  },
  {
    id: 'camp-3',
    brandName: 'Volt Mobility',
    brandInitials: 'VM',
    category: 'auto',
    collabType: 'Hybride',
    status: 'Bientôt',
    title: 'Essai urbain moto & trottinette électrique',
    description: 'Test en conditions réelles dans les axes urbains : maniabilité, autonomie et recharge.',
    deliverables: ['1 vidéo test TikTok (60s)', '1 Reel Instagram'],
    budget: '$450 – $700',
    deadline: '1 mois',
    creatorsNeeded: 2,
    duotone: { bg: '#141416', accent: '#F2A900', paletteId: 3 },
  },
  {
    id: 'camp-4',
    brandName: 'Kivu Roasters',
    brandInitials: 'KR',
    category: 'food',
    collabType: 'Gifting',
    status: 'Ouvert',
    title: 'Coffret dégustation café d’altitude',
    description: 'Réception du coffret 3 terroirs pour création de contenu pause-café esthétique.',
    deliverables: ['1 vidéo TikTok dégustation', '3 photos studio'],
    budget: 'Produit offert ($120 val.)',
    deadline: '15 jours',
    creatorsNeeded: 5,
    duotone: { bg: '#191612', accent: '#D99700', paletteId: 4 },
  },
  {
    id: 'camp-5',
    brandName: 'Aura Grand Palm',
    brandInitials: 'AG',
    category: 'hotels',
    collabType: 'Hybride',
    status: 'Ouvert',
    title: 'Immersion week-end & gastronomie',
    description: 'Séjour d’une nuit avec dîner pour valoriser l’ambiance feutrée et le service de table.',
    deliverables: ['Séjour offert + $300', '2 Reels', '5 photos'],
    budget: '$300 + Séjour offert',
    deadline: '25 jours',
    creatorsNeeded: 2,
    duotone: { bg: '#151413', accent: '#F2A900', paletteId: 5 },
  },
  {
    id: 'camp-6',
    brandName: 'Pulse Audio',
    brandInitials: 'PA',
    category: 'tech',
    collabType: 'UGC',
    status: 'Ouvert',
    title: 'Test réduction de bruit casque sans fil',
    description: 'Démonstration comparative du son en milieu bruyant (transport, café, bureau).',
    deliverables: ['2 vidéos UGC dynamiques', 'Droits ads 60j'],
    budget: '$350 – $500',
    deadline: '18 jours',
    creatorsNeeded: 3,
    duotone: { bg: '#161719', accent: '#E09B00', paletteId: 6 },
  },
]

export const creatorExamples: CreatorItem[] = [
  {
    id: 'creat-1',
    name: 'Amara K.',
    handle: '@amara.creates',
    city: 'Kinshasa',
    category: 'mode',
    niches: ['Mode & Style', 'UGC'],
    levelChip: 'Identité vérifiée',
    highlight: 'Storytelling visuel & tenues du jour',
    platforms: [
      { platform: 'instagram', followers: '14.2K' },
      { platform: 'tiktok', followers: '28.5K' },
    ],
    duotone: { bg: '#1A1815', accent: '#F2A900', paletteId: 1 },
  },
  {
    id: 'creat-2',
    name: 'Christian M.',
    handle: '@chrism.tech',
    city: 'Lubumbashi',
    category: 'tech',
    niches: ['Tech & Gadgets', 'Tests 4K'],
    levelChip: 'Identité vérifiée',
    highlight: 'Démos claires, audio studio & b-rolls',
    platforms: [
      { platform: 'youtube', followers: '19.8K' },
      { platform: 'tiktok', followers: '42.1K' },
    ],
    duotone: { bg: '#25211D', accent: '#E59900', paletteId: 2 },
  },
  {
    id: 'creat-3',
    name: 'Syntyche B.',
    handle: '@syntyche.glow',
    city: 'Goma',
    category: 'beaute',
    niches: ['Soins de la peau', 'Conseils'],
    levelChip: 'Identité vérifiée',
    highlight: 'Revues honnêtes sans filtre',
    platforms: [
      { platform: 'instagram', followers: '11.6K' },
      { platform: 'tiktok', followers: '34.0K' },
    ],
    duotone: { bg: '#151412', accent: '#D99700', paletteId: 3 },
  },
  {
    id: 'creat-4',
    name: 'Eliel K.',
    handle: '@eliel.eats',
    city: 'Kinshasa',
    category: 'food',
    niches: ['Gastronomie', 'Bons plans'],
    levelChip: 'Identité vérifiée',
    highlight: 'Visites de restaurants & street food',
    platforms: [
      { platform: 'tiktok', followers: '51.4K' },
      { platform: 'instagram', followers: '18.9K' },
    ],
    duotone: { bg: '#1D1915', accent: '#F2A900', paletteId: 4 },
  },
  {
    id: 'creat-5',
    name: 'Naomie T.',
    handle: '@naomie.voyages',
    city: 'Lubumbashi',
    category: 'hotels',
    niches: ['Hôtellerie', 'Évasion'],
    levelChip: 'Identité vérifiée',
    highlight: 'Mise en valeur d’espaces & séjours',
    platforms: [
      { platform: 'instagram', followers: '22.3K' },
      { platform: 'tiktok', followers: '16.7K' },
    ],
    duotone: { bg: '#161513', accent: '#D99700', paletteId: 5 },
  },
  {
    id: 'creat-6',
    name: 'David L.',
    handle: '@david.drive',
    city: 'Kinshasa',
    category: 'auto',
    niches: ['Automobile', 'Mobilité'],
    levelChip: 'Identité vérifiée',
    highlight: 'Essais véhicules, conseils entretien',
    platforms: [
      { platform: 'youtube', followers: '15.1K' },
      { platform: 'tiktok', followers: '39.8K' },
    ],
    duotone: { bg: '#181A1C', accent: '#F2A900', paletteId: 6 },
  },
]
