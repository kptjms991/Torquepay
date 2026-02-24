'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { mfsService } from '@/lib/services/mfs-service'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ArrowRight, Search } from 'lucide-react'

interface Recipient {
  id: string
  full_name: string
  phone: string
  avatar_url: string | null
}

export default function SendMoneyPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [searchResults, setSearchResults] = useState<Recipient[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
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
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load wallet data')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim() || query.length < 2) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      // Search by name or phone
      const { data: results } = await supabase
        .from('profiles')
        .select('id, full_name, phone, avatar_url')
        .or(`full_name.ilike.%${query}%,phone.ilike.%${query}%`)
        .neq('id', user?.id)
        .limit(10)

      setSearchResults((results || []) as Recipient[])
    } catch (error) {
      console.error('Error searching:', error)
      toast.error('Search failed')
    } finally {
      setSearching(false)
    }
  }

  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRecipient) {
      toast.error('Please select a recipient')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (parseFloat(amount) > (wallet?.balance || 0)) {
      toast.error('Insufficient balance')
      return
    }

    setSubmitting(true)
    try {
      await mfsService.sendMoney(user.id, selectedRecipient.id, parseFloat(amount), description)
      toast.success('Money sent successfully!')
      
      // Reset form
      setAmount('')
      setDescription('')
      setSelectedRecipient(null)
      setSearchQuery('')
      setSearchResults([])

      // Refresh wallet balance
      const { data: walletData } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setWallet(walletData)

      // Redirect to dashboard after 2 seconds
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (error) {
      console.error('Error sending money:', error)
      toast.error('Failed to send money')
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
            <ArrowRight className="w-8 h-8 text-[#006a4e]" />
            <div>
              <h1 className="text-2xl font-bold text-[#006a4e]">Send Money</h1>
              <p className="text-sm text-gray-600 mt-1">Transfer funds to another user</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Card */}
        <Card className="p-6 border-0 shadow-md mb-8 bg-gradient-to-r from-[#006a4e] to-[#00553d] text-white">
          <p className="text-sm font-medium opacity-90">Available Balance</p>
          <p className="text-3xl font-bold mt-2">${(wallet?.balance || 0).toFixed(2)}</p>
        </Card>

        <form onSubmit={handleSendMoney} className="space-y-6">
          {/* Recipient Selection */}
          <Card className="p-6 border-0 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Recipient</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">Search by Name or Phone</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="John Doe or +1234567890"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              {selectedRecipient ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{selectedRecipient.full_name}</p>
                    <p className="text-sm text-gray-600">{selectedRecipient.phone}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setSelectedRecipient(null)
                      setSearchQuery('')
                      setSearchResults([])
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <>
                  {searching && (
                    <p className="text-sm text-gray-500 text-center py-4">Searching...</p>
                  )}
                  {searchResults.length > 0 && (
                    <div className="space-y-2">
                      {searchResults.map((recipient) => (
                        <button
                          key={recipient.id}
                          type="button"
                          onClick={() => setSelectedRecipient(recipient)}
                          className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left"
                        >
                          <p className="font-medium text-gray-800">{recipient.full_name}</p>
                          <p className="text-sm text-gray-600">{recipient.phone}</p>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchQuery && searchResults.length === 0 && !searching && (
                    <p className="text-sm text-gray-500 text-center py-4">No users found</p>
                  )}
                </>
              )}
            </div>
          </Card>

          {selectedRecipient && (
            <>
              {/* Amount */}
              <Card className="p-6 border-0 shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Amount</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount to Send</Label>
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
                        required
                      />
                    </div>
                    {amount && (
                      <p className="text-xs text-gray-600 mt-2">
                        You have ${(wallet?.balance || 0).toFixed(2)} available
                        {parseFloat(amount) > (wallet?.balance || 0) && (
                          <span className="text-red-600 ml-2">- Insufficient balance</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Description */}
              <Card className="p-6 border-0 shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Message (Optional)</h2>
                <Textarea
                  placeholder="Add a note about this transfer..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={submitting}
                  rows={3}
                />
              </Card>

              {/* Summary */}
              <Card className="p-6 border-0 shadow-md bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Transfer Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipient</span>
                    <span className="font-medium text-gray-800">{selectedRecipient.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium text-gray-800">${parseFloat(amount || '0').toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="font-bold text-[#006a4e] text-lg">${parseFloat(amount || '0').toFixed(2)}</span>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting || !amount || parseFloat(amount) <= 0}
                  className="flex-1 bg-[#006a4e] hover:bg-[#005a3f] text-white"
                >
                  {submitting ? 'Sending...' : 'Send Money'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </form>
      </main>
    </div>
  )
}
