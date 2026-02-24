'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Dispute } from '@/types/database'
import { AlertCircle } from 'lucide-react'

export default function DisputeManagementPage() {
  const [loading, setLoading] = useState(true)
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [user, setUser] = useState<any>(null)
  const [filters, setFilters] = useState({ status: 'all', searchId: '' })
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [resolution, setResolution] = useState('')
  const [newStatus, setNewStatus] = useState('investigating')
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

        if (profile?.user_type !== 'admin') {
          router.push('/dashboard')
          return
        }

        setUser(user)

        const { data: disputeData } = await supabase
          .from('disputes')
          .select('*')
          .order('created_at', { ascending: false })

        setDisputes(disputeData || [])
      } catch (error) {
        console.error('Error loading disputes:', error)
        toast.error('Failed to load disputes')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  const handleUpdateDispute = async () => {
    if (!selectedDispute || !resolution.trim()) {
      toast.error('Please enter resolution notes')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('disputes')
        .update({
          status: newStatus as any,
          resolution_notes: resolution,
          resolved_at: newStatus === 'closed' ? new Date().toISOString() : null,
        })
        .eq('id', selectedDispute.id)

      if (error) throw error

      const updatedDisputes = disputes.map((d) =>
        d.id === selectedDispute.id
          ? {
              ...d,
              status: newStatus as any,
              resolution_notes: resolution,
              resolved_at: newStatus === 'closed' ? new Date().toISOString() : null,
            }
          : d
      )
      setDisputes(updatedDisputes)
      setDialogOpen(false)
      setSelectedDispute(null)
      setResolution('')
      setNewStatus('investigating')
      toast.success('Dispute updated successfully')
    } catch (error) {
      console.error('Error updating dispute:', error)
      toast.error('Failed to update dispute')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredDisputes = disputes.filter((d) => {
    if (filters.status !== 'all' && d.status !== filters.status) return false
    if (filters.searchId && !d.id.includes(filters.searchId)) return false
    return true
  })

  const stats = {
    total: disputes.length,
    open: disputes.filter((d) => d.status === 'open').length,
    investigating: disputes.filter((d) => d.status === 'investigating').length,
    resolved: disputes.filter((d) => d.status === 'resolved').length,
    closed: disputes.filter((d) => d.status === 'closed').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#006a4e]/20 border-t-[#006a4e] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading disputes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-[#006a4e]">Dispute Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and resolve customer disputes</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Disputes', value: stats.total, icon: '⚠️' },
            { label: 'Open', value: stats.open, icon: '🔴' },
            { label: 'Investigating', value: stats.investigating, icon: '🔍' },
            { label: 'Resolved', value: stats.resolved, icon: '✅' },
            { label: 'Closed', value: stats.closed, icon: '✔️' },
          ].map((stat, i) => (
            <Card key={i} className="p-4 border-0 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-gray-600 text-xs font-medium">{stat.label}</p>
              <p className="text-xl font-bold text-[#006a4e] mt-2">{stat.value}</p>
              <p className="text-lg mt-2">{stat.icon}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-6 border-0 shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="searchId">Dispute ID</Label>
              <Input
                id="searchId"
                placeholder="Search..."
                value={filters.searchId}
                onChange={(e) => setFilters({ ...filters, searchId: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => setFilters({ status: 'all', searchId: '' })}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Disputes Table */}
        <Card className="border-0 shadow-md overflow-hidden">
          {filteredDisputes.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No disputes found</p>
              <p className="text-sm text-gray-500">Good news! All disputes have been resolved.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-[#006a4e] font-semibold">Dispute ID</TableHead>
                    <TableHead className="text-[#006a4e] font-semibold">Transaction</TableHead>
                    <TableHead className="text-[#006a4e] font-semibold">Reason</TableHead>
                    <TableHead className="text-[#006a4e] font-semibold">Status</TableHead>
                    <TableHead className="text-[#006a4e] font-semibold">Date Filed</TableHead>
                    <TableHead className="text-[#006a4e] font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDisputes.map((dispute) => (
                    <TableRow key={dispute.id} className="hover:bg-gray-50 transition">
                      <TableCell className="font-mono text-sm text-gray-700">{dispute.id.slice(0, 8)}...</TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">
                        {dispute.transaction_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 max-w-xs truncate">{dispute.reason}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          dispute.status === 'open'
                            ? 'bg-red-100 text-red-700'
                            : dispute.status === 'investigating'
                            ? 'bg-blue-100 text-blue-700'
                            : dispute.status === 'resolved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(dispute.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog open={dialogOpen && selectedDispute?.id === dispute.id} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedDispute(dispute)
                                setNewStatus(dispute.status)
                                setResolution(dispute.resolution_notes || '')
                              }}
                            >
                              Update
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Dispute</DialogTitle>
                            </DialogHeader>
                            {selectedDispute && (
                              <div className="space-y-4">
                                <div>
                                  <Label>Dispute ID</Label>
                                  <p className="text-sm text-gray-600 mt-1">{selectedDispute.id}</p>
                                </div>

                                <div>
                                  <Label>Reason</Label>
                                  <p className="text-sm text-gray-600 mt-1">{selectedDispute.reason}</p>
                                </div>

                                <div>
                                  <Label htmlFor="status">Status</Label>
                                  <Select value={newStatus} onValueChange={setNewStatus}>
                                    <SelectTrigger id="status">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="open">Open</SelectItem>
                                      <SelectItem value="investigating">Investigating</SelectItem>
                                      <SelectItem value="resolved">Resolved</SelectItem>
                                      <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label htmlFor="notes">Resolution Notes</Label>
                                  <Textarea
                                    id="notes"
                                    placeholder="Enter resolution details..."
                                    value={resolution}
                                    onChange={(e) => setResolution(e.target.value)}
                                    rows={4}
                                  />
                                </div>

                                <Button
                                  onClick={handleUpdateDispute}
                                  disabled={submitting}
                                  className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white"
                                >
                                  {submitting ? 'Updating...' : 'Update Dispute'}
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
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
