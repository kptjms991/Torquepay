"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface Contact {
  id: string
  name: string
  avatar: string
  status: "online" | "offline"
  paymentHistory: { amount: number; date: string }[]
}

export default function ContactsList() {
  const [contacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Alice Chen",
      avatar: "👩‍💼",
      status: "online",
      paymentHistory: [
        { amount: 50, date: "1 day ago" },
        { amount: 100, date: "1 week ago" },
      ],
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "👨‍💻",
      status: "offline",
      paymentHistory: [{ amount: 25, date: "2 days ago" }],
    },
    {
      id: "3",
      name: "Carol Davis",
      avatar: "👩‍🔬",
      status: "online",
      paymentHistory: [{ amount: 200, date: "Today" }],
    },
  ])

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-md p-4">
        <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {contacts.map((contact) => (
          <div key={contact.id} className="p-4 rounded-2xl bg-muted hover:bg-muted/80 transition space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="text-4xl">{contact.avatar}</span>
                  {contact.status === "online" && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-wechat-green border-2 border-background" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{contact.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {contact.status === "online" ? "Active now" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 rounded-full text-xs bg-transparent">
                📞 Call
              </Button>
              <Button variant="outline" size="sm" className="flex-1 rounded-full text-xs bg-transparent">
                💳 Pay
              </Button>
            </div>

            {/* Payment History */}
            {contact.paymentHistory.length > 0 && (
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs font-medium text-foreground mb-2">Recent Payments</p>
                <div className="space-y-1">
                  {contact.paymentHistory.map((payment, idx) => (
                    <p key={idx} className="text-xs text-muted-foreground flex justify-between">
                      <span>+${payment.amount.toFixed(2)}</span>
                      <span>{payment.date}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
