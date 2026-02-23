import { createClient } from "@/lib/supabase/client"
import { peerManager } from "./peer-manager"

export interface CallState {
  id: string
  peerId: string
  type: "voice" | "video"
  status: "pending" | "connecting" | "active" | "ended"
  duration: number
  localStream?: MediaStream
  remoteStream?: MediaStream
}

export class CallManager {
  private supabase = createClient()
  private callState: CallState | null = null
  private durationInterval: NodeJS.Timer | null = null

  async initiateCall(recipientId: string, callType: "voice" | "video"): Promise<CallState> {
    const peerConnection = await peerManager.createPeerConnection(recipientId)

    // Get local stream
    const localStream = await peerManager.getLocalStream(callType === "video", true)
    await peerManager.addLocalStream(recipientId, localStream, callType === "video")

    // Create offer
    const offer = await peerManager.createOffer(recipientId)

    // Store in database
    const { data: call, error } = await this.supabase
      .from("calls")
      .insert({
        recipient_id: recipientId,
        call_type: callType,
        status: "pending",
        call_started_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error

    this.callState = {
      id: call[0].id,
      peerId: recipientId,
      type: callType,
      status: "pending",
      duration: 0,
      localStream,
    }

    // Start duration tracking
    this.startDurationTracking()

    return this.callState
  }

  async acceptCall(callData: any, callType: "voice" | "video"): Promise<void> {
    const peerConnection = await peerManager.createPeerConnection(callData.caller_id)

    // Get local stream
    const localStream = await peerManager.getLocalStream(callType === "video", true)
    await peerManager.addLocalStream(callData.caller_id, localStream, callType === "video")

    // Set remote description from offer
    if (callData.offer) {
      await peerManager.setRemoteDescription(callData.caller_id, JSON.parse(callData.offer))
    }

    // Create answer
    const answer = await peerManager.createAnswer(callData.caller_id)

    // Update call status
    await this.supabase
      .from("calls")
      .update({
        status: "active",
      })
      .eq("id", callData.id)

    this.callState = {
      id: callData.id,
      peerId: callData.caller_id,
      type: callType,
      status: "active",
      duration: 0,
      localStream,
    }

    this.startDurationTracking()
  }

  async endCall(): Promise<void> {
    if (!this.callState) return

    if (this.durationInterval) {
      clearInterval(this.durationInterval)
    }

    // Close peer connection
    peerManager.closePeerConnection(this.callState.peerId)

    // Update database
    await this.supabase
      .from("calls")
      .update({
        status: "ended",
        call_ended_at: new Date().toISOString(),
        duration_seconds: this.callState.duration,
      })
      .eq("id", this.callState.id)

    this.callState = null
  }

  private startDurationTracking(): void {
    this.durationInterval = setInterval(() => {
      if (this.callState) {
        this.callState.duration += 1
      }
    }, 1000)
  }

  getCallState(): CallState | null {
    return this.callState
  }
}

export const callManager = new CallManager()
