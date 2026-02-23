"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Info } from "lucide-react"

interface PrivacyToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  maskLevel?: "city" | "region" | "country"
  onMaskLevelChange?: (level: "city" | "region" | "country") => void
}

export default function PrivacyToggle({
  enabled,
  onChange,
  maskLevel = "city",
  onMaskLevelChange,
}: PrivacyToggleProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="p-4 bg-background/80 backdrop-blur-md border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="font-medium cursor-pointer">IP Masking</Label>
            <Info className="w-4 h-4 text-muted-foreground" />
          </div>
          <Switch checked={enabled} onCheckedChange={onChange} />
        </div>

        {enabled && (
          <div className="pt-3 border-t border-border/50 space-y-3">
            <p className="text-sm text-muted-foreground">Privacy Level:</p>
            <div className="space-y-2">
              {(["city", "region", "country"] as const).map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mask-level"
                    value={level}
                    checked={maskLevel === level}
                    onChange={() => onMaskLevelChange?.(level)}
                    className="w-3 h-3"
                  />
                  <span className="text-sm capitalize">{level} Level</span>
                  <span className="text-xs text-muted-foreground">
                    {level === "city" && "Show city, hide street"}
                    {level === "region" && "Show region, hide city"}
                    {level === "country" && "Show country only"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 bg-wechat-green/10 rounded-lg text-xs text-muted-foreground">
          {enabled ? "Your IP location is masked during calls" : "Your IP location is visible to contacts"}
        </div>
      </div>
    </Card>
  )
}
