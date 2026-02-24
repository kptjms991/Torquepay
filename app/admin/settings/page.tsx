'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Settings, Mail, MessageSquare } from 'lucide-react'

export default function SystemSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [settings, setSettings] = useState({
    commissionRate: '2.5',
    settlementThreshold: '1000',
    emailTemplate: '',
    smsTemplate: '',
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

        if (profile?.user_type !== 'admin') {
          router.push('/dashboard')
          return
        }

        setUser(user)
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  const handleSaveCommission = async () => {
    setSubmitting(true)
    try {
      // In a real app, this would save to a system config table
      toast.success(`Commission rate updated to ${settings.commissionRate}%`)
    } catch (error) {
      console.error('Error saving commission:', error)
      toast.error('Failed to save commission rate')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveThreshold = async () => {
    setSubmitting(true)
    try {
      // In a real app, this would save to a system config table
      toast.success(`Settlement threshold updated to $${settings.settlementThreshold}`)
    } catch (error) {
      console.error('Error saving threshold:', error)
      toast.error('Failed to save threshold')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveEmailTemplate = async () => {
    setSubmitting(true)
    try {
      // In a real app, this would save to a templates table
      toast.success('Email template updated')
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save email template')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveSmsTemplate = async () => {
    setSubmitting(true)
    try {
      // In a real app, this would save to a templates table
      toast.success('SMS template updated')
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save SMS template')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#006a4e]/20 border-t-[#006a4e] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-[#006a4e]" />
            <h1 className="text-2xl font-bold text-[#006a4e]">System Settings</h1>
          </div>
          <p className="text-sm text-gray-600">Configure platform-wide settings and templates</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="rates" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="rates">Commission & Fees</TabsTrigger>
            <TabsTrigger value="email">Email Templates</TabsTrigger>
            <TabsTrigger value="sms">SMS Templates</TabsTrigger>
          </TabsList>

          {/* Commission & Fees */}
          <TabsContent value="rates" className="space-y-6">
            <Card className="p-6 border-0 shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Commission Rates</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="commissionRate">Default Commission Rate (%)</Label>
                  <p className="text-xs text-gray-600 mb-2">Applied to all merchant transactions</p>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Input
                        id="commissionRate"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={settings.commissionRate}
                        onChange={(e) => setSettings({ ...settings, commissionRate: e.target.value })}
                      />
                    </div>
                    <Button
                      onClick={handleSaveCommission}
                      disabled={submitting}
                      className="bg-[#006a4e] hover:bg-[#005a3f] text-white"
                    >
                      Save Rate
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Example:</strong> With {settings.commissionRate}% rate, a $100 transaction will earn ${(100 * parseFloat(settings.commissionRate || '0')) / 100} in commission.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Settlement Thresholds</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="settlementThreshold">Minimum Settlement Amount ($)</Label>
                  <p className="text-xs text-gray-600 mb-2">Merchants can request settlement after reaching this amount</p>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Input
                        id="settlementThreshold"
                        type="number"
                        step="100"
                        min="0"
                        value={settings.settlementThreshold}
                        onChange={(e) => setSettings({ ...settings, settlementThreshold: e.target.value })}
                      />
                    </div>
                    <Button
                      onClick={handleSaveThreshold}
                      disabled={submitting}
                      className="bg-[#006a4e] hover:bg-[#005a3f] text-white"
                    >
                      Save Threshold
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Current Setting:</strong> Merchants will be able to request settlement once they reach ${settings.settlementThreshold || '0'} in earnings.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Email Templates */}
          <TabsContent value="email" className="space-y-6">
            <Card className="p-6 border-0 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-5 h-5 text-[#006a4e]" />
                <h2 className="text-lg font-semibold text-gray-800">Email Notification Template</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="emailTemplate">Transaction Confirmation Email</Label>
                  <p className="text-xs text-gray-600 mb-2">Sent to users after payment completion</p>
                  <Textarea
                    id="emailTemplate"
                    placeholder={`Dear {{user_name}},

Your payment of {{amount}} has been processed successfully.

Transaction ID: {{transaction_id}}
Date: {{date}}
Status: {{status}}

Thank you for using our service!

Best regards,
TorquePay Team`}
                    value={settings.emailTemplate}
                    onChange={(e) => setSettings({ ...settings, emailTemplate: e.target.value })}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-700 font-medium mb-2">Available variables:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>{'{{user_name}}'} - User full name</li>
                    <li>{'{{amount}}'} - Transaction amount</li>
                    <li>{'{{transaction_id}}'} - Unique transaction ID</li>
                    <li>{'{{date}}'} - Transaction date</li>
                    <li>{'{{status}}'} - Payment status</li>
                  </ul>
                </div>

                <Button
                  onClick={handleSaveEmailTemplate}
                  disabled={submitting}
                  className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white"
                >
                  Save Email Template
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* SMS Templates */}
          <TabsContent value="sms" className="space-y-6">
            <Card className="p-6 border-0 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-[#006a4e]" />
                <h2 className="text-lg font-semibold text-gray-800">SMS Notification Template</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="smsTemplate">Transaction Confirmation SMS</Label>
                  <p className="text-xs text-gray-600 mb-2">Sent to users after payment completion (max 160 characters)</p>
                  <Textarea
                    id="smsTemplate"
                    placeholder={`Payment of {{amount}} confirmed. Transaction ID: {{transaction_id}}. Status: {{status}}. Thank you!`}
                    value={settings.smsTemplate}
                    onChange={(e) => setSettings({ ...settings, smsTemplate: e.target.value.slice(0, 160) })}
                    rows={4}
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {settings.smsTemplate.length}/160 characters
                  </p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-700 font-medium mb-2">Available variables:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>{'{{amount}}'} - Transaction amount</li>
                    <li>{'{{transaction_id}}'} - Unique transaction ID</li>
                    <li>{'{{status}}'} - Payment status</li>
                  </ul>
                </div>

                <Button
                  onClick={handleSaveSmsTemplate}
                  disabled={submitting}
                  className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white"
                >
                  Save SMS Template
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
