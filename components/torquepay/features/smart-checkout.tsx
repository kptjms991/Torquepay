'use client'

import { useState } from 'react'
import { CreditCard, Smartphone, QrCode, Check, Lock } from 'lucide-react'

type CheckoutTab = 'mfs' | 'cards' | 'qr'

export function SmartCheckout() {
  const [activeTab, setActiveTab] = useState<CheckoutTab>('mfs')
  const [amount, setAmount] = useState('5000')
  const [showTokenized, setShowTokenized] = useState(false)
  const [selectedToken, setSelectedToken] = useState<string | null>(null)

  const savedTokens = [
    { id: '1', name: 'bKash', last4: '****0123', icon: '📱' },
    { id: '2', name: 'Nagad', last4: '****4567', icon: '📱' },
    { id: '3', name: 'Visa', last4: '****8901', icon: '💳' },
  ]

  const tabs = [
    { id: 'mfs', label: 'MFS', icon: Smartphone },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'qr', label: 'Bangla QR', icon: QrCode },
  ]

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto">
        {/* Checkout Header */}
        <div className="rounded-t-3xl bg-gradient-to-r from-[#006a4e] to-[#004a37] p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Torque One-Link</h2>
          <p className="text-white/80">Smart Checkout - Multiple payment methods in one place</p>
        </div>

        {/* Amount Input */}
        <div className="bg-white p-8 border-b border-neutral-200">
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Amount (BDT)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#006a4e]">৳</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 text-4xl font-bold outline-none text-neutral-900 placeholder-neutral-300"
              placeholder="0"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-0 bg-white px-8 pt-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id as CheckoutTab
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CheckoutTab)}
                className={`flex items-center gap-2 pb-4 px-4 border-b-2 font-semibold transition-all ${
                  isActive
                    ? 'border-[#006a4e] text-[#006a4e]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white p-8 space-y-6">
          {/* MFS Tab */}
          {activeTab === 'mfs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {['bKash', 'Nagad', 'Rocket'].map((mfs) => (
                  <button
                    key={mfs}
                    className="p-4 rounded-2xl border-2 border-neutral-200 hover:border-[#006a4e] hover:bg-[#006a4e]/5 transition-all text-center font-semibold text-neutral-700 hover:text-[#006a4e]"
                  >
                    <div className="text-2xl mb-2">📱</div>
                    {mfs}
                  </button>
                ))}
              </div>
              <p className="text-xs text-neutral-500 text-center">
                Enter your {['bKash', 'Nagad', 'Rocket'][Math.floor(Math.random() * 3)]} number on next screen
              </p>
            </div>
          )}

          {/* Cards Tab */}
          {activeTab === 'cards' && (
            <div className="space-y-4">
              <div className="grid gap-4">
                {['Visa', 'Mastercard', 'American Express'].map((card) => (
                  <button
                    key={card}
                    className="p-4 rounded-2xl border-2 border-neutral-200 hover:border-[#006a4e] hover:bg-[#006a4e]/5 transition-all text-left font-semibold text-neutral-700 hover:text-[#006a4e]"
                  >
                    <div className="flex items-center justify-between">
                      <div>{card}</div>
                      <div className="text-2xl">💳</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QR Tab */}
          {activeTab === 'qr' && (
            <div className="space-y-4 text-center">
              <div className="w-48 h-48 mx-auto rounded-2xl bg-neutral-100 flex items-center justify-center border-4 border-dashed border-neutral-300">
                <div className="text-6xl">📲</div>
              </div>
              <p className="text-sm text-neutral-600">
                Open Bangla QR app and scan the code below, or upload an existing QR code
              </p>
              <button className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold py-3 rounded-xl transition-all">
                Upload QR Code
              </button>
            </div>
          )}

          {/* Tokenized Payment Section */}
          {!showTokenized ? (
            <button
              onClick={() => setShowTokenized(true)}
              className="w-full text-center py-4 text-[#006a4e] font-semibold hover:underline"
            >
              Returning Customer? Use Saved Payment Method
            </button>
          ) : (
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                One-Click Pay with Saved Methods
              </h3>
              <div className="grid gap-3">
                {savedTokens.map((token) => (
                  <button
                    key={token.id}
                    onClick={() => setSelectedToken(token.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                      selectedToken === token.id
                        ? 'border-[#006a4e] bg-[#006a4e]/5'
                        : 'border-neutral-200 hover:border-[#006a4e]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{token.icon}</span>
                      <div className="text-left">
                        <p className="font-semibold text-neutral-900">{token.name}</p>
                        <p className="text-xs text-neutral-500">{token.last4}</p>
                      </div>
                    </div>
                    {selectedToken === token.id && (
                      <div className="h-6 w-6 rounded-full bg-[#006a4e] flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {selectedToken && (
                <button className="w-full bg-[#006a4e] hover:bg-[#005a42] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                  <Lock className="h-5 w-5" />
                  Pay ৳{amount} with One-Click
                </button>
              )}
            </div>
          )}
        </div>

        {/* Security Badge */}
        {!showTokenized && (
          <div className="bg-neutral-50 border-t border-neutral-200 p-6 rounded-b-3xl flex items-center justify-center gap-2 text-sm text-neutral-600">
            <Lock className="h-4 w-4 text-green-500" />
            Bank-level encryption. Your data is secure.
          </div>
        )}
      </div>
    </div>
  )
}
