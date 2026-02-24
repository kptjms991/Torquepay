'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import QRCode from 'qrcode.react'
import { toast } from 'sonner'
import { QrCode, Download, Copy } from 'lucide-react'

export default function QRGeneratePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
  })
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const qrRef = useRef<any>(null)

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

  const handleGenerateQR = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setSubmitting(true)
    try {
      // Create QR code data
      const qrData = {
        userId: user.id,
        username: user.email,
        amount: parseFloat(formData.amount),
        description: formData.description,
        timestamp: new Date().toISOString(),
      }

      // Save QR code to database
      const { data: qr, error } = await supabase
        .from('qr_codes')
        .insert([
          {
            user_id: user.id,
            qr_type: 'payment',
            amount: parseFloat(formData.amount),
            description: formData.description,
            is_active: true,
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Set QR code - in real app, would encode to QR
      setQrCode(JSON.stringify(qrData))
      toast.success('QR code generated successfully')
    } catch (error) {
      console.error('Error generating QR:', error)
      toast.error('Failed to generate QR code')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownloadQR = () => {
    if (!qrRef.current) return
    const canvas = qrRef.current.querySelector('canvas')
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `payment-qr-${new Date().getTime()}.png`
    a.click()
    toast.success('QR code downloaded')
  }

  const handleCopyQR = () => {
    if (!qrCode) return
    navigator.clipboard.writeText(qrCode)
    toast.success('QR data copied to clipboard')
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
            <QrCode className="w-8 h-8 text-[#006a4e]" />
            <div>
              <h1 className="text-2xl font-bold text-[#006a4e]">Generate Payment QR</h1>
              <p className="text-sm text-gray-600 mt-1">Create a QR code for customers to scan and pay</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <form onSubmit={handleGenerateQR} className="space-y-6">
            <Card className="p-6 border-0 shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">QR Code Details</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount to Receive</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">$</span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-8"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      disabled={submitting || !!qrCode}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="What is this payment for? e.g., 'Coffee', 'Service Fee'"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={submitting || !!qrCode}
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4 border-0 shadow-md bg-blue-50 border-l-4 border-blue-400">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> Share this QR code with customers to collect payments instantly.
              </p>
            </Card>

            {!qrCode ? (
              <Button
                type="submit"
                disabled={submitting || !formData.amount}
                className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white"
              >
                {submitting ? 'Generating...' : 'Generate QR Code'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  setQrCode(null)
                  setFormData({ amount: '', description: '' })
                }}
                variant="outline"
                className="w-full"
              >
                Generate Another
              </Button>
            )}
          </form>

          {/* QR Code Display */}
          {qrCode && (
            <div className="space-y-6">
              <Card className="p-8 border-0 shadow-md flex flex-col items-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Your QR Code</h2>
                <div ref={qrRef} className="p-4 bg-white border-2 border-gray-200 rounded-lg mb-4">
                  <QRCode
                    value={qrCode}
                    size={280}
                    level="H"
                    includeMargin={true}
                    fgColor="#006a4e"
                  />
                </div>

                <div className="text-center mb-6">
                  <p className="text-2xl font-bold text-[#006a4e]">
                    ${parseFloat(formData.amount).toFixed(2)}
                  </p>
                  {formData.description && (
                    <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <Button
                    onClick={handleDownloadQR}
                    className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download QR
                  </Button>
                  <Button
                    onClick={handleCopyQR}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Data
                  </Button>
                </div>
              </Card>

              <Card className="p-4 border-0 shadow-md bg-gray-50">
                <h3 className="font-semibold text-gray-800 mb-2">How to Use</h3>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Download or screenshot the QR code</li>
                  <li>Share it with customers</li>
                  <li>They scan with their device to complete payment</li>
                  <li>Funds are received instantly to your wallet</li>
                </ol>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

import { useRef } from 'react'
