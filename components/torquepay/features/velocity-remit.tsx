'use client'

import { useEffect, useState } from 'react'
import { Globe, Zap, Clock, ArrowRight } from 'lucide-react'

export function VelocityRemit() {
  const [countdown, setCountdown] = useState(60)
  const [exchangeRate, setExchangeRate] = useState(109.5)
  const [animateRate, setAnimateRate] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 60))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate live exchange rate updates
  useEffect(() => {
    const rateTimer = setInterval(() => {
      setExchangeRate((prev) => prev + (Math.random() - 0.5) * 0.5)
      setAnimateRate(true)
      setTimeout(() => setAnimateRate(false), 500)
    }, 3000)
    return () => clearInterval(rateTimer)
  }, [])

  const countries = [
    { code: 'USA', name: 'United States', flag: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪' },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  ]

  return (
    <div className="space-y-8">
      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#006a4e] to-[#004a37] p-8 text-white md:p-12">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute h-40 w-40 rounded-full bg-white blur-3xl -top-20 -right-20"></div>
          <div className="absolute h-40 w-40 rounded-full bg-white blur-3xl -bottom-20 -left-20"></div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-yellow-300" />
              <h1 className="text-4xl font-bold">Velocity Remit</h1>
            </div>
            <p className="text-lg text-white/80">Fastest remittance to 60+ countries. Funds arrive instantly.</p>
          </div>

          {/* Countdown Timer & Exchange Rate */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {/* Countdown */}
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
              <p className="text-sm text-white/70 mb-2">Next Fund Arrival</p>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300">{countdown}s</div>
                <p className="text-xs text-white/60 mt-1">Direct to bKash/Nagad</p>
              </div>
            </div>

            {/* Exchange Rate */}
            <div className={`rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20 transition-all ${
              animateRate ? 'scale-105' : 'scale-100'
            }`}>
              <p className="text-sm text-white/70 mb-2">Live Rate (1 USD)</p>
              <div className="text-center">
                <div className="text-3xl font-bold">৳{exchangeRate.toFixed(2)}</div>
                <p className="text-xs text-green-300 mt-1">0% Transparency Fee</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/20 md:col-span-1">
              <p className="text-sm text-white/70 mb-2">Status</p>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm font-semibold">Live</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button className="w-full md:w-auto flex items-center gap-3 bg-yellow-400 text-[#006a4e] font-bold px-8 py-4 rounded-xl hover:bg-yellow-300 transition-all">
            Start Remit Now
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Supported Countries Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Send to 60+ Countries</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {countries.map((country) => (
            <button
              key={country.code}
              className="group rounded-2xl bg-white p-4 shadow-md hover:shadow-lg transition-all hover:scale-105 text-center border border-neutral-200 hover:border-[#006a4e]"
            >
              <div className="text-4xl mb-2">{country.flag}</div>
              <div className="text-sm font-semibold text-neutral-900 group-hover:text-[#006a4e]">
                {country.code}
              </div>
              <div className="text-xs text-neutral-500">{country.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Mastercard Move Logic Explanation */}
      <div className="rounded-2xl bg-neutral-50 p-8 border border-neutral-200">
        <h3 className="text-lg font-bold text-neutral-900 mb-4">How Velocity Remit Works</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#006a4e] text-white font-bold">
              1
            </div>
            <h4 className="font-semibold text-neutral-900">Send via Mastercard</h4>
            <p className="text-sm text-neutral-600">
              Use your Mastercard, bKash, or Nagad to initiate remittance
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#006a4e] text-white font-bold">
              2
            </div>
            <h4 className="font-semibold text-neutral-900">Move Logic Routes</h4>
            <p className="text-sm text-neutral-600">
              Funds are routed via Mastercard Move for instant settlement
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#006a4e] text-white font-bold">
              3
            </div>
            <h4 className="font-semibold text-neutral-900">Instant Arrival</h4>
            <p className="text-sm text-neutral-600">
              Recipient receives funds in their bKash/Nagad wallet instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
