import { COLOR_PRESETS, QR_SIZES } from '../types'
import type { CustomizationOptions, QRSize } from '../types'

interface Props {
  options: CustomizationOptions
  onChange: (options: CustomizationOptions) => void
}

export default function CustomizationPanel({ options, onChange }: Props) {
  const handleLogoUpload = (file: File | null) => {
    if (!file) {
      onChange({ ...options, logo: null })
      return
    }
    const reader = new FileReader()
    reader.onload = () => onChange({ ...options, logo: reader.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <div className="customization-panel">
      <div className="form-field">
        <span>Size</span>
        <div className="size-options">
          {QR_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              className={`size-button ${options.size === size ? 'active' : ''}`}
              onClick={() => onChange({ ...options, size: size as QRSize })}
            >
              {size}x{size}
            </button>
          ))}
        </div>
      </div>

      <div className="form-field">
        <span>Color presets</span>
        <div className="color-presets">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              title={preset.name}
              aria-label={preset.name}
              className={`color-swatch ${options.color === preset.value ? 'active' : ''}`}
              style={{ backgroundColor: preset.value }}
              onClick={() => onChange({ ...options, color: preset.value })}
            />
          ))}
        </div>
      </div>

      <label className="form-field">
        <span>Custom color</span>
        <input
          type="color"
          value={options.color}
          onChange={(e) => onChange({ ...options, color: e.target.value })}
        />
      </label>

      <label className="form-field">
        <span>Logo (optional)</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleLogoUpload(e.target.files?.[0] ?? null)}
        />
      </label>

      {options.logo && (
        <label className="form-field checkbox-field">
          <input
            type="checkbox"
            checked={options.whiteLogoBackground}
            onChange={(e) => onChange({ ...options, whiteLogoBackground: e.target.checked })}
          />
          <span>White circle behind logo (for dark QR colors)</span>
        </label>
      )}
    </div>
  )
}
