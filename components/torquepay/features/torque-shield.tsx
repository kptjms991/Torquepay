'use client'

import { useState, useEffect } from 'react'
import { Shield, Zap, AlertTriangle, CheckCircle2, Clock, ToggleLeft, ToggleRight, Fingerprint } from 'lucide-react'

interface RiskLog {
  id: string
  timestamp: string
  type: 'success' | 'warning' | 'danger'
  title: string
  description: string
  scanTime: number
}

export function TorqueShield() {
  const [agenticEnabled, setAgenticEnabled] = useState(false)
  const [biometricPrompt, setBiometricPrompt] = useState(false)
  const [riskLogs, setRiskLogs] = useState<RiskLog[]>([
    {
      id: '1',
      timestamp: '2026-02-24 14:32:15',
      type: 'success',
      title: 'Velocity Remit Approved',
      description: 'Transaction to USA verified. No SIM-clone detected.',
      scanTime: 245,
    },
    {
      id: '2',
      timestamp: '2026-02-24 14:15:42',
      type: 'warning',
      title: 'Device Verification Required',
      description: 'Unusual transaction amount. Device fingerprint confirmed.',
      scanTime: 512,
    },
    {
      id: '3',
      timestamp: '2026-02-24 13:48:20',
      type: 'success',
      title: 'Education Payment Safe',
      description: 'Whitelist university detected. Zero fraud indicators.',
      scanTime: 178,
    },
  ])

  // Simulate real-time risk scanning
  useEffect(() => {
    const interval = setInterval(() => {
      setRiskLogs((prev) => [
        {
          id: String(Math.random()),
          timestamp: new Date().toLocaleString(),
          type: ['success', 'warning'][Math.floor(Math.random() * 2)] as 'success' | 'warning',
          title: ['Transaction Safe', 'Extra Verification'][Math.floor(Math.random() * 2)],
          description: `Real-time scanning: South Asian corridor pattern analysis ${Math.random() > 0.5 ? 'passed' : 'flagged'}`,
          scanTime: Math.floor(Math.random() * 500) + 100,
        },
        ...prev.slice(0, 4),
      ])
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-neutral-900 flex items-center gap-3">
          <Shield className="h-10 w-10 text-[#006a4e]" />
          TorqueShield
        </h1>
        <p className="text-lg text-neutral-600">
          Enterprise-grade security with Antom Shield-style risk scanning targeting South Asian fraud patterns.
        </p>
      </div>

      {/* Agentic Payment Toggle */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Agentic Payments</h2>
            <p className="text-neutral-600">
              Allow AI agent to autonomously pay utility bills with your pre-approved limits.
            </p>
          </div>
          <button
            onClick={() => setAgenticEnabled(!agenticEnabled)}
            className="flex-shrink-0 mt-2"
          >
            {agenticEnabled ? (
              <ToggleRight className="h-8 w-8 text-green-500" />
            ) : (
              <ToggleLeft className="h-8 w-8 text-neutral-400" />
            )}
          </button>
        </div>

        {agenticEnabled && (
          <div className="space-y-4 pt-6 border-t border-indigo-200">
            <h3 className="font-semibold text-neutral-900">Approved Utilities</h3>
            <div className="grid gap-3">
              {[
                { name: 'DESCO (Dhaka Power)', monthly: 5000 },
                { name: 'WASA (Water Supply)', monthly: 2000 },
                { name: 'Titas Gas', monthly: 3000 },
              ].map((utility) => (
                <div
                  key={utility.name}
                  className="flex items-center justify-between rounded-xl bg-white/60 backdrop-blur-sm p-4 border border-white/40"
                >
                  <div>
                    <p className="font-semibold text-neutral-900">{utility.name}</p>
                    <p className="text-sm text-neutral-600">
                      Auto-pay limit: ৳{utility.monthly.toLocaleString()}/month
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Biometric Authentication */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200 p-8">
        <div className="flex items-start gap-4">
          <Fingerprint className="h-8 w-8 text-emerald-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-neutral-900 mb-3">Biometric Confirmation</h3>
            <p className="text-neutral-600 mb-6">
              Secure all payments over ৳10,000 with FaceID or Fingerprint authentication.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 hover:border-emerald-300 transition-all text-center">
                <div className="text-3xl mb-2">👤</div>
                <p className="font-semibold text-neutral-900 text-sm">Face ID</p>
              </button>
              <button className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 hover:border-emerald-300 transition-all text-center">
                <div className="text-3xl mb-2">👆</div>
                <p className="font-semibold text-neutral-900 text-sm">Fingerprint</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Risk Logs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">Real-Time Risk Scanning</h2>
          <div className="flex items-center gap-2 text-green-600">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-semibold">Live</span>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {riskLogs.map((log) => (
            <div
              key={log.id}
              className={`rounded-xl p-4 border backdrop-blur-sm ${
                log.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : log.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {log.type === 'success' && (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                )}
                {log.type === 'warning' && (
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                )}
                {log.type === 'danger' && (
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p
                        className={`font-semibold ${
                          log.type === 'success'
                            ? 'text-green-900'
                            : log.type === 'warning'
                            ? 'text-yellow-900'
                            : 'text-red-900'
                        }`}
                      >
                        {log.title}
                      </p>
                      <p className="text-sm text-neutral-600 mt-1">{log.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-neutral-500">{log.timestamp}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-neutral-600">
                        <Zap className="h-3 w-3" />
                        {log.scanTime}ms
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Info */}
      <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-6 space-y-4">
        <h3 className="font-bold text-neutral-900">South Asian Fraud Detection</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-neutral-700">SIM-Clone Detection</p>
            <p className="text-xs text-neutral-600">
              Identifies compromised SIM cards used in Bangladesh corridor fraud
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-neutral-700">Device Fingerprinting</p>
            <p className="text-xs text-neutral-600">
              Tracks device consistency to prevent unauthorized access patterns
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-neutral-700">Behavioral Analytics</p>
            <p className="text-xs text-neutral-600">
              Machine learning models trained on regional transaction patterns
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
