"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface ErrorRecoveryProps {
  onRetry: () => Promise<void>
  error: Error | null
  children: React.ReactNode
}

export default function ErrorRecovery({ onRetry, error, children }: ErrorRecoveryProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = useCallback(async () => {
    setIsRetrying(true)
    try {
      await onRetry()
    } catch (e) {
      console.error("[v0] Retry failed:", e)
    } finally {
      setIsRetrying(false)
    }
  }, [onRetry])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full flex-col gap-4 p-4">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">{error.message || "Please try again"}</p>
        </div>
        <Button onClick={handleRetry} disabled={isRetrying} className="bg-wechat-green hover:bg-wechat-green/90">
          {isRetrying ? "Retrying..." : "Try Again"}
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
