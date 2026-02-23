'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { MerchantDashboardOverview } from '@/components/merchant/dashboard-overview'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function MerchantPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        setUser(user)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#006a4e]/20 border-t-[#006a4e] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading merchant dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#006a4e]">Merchant Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Account: {user?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Transactions', value: '2,543', icon: '📊' },
            { label: 'Monthly Volume', value: '$125,450', icon: '💵' },
            { label: 'Settlement Balance', value: '$45,230', icon: '🏦' },
            { label: 'Success Rate', value: '99.8%', icon: '✅' },
          ].map((stat, i) => (
            <Card key={i} className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#006a4e] mt-2">{stat.value}</p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 border-0 shadow-lg">
          <MerchantDashboardOverview
            transactions={2543}
            volume={125450}
            settlementBalance={45230}
            pendingSettlement={5200}
            recentPayments={[]}
          />
        </Card>
      </main>
    </div>
  )
}
