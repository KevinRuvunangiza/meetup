/**
 * FORM TYPES
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for form field shapes.
 * The same types are used by form components and by the submission handler.
 */

export type Role = 'brand' | 'creator'
export type Language = 'fr' | 'en'

// ─── Shared fields (both brands and creators) ────────────────────────────────

export interface SharedFields {
  role: Role
  fullName: string
  whatsapp: string    // includes country code, e.g. +243812345678
  email: string       // optional
  city: string
  consent: boolean
  honeypot: string    // must be empty; filled = bot
  source: string      // UTM or referrer, set automatically
}

// ─── Brand-specific fields ───────────────────────────────────────────────────

export type Sector =
  | 'fashion'
  | 'beauty'
  | 'food'
  | 'hospitality'
  | 'auto'
  | 'fitness'
  | 'ecommerce'
  | 'tech'
  | 'other'

export type CreatorNeed =
  | 'ugc'
  | 'influencer'
  | 'both'
  | 'unsure'

export type BudgetRange =
  | 'under_200'
  | '200_500'
  | '500_1000'
  | '1000_plus'
  | 'unsure'

export interface BrandFields extends SharedFields {
  role: 'brand'
  businessName: string
  sector: Sector | ''
  creatorNeed: CreatorNeed | ''
  budget: BudgetRange | ''
  workedBefore: 'yes' | 'no' | ''
  websiteOrInsta: string   // optional
}

// ─── Creator-specific fields ─────────────────────────────────────────────────

export type CreatorType = 'ugc' | 'influencer' | 'both'

export type Niche =
  | 'fashion'
  | 'beauty'
  | 'food'
  | 'lifestyle'
  | 'fitness'
  | 'tech'
  | 'auto'
  | 'travel'
  | 'parenting'
  | 'finance'
  | 'music'
  | 'comedy'
  | 'other'

export type FollowerRange =
  | 'under_1k'
  | '1k_5k'
  | '5k_20k'
  | '20k_100k'
  | '100k_plus'

export type RateRange =
  | 'under_50'
  | '50_150'
  | '150_500'
  | '500_plus'
  | 'unsure'

export interface CreatorFields extends SharedFields {
  role: 'creator'
  creatorName: string    // public/creator name
  creatorType: CreatorType | ''
  niches: Niche[]        // multi-select
  instagramHandle: string
  instagramFollowers: FollowerRange | ''
  tiktokHandle: string
  tiktokFollowers: FollowerRange | ''
  youtubeHandle: string
  youtubeFollowers: FollowerRange | ''
  portfolioLink: string   // optional
  paidBefore: 'yes' | 'no' | ''
  rateRange: RateRange | '' // optional
}

export type FormData = BrandFields | CreatorFields

// ─── API payload sent to Apps Script ─────────────────────────────────────────

export interface SubmissionPayload {
  timestamp: string   // ISO 8601, set client-side, also set server-side
  data: FormData
}

export interface SubmissionResponse {
  success: boolean
  message: string
  duplicate?: boolean
}
