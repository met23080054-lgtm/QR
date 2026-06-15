/** Composites a logo onto a white circle, for use on dark-colored QR codes. */
export function withWhiteBackground(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const size = 200
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas is not supported in this browser.'))
        return
      }

      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      ctx.fill()

      const padding = size * 0.12
      ctx.drawImage(img, padding, padding, size - padding * 2, size - padding * 2)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('Failed to load logo image.'))
    img.src = dataUrl
  })
}
