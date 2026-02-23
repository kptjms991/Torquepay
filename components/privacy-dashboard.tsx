"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PrivacyLevel, IPMaskingService } from "@/lib/privacy/ip-masking"

export default function PrivacyDashboard() {
  const [ipMasking, setIpMasking] = useState(true)
  const [relayOnly, setRelayOnly] = useState(true)
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(PrivacyLevel.COUNTRY)
  const [dataCollection, setDataCollection] = useState(false)

  const ipService = new IPMaskingService()

  const handlePrivacyLevelChange = (level: PrivacyLevel) => {
    setPrivacyLevel(level)
    ipService.setPrivacyLevel(level)
  }

  return (
    <div className="space-y-4">
      <Card className="border-wechat-green/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Privacy Controls</span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${ipMasking ? "bg-wechat-green/20 text-wechat-green" : "bg-destructive/20 text-destructive"}`}
            >
              {ipMasking ? "Protected" : "Exposed"}
            </span>
          </CardTitle>
          <CardDescription>Manage your privacy and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-wechat-green/20 bg-wechat-green/5">
            <AlertDescription>
              Your data never leaves your device. All communications are end-to-end encrypted.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-semibold">IP Address Masking</Label>
                <p className="text-xs text-muted-foreground">Hide your real IP during calls</p>
              </div>
              <Switch
                checked={ipMasking}
                onCheckedChange={(checked) => {
                  setIpMasking(checked)
                  ipService.toggleIPMasking(checked)
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-semibold">Relay-Only WebRTC</Label>
                <p className="text-xs text-muted-foreground">Route calls through relay servers</p>
              </div>
              <Switch
                checked={relayOnly}
                onCheckedChange={(checked) => {
                  setRelayOnly(checked)
                  ipService.toggleRelayOnlyWebRTC(checked)
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-semibold">No Data Collection</Label>
                <p className="text-xs text-muted-foreground">Opt out of analytics</p>
              </div>
              <Switch checked={dataCollection} onCheckedChange={(checked) => setDataCollection(checked)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Privacy Level</Label>
            <div className="grid grid-cols-2 gap-2">
              {[PrivacyLevel.CITY, PrivacyLevel.REGION, PrivacyLevel.COUNTRY, PrivacyLevel.MASKED].map((level) => (
                <Button
                  key={level}
                  variant={privacyLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePrivacyLevelChange(level)}
                  className={privacyLevel === level ? "bg-wechat-green hover:bg-wechat-green/90" : ""}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
