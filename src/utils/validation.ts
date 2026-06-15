import type { ContentType, QRFormData, QRSize, WifiData } from '../types'

const URL_PATTERN = /^https?:\/\/[^\s/$.?#].[^\s]*$/i
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?\d{7,15}$/

export const MAX_LENGTH_BY_SIZE: Record<QRSize, number> = {
  150: 100,
  200: 200,
  300: 400,
  400: 800,
  500: 1500,
}

export function validateUrl(url: string): string | null {
  const trimmed = url.trim()
  if (!trimmed) return 'Please enter a URL.'
  if (!URL_PATTERN.test(trimmed)) {
    return 'URL must start with http:// or https:// and be a valid web address.'
  }
  return null
}

export function validateText(text: string, maxLength: number): string | null {
  const trimmed = text.trim()
  if (!trimmed) return 'Please enter some text.'
  if (trimmed.length > maxLength) {
    return `Content is too long for the selected size (max ${maxLength} characters).`
  }
  return null
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim()
  if (!trimmed) return 'Please enter an email address.'
  if (!EMAIL_PATTERN.test(trimmed)) {
    return 'Please enter a valid email address.'
  }
  return null
}

export function validatePhone(phone: string): string | null {
  const cleaned = phone.trim().replace(/[\s()-]/g, '')
  if (!cleaned) return 'Please enter a phone number.'
  if (!PHONE_PATTERN.test(cleaned)) {
    return 'Phone number must be 7-15 digits, with an optional leading +.'
  }
  return null
}

export function validateWifi(wifi: WifiData): string | null {
  const ssid = wifi.ssid.trim()
  if (!ssid) return 'Please enter a network name (SSID).'
  if (ssid.length > 32) return 'Network name (SSID) must be 32 characters or fewer.'
  if (wifi.encryption !== 'nopass') {
    if (!wifi.password) return 'Please enter a password, or set security to "No Password".'
    if (wifi.password.length < 8) return 'Password must be at least 8 characters.'
  }
  return null
}

export function validateContent(
  contentType: ContentType,
  formData: QRFormData,
  size: QRSize
): string | null {
  const maxLength = MAX_LENGTH_BY_SIZE[size]
  switch (contentType) {
    case 'url':
      return validateUrl(formData.url) ?? validateText(formData.url, maxLength)
    case 'text':
      return validateText(formData.text, maxLength)
    case 'email':
      return validateEmail(formData.email)
    case 'phone':
      return validatePhone(formData.phone)
    case 'wifi':
      return validateWifi(formData.wifi)
    default:
      return null
  }
}
