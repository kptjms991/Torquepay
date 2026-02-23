"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { pwaManager } from "@/lib/pwa/install-prompt"

export default function PWAInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    pwaManager.setupInstallPrompt()
    setCanInstall(pwaManager.canInstall())
    setIsInstalled(pwaManager.isInstalled())
  }, [])

  if (isInstalled || !canInstall) return null

  const handleInstall = async () => {
    const success = await pwaManager.installApp()
    if (success) {
      setCanInstall(false)
    }
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 bg-card border border-border rounded-lg shadow-lg p-4 z-40 flex items-center justify-between gap-4">
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground text-sm">Install P2P Wallet</h3>
        <p className="text-xs text-muted-foreground">Access your wallet anytime</p>
      </div>
      <Button
        onClick={handleInstall}
        size="sm"
        className="bg-wechat-green hover:bg-wechat-green/90 text-white flex-shrink-0"
      >
        Install
      </Button>
    </div>
  )
}
