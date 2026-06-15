import type { ContentType } from '../types'

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: 'url', label: 'URL' },
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'wifi', label: 'WiFi' },
]

interface Props {
  value: ContentType
  onChange: (type: ContentType) => void
}

export default function ContentTypeSelector({ value, onChange }: Props) {
  return (
    <div className="content-type-selector" role="tablist" aria-label="QR content type">
      {CONTENT_TYPES.map((type) => (
        <button
          key={type.value}
          type="button"
          role="tab"
          aria-selected={value === type.value}
          className={`content-type-button ${value === type.value ? 'active' : ''}`}
          onClick={() => onChange(type.value)}
        >
          {type.label}
        </button>
      ))}
    </div>
  )
}
