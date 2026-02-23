'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthConfigured } from '@/lib/supabase/auth'
import { supabase } from '@/lib/supabase/client'
import { AdminDashboard } from '@/components/admin/dashboard'
import { Card } from '@/components/ui/card'

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [authAvailable, setAuthAvailable] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const hasAuth = isAuthConfigured()
        setAuthAvailable(hasAuth)

        if (!hasAuth) {
          // Allow demo access to admin panel without auth
          setIsAdmin(true)
          setUser({ email: 'Demo Admin (No Auth)', id: 'demo' })
          setLoading(false)
          return
        }

        if (!supabase) {
          setLoading(false)
          return
        }

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        const isAdminUser = user.user_metadata?.role === 'admin' || user.email === 'kptjms991@gmail.com'

        if (!isAdminUser) {
          router.push('/dashboard')
          return
        }

        setUser(user)
        setIsAdmin(true)
      } catch (error) {
        console.warn('Auth check failed:', error)
        // Allow demo mode without authentication
        setIsAdmin(true)
        setUser({ email: 'Demo Admin', id: 'demo' })
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [router])

  const handleLogout = async () => {
    if (authAvailable && supabase) {
      await supabase.auth.signOut()
    }
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#006a4e]/20 border-t-[#006a4e] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Auth Warning Banner */}
      {!authAvailable && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Supabase not configured. Running in demo mode with full admin access. Configure environment variables for production.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold torquepay-text-primary">TorquePay Admin</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome, {user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: '1,234', icon: '👥' },
            { label: 'Active Merchants', value: '456', icon: '🏪' },
            { label: 'Total Volume', value: '$12.5M', icon: '💰' },
            { label: 'Open Disputes', value: '23', icon: '⚠️' },
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
          <AdminDashboard
            totalUsers={1234}
            activeMerchants={456}
            totalVolume={12500000}
            openDisputes={23}
            recentTransactions={[]}
          />
        </Card>
      </main>
    </div>
  )
}
