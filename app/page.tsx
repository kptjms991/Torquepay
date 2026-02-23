"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import ChatInterface from "@/components/chat-interface"
import CallScreen from "@/components/call-screen"
import WalletDashboard from "@/components/wallet-dashboard"
import QRScanner from "@/components/qr-scanner"
import ContactsList from "@/components/contacts-list"
import FloatingActionButton from "@/components/floating-action-button"
import { TabTransition } from "@/components/smooth-transitions"

export default function Page() {
  const [activeTab, setActiveTab] = useState<"chats" | "calls" | "wallet" | "scan" | "contacts">("chats")
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push("/auth/login")
          return
        }

        // Redirect based on user role
        if (user.user_metadata?.role === "admin" || user.email === "kptjms991@gmail.com") {
          router.push("/admin")
          return
        }

        if (user.user_metadata?.role === "merchant") {
          router.push("/merchant")
          return
        }

        setIsLoaded(true)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/auth/login")
      }
    }

    checkAuth()
  }, [router])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-wechat-green/20 border-t-wechat-green animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TabTransition isActive={activeTab === "chats"}>
          <ChatInterface />
        </TabTransition>
        <TabTransition isActive={activeTab === "calls"}>
          <CallScreen />
        </TabTransition>
        <TabTransition isActive={activeTab === "wallet"}>
          <WalletDashboard />
        </TabTransition>
        <TabTransition isActive={activeTab === "scan"}>
          <QRScanner />
        </TabTransition>
        <TabTransition isActive={activeTab === "contacts"}>
          <ContactsList />
        </TabTransition>

        {activeTab === "chats" && <FloatingActionButton onNewChat={() => {}} />}

        <nav className="border-t border-border bg-background/95 backdrop-blur-md">
          <div className="flex h-20 items-center justify-around px-2">
            <NavButton icon="💬" label="Chats" isActive={activeTab === "chats"} onClick={() => setActiveTab("chats")} />
            <NavButton icon="📞" label="Calls" isActive={activeTab === "calls"} onClick={() => setActiveTab("calls")} />
            <NavButton
              icon="💳"
              label="Wallet"
              isActive={activeTab === "wallet"}
              onClick={() => setActiveTab("wallet")}
            />
            <NavButton icon="📱" label="Scan" isActive={activeTab === "scan"} onClick={() => setActiveTab("scan")} />
            <NavButton
              icon="👥"
              label="Contacts"
              isActive={activeTab === "contacts"}
              onClick={() => setActiveTab("contacts")}
            />
          </div>
        </nav>
      </div>
    </div>
  )
}

function NavButton({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: string
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all text-center active:scale-95 min-h-12 min-w-12 ${
        isActive ? "bg-wechat-green/20 text-wechat-green" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
