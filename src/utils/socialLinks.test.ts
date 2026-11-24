import { describe, it, expect } from 'vitest'
import {
  normalizeInstagram,
  normalizeTikTok,
  normalizeYouTube,
  normalizeFacebook,
  normalizeWebsite,
} from './socialLinks'

describe('Social link normalization', () => {
  describe('Instagram', () => {
    it('normalizes handles with or without @', () => {
      expect(normalizeInstagram('@grace_mu').normalized).toBe('https://instagram.com/grace_mu')
      expect(normalizeInstagram('grace.mu').normalized).toBe('https://instagram.com/grace.mu')
    })

    it('strips tracking query params from pasted URLs', () => {
      const pasted = 'https://www.instagram.com/grace_mu/?igsh=MWZzOWp0Z256&utm_source=qr'
      expect(normalizeInstagram(pasted).normalized).toBe('https://instagram.com/grace_mu')
    })

    it('detects invalid handles', () => {
      expect(normalizeInstagram('user with spaces').ok).toBe(false)
    })
  })

  describe('TikTok', () => {
    it('normalizes handles and URLs', () => {
      expect(normalizeTikTok('@kinkreation').normalized).toBe('https://www.tiktok.com/@kinkreation')
      expect(normalizeTikTok('https://tiktok.com/@kinkreation?_t=8a1').normalized).toBe(
        'https://www.tiktok.com/@kinkreation'
      )
    })
  })

  describe('YouTube', () => {
    it('normalizes handle or channel URL', () => {
      expect(normalizeYouTube('@StudioKinshasa').normalized).toBe(
        'https://youtube.com/@StudioKinshasa'
      )
      expect(
        normalizeYouTube('https://www.youtube.com/@StudioKinshasa?si=test123').normalized
      ).toBe('https://www.youtube.com/@StudioKinshasa')
    })
  })

  describe('Facebook', () => {
    it('normalizes Facebook page handles or URLs', () => {
      expect(normalizeFacebook('MaisonBeauteKin').normalized).toBe(
        'https://facebook.com/MaisonBeauteKin'
      )
      expect(
        normalizeFacebook('https://www.facebook.com/MaisonBeauteKin?mibextid=ZbWKwL').normalized
      ).toBe('https://www.facebook.com/MaisonBeauteKin')
    })
  })

  describe('Website', () => {
    it('prepends https and validates domain', () => {
      expect(normalizeWebsite('maisonbeaute.cd').normalized).toBe('https://maisonbeaute.cd')
      expect(normalizeWebsite('https://mon-site.com/').normalized).toBe('https://mon-site.com')
      expect(normalizeWebsite('notadomain').ok).toBe(false)
    })
  })
})
