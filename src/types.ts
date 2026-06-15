export type ContentType = 'url' | 'text' | 'email' | 'phone' | 'wifi'

export type WifiEncryption = 'WPA' | 'WEP' | 'nopass'

export interface WifiData {
  ssid: string
  password: string
  encryption: WifiEncryption
}

export interface QRFormData {
  url: string
  text: string
  email: string
  phone: string
  wifi: WifiData
}

export const QR_SIZES = [150, 200, 300, 400, 500] as const
export type QRSize = (typeof QR_SIZES)[number]

export interface ColorPreset {
  name: string
  value: string
}

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Black', value: '#000000' },
  { name: 'Navy Blue', value: '#1e3a8a' },
  { name: 'Forest Green', value: '#166534' },
  { name: 'Crimson Red', value: '#b91c1c' },
  { name: 'Royal Purple', value: '#6d28d9' },
  { name: 'Burnt Orange', value: '#c2410c' },
]

export interface CustomizationOptions {
  size: QRSize
  color: string
  logo: string | null
  whiteLogoBackground: boolean
}

export const DEFAULT_FORM_DATA: QRFormData = {
  url: '',
  text: '',
  email: '',
  phone: '',
  wifi: { ssid: '', password: '', encryption: 'WPA' },
}

export const DEFAULT_CUSTOMIZATION: CustomizationOptions = {
  size: 300,
  color: '#000000',
  logo: null,
  whiteLogoBackground: false,
}
