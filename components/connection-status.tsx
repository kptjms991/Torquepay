"use client"

import { useState, useEffect } from "react"
import { connectionManager } from "@/lib/network/connection-manager"

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(connectionManager.getIsOnline())
    const unsubscribe = connectionManager.subscribe(setIsOnline)
    return unsubscribe
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 bg-destructive text-white p-3 rounded-lg shadow-lg z-40 flex items-center gap-2">
      <span>No internet connection</span>
    </div>
  )
}
