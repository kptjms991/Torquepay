"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatLocation } from "@/lib/ip-location"

interface IPLocationDisplayProps {
  location: {
    city: string
    region: string
    country: string
  } | null
  isMasked: boolean
  onToggleMask?: (masked: boolean) => void
}

export default function IPLocationDisplay({ location, isMasked, onToggleMask }: IPLocationDisplayProps) {
  const [showDetails, setShowDetails] = useState(false)

  const displayText = formatLocation(location, isMasked)
  const maskStatus = isMasked ? "Privacy Mode On" : "Public Location"

  return (
    <Card className="p-3 bg-gradient-to-r from-wechat-green/10 to-transparent border-wechat-green/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{displayText}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={isMasked ? "default" : "secondary"} className="text-xs">
              {maskStatus}
            </Badge>
            {showDetails && (
              <div className="text-xs text-muted-foreground">
                <p>IP: {isMasked ? "Hidden" : "Show when unmasked"}</p>
              </div>
            )}
          </div>
        </div>
        {onToggleMask && (
          <button
            onClick={() => onToggleMask(!isMasked)}
            className="px-3 py-1 text-xs font-medium bg-wechat-green/20 hover:bg-wechat-green/30 text-wechat-green rounded-full transition"
          >
            {isMasked ? "Unmask" : "Mask IP"}
          </button>
        )}
      </div>
    </Card>
  )
}
