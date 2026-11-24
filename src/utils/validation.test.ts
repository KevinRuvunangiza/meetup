import { describe, it, expect } from 'vitest'
import {
  normalizePhone,
  isValidPhone,
  isValidEmail,
  validateStep1,
} from './validation'

describe('validation utilities', () => {
  it('normalizes phone numbers correctly', () => {
    expect(normalizePhone('+243 812 345 678')).toBe('+243812345678')
    expect(normalizePhone('081-234-5678')).toBe('0812345678')
    expect(normalizePhone('(243) 999 123 456')).toBe('243999123456')
  })

  it('validates Congolese and international phone numbers', () => {
    expect(isValidPhone('+243812345678')).toBe(true)
    expect(isValidPhone('0812345678')).toBe(true)
    expect(isValidPhone('243812345678')).toBe(true)
    expect(isValidPhone('+33612345678')).toBe(true)
    expect(isValidPhone('123')).toBe(false)
    expect(isValidPhone('invalid')).toBe(false)
  })

  it('validates email addresses', () => {
    expect(isValidEmail('contact@mosala.io')).toBe(true)
    expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true)
    expect(isValidEmail('invalid-email')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
    expect(isValidEmail('@domain.com')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })

  it('validates Step 1 payload requiring both phone and email', () => {
    expect(
      validateStep1({
        fullName: 'Beni Banzadio',
        whatsapp: '+243812345678',
        email: 'beni@example.com',
      }).ok
    ).toBe(true)

    // Missing name
    expect(
      validateStep1({
        fullName: '',
        whatsapp: '+243812345678',
        email: 'beni@example.com',
      }).ok
    ).toBe(false)

    // Missing phone
    expect(
      validateStep1({
        fullName: 'Beni Banzadio',
        whatsapp: '',
        email: 'beni@example.com',
      }).ok
    ).toBe(false)

    // Missing email
    expect(
      validateStep1({
        fullName: 'Beni Banzadio',
        whatsapp: '+243812345678',
        email: '',
      }).ok
    ).toBe(false)
  })
})
