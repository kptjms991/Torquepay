"use client"

import { useEffect, useRef } from "react"

interface QRCodeGeneratorProps {
  value: string
  type?: "payment" | "contact" | "url"
}

export default function QRCodeGenerator({ value, type = "url" }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Simple QR code simulation - in production, use a library like qrcode.react
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = 200
    canvas.width = size
    canvas.height = size

    // Draw white background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, size, size)

    // Draw QR pattern (simplified)
    ctx.fillStyle = "#07C160"
    const cellSize = size / 7

    // Generate pseudo-random pattern based on value
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const hash = (value.charCodeAt(i * 7 + j) || 0) + i * j
        if (hash % 2 === 0) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
        }
      }
    }

    // Draw position detection patterns
    const positions = [
      [0, 0],
      [size - 25, 0],
      [0, size - 25],
    ]
    positions.forEach(([x, y]) => {
      ctx.fillStyle = "#07C160"
      ctx.fillRect(x, y, 25, 25)
      ctx.fillStyle = "white"
      ctx.fillRect(x + 5, y + 5, 15, 15)
      ctx.fillStyle = "#07C160"
      ctx.fillRect(x + 8, y + 8, 9, 9)
    })
  }, [value])

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-muted rounded-2xl">
      <canvas ref={canvasRef} className="border-4 border-wechat-green/30 rounded-lg" />
      <div className="text-center">
        <p className="text-sm font-medium text-foreground mb-1">
          {type === "payment" && "💳 Payment QR Code"}
          {type === "contact" && "👤 Contact QR Code"}
          {type === "url" && "🔗 URL QR Code"}
        </p>
        <p className="text-xs text-muted-foreground">{value}</p>
      </div>
    </div>
  )
}
