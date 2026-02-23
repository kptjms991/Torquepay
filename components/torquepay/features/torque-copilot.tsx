'use client'

import { useState } from 'react'
import { Send, MessageCircle, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export function TorqueCopilot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m Torque Copilot. I can help you manage chargebacks, disputes, and real-time settlement analytics. How can I assist you today?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: String(Date.now() + 1),
        type: 'ai',
        content: `I understand you mentioned "${input}". Let me help you with that. I can analyze your recent transactions and provide recommendations for managing chargebacks.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 500)

    setInput('')
  }

  // Settlement data
  const settlementData = [
    { day: 'Mon', amount: 125000, status: 'completed' },
    { day: 'Tue', amount: 145000, status: 'completed' },
    { day: 'Wed', amount: 98000, status: 'completed' },
    { day: 'Thu', amount: 167000, status: 'completed' },
    { day: 'Fri', amount: 189000, status: 'in-progress' },
    { day: 'Sat', amount: 156000, status: 'pending' },
    { day: 'Sun', amount: 142000, status: 'pending' },
  ]

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Left: Copilot Chat */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-neutral-900 flex items-center gap-3">
            <MessageCircle className="h-10 w-10 text-[#006a4e]" />
            Torque Copilot
          </h1>
          <p className="text-lg text-neutral-600">
            AI-powered merchant assistant for dispute management and real-time settlement insights.
          </p>
        </div>

        {/* Chat Container */}
        <div className="rounded-3xl border border-neutral-200 bg-white overflow-hidden flex flex-col h-96">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-[#006a4e] text-white rounded-br-none'
                      : 'bg-white border border-neutral-200 text-neutral-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-neutral-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-neutral-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about chargebacks, disputes, or settlements..."
                className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#006a4e] placeholder-neutral-400 text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 rounded-lg bg-[#006a4e] hover:bg-[#005a42] text-white transition-all"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-neutral-700">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              'Show chargeback trends',
              'Analyze dispute patterns',
              'Settlement forecast',
              'Risk assessment',
            ].map((action) => (
              <button
                key={action}
                onClick={() => setInput(action)}
                className="px-4 py-2 rounded-lg border border-neutral-300 hover:border-[#006a4e] hover:bg-[#006a4e]/5 text-sm font-medium text-neutral-700 transition-all text-left"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Settlement Dashboard */}
      <div className="space-y-6">
        {/* Settlement Status */}
        <div className="rounded-2xl bg-gradient-to-br from-[#006a4e] to-[#004a37] p-6 text-white space-y-4">
          <h3 className="text-lg font-bold">T+0 Settlement Status</h3>

          <div className="space-y-3">
            {[
              { status: 'Completed', count: 4, color: 'green' },
              { status: 'In Progress', count: 1, color: 'blue' },
              { status: 'Pending', count: 2, color: 'yellow' },
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <p className="text-sm text-white/80">{item.status}</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      item.color === 'green'
                        ? 'bg-green-400'
                        : item.color === 'blue'
                        ? 'bg-blue-400'
                        : 'bg-yellow-400'
                    }`}
                  ></div>
                  <span className="font-bold">{item.count}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/20">
            <p className="text-xs text-white/70 mb-1">Weekly Volume</p>
            <p className="text-2xl font-bold">৳1.12M</p>
          </div>
        </div>

        {/* Dispute Management */}
        <div className="rounded-2xl bg-white border border-neutral-200 p-6 space-y-4">
          <h3 className="font-bold text-neutral-900">Recent Disputes</h3>

          <div className="space-y-3">
            {[
              { id: 'CHB-001', amount: 25000, status: 'resolved', icon: CheckCircle2, color: 'green' },
              { id: 'CHB-002', amount: 15000, status: 'pending', icon: Clock, color: 'yellow' },
              { id: 'CHB-003', amount: 8000, status: 'investigating', icon: AlertCircle, color: 'red' },
            ].map((dispute) => {
              const Icon = dispute.icon
              return (
                <div key={dispute.id} className="flex items-center gap-3 pb-3 border-b border-neutral-200 last:border-b-0">
                  <Icon className={`h-5 w-5 text-${dispute.color}-500`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900">{dispute.id}</p>
                    <p className="text-xs text-neutral-500">৳{dispute.amount.toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-semibold text-${dispute.color}-600 bg-${dispute.color}-50 px-2 py-1 rounded`}>
                    {dispute.status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Merchant Type Filter */}
        <div className="rounded-2xl bg-white border border-neutral-200 p-6 space-y-4">
          <h3 className="font-bold text-neutral-900">Settlement by Type</h3>

          <div className="space-y-2">
            {['Travel', 'Gaming', 'E-commerce', 'Education'].map((type) => (
              <button
                key={type}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-neutral-100 transition-all text-sm font-medium text-neutral-700"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
