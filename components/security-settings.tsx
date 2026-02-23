"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { BiometricAuth } from "@/lib/security/biometric"

export default function SecuritySettings() {
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [encryptionEnabled, setEncryptionEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    BiometricAuth.isAvailable().then(setBiometricAvailable)
  }, [])

  const handleBiometricToggle = async (enabled: boolean) => {
    setIsLoading(true)
    try {
      if (enabled) {
        await BiometricAuth.registerBiometric(crypto.randomUUID())
      }
      setBiometricEnabled(enabled)
    } catch (error) {
      console.error("Biometric setup failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Security Settings</h2>

      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">End-to-End Encryption</Label>
            <p className="text-xs text-muted-foreground mt-1">All messages are encrypted</p>
          </div>
          <Switch checked={encryptionEnabled} disabled />
        </div>

        {biometricAvailable && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Biometric Authentication</Label>
                <p className="text-xs text-muted-foreground mt-1">Use fingerprint or face ID</p>
              </div>
              <Switch checked={biometricEnabled} onCheckedChange={handleBiometricToggle} disabled={isLoading} />
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Privacy Mode</Label>
              <p className="text-xs text-muted-foreground mt-1">Hide sensitive information</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-wechat-green/10 border-wechat-green/30">
        <div className="space-y-2">
          <h3 className="font-medium text-wechat-green">Security Status</h3>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>✓ Encrypted messaging active</li>
            <li>✓ IP privacy protection available</li>
            <li>✓ Secure payment processing</li>
            <li>✓ Session management enabled</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
