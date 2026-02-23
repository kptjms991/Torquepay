'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { WalletDashboard } from '@/components/mfs/wallet-dashboard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function WalletPage() {
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
          <p className="text-gray-600">Loading wallet...</p>
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
            <h1 className="text-2xl font-bold text-[#006a4e]">My Wallet</h1>
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
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Card */}
        <Card className="p-8 border-0 shadow-lg bg-gradient-to-br from-[#006a4e] to-[#004a37] text-white mb-8 rounded-3xl">
          <p className="text-sm font-medium text-white/80">Total Balance</p>
          <h2 className="text-5xl font-bold mt-2">$5,234.50</h2>
          <p className="text-white/80 mt-4">Last updated: Just now</p>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: 'Send Money', icon: '📤' },
            { label: 'Add Funds', icon: '➕' },
            { label: 'Scan QR', icon: '📱' },
            { label: 'History', icon: '📋' },
          ].map((action, i) => (
            <Card
              key={i}
              className="p-6 border-0 shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105"
            >
              <div className="text-center">
                <span className="text-4xl">{action.icon}</span>
                <p className="text-sm font-medium text-gray-700 mt-3">{action.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Wallet Component */}
        <Card className="p-8 border-0 shadow-lg">
          <WalletDashboard
            balance={5234.50}
            currency="USD"
            recentTransactions={[]}
            onSendMoney={() => console.log('Send money')}
            onAddMoney={() => console.log('Add money')}
            onScanQR={() => console.log('Scan QR')}
          />
        </Card>
      </main>
    </div>
  )
}
