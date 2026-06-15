import { useEffect, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'
import type { CustomizationOptions } from '../types'
import { withWhiteBackground } from '../utils/logo'

interface Props {
  data: string
  options: CustomizationOptions
}

export default function QRPreview({ data, options }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)
  const [whiteBgLogo, setWhiteBgLogo] = useState<string | undefined>(undefined)
  const [copyMessage, setCopyMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!options.logo || !options.whiteLogoBackground) return

    let active = true
    withWhiteBackground(options.logo).then((url) => {
      if (active) setWhiteBgLogo(url)
    })
    return () => {
      active = false
    }
  }, [options.logo, options.whiteLogoBackground])

  const logoImage = !options.logo
    ? undefined
    : options.whiteLogoBackground
      ? whiteBgLogo
      : options.logo

  useEffect(() => {
    const config = {
      width: options.size,
      height: options.size,
      type: 'canvas' as const,
      data,
      image: logoImage,
      dotsOptions: { color: options.color, type: 'rounded' as const },
      cornersSquareOptions: { color: options.color, type: 'extra-rounded' as const },
      backgroundOptions: { color: '#ffffff' },
      imageOptions: { crossOrigin: 'anonymous' as const, margin: 8, imageSize: 0.2 },
    }

    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(config)
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
        qrRef.current.append(containerRef.current)
      }
    } else {
      qrRef.current.update(config)
    }
  }, [data, options.size, options.color, logoImage])

  const handleDownload = () => {
    qrRef.current?.download({ name: 'qrcode', extension: 'png' })
  }

  const handleCopy = async () => {
    try {
      const raw = await qrRef.current?.getRawData('png')
      if (!raw) return
      const blob = raw instanceof Blob ? raw : new Blob([raw], { type: 'image/png' })
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopyMessage('Copied to clipboard!')
    } catch {
      setCopyMessage('Copy failed. Try downloading instead.')
    } finally {
      setTimeout(() => setCopyMessage(null), 2500)
    }
  }

  return (
    <div className="qr-preview">
      <div ref={containerRef} className="qr-canvas" />
      <div className="qr-actions">
        <button type="button" onClick={handleDownload}>
          Download PNG
        </button>
        <button type="button" onClick={handleCopy}>
          Copy to Clipboard
        </button>
      </div>
      {copyMessage && <p className="copy-message">{copyMessage}</p>}
    </div>
  )
}
