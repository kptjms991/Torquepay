"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function QRScanner() {
  const [mode, setMode] = useState<"camera" | "upload">("camera")
  const [scanning, setScanning] = useState(true)
  const [scannedCode, setScannedCode] = useState("user@wechat.com")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setScannedCode("payment://alice_chen?amount=50")
      setScanning(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-md p-4">
        <h1 className="text-2xl font-bold text-foreground">Scan QR Code</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-6">
        {/* Scanner Area */}
        <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden border-4 border-wechat-green/30 bg-muted">
          {scanning && (
            <>
              {/* Camera View */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <span className="text-6xl opacity-30">📱</span>
              </div>

              {/* Scanning Line Animation */}
              <div className="absolute inset-0">
                <div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-wechat-green to-transparent"
                  style={{
                    top: "50%",
                    animation: "scan 2s infinite",
                  }}
                />
              </div>

              {/* Corner Markers */}
              <div className="absolute top-4 left-4 w-8 h-8 border-2 border-wechat-green border-r-0 border-b-0" />
              <div className="absolute top-4 right-4 w-8 h-8 border-2 border-wechat-green border-l-0 border-b-0" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-wechat-green border-r-0 border-t-0" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-wechat-green border-l-0 border-t-0" />
            </>
          )}
        </div>

        {/* Mode Selector */}
        <div className="flex gap-3 w-full max-w-sm">
          <Button
            onClick={() => setScanning(true)}
            variant={scanning ? "default" : "outline"}
            className={`flex-1 rounded-full ${scanning ? "bg-wechat-green hover:bg-wechat-green/90" : ""}`}
          >
            📷 Camera
          </Button>
          <Button
            onClick={() => setMode("upload")}
            variant={!scanning && mode === "upload" ? "default" : "outline"}
            className={`flex-1 rounded-full ${
              !scanning && mode === "upload" ? "bg-wechat-green hover:bg-wechat-green/90" : ""
            }`}
          >
            📁 Upload
          </Button>
        </div>

        {mode === "upload" && (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full max-w-sm px-4 py-2 border-2 border-dashed border-wechat-green/30 rounded-lg text-sm text-foreground cursor-pointer hover:border-wechat-green/50 transition"
          />
        )}

        {/* Result Display */}
        {!scanning && (
          <div className="w-full max-w-sm p-4 rounded-2xl bg-gradient-to-br from-wechat-green/10 to-wechat-green/5 border-2 border-wechat-green/30 text-center space-y-2">
            <p className="text-sm text-muted-foreground font-medium">QR Code Detected</p>
            <p className="font-semibold text-foreground truncate">{scannedCode}</p>
            <Button
              onClick={() => setScanning(true)}
              className="w-full mt-3 bg-wechat-green hover:bg-wechat-green/90 text-white rounded-full text-sm"
            >
              Scan Again
            </Button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 20%; }
          50% { top: 80%; }
        }
      `}</style>
    </div>
  )
}
