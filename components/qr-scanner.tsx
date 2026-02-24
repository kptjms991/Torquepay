'use client'

import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface Html5QrcodePluginProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
}

export default function Html5QrcodePlugin({ onScan, onError }: Html5QrcodePluginProps) {
  const qrRef = useRef<any>(null)
  const html5QrcodeScanner = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    if (!qrRef.current) return

    const config = { fps: 25, qrbox: { width: 250, height: 250 } }
    const qrcodeScanner = new Html5Qrcode('reader', config)

    qrcodeScanner
      .start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          onScan(decodedText)
        },
        (errorMessage) => {
          if (onError) onError(errorMessage)
        }
      )
      .catch((err) => {
        console.error('Failed to start camera:', err)
        if (onError) onError('Failed to access camera. Please check permissions.')
      })

    html5QrcodeScanner.current = qrcodeScanner

    return () => {
      if (html5QrcodeScanner.current) {
        html5QrcodeScanner.current
          .stop()
          .catch((err) => console.error('Failed to stop scanner:', err))
      }
    }
  }, [onScan, onError])

  return (
    <div className="w-full">
      <div id="reader" className="w-full"></div>
    </div>
  )
}
