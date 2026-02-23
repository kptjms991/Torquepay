"use client"

import { useState, useCallback } from "react"
import { callManager, type CallState } from "@/lib/webrtc/call-manager"

export function useCall() {
  const [callState, setCallState] = useState<CallState | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initiateCall = useCallback(async (recipientId: string, callType: "voice" | "video") => {
    setIsLoading(true)
    setError(null)
    try {
      const state = await callManager.initiateCall(recipientId, callType)
      setCallState(state)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to initiate call"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const acceptCall = useCallback(async (callData: any, callType: "voice" | "video") => {
    setIsLoading(true)
    setError(null)
    try {
      await callManager.acceptCall(callData, callType)
      setCallState(callManager.getCallState())
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to accept call"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const endCall = useCallback(async () => {
    try {
      await callManager.endCall()
      setCallState(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to end call"
      setError(message)
    }
  }, [])

  return {
    callState,
    isLoading,
    error,
    initiateCall,
    acceptCall,
    endCall,
  }
}
