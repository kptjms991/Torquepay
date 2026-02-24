'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { merchantService } from '@/lib/services/merchant-service'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Merchant } from '@/types/database'

export default function CheckoutSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [settings, setSettings] = useState({
    successUrl: '',
    cancelUrl: '',
    webhookUrl: '',
    enableEmail: true,
    enableSms: false,
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

        // Load existing settings from checkout table
        const { data: checkouts } = await supabase
          .from('merchant_checkouts')
          .select('*')
          .eq('merchant_id', merchantData?.id)
          .limit(1)

        if (checkouts?.[0]) {
          setSettings({
            successUrl: checkouts[0].success_url || '',
            cancelUrl: checkouts[0].cancel_url || '',
            webhookUrl: checkouts[0].webhook_url || '',
            enableEmail: true,
            enableSms: false,
          })
        }
      } catch (error) {
        console.error('Error loading settings:', error)
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!merchant) return

    setSubmitting(true)
    try {
      await merchantService.updateCheckoutSettings(merchant.id, {
        success_url: settings.successUrl,
        cancel_url: settings.cancelUrl,
        webhook_url: settings.webhookUrl,
      })
      toast.success('Settings updated successfully')
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
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
          <h1 className="text-2xl font-bold text-[#006a4e]">Checkout Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Configure your payment checkout experience</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {/* URLs Section */}
          <Card className="p-6 border-0 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Redirect URLs</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="successUrl">Success URL</Label>
                <p className="text-xs text-gray-600 mb-2">
                  Customer will be redirected here after successful payment
                </p>
                <Input
                  id="successUrl"
                  placeholder="https://example.com/success"
                  type="url"
                  value={settings.successUrl}
                  onChange={(e) => setSettings({ ...settings, successUrl: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="cancelUrl">Cancel URL</Label>
                <p className="text-xs text-gray-600 mb-2">
                  Customer will be redirected here if they cancel the payment
                </p>
                <Input
                  id="cancelUrl"
                  placeholder="https://example.com/cancel"
                  type="url"
                  value={settings.cancelUrl}
                  onChange={(e) => setSettings({ ...settings, cancelUrl: e.target.value })}
                  required
                />
              </div>
            </div>
          </Card>

          {/* Webhook Section */}
          <Card className="p-6 border-0 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Webhooks</h2>
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook Endpoint URL</Label>
              <p className="text-xs text-gray-600 mb-4">
                Payment status updates will be sent to this URL as POST requests
              </p>
              <Input
                id="webhookUrl"
                placeholder="https://example.com/webhooks/payments"
                type="url"
                value={settings.webhookUrl}
                onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
              />
            </div>
          </Card>

          {/* Notifications Section */}
          <Card className="p-6 border-0 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="enableEmail"
                  checked={settings.enableEmail}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableEmail: checked as boolean })
                  }
                />
                <Label htmlFor="enableEmail" className="cursor-pointer">
                  Email notifications for payment updates
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="enableSms"
                  checked={settings.enableSms}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableSms: checked as boolean })
                  }
                />
                <Label htmlFor="enableSms" className="cursor-pointer">
                  SMS notifications for payment updates
                </Label>
              </div>
            </div>
          </Card>

          {/* Payment Methods Section */}
          <Card className="p-6 border-0 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Payment Methods</h2>
            <div className="space-y-4">
              {[
                { id: 'wallet', label: 'Wallet Payments', description: 'Allow customers to pay from their wallet' },
                { id: 'cards', label: 'Card Payments', description: 'Accept credit and debit cards' },
                { id: 'mobilewallet', label: 'Mobile Wallets', description: 'Mobile wallet payments' },
                { id: 'qr', label: 'QR Code Payments', description: 'Scan QR code to complete payment' },
              ].map((method) => (
                <div key={method.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                  <Checkbox id={`method-${method.id}`} defaultChecked />
                  <div className="flex-1">
                    <label htmlFor={`method-${method.id}`} className="text-sm font-medium text-gray-800 cursor-pointer">
                      {method.label}
                    </label>
                    <p className="text-xs text-gray-600">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#006a4e] hover:bg-[#005a3f] text-white"
            >
              {submitting ? 'Saving...' : 'Save Settings'}
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
