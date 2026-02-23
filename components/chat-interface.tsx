"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatBubble from "./chat-bubble"
import PullToRefresh from "./pull-to-refresh"
import TypingIndicator from "./typing-indicator"
import type { Chat, Message } from "@/types/chat" // Declare Chat and Message types

export default function ChatInterface() {
  const [view, setView] = useState<"list" | "detail">("list")
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "contact",
      text: "Hey, how are you?",
      timestamp: new Date(Date.now() - 300000),
      status: "read",
      encrypted: true,
    },
    {
      id: "2",
      sender: "user",
      text: "I'm doing great! How about you?",
      timestamp: new Date(Date.now() - 240000),
      status: "read",
      encrypted: true,
    },
    {
      id: "3",
      sender: "contact",
      text: "Pretty good, just working on a project",
      timestamp: new Date(Date.now() - 180000),
      status: "read",
      encrypted: true,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chats: Chat[] = [
    {
      id: "1",
      name: "Alice Chen",
      avatar: "👩‍💼",
      lastMessage: "Pretty good, just working on a project",
      timestamp: new Date(Date.now() - 180000),
      unread: 0,
      encrypted: true,
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "👨‍💻",
      lastMessage: "See you tomorrow!",
      timestamp: new Date(Date.now() - 3600000),
      unread: 2,
      encrypted: true,
    },
    {
      id: "3",
      name: "Design Team",
      avatar: "👥",
      lastMessage: "New designs ready for review",
      timestamp: new Date(Date.now() - 7200000),
      unread: 0,
      encrypted: true,
    },
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedChat) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date(),
      status: "sending",
      encrypted: true,
    }

    setMessages([...messages, newMessage])
    setInputValue("")

    if (selectedChat) {
      setTypingUsers(new Set([selectedChat.id]))
      setTimeout(() => setTypingUsers(new Set()), 2000)
    }

    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "sent" } : msg)))
    }, 500)

    setTimeout(() => {
      const responses = ["That's interesting!", "Sounds good!", "Got it!", "Thanks for the update!"]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "contact",
          text: randomResponse,
          timestamp: new Date(),
          status: "read",
          encrypted: true,
        },
      ])
      setTypingUsers(new Set())
    }, 2000)
  }

  if (view === "detail" && selectedChat) {
    return (
      <div className="flex h-full flex-col bg-background">
        {/* Chat Header */}
        <div className="border-b border-border bg-background/80 backdrop-blur-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setView("list")
                setSelectedChat(null)
              }}
              className="text-2xl hover:opacity-70 transition active:scale-95 min-w-10 min-h-10 flex items-center justify-center"
            >
              ←
            </button>
            <div>
              <h2 className="font-semibold text-foreground">{selectedChat.name}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {typingUsers.has(selectedChat.id) ? "typing..." : "Active now"} {selectedChat.encrypted && "🔒"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition text-xl active:scale-95 min-w-10 min-h-10">
              📞
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition text-xl active:scale-95 min-w-10 min-h-10">
              📹
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition text-xl active:scale-95 min-w-10 min-h-10">
              ⋯
            </button>
          </div>
        </div>

        {/* Messages with pull-to-refresh */}
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {typingUsers.has(selectedChat.id) && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </PullToRefresh>

        {/* Input Area */}
        <div className="border-t border-border bg-background/80 backdrop-blur-md p-4 space-y-3">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Message..."
              className="flex-1 bg-muted border-0 rounded-full"
            />
            <button className="p-2 text-xl hover:opacity-70 transition active:scale-95 min-w-10 min-h-10 flex items-center justify-center">
              ➕
            </button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="rounded-full bg-wechat-green hover:bg-wechat-green/90 w-10 h-10 p-0 flex items-center justify-center"
            >
              ➤
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-border bg-background/80 backdrop-blur-md p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            <button className="p-2 hover:bg-muted rounded-lg transition text-xl active:scale-95 min-w-10 min-h-10">
              ➕
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto space-y-2 p-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat)
                setView("detail")
              }}
              className="w-full p-3 hover:bg-muted rounded-lg transition text-left active:scale-95 min-h-16"
            >
              <div className="flex items-center gap-3">
                <div className="text-4xl flex-shrink-0">{chat.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground truncate">{chat.name}</h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {chat.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.encrypted && "🔒 "}
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-wechat-green flex items-center justify-center text-xs font-bold text-white ml-2">
                    {chat.unread}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </PullToRefresh>
  )
}
