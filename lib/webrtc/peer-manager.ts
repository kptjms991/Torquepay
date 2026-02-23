// WebRTC Peer Connection Manager
export class PeerManager {
  private peerConnections: Map<string, RTCPeerConnection> = new Map()
  private dataChannels: Map<string, RTCDataChannel> = new Map()
  private streams: Map<string, MediaStream> = new Map()

  private readonly configuration: RTCConfiguration = {
    iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }, { urls: ["stun:stun1.l.google.com:19302"] }],
  }

  async createPeerConnection(peerId: string): Promise<RTCPeerConnection> {
    const peerConnection = new RTCPeerConnection(this.configuration)
    this.peerConnections.set(peerId, peerConnection)

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.onIceCandidate?.(peerId, event.candidate)
      }
    }

    peerConnection.ontrack = (event) => {
      this.onRemoteStream?.(peerId, event.streams[0])
    }

    return peerConnection
  }

  async addLocalStream(peerId: string, stream: MediaStream, isVideo = true): Promise<void> {
    const peerConnection = this.peerConnections.get(peerId)
    if (!peerConnection) return

    this.streams.set(peerId, stream)

    stream.getTracks().forEach((track) => {
      if (isVideo && track.kind !== "video") return
      if (!isVideo && track.kind !== "audio") return
      peerConnection.addTrack(track, stream)
    })
  }

  async createOffer(peerId: string): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.peerConnections.get(peerId)
    if (!peerConnection) throw new Error("Peer connection not found")

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    return offer
  }

  async createAnswer(peerId: string): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.peerConnections.get(peerId)
    if (!peerConnection) throw new Error("Peer connection not found")

    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    return answer
  }

  async setRemoteDescription(peerId: string, description: RTCSessionDescriptionInit): Promise<void> {
    const peerConnection = this.peerConnections.get(peerId)
    if (!peerConnection) throw new Error("Peer connection not found")

    await peerConnection.setRemoteDescription(new RTCSessionDescription(description))
  }

  async addIceCandidate(peerId: string, candidate: RTCIceCandidate): Promise<void> {
    const peerConnection = this.peerConnections.get(peerId)
    if (!peerConnection) return

    try {
      await peerConnection.addIceCandidate(candidate)
    } catch (error) {
      console.error("Error adding ICE candidate:", error)
    }
  }

  closePeerConnection(peerId: string): void {
    const peerConnection = this.peerConnections.get(peerId)
    if (peerConnection) {
      peerConnection.close()
      this.peerConnections.delete(peerId)
    }

    const stream = this.streams.get(peerId)
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      this.streams.delete(peerId)
    }
  }

  async getLocalStream(isVideo = true, isAudio = true): Promise<MediaStream> {
    const constraints: MediaStreamConstraints = {
      video: isVideo
        ? {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          }
        : false,
      audio: isAudio,
    }

    return navigator.mediaDevices.getUserMedia(constraints)
  }

  // Callbacks
  onIceCandidate?: (peerId: string, candidate: RTCIceCandidate) => void
  onRemoteStream?: (peerId: string, stream: MediaStream) => void
}

export const peerManager = new PeerManager()
