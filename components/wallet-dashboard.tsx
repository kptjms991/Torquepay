"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import QRCodeGenerator from "./qr-code-generator"
import { WalletSkeleton } from "./skeleton-loader"

interface Transaction {
  id: string
  type: "receive" | "send"
  amount: number
  contact: string
  time: string
  status: "completed" | "pending"
}

export default function WalletDashboard() {
  const [balance, setBalance] = useState(2450.75)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [sendAmount, setSendAmount] = useState("")
  const [sendRecipient, setSendRecipient] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "receive",
      amount: 100,
      contact: "Bob Smith",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: "2",
      type: "send",
      amount: 50,
      contact: "Alice Chen",
      time: "1 day ago",
      status: "completed",
    },
    {
      id: "3",
      type: "receive",
      amount: 250,
      contact: "Design Team",
      time: "2 days ago",
      status: "completed",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMoney = () => {
    if (!sendAmount || !sendRecipient) return

    const amount = Number.parseFloat(sendAmount)
    if (amount > balance) {
      alert("Insufficient balance")
      return
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "send",
      amount,
      contact: sendRecipient,
      time: "just now",
      status: "completed",
    }

    setBalance(balance - amount)
    setTransactions([newTransaction, ...transactions])
    setSendAmount("")
    setSendRecipient("")
    setShowSendModal(false)
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-md p-4">
        <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <WalletSkeleton />
        ) : (
          <>
            {/* Balance Card */}
            <div
              className="bg-gradient-to-br from-wechat-green via-wechat-green/90 to-wechat-green/80 text-white border-0 p-6 rounded-3xl shadow-lg"
              role="region"
              aria-label="Wallet balance"
            >
              <p className="text-sm opacity-90 mb-2 font-medium">Available Balance</p>
              <h2 className="text-5xl font-bold mb-6">${balance.toFixed(2)}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSendModal(true)}
                  aria-label="Send money"
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium backdrop-blur-sm border border-white/30 min-h-11 transition active:scale-95"
                >
                  💳 Send Money
                </button>
                <button
                  onClick={() => setShowReceiveModal(true)}
                  aria-label="Receive money"
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium backdrop-blur-sm border border-white/30 min-h-11 transition active:scale-95"
                >
                  📥 Receive
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
              <button className="p-4 rounded-2xl bg-muted hover:bg-muted/80 transition flex flex-col items-center gap-2 active:scale-95 min-h-20 aria-label='Top up'">
                <span className="text-3xl">🏦</span>
                <span className="text-xs font-medium text-foreground text-center">Top Up</span>
              </button>
              <button className="p-4 rounded-2xl bg-muted hover:bg-muted/80 transition flex flex-col items-center gap-2 active:scale-95 min-h-20 aria-label='Transfer'">
                <span className="text-3xl">🔄</span>
                <span className="text-xs font-medium text-foreground text-center">Transfer</span>
              </button>
              <button className="p-4 rounded-2xl bg-muted hover:bg-muted/80 transition flex flex-col items-center gap-2 active:scale-95 min-h-20 aria-label='History'">
                <span className="text-3xl">📊</span>
                <span className="text-xs font-medium text-foreground text-center">History</span>
              </button>
            </div>

            {/* Transactions */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Recent Transactions</h3>
              <div className="space-y-2" role="list">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition bg-card min-h-16"
                    role="listitem"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg flex-shrink-0">
                        {tx.type === "send" ? "📤" : "📥"}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{tx.contact}</p>
                        <p className="text-xs text-muted-foreground">{tx.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold text-sm ${
                          tx.type === "send" ? "text-destructive" : "text-wechat-green"
                        }`}
                      >
                        {tx.type === "send" ? "-" : "+"}${tx.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">{tx.status === "completed" ? "✓" : "Pending"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ... existing modals ... */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-background rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Send Money</h2>
              <button
                onClick={() => setShowSendModal(false)}
                className="text-2xl text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Recipient</label>
                <Input
                  value={sendRecipient}
                  onChange={(e) => setSendRecipient(e.target.value)}
                  placeholder="Enter contact name or phone"
                  className="rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-muted rounded-lg text-foreground">$</span>
                  <Input
                    type="number"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    placeholder="0.00"
                    className="rounded-lg"
                  />
                </div>
              </div>

              <Button
                onClick={handleSendMoney}
                disabled={!sendAmount || !sendRecipient}
                className="w-full bg-wechat-green hover:bg-wechat-green/90 text-white rounded-full h-12 font-semibold mt-6"
              >
                Send Money
              </Button>
            </div>
          </div>
        </div>
      )}

      {showReceiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-background rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Receive Money</h2>
              <button
                onClick={() => setShowReceiveModal(false)}
                className="text-2xl text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <QRCodeGenerator value={`wechat://pay?user=john_doe&amount=0`} type="payment" />

            <p className="text-center text-sm text-muted-foreground">
              Share this QR code with friends to receive money
            </p>

            <Button
              onClick={() => setShowReceiveModal(false)}
              className="w-full bg-wechat-green hover:bg-wechat-green/90 text-white rounded-full h-12 font-semibold"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
