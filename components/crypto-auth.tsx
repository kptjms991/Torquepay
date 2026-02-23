"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IdentityManager } from "@/lib/crypto/identity-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RecoveryBackup from "@/components/recovery-backup"

export default function CryptoAuth() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [mnemonic, setMnemonic] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showRecovery, setShowRecovery] = useState(false)
  const [identity, setIdentity] = useState(null)

  const handleCreateIdentity = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const manager = new IdentityManager()
      const newIdentity = await manager.createIdentity(username)

      sessionStorage.setItem("current_identity", JSON.stringify(newIdentity))
      setIdentity(newIdentity)
      setShowRecovery(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create identity")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecoverIdentity = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const manager = new IdentityManager()
      const recoveredIdentity = manager.recoverIdentity(username, mnemonic)

      if (!recoveredIdentity) {
        throw new Error("Invalid recovery phrase or username")
      }

      sessionStorage.setItem("current_identity", JSON.stringify(recoveredIdentity))
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to recover identity")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-sm">
        {showRecovery ? (
          <RecoveryBackup
            identity={identity}
            onContinue={() => {
              router.push("/")
            }}
          />
        ) : (
          <Card className="border-wechat-green/20">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-center">P2P Wallet</CardTitle>
              <CardDescription className="text-center">Private, Encrypted, Decentralized</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="create">Create</TabsTrigger>
                  <TabsTrigger value="recover">Recover</TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="space-y-4">
                  <form onSubmit={handleCreateIdentity} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="your_username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-wechat-green hover:bg-wechat-green/90 rounded-full"
                    >
                      {isLoading ? "Creating..." : "Create Identity"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="recover" className="space-y-4">
                  <form onSubmit={handleRecoverIdentity} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rec-username">Username</Label>
                      <Input
                        id="rec-username"
                        type="text"
                        placeholder="your_username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mnemonic">Recovery Phrase (12 words)</Label>
                      <Input
                        id="mnemonic"
                        type="text"
                        placeholder="word1 word2 word3..."
                        required
                        value={mnemonic}
                        onChange={(e) => setMnemonic(e.target.value)}
                        className="rounded-lg h-20"
                      />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-wechat-green hover:bg-wechat-green/90 rounded-full"
                    >
                      {isLoading ? "Recovering..." : "Recover Identity"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
