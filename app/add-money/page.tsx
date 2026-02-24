'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

export default function AddMoneyPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('debit-card')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const presetAmounts = [100, 500, 1000, 5000]

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
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load wallet data')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setSubmitting(true)
    try {
      // Simulate payment processing
      // In a real app, this would integrate with a payment gateway
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            transaction_type: 'add_money',
            amount: parseFloat(amount),
            currency: 'USD',
            status: 'completed',
            payment_method: method,
            description: `Added money via ${method}`,
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Update wallet balance
      const newBalance = (wallet?.balance || 0) + parseFloat(amount)
      await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('user_id', user.id)

      toast.success(`$${parseFloat(amount).toFixed(2)} added to your wallet!`)
      setAmount('')
      
      // Refresh wallet
      const { data: walletData } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setWallet(walletData)

      // Redirect after 2 seconds
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (error) {
      console.error('Error adding money:', error)
      toast.error('Failed to add money')
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
            <Plus className="w-8 h-8 text-[#006a4e]" />
            <div>
              <h1 className="text-2xl font-bold text-[#006a4e]">Add Money</h1>
              <p className="text-sm text-gray-600 mt-1">Instantly add funds to your wallet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Balance */}
        <Card className="p-6 border-0 shadow-md mb-8 bg-gradient-to-r from-[#006a4e] to-[#00553d] text-white">
          <p className="text-sm font-medium opacity-90">Current Balance</p>
          <p className="text-3xl font-bold mt-2">${(wallet?.balance || 0).toFixed(2)}</p>
        </Card>

        <form onSubmit={handleAddMoney} className="space-y-6">
          {/* Amount Selection */}
          <Card className="p-6 border-0 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Amount</h2>
            
            <div className="space-y-4">
              {/* Preset Amounts */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Quick Select</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset.toString())}
                      className={`p-3 rounded-lg border-2 font-medium transition ${
                        amount === preset.toString()
                          ? 'border-[#006a4e] bg-[#006a4e]/10 text-[#006a4e]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <Label htmlFor="amount">Custom Amount</Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-8"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6 border-0 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h2>
            
            <RadioGroup value={method} onValueChange={setMethod}>
              <div className="space-y-4">
                {[
                  {
                    id: 'debit-card',
                    name: 'Debit Card',
                    description: 'Visa, Mastercard, or other debit cards',
                  },
                  {
                    id: 'credit-card',
                    name: 'Credit Card',
                    description: 'Visa, Mastercard, or other credit cards',
                  },
                  {
                    id: 'bank-transfer',
                    name: 'Bank Transfer',
                    description: 'Direct transfer from your bank account',
                  },
                  {
                    id: 'mobile-wallet',
                    name: 'Mobile Wallet',
                    description: 'Apple Pay, Google Pay, or similar',
                  },
                ].map((opt) => (
                  <div key={opt.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                    <RadioGroupItem value={opt.id} id={opt.id} />
                    <label htmlFor={opt.id} className="flex-1 cursor-pointer">
                      <p className="font-medium text-gray-800">{opt.name}</p>
                      <p className="text-sm text-gray-600">{opt.description}</p>
                    </label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>

          {/* Summary */}
          {amount && parseFloat(amount) > 0 && (
            <Card className="p-6 border-0 shadow-md bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium text-gray-800">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee</span>
                  <span className="font-medium text-gray-800">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-800">You'll receive</span>
                  <span className="font-bold text-[#006a4e] text-lg">${parseFloat(amount).toFixed(2)}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Info Box */}
          <Card className="p-4 border-0 shadow-md bg-blue-50 border-l-4 border-blue-400">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> This is a simulated payment. In a production environment, you would be redirected to a secure payment gateway.
            </p>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={submitting || !amount || parseFloat(amount) <= 0}
              className="flex-1 bg-[#006a4e] hover:bg-[#005a3f] text-white"
            >
              {submitting ? 'Processing...' : 'Add Money'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
