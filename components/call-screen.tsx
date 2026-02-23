"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import IPLocationDisplay from "./ip-location-display"
import PrivacyToggle from "./privacy-toggle"

export default function CallScreen() {
  const [isCallActive, setIsCallActive] = useState(true)
  const [callType, setCallType] = useState<"voice" | "video">("video")
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [speakerOn, setSpeakerOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState("Connected")
  const [showPrivacySettings, setShowPrivacySettings] = useState(false)
  const [ipMasked, setIpMasked] = useState(false)
  const [maskLevel, setMaskLevel] = useState<"city" | "region" | "country">("city")
  const [ipLocation, setIpLocation] = useState({
    city: "San Francisco",
    region: "California",
    country: "United States",
  })

  useEffect(() => {
    if (!isCallActive) return
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isCallActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      {isCallActive ? (
        <div className="w-full max-w-md space-y-6 text-center">
          {/* Call Type Selector */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setCallType("voice")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                callType === "voice" ? "bg-wechat-green text-white" : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Voice Call
            </button>
            <button
              onClick={() => setCallType("video")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                callType === "video" ? "bg-wechat-green text-white" : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              Video Call
            </button>
          </div>

          {/* IP Location Display */}
          {isCallActive && <IPLocationDisplay location={ipLocation} isMasked={ipMasked} onToggleMask={setIpMasked} />}

          {/* Video Stream */}
          {callType === "video" && (
            <div className="relative w-full aspect-square rounded-3xl bg-muted overflow-hidden border-4 border-wechat-green/20">
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50">
                <span className="text-8xl">👩‍💼</span>
              </div>
              {/* Picture-in-Picture */}
              <div className="absolute top-4 right-4 w-20 h-28 rounded-2xl bg-muted border-2 border-border overflow-hidden">
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary to-primary/50">
                  <span className="text-3xl">👤</span>
                </div>
              </div>
            </div>
          )}

          {/* Call Audio Visual */}
          {callType === "voice" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-wechat-green to-wechat-green/50 flex items-center justify-center text-6xl animate-pulse">
                👩‍💼
              </div>
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-wechat-green rounded-full"
                    style={{
                      height: "20px",
                      animation: `wave 0.6s ease-in-out ${i * 0.1}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Call Info */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Alice Chen</h2>
            <p className="text-sm text-muted-foreground">{formatTime(callDuration)}</p>
            <p className="text-xs text-wechat-green font-medium">{connectionStatus}</p>
          </div>

          {/* Controls with improved touch targets */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <button
              onClick={() => setIsMuted(!isMuted)}
              aria-pressed={isMuted}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className={`flex flex-col items-center gap-2 p-3 rounded-full transition-all min-h-16 min-w-16 ${
                isMuted
                  ? "bg-wechat-green/20 text-wechat-green"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-2xl">🔇</span>
              <span className="text-xs font-medium">Mute</span>
            </button>
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              aria-pressed={isVideoOn}
              aria-label={isVideoOn ? "Turn off video" : "Turn on video"}
              className={`flex flex-col items-center gap-2 p-3 rounded-full transition-all min-h-16 min-w-16 ${
                isVideoOn
                  ? "bg-wechat-green/20 text-wechat-green"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-2xl">📹</span>
              <span className="text-xs font-medium">Video</span>
            </button>
            <button
              onClick={() => setSpeakerOn(!speakerOn)}
              aria-pressed={speakerOn}
              aria-label={speakerOn ? "Speaker on" : "Speaker off"}
              className={`flex flex-col items-center gap-2 p-3 rounded-full transition-all min-h-16 min-w-16 ${
                speakerOn
                  ? "bg-wechat-green/20 text-wechat-green"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-2xl">🔊</span>
              <span className="text-xs font-medium">Speaker</span>
            </button>
            <button
              onClick={() => setShowPrivacySettings(!showPrivacySettings)}
              aria-pressed={showPrivacySettings}
              aria-label="Privacy settings"
              className={`flex flex-col items-center gap-2 p-3 rounded-full transition-all min-h-16 min-w-16 ${
                showPrivacySettings
                  ? "bg-wechat-green/20 text-wechat-green"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-2xl">🔒</span>
              <span className="text-xs font-medium">Privacy</span>
            </button>
          </div>

          {/* Privacy Settings Panel */}
          {showPrivacySettings && (
            <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
              <PrivacyToggle
                enabled={ipMasked}
                onChange={setIpMasked}
                maskLevel={maskLevel}
                onMaskLevelChange={setMaskLevel}
              />
            </div>
          )}

          {/* End Call */}
          <Button
            onClick={() => setIsCallActive(false)}
            className="w-full mt-6 h-14 rounded-full bg-destructive hover:bg-destructive/90 text-white text-lg font-semibold"
          >
            End Call
          </Button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Call Ended</h2>
          <p className="text-muted-foreground">Duration: {formatTime(callDuration)}</p>
          <Button
            onClick={() => {
              setIsCallActive(true)
              setCallDuration(0)
            }}
            className="mt-6 bg-wechat-green hover:bg-wechat-green/90"
          >
            Call Again
          </Button>
        </div>
      )}

      <style>{`
        @keyframes wave {
          0%, 100% { height: 20px; }
          50% { height: 40px; }
        }
      `}</style>
    </div>
  )
}

function CallControlButton({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: string
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-full transition-all ${
        isActive ? "bg-wechat-green/20 text-wechat-green" : "bg-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
