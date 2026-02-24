'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { Transaction } from '@/types/database'
import { formatCurrency } from '@/lib/utils/format'
import { Download } from 'lucide-react'

export default function MerchantTransactionsPage() {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [user, setUser] = useState<any>(null)
  const [merchant, setMerchant] = useState<any>(null)
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    searchId: '',
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

        if (profile?.user_type !== 'merchant') {
          router.push('/dashboard')
          return
        }

        const { data: merchantData } = await supabase
          .from('merchants')
          .select('*')
          .eq('user_id', user.id)
          .single()

        setUser(user)
        setMerchant(merchantData)

        // Fetch transactions for this merchant
        const query = supabase
          .from('transactions')
          .select('*')
          .eq('merchant_id', merchantData?.id)
          .order('created_at', { ascending: false })

        const { data: txns } = await query

        setTransactions(txns || [])
      } catch (error) {
        console.error('Error loading transactions:', error)
        toast.error('Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  const filteredTransactions = transactions.filter((tx) => {
    if (filters.status !== 'all' && tx.status !== filters.status) return false
    if (filters.searchId && !tx.id.includes(filters.searchId)) return false
    return true
  })

  const stats = {
    total: transactions.length,
    completed: transactions.filter((t) => t.status === 'completed').length,
    pending: transactions.filter((t) => t.status === 'pending').length,
    volume: transactions
      .filter((t) => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
  }

  const handleExport = () => {
    const csv = [
      ['Transaction ID', 'Date', 'Amount', 'Currency', 'Status', 'Description'],
      ...filteredTransactions.map((tx) => [
        tx.id,
        new Date(tx.created_at).toLocaleDateString(),
        tx.amount.toString(),
        tx.currency,
        tx.status,
        tx.description || '',
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Transactions exported')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#006a4e]/20 border-t-[#006a4e] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-[#006a4e]">Transactions</h1>
          <p className="text-sm text-gray-600 mt-1">View and manage all your payment transactions</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Transactions', value: stats.total, icon: '📊' },
            { label: 'Completed', value: stats.completed, icon: '✅' },
            { label: 'Pending', value: stats.pending, icon: '⏳' },
            { label: 'Total Volume', value: formatCurrency(stats.volume), icon: '💰' },
          ].map((stat, i) => (
            <Card key={i} className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-[#006a4e] mt-2">{stat.value}</p>
              <p className="text-lg mt-2">{stat.icon}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-6 border-0 shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="searchId">Transaction ID</Label>
              <Input
                id="searchId"
                placeholder="Search by ID..."
                value={filters.searchId}
                onChange={(e) => setFilters({ ...filters, searchId: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => setFilters({ status: 'all', dateFrom: '', dateTo: '', searchId: '' })}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleExport}
                className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card className="border-0 shadow-md overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">No transactions found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-[#006a4e] font-semibold">Transaction ID</TableHead>
                    <TableHead className="text-[#006a4e] font-semibold">Date</TableHead>
                    <TableHead className="text-[#006a4e] font-semibold text-right">Amount</TableHead>
                    <TableHead className="text-[#006a4e] font-semibold">Type</TableHead>
                    <TableHead className="text-[#006a4e] font-semibold">Status</TableHead>
                    <TableHead className="text-[#006a4e] font-semibold">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-gray-50 transition">
                      <TableCell className="font-mono text-sm text-gray-700">{tx.id.slice(0, 8)}...</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-gray-800">
                        {formatCurrency(tx.amount)}
                      </TableCell>
                      <TableCell className="text-sm capitalize text-gray-700">{tx.transaction_type}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          tx.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : tx.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : tx.status === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                        {tx.description || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
