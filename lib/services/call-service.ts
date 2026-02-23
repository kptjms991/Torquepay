import { getIPLocation, maskIPLocation } from "@/lib/ip-location"

export interface CallRecord {
  id: string
  recipientId: string
  callType: "voice" | "video"
  ipLocation: { city: string; region: string; country: string }
  ipMasked: boolean
  status: "pending" | "active" | "completed"
  startTime: Date
  endTime?: Date
  durationSeconds?: number
}

export class CallService {
  private static readonly CALLS_KEY = "p2p_calls"

  static async initializeCall(
    recipientId: string,
    callType: "voice" | "video",
    ipMasked: boolean,
  ): Promise<CallRecord> {
    const ipLocation = await getIPLocation("203.0.113.1") // Mock IP
    const maskedLocation = ipMasked ? maskIPLocation(ipLocation) : ipLocation

    const call: CallRecord = {
      id: `call_${Date.now()}`,
      recipientId,
      callType,
      ipLocation: maskedLocation,
      ipMasked,
      status: "pending",
      startTime: new Date(),
    }

    const calls = this.getLocalCalls()
    calls.push(call)
    localStorage.setItem(this.CALLS_KEY, JSON.stringify(calls))

    return call
  }

  static async endCall(callId: string, durationSeconds: number): Promise<void> {
    const calls = this.getLocalCalls()
    const call = calls.find((c) => c.id === callId)
    if (call) {
      call.status = "completed"
      call.endTime = new Date()
      call.durationSeconds = durationSeconds
      localStorage.setItem(this.CALLS_KEY, JSON.stringify(calls))
    }
  }

  static async getCallHistory(): Promise<CallRecord[]> {
    return this.getLocalCalls()
  }

  private static getLocalCalls(): CallRecord[] {
    try {
      const data = localStorage.getItem(this.CALLS_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }
}
