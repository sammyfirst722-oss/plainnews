'use client'

import React, { useRef, useState, useEffect } from 'react'
import { X, Download, Share2, Sparkles, Check } from 'lucide-react'

interface VisualShareCardModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  category: string
  gist: string
  bulletPoints: string[]
}

export function VisualShareCardModal({
  isOpen,
  onClose,
  title,
  category,
  gist,
  bulletPoints,
}: VisualShareCardModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1080
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 1. Background gradient (calm, senior-friendly dark slate + emerald border)
    const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1080)
    bgGradient.addColorStop(0, '#064e3b') // emerald-900
    bgGradient.addColorStop(0.4, '#0f172a') // slate-900
    bgGradient.addColorStop(1, '#022c22') // emerald-950
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, 1080, 1080)

    // Inner card border
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 12
    ctx.strokeRect(36, 36, 1008, 1008)

    // Decorative inner thin ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 3
    ctx.strokeRect(52, 52, 976, 976)

    // 2. Header: SimplyBigNews brand
    ctx.fillStyle = '#34d399' // emerald-400
    ctx.font = 'bold 38px system-ui, -apple-system, sans-serif'
    ctx.fillText('SIMPLYBIGNEWS • PLAIN ENGLISH DIGEST', 80, 120)

    // Category badge
    const badgeText = category.toUpperCase()
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif'
    const badgeWidth = ctx.measureText(badgeText).width + 36
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)'
    ctx.fillRect(80, 150, badgeWidth, 44)
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 2
    ctx.strokeRect(80, 150, badgeWidth, 44)

    ctx.fillStyle = '#a7f3d0'
    ctx.fillText(badgeText, 98, 180)

    // 3. Headline with clean multi-line word wrapping
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 52px system-ui, -apple-system, sans-serif'

    function wrapText(
      c: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number
    ): number {
      const words = text.split(' ')
      let line = ''
      let currentY = y

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' '
        const metrics = c.measureText(testLine)
        if (metrics.width > maxWidth && n > 0) {
          c.fillText(line, x, currentY)
          line = words[n] + ' '
          currentY += lineHeight
        } else {
          line = testLine
        }
      }
      c.fillText(line, x, currentY)
      return currentY + lineHeight
    }

    let nextY = wrapText(ctx, title, 80, 270, 920, 64)

    // 4. "The Gist" Highlight Box
    nextY += 20
    const gistBoxY = nextY
    ctx.fillStyle = 'rgba(16, 185, 129, 0.12)'
    ctx.fillRect(80, gistBoxY, 920, 130)
    ctx.strokeStyle = '#34d399'
    ctx.lineWidth = 3
    ctx.strokeRect(80, gistBoxY, 920, 130)

    ctx.fillStyle = '#6ee7b7'
    ctx.font = 'bold 26px system-ui, -apple-system, sans-serif'
    ctx.fillText('THE GIST IN PLAIN WORDS:', 110, gistBoxY + 45)

    ctx.fillStyle = '#ffffff'
    ctx.font = '500 28px system-ui, -apple-system, sans-serif'
    wrapText(ctx, gist, 110, gistBoxY + 88, 860, 36)

    // 5. Key Points / What to Know
    nextY = gistBoxY + 160
    ctx.fillStyle = '#38bdf8' // sky-400
    ctx.font = 'bold 30px system-ui, -apple-system, sans-serif'
    ctx.fillText('KEY TAKEAWAYS FOR FAMILY:', 80, nextY)
    nextY += 45

    const points = bulletPoints.slice(0, 3)
    for (let i = 0; i < points.length; i++) {
      // Circle icon
      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc(105, nextY + 12, 18, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
      ctx.fillText(`${i + 1}`, 98, nextY + 20)

      // Text
      ctx.fillStyle = '#e2e8f0'
      ctx.font = '500 28px system-ui, -apple-system, sans-serif'
      nextY = wrapText(ctx, points[i], 145, nextY + 20, 850, 38) + 12
    }

    // 6. Watermark Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(52, 980, 976, 52)

    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
    ctx.fillText('SHARE WITH FAMILY • READ CALM, CLEAR NEWS AT SIMPLYBIGNEWS.COM', 80, 1015)

    // Set preview image data URL
    const url = canvas.toDataURL('image/png')
    setDataUrl(url)
  }, [isOpen, title, category, gist, bulletPoints])

  if (!isOpen) return null

  const handleDownload = () => {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `simplybignews-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}.png`
    a.click()
  }

  const handleNativeShare = async () => {
    if (!dataUrl) return
    try {
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], 'simplybignews-card.png', { type: 'image/png' })
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title,
          text: `Important breakdown: ${title} (via SimplyBigNews)`,
        })
      } else {
        handleDownload()
      }
    } catch {
      handleDownload()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border-2 border-border/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h3 className="font-black text-lg text-foreground">Visual Share Card</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-border/80 hover:bg-muted text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          This 1080&times;1080 picture card is sized for easy reading on phones, WhatsApp, and Facebook.
        </p>

        {/* Card Preview */}
        {dataUrl && (
          <div className="rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-lg aspect-square">
            <img src={dataUrl} alt="Visual share card preview" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 font-bold text-sm text-foreground transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Send to Family</span>
          </button>
        </div>
      </div>
    </div>
  )
}
