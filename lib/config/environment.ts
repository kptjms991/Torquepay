export const config = {
  crypto: {
    enabled: process.env.NEXT_PUBLIC_CRYPTO_ENABLED === "true",
    e2eeEnabled: process.env.NEXT_PUBLIC_E2EE_ENABLED === "true",
  },
  privacy: {
    ipMaskingEnabled: process.env.NEXT_PUBLIC_IP_MASKING_ENABLED === "true",
    defaultPrivacyLevel: (process.env.NEXT_PUBLIC_DEFAULT_PRIVACY_LEVEL || "high") as
      | "city"
      | "region"
      | "country"
      | "high",
  },
  webrtc: {
    enabled: process.env.NEXT_PUBLIC_WEBRTC_ENABLED === "true",
    turnServers: parseTurnServers(process.env.NEXT_PUBLIC_TURN_SERVERS),
  },
  features: {
    pwaEnabled: process.env.NEXT_PUBLIC_PWA_ENABLED === "true",
    offlineModeEnabled: process.env.NEXT_PUBLIC_OFFLINE_MODE === "true",
    hapticFeedbackEnabled: process.env.NEXT_PUBLIC_HAPTIC_FEEDBACK === "true",
  },
  analytics: {
    enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
  },
  debug: process.env.DEBUG_MODE === "true",
}

function parseTurnServers(input?: string) {
  if (!input) {
    return ["stun:stun.l.google.com:19302"]
  }
  try {
    const servers = JSON.parse(input)
    return servers.flatMap((server: any) => server.urls || [])
  } catch {
    return input.split(",").map((s) => s.trim())
  }
}
