"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { CryptoIdentity } from "@/lib/crypto/identity-manager"

interface RecoveryBackupProps {
  identity: CryptoIdentity | null
  onContinue: () => void
}

export default function RecoveryBackup({ identity, onContinue }: RecoveryBackupProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!identity) return null

  const handleCopyPhrase = () => {
    navigator.clipboard.writeText(identity.mnemonic)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-sm">
      <Card className="border-wechat-green/20">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-center">Backup Your Phrase</CardTitle>
          <CardDescription className="text-center text-sm">
            Save this phrase in a safe place. It's your only recovery method.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-destructive bg-destructive/10">
            <AlertDescription>Never share this phrase. Whoever has it can access your wallet.</AlertDescription>
          </Alert>

          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm font-mono text-center break-words">{identity.mnemonic}</p>
          </div>

          <Button onClick={handleCopyPhrase} variant="outline" className="w-full bg-transparent">
            {copied ? "Copied!" : "Copy Phrase"}
          </Button>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">I've saved my phrase safely</span>
          </label>

          <Button
            onClick={onContinue}
            disabled={!confirmed}
            className="w-full bg-wechat-green hover:bg-wechat-green/90 rounded-full"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
