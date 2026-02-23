"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import QRCodeGenerator from "./qr-code-generator"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  type: "send" | "request"
  onConfirm: (amount: string, recipient: string) => void
}

export default function PaymentModal({ isOpen, onClose, type, onConfirm }: PaymentModalProps) {
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [step, setStep] = useState<"form" | "confirm">("form")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50 animate-in fade-in duration-300">
      <div className="w-full bg-background rounded-t-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">{type === "send" ? "Send Money" : "Request Money"}</h2>
          <button onClick={onClose} className="text-2xl text-muted-foreground hover:text-foreground transition">
            ✕
          </button>
        </div>

        {step === "form" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {type === "send" ? "Send to" : "Request from"}
              </label>
              <Input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter name or phone number"
                className="rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
              <div className="flex gap-2">
                <span className="flex items-center px-4 bg-muted rounded-lg text-foreground font-semibold">$</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="rounded-lg"
                />
              </div>
            </div>

            <Button
              onClick={() => setStep("confirm")}
              disabled={!amount || !recipient}
              className="w-full bg-wechat-green hover:bg-wechat-green/90 text-white rounded-full h-12 font-semibold"
            >
              Continue
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">{type === "send" ? "Sending to" : "Requesting from"}</p>
              <p className="font-semibold text-foreground">{recipient}</p>
              <p className="text-2xl font-bold text-wechat-green mt-2">${amount}</p>
            </div>

            <QRCodeGenerator value={`${type}://payment?to=${recipient}&amount=${amount}`} type="payment" />

            <div className="flex gap-2">
              <Button onClick={() => setStep("form")} variant="outline" className="flex-1 rounded-full h-12">
                Back
              </Button>
              <Button
                onClick={() => {
                  onConfirm(amount, recipient)
                  onClose()
                }}
                className="flex-1 bg-wechat-green hover:bg-wechat-green/90 text-white rounded-full h-12 font-semibold"
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
