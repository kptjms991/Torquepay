'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { PaymentToken } from '@/types/database'
import { CreditCard, Plus, Trash2, CheckCircle } from 'lucide-react'

export default function PaymentMethodsPage() {
  const [loading, setLoading] = useState(true)
  const [paymentTokens, setPaymentTokens] = useState<PaymentToken[]>([])
  const [user, setUser] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: 'card' as 'card' | 'mobile_wallet' | 'bank',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  })
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

        setUser(user)

        // Fetch payment tokens
        const { data: tokens } = await supabase
          .from('payment_tokens')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        setPaymentTokens(tokens || [])
      } catch (error) {
        console.error('Error loading payment methods:', error)
        toast.error('Failed to load payment methods')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  const handleAddToken = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.cardNumber || !formData.cardName) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      // Mask card number - show only last 4 digits
      const lastFour = formData.cardNumber.slice(-4)
      
      const { data, error } = await supabase
        .from('payment_tokens')
        .insert([
          {
            user_id: user.id,
            token_type: formData.type,
            token_value: formData.cardNumber, // In real app, would be tokenized by payment gateway
            last_four: lastFour,
            is_active: true,
            is_default: paymentTokens.length === 0,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setPaymentTokens([data, ...paymentTokens])
      setFormData({
        type: 'card',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
      })
      setDialogOpen(false)
      toast.success('Payment method added successfully')
    } catch (error) {
      console.error('Error adding payment method:', error)
      toast.error('Failed to add payment method')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSetDefault = async (tokenId: string) => {
    try {
      // Set all to non-default
      await supabase
        .from('payment_tokens')
        .update({ is_default: false })
        .eq('user_id', user.id)

      // Set selected as default
      await supabase
        .from('payment_tokens')
        .update({ is_default: true })
        .eq('id', tokenId)

      // Update state
      setPaymentTokens(
        paymentTokens.map((t) => ({
          ...t,
          is_default: t.id === tokenId,
        }))
      )
      toast.success('Default payment method updated')
    } catch (error) {
      console.error('Error updating default:', error)
      toast.error('Failed to update default method')
    }
  }

  const handleDeleteToken = async (tokenId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return

    try {
      await supabase
        .from('payment_tokens')
        .delete()
        .eq('id', tokenId)

      setPaymentTokens(paymentTokens.filter((t) => t.id !== tokenId))
      toast.success('Payment method deleted')
    } catch (error) {
      console.error('Error deleting payment method:', error)
      toast.error('Failed to delete payment method')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#006a4e]/20 border-t-[#006a4e] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading payment methods...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-[#006a4e]" />
            <div>
              <h1 className="text-2xl font-bold text-[#006a4e]">Payment Methods</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your saved cards and wallets</p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#006a4e] hover:bg-[#005a3f] text-white gap-2">
                <Plus className="w-4 h-4" />
                Add Method
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddToken} className="space-y-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="mobile_wallet">Mobile Wallet</SelectItem>
                      <SelectItem value="bank">Bank Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === 'card' && (
                  <>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={formData.cardName}
                        onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\s/g, '') })}
                        disabled={submitting}
                        maxLength={16}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                          disabled={submitting}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          value={formData.cvv}
                          onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                          disabled={submitting}
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white"
                >
                  {submitting ? 'Adding...' : 'Add Payment Method'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {paymentTokens.length === 0 ? (
          <Card className="p-12 text-center border-0 shadow-md">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Payment Methods</h3>
            <p className="text-gray-600 mb-6">Add a payment method to get started</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#006a4e] hover:bg-[#005a3f] text-white gap-2">
                  <Plus className="w-4 h-4" />
                  Add Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddToken} className="space-y-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="mobile_wallet">Mobile Wallet</SelectItem>
                        <SelectItem value="bank">Bank Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.type === 'card' && (
                    <>
                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={formData.cardName}
                          onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                          disabled={submitting}
                        />
                      </div>

                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\s/g, '') })}
                          disabled={submitting}
                          maxLength={16}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            disabled={submitting}
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            value={formData.cvv}
                            onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                            disabled={submitting}
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white"
                  >
                    {submitting ? 'Adding...' : 'Add Payment Method'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </Card>
        ) : (
          <div className="space-y-4">
            {paymentTokens.map((token) => (
              <Card key={token.id} className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <CreditCard className="w-6 h-6 text-[#006a4e]" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {token.token_type === 'card' && '•••• ' + token.last_four}
                          {token.token_type === 'mobile_wallet' && 'Mobile Wallet - ' + token.last_four}
                          {token.token_type === 'bank' && 'Bank Account - ' + token.last_four}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">{token.token_type}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {token.is_default && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                          <CheckCircle className="w-3 h-3" />
                          Default
                        </span>
                      )}
                      {!token.is_active && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {!token.is_default && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetDefault(token.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <button
                      onClick={() => handleDeleteToken(token.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
