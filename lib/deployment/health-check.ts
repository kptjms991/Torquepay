export interface HealthCheckResult {
  status: "healthy" | "degraded" | "unhealthy"
  checks: {
    crypto: boolean
    storage: boolean
    webrtc: boolean
    network: boolean
  }
  timestamp: number
}

export async function performHealthCheck(): Promise<HealthCheckResult> {
  const checks = {
    crypto: Boolean(window.crypto?.subtle),
    storage: checkStorage(),
    webrtc: checkWebRTC(),
    network: await checkNetwork(),
  }

  const allHealthy = Object.values(checks).every((check) => check)

  return {
    status: allHealthy ? "healthy" : "degraded",
    checks,
    timestamp: Date.now(),
  }
}

function checkStorage(): boolean {
  try {
    const test = "__storage_test__"
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

function checkWebRTC(): boolean {
  const RTCPeerConnection = (window as any).RTCPeerConnection || (window as any).webkitRTCPeerConnection
  return Boolean(RTCPeerConnection)
}

async function checkNetwork(): Promise<boolean> {
  try {
    const response = await fetch("/", { method: "HEAD", cache: "no-store" })
    return response.ok
  } catch {
    return false
  }
}
