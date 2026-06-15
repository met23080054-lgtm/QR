import { useState } from 'react'
import './App.css'
import ContentForm from './components/ContentForm'
import ContentTypeSelector from './components/ContentTypeSelector'
import CustomizationPanel from './components/CustomizationPanel'
import QRPreview from './components/QRPreview'
import { moderateContent } from './services/contentModeration'
import type { ContentType } from './types'
import { DEFAULT_CUSTOMIZATION, DEFAULT_FORM_DATA } from './types'
import { buildQRContent, getModerationText } from './utils/qrContent'
import { validateContent } from './utils/validation'

function App() {
  const [contentType, setContentType] = useState<ContentType>('url')
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)
  const [customization, setCustomization] = useState(DEFAULT_CUSTOMIZATION)
  const [qrData, setQrData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const handleContentTypeChange = (type: ContentType) => {
    setContentType(type)
    setQrData(null)
    setError(null)
  }

  const handleGenerate = async () => {
    setError(null)
    setQrData(null)

    const validationError = validateContent(contentType, formData, customization.size)
    if (validationError) {
      setError(validationError)
      return
    }

    const moderationText = getModerationText(contentType, formData)
    if (moderationText.trim()) {
      setIsChecking(true)
      try {
        const result = await moderateContent(moderationText)
        if (result.flagged) {
          setError(
            `This content can't be used: ${result.reason ?? 'flagged as inappropriate (18+/NSFW).'}`
          )
          return
        }
      } finally {
        setIsChecking(false)
      }
    }

    setQrData(buildQRContent(contentType, formData))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>QR Code Generator</h1>
        <p>Create branded QR codes for URLs, text, email, phone numbers, and WiFi.</p>
      </header>

      <main className="app-main">
        <section className="panel">
          <h2>1. Content</h2>
          <ContentTypeSelector value={contentType} onChange={handleContentTypeChange} />
          <ContentForm contentType={contentType} formData={formData} onChange={setFormData} />
        </section>

        <section className="panel">
          <h2>2. Customize</h2>
          <CustomizationPanel options={customization} onChange={setCustomization} />
        </section>

        <section className="panel preview-panel">
          <h2>3. Generate &amp; Export</h2>
          <button
            type="button"
            className="generate-button"
            onClick={handleGenerate}
            disabled={isChecking}
          >
            {isChecking ? 'Checking content...' : 'Generate QR Code'}
          </button>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          {qrData && !error && <QRPreview data={qrData} options={customization} />}
        </section>
      </main>
    </div>
  )
}

export default App
