export interface Message {
  id: string
  sender: "user" | "contact"
  text: string
  timestamp: Date
  status?: "sending" | "sent" | "read"
  encrypted?: boolean
}

export interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: Date
  unread: number
  encrypted?: boolean
}

export interface Contact {
  id: string
  name: string
  avatar: string
  publicKey: string
  online: boolean
  lastSeen: Date
}
