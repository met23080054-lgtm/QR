import type { ContentType, QRFormData } from '../types'

function escapeWifiValue(value: string): string {
  return value.replace(/([\\;,":])/g, '\\$1')
}

/** Builds the raw string that gets encoded into the QR code. */
export function buildQRContent(contentType: ContentType, formData: QRFormData): string {
  switch (contentType) {
    case 'url':
      return formData.url.trim()
    case 'text':
      return formData.text.trim()
    case 'email':
      return `mailto:${formData.email.trim()}`
    case 'phone':
      return `tel:${formData.phone.trim().replace(/[\s()-]/g, '')}`
    case 'wifi': {
      const { ssid, password, encryption } = formData.wifi
      const ssidEsc = escapeWifiValue(ssid.trim())
      if (encryption === 'nopass') {
        return `WIFI:T:nopass;S:${ssidEsc};;`
      }
      return `WIFI:T:${encryption};S:${ssidEsc};P:${escapeWifiValue(password)};;`
    }
    default:
      return ''
  }
}

/** Returns the free-text field (if any) that should be screened by content moderation. */
export function getModerationText(contentType: ContentType, formData: QRFormData): string {
  switch (contentType) {
    case 'url':
      return formData.url
    case 'text':
      return formData.text
    case 'wifi':
      return formData.wifi.ssid
    default:
      return ''
  }
}
