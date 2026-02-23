"use client"

import { useState } from "react"

interface FloatingActionButtonProps {
  onNewChat: () => void
}

export default function FloatingActionButton({ onNewChat }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-24 right-6 z-40">
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-2 animate-in fade-in duration-200">
          <button className="flex items-center gap-3 p-3 bg-background border border-border rounded-full hover:bg-muted transition w-full justify-end">
            <span className="text-sm font-medium text-foreground">New Group</span>
            <span className="text-xl bg-muted p-2 rounded-full">👥</span>
          </button>
          <button className="flex items-center gap-3 p-3 bg-background border border-border rounded-full hover:bg-muted transition w-full justify-end">
            <span className="text-sm font-medium text-foreground">New Chat</span>
            <span className="text-xl bg-muted p-2 rounded-full">💬</span>
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-wechat-green text-white flex items-center justify-center text-2xl hover:bg-wechat-green/90 transition shadow-lg hover:shadow-xl active:scale-95"
      >
        {isOpen ? "✕" : "+"}
      </button>
    </div>
  )
}
