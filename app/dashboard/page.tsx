'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/torquepay/layout/app-header'
import { VelocityRemit } from '@/components/torquepay/features/velocity-remit'
import { SmartCheckout } from '@/components/torquepay/features/smart-checkout'
import { EducationPayments } from '@/components/torquepay/features/education-payments'
import { TorqueShield } from '@/components/torquepay/features/torque-shield'
import { TorqueCopilot } from '@/components/torquepay/features/torque-copilot'

type Feature = 'remit' | 'checkout' | 'education' | 'shield' | 'copilot'

export default function DashboardPage() {
  const [activeFeature, setActiveFeature] = useState<Feature>('remit')

  const features = [
    { id: 'remit', label: 'Velocity Remit', icon: '🌍' },
    { id: 'checkout', label: 'Smart Checkout', icon: '💳' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'shield', label: 'TorqueShield', icon: '🛡️' },
    { id: 'copilot', label: 'Copilot', icon: '🤖' },
  ] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Feature Navigation */}
        <div className="mb-12 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeFeature === feature.id
                    ? 'bg-[#006a4e] text-white shadow-lg'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:border-[#006a4e]'
                }`}
              >
                <span className="text-xl">{feature.icon}</span>
                {feature.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Content */}
        <div className="rounded-3xl bg-white shadow-xl p-8 md:p-12">
          {activeFeature === 'remit' && <VelocityRemit />}
          {activeFeature === 'checkout' && <SmartCheckout />}
          {activeFeature === 'education' && <EducationPayments />}
          {activeFeature === 'shield' && <TorqueShield />}
          {activeFeature === 'copilot' && <TorqueCopilot />}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-neutral-600">
          <p>© 2026 TorquePay Bangladesh. All transactions are secured with enterprise-grade encryption.</p>
        </div>
      </main>
    </div>
  )
}
