import type { ContentType, QRFormData, WifiEncryption } from '../types'

interface Props {
  contentType: ContentType
  formData: QRFormData
  onChange: (formData: QRFormData) => void
}

export default function ContentForm({ contentType, formData, onChange }: Props) {
  switch (contentType) {
    case 'url':
      return (
        <label className="form-field">
          <span>Website URL</span>
          <input
            type="text"
            placeholder="https://example.com"
            value={formData.url}
            onChange={(e) => onChange({ ...formData, url: e.target.value })}
          />
        </label>
      )

    case 'text':
      return (
        <label className="form-field">
          <span>Text content</span>
          <textarea
            rows={4}
            placeholder="Enter your message"
            value={formData.text}
            onChange={(e) => onChange({ ...formData, text: e.target.value })}
          />
        </label>
      )

    case 'email':
      return (
        <label className="form-field">
          <span>Email address</span>
          <input
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => onChange({ ...formData, email: e.target.value })}
          />
        </label>
      )

    case 'phone':
      return (
        <label className="form-field">
          <span>Phone number</span>
          <input
            type="tel"
            placeholder="+1234567890"
            value={formData.phone}
            onChange={(e) => onChange({ ...formData, phone: e.target.value })}
          />
        </label>
      )

    case 'wifi':
      return (
        <div className="wifi-fields">
          <label className="form-field">
            <span>Network name (SSID)</span>
            <input
              type="text"
              placeholder="My WiFi Network"
              maxLength={32}
              value={formData.wifi.ssid}
              onChange={(e) =>
                onChange({ ...formData, wifi: { ...formData.wifi, ssid: e.target.value } })
              }
            />
          </label>

          <label className="form-field">
            <span>Security type</span>
            <select
              value={formData.wifi.encryption}
              onChange={(e) =>
                onChange({
                  ...formData,
                  wifi: { ...formData.wifi, encryption: e.target.value as WifiEncryption },
                })
              }
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No Password</option>
            </select>
          </label>

          {formData.wifi.encryption !== 'nopass' && (
            <label className="form-field">
              <span>Password</span>
              <input
                type="password"
                placeholder="Network password"
                value={formData.wifi.password}
                onChange={(e) =>
                  onChange({ ...formData, wifi: { ...formData.wifi, password: e.target.value } })
                }
              />
            </label>
          )}
        </div>
      )

    default:
      return null
  }
}
