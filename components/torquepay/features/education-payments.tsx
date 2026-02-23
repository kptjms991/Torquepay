'use client'

import { useState, useMemo } from 'react'
import { Search, Globe, Zap, TrendingUp } from 'lucide-react'

interface University {
  id: string
  name: string
  country: string
  tuition: number
  quota: number
  quotaUsed: number
  region: 'USA' | 'UK' | 'Canada' | 'Australia' | 'Europe' | 'Asia'
}

export function EducationPayments() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  const universities: University[] = [
    {
      id: '1',
      name: 'Harvard University',
      country: 'USA',
      tuition: 60000,
      quota: 150000,
      quotaUsed: 95000,
      region: 'USA',
    },
    {
      id: '2',
      name: 'Oxford University',
      country: 'UK',
      tuition: 45000,
      quota: 150000,
      quotaUsed: 120000,
      region: 'UK',
    },
    {
      id: '3',
      name: 'MIT',
      country: 'USA',
      tuition: 65000,
      quota: 150000,
      quotaUsed: 80000,
      region: 'USA',
    },
    {
      id: '4',
      name: 'Cambridge University',
      country: 'UK',
      tuition: 48000,
      quota: 150000,
      quotaUsed: 130000,
      region: 'UK',
    },
    {
      id: '5',
      name: 'University of Toronto',
      country: 'Canada',
      tuition: 35000,
      quota: 150000,
      quotaUsed: 70000,
      region: 'Canada',
    },
    {
      id: '6',
      name: 'National University of Singapore',
      country: 'Singapore',
      tuition: 28000,
      quota: 150000,
      quotaUsed: 110000,
      region: 'Asia',
    },
  ]

  const regions = ['USA', 'UK', 'Canada', 'Australia', 'Europe', 'Asia']

  const filteredUniversities = useMemo(() => {
    return universities.filter((uni) => {
      const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.country.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRegion = !selectedRegion || uni.region === selectedRegion
      return matchesSearch && matchesRegion
    })
  }, [searchQuery, selectedRegion])

  const userQuotaRemaining = 55000
  const userQuotaTotal = 150000

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-neutral-900">Global Education Payments</h1>
        <p className="text-lg text-neutral-600">
          Pay tuition for 1,000+ universities worldwide. Track your foreign exchange quota in real-time.
        </p>
      </div>

      {/* Quota Status Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#f42a41] to-[#e01f35] p-8 text-white">
        <h3 className="text-lg font-semibold mb-4">Your Annual FX Allowance</h3>
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-white/80 mb-1">Used</p>
              <p className="text-3xl font-bold">৳{(userQuotaTotal - userQuotaRemaining).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80 mb-1">Remaining</p>
              <p className="text-3xl font-bold">৳{userQuotaRemaining.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-yellow-300 transition-all"
              style={{
                width: `${((userQuotaTotal - userQuotaRemaining) / userQuotaTotal) * 100}%`,
              }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <p className="text-white/80">
              {((userQuotaTotal - userQuotaRemaining) / userQuotaTotal * 100).toFixed(1)}% of annual quota used
            </p>
            <p className="text-white/60">Total: ৳{userQuotaTotal.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search university or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#006a4e] placeholder-neutral-400"
          />
        </div>

        {/* Region Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedRegion(null)}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              selectedRegion === null
                ? 'bg-[#006a4e] text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            All Regions
          </button>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                selectedRegion === region
                  ? 'bg-[#006a4e] text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Universities Grid */}
      <div className="grid gap-4">
        {filteredUniversities.map((uni) => {
          const quotaPercentage = (uni.quotaUsed / uni.quota) * 100
          const canPay = userQuotaRemaining >= uni.tuition
          return (
            <div
              key={uni.id}
              className="rounded-2xl border border-neutral-200 p-6 hover:shadow-lg hover:border-[#006a4e] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">{uni.name}</h3>
                  <p className="text-sm text-neutral-600">{uni.country}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-600 mb-1">Tuition Fee</p>
                  <p className="text-2xl font-bold text-[#006a4e]">৳{uni.tuition.toLocaleString()}</p>
                </div>
              </div>

              {/* Quota Status */}
              <div className="mb-4 pb-4 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-neutral-700">Annual Quota Status</p>
                  <p className="text-xs text-neutral-500">
                    {quotaPercentage.toFixed(0)}% filled
                  </p>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      quotaPercentage > 80
                        ? 'bg-[#f42a41]'
                        : quotaPercentage > 50
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${quotaPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={!canPay}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  canPay
                    ? 'bg-[#006a4e] hover:bg-[#005a42] text-white'
                    : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                }`}
              >
                <Zap className="h-5 w-5" />
                {canPay
                  ? `Pay ৳${uni.tuition.toLocaleString()}`
                  : 'Insufficient Quota'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Info Banner */}
      <div className="rounded-2xl bg-blue-50 border border-blue-200 p-6 flex gap-4">
        <Globe className="h-6 w-6 text-blue-600 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-blue-900 mb-1">Foreign Exchange Allowance</h4>
          <p className="text-sm text-blue-800">
            As a resident of Bangladesh, you can remit up to USD equivalent of ৳150,000 annually for
            education. This includes tuition, accommodation, and other approved expenses.
          </p>
        </div>
      </div>
    </div>
  )
}
