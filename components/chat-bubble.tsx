"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"

interface Message {
  id: string
  sender: "user" | "contact"
  text: string
  timestamp: Date
  status?: "sending" | "sent" | "read"
  encrypted?: boolean
}

export default function ChatBubble({ message }: { message: Message }) {
  const [showEncryption, setShowEncryption] = useState(false)
  const isUser = message.sender === "user"
  const statusIcon = {
    sending: "⏱",
    sent: "✓",
    read: "✓✓",
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-xs">
        <div
          onClick={() => setShowEncryption(!showEncryption)}
          className={`rounded-2xl px-4 py-2 cursor-pointer transition-all ${
            isUser ? "bg-wechat-green text-white rounded-br-none" : "bg-muted text-foreground rounded-bl-none"
          } ${showEncryption ? "ring-2 ring-wechat-green/50" : ""}`}
        >
          <p className="text-sm break-words">{message.text}</p>
          {message.encrypted && <p className="text-xs opacity-70 mt-1 flex items-center gap-1">🔒 Encrypted</p>}
        </div>
        <div
          className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          <span>{formatDistanceToNow(message.timestamp, { addSuffix: false })}</span>
          {isUser && message.status && <span>{statusIcon[message.status]}</span>}
        </div>
      </div>
    </div>
  )
}
