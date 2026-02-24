'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Lock, CheckCircle } from 'lucide-react'

export default function TransactionPINPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [pinSet, setPinSet] = useState(false)
  const [mode, setMode] = useState<'view' | 'set' | 'change'>('view')
  const [formData, setFormData] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile?.user_type !== 'user') {
          router.push('/dashboard')
          return
        }

        const { data: walletData } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .single()

        setUser(user)
        setWallet(walletData)
        setPinSet(walletData?.pin_set || false)
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load wallet data')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.newPin || !formData.confirmPin) {
      toast.error('Please enter PIN and confirm PIN')
      return
    }

    if (formData.newPin.length !== 4 || !/^\d+$/.test(formData.newPin)) {
      toast.error('PIN must be exactly 4 digits')
      return
    }

    if (formData.newPin !== formData.confirmPin) {
      toast.error('PINs do not match')
      return
    }

    setSubmitting(true)
    try {
      // In a real app, would hash the PIN
      const { error } = await supabase
        .from('wallets')
        .update({
          pin_hash: formData.newPin, // In production, use bcrypt
          pin_set: true,
        })
        .eq('user_id', user.id)

      if (error) throw error

      setPinSet(true)
      setMode('view')
      setFormData({ currentPin: '', newPin: '', confirmPin: '' })
      toast.success('Transaction PIN set successfully')
    } catch (error) {
      console.error('Error setting PIN:', error)
      toast.error('Failed to set PIN')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.currentPin || !formData.newPin || !formData.confirmPin) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.newPin.length !== 4 || !/^\d+$/.test(formData.newPin)) {
      toast.error('New PIN must be exactly 4 digits')
      return
    }

    if (formData.newPin !== formData.confirmPin) {
      toast.error('New PINs do not match')
      return
    }

    if (formData.currentPin === formData.newPin) {
      toast.error('New PIN must be different from current PIN')
      return
    }

    setSubmitting(true)
    try {
      // Verify current PIN
      if (wallet?.pin_hash !== formData.currentPin) {
        toast.error('Current PIN is incorrect')
        return
      }

      const { error } = await supabase
        .from('wallets')
        .update({
          pin_hash: formData.newPin,
        })
        .eq('user_id', user.id)

      if (error) throw error

      setMode('view')
      setFormData({ currentPin: '', newPin: '', confirmPin: '' })
      toast.success('Transaction PIN changed successfully')
    } catch (error) {
      console.error('Error changing PIN:', error)
      toast.error('Failed to change PIN')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#006a4e]/20 border-t-[#006a4e] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Lock className="w-8 h-8 text-[#006a4e]" />
            <div>
              <h1 className="text-2xl font-bold text-[#006a4e]">Transaction PIN</h1>
              <p className="text-sm text-gray-600 mt-1">Secure your transactions with a 4-digit PIN</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <Card className={`p-6 border-0 shadow-md mb-8 ${pinSet ? 'bg-green-50 border-l-4 border-green-400' : 'bg-yellow-50 border-l-4 border-yellow-400'}`}>
          <div className="flex items-center gap-3">
            {pinSet ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Transaction PIN Active</p>
                  <p className="text-sm text-green-700">Your transactions are protected with a PIN</p>
                </div>
              </>
            ) : (
              <>
                <Lock className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-900">No PIN Set</p>
                  <p className="text-sm text-yellow-700">Set up a PIN to protect your transactions</p>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Mode Selection */}
        {mode === 'view' && (
          <Card className="p-6 border-0 shadow-md text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">PIN Management</h2>
            <div className="space-y-3">
              {pinSet ? (
                <>
                  <p className="text-gray-600 mb-4">Your PIN is currently set and protecting your transactions.</p>
                  <Button
                    onClick={() => setMode('change')}
                    className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white"
                  >
                    Change PIN
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">Set up a 4-digit PIN to secure your transactions.</p>
                  <Button
                    onClick={() => setMode('set')}
                    className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white"
                  >
                    Set PIN Now
                  </Button>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Set PIN Form */}
        {mode === 'set' && (
          <form onSubmit={handleSetPin} className="space-y-6">
            <Card className="p-6 border-0 shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Create Transaction PIN</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="newPin">New PIN</Label>
                  <p className="text-xs text-gray-600 mb-2">Must be exactly 4 digits</p>
                  <Input
                    id="newPin"
                    type="password"
                    placeholder="••••"
                    maxLength={4}
                    value={formData.newPin}
                    onChange={(e) => setFormData({ ...formData, newPin: e.target.value })}
                    disabled={submitting}
                    inputMode="numeric"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPin">Confirm PIN</Label>
                  <Input
                    id="confirmPin"
                    type="password"
                    placeholder="••••"
                    maxLength={4}
                    value={formData.confirmPin}
                    onChange={(e) => setFormData({ ...formData, confirmPin: e.target.value })}
                    disabled={submitting}
                    inputMode="numeric"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Remember:</strong> Keep your PIN private. You'll need to enter it to confirm transactions.
                </p>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#006a4e] hover:bg-[#005a3f] text-white"
              >
                {submitting ? 'Setting PIN...' : 'Set PIN'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setMode('view')
                  setFormData({ currentPin: '', newPin: '', confirmPin: '' })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Change PIN Form */}
        {mode === 'change' && (
          <form onSubmit={handleChangePin} className="space-y-6">
            <Card className="p-6 border-0 shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Change Transaction PIN</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPin">Current PIN</Label>
                  <Input
                    id="currentPin"
                    type="password"
                    placeholder="••••"
                    maxLength={4}
                    value={formData.currentPin}
                    onChange={(e) => setFormData({ ...formData, currentPin: e.target.value })}
                    disabled={submitting}
                    inputMode="numeric"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="newPin">New PIN</Label>
                  <p className="text-xs text-gray-600 mb-2">Must be exactly 4 digits and different from current</p>
                  <Input
                    id="newPin"
                    type="password"
                    placeholder="••••"
                    maxLength={4}
                    value={formData.newPin}
                    onChange={(e) => setFormData({ ...formData, newPin: e.target.value })}
                    disabled={submitting}
                    inputMode="numeric"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPin">Confirm New PIN</Label>
                  <Input
                    id="confirmPin"
                    type="password"
                    placeholder="••••"
                    maxLength={4}
                    value={formData.confirmPin}
                    onChange={(e) => setFormData({ ...formData, confirmPin: e.target.value })}
                    disabled={submitting}
                    inputMode="numeric"
                    required
                  />
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#006a4e] hover:bg-[#005a3f] text-white"
              >
                {submitting ? 'Changing PIN...' : 'Change PIN'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setMode('view')
                  setFormData({ currentPin: '', newPin: '', confirmPin: '' })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
