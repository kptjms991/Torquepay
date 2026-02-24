'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { QrCode, AlertCircle } from 'lucide-react'
import Html5QrcodePlugin from '@/components/qr-scanner'

interface PaymentData {
  userId: string
  username: string
  amount: number
  description: string
  timestamp: string
}

export default function QRScanPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [scannedData, setScannedData] = useState<PaymentData | null>(null)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [manualInput, setManualInput] = useState('')
  const [confirming, setConfirming] = useState(false)
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

  const handleQRScanned = (data: string) => {
    try {
      const paymentData = JSON.parse(data) as PaymentData
      setScannedData(paymentData)
      setScannerOpen(false)
    } catch (error) {
      toast.error('Invalid QR code format')
    }
  }

  const handleManualInput = () => {
    if (!manualInput.trim()) {
      toast.error('Please enter QR data')
      return
    }
    handleQRScanned(manualInput)
    setManualInput('')
  }

  const handleConfirmPayment = async () => {
    if (!scannedData) return

    if (scannedData.amount > (wallet?.balance || 0)) {
      toast.error('Insufficient balance for this payment')
      return
    }

    setConfirming(true)
    try {
      // Create transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            related_user_id: scannedData.userId,
            transaction_type: 'payment',
            amount: scannedData.amount,
            currency: 'USD',
            status: 'completed',
            description: scannedData.description,
          },
        ])

      if (txError) throw txError

      // Update wallet balance
      const newBalance = (wallet?.balance || 0) - scannedData.amount
      await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('user_id', user.id)

      // Refresh wallet
      const { data: walletData } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setWallet(walletData)

      toast.success(`Payment of $${scannedData.amount.toFixed(2)} sent successfully!`)
      setScannedData(null)

      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (error) {
      console.error('Error confirming payment:', error)
      toast.error('Failed to process payment')
    } finally {
      setConfirming(false)
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
            <QrCode className="w-8 h-8 text-[#006a4e]" />
            <div>
              <h1 className="text-2xl font-bold text-[#006a4e]">Scan QR Code</h1>
              <p className="text-sm text-gray-600 mt-1">Scan a QR code to make a payment</p>
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

        {!scannedData ? (
          <div className="space-y-6">
            {/* Scanner Option */}
            <Card className="p-8 border-0 shadow-md text-center">
              <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Use Camera to Scan</h2>
              <p className="text-gray-600 mb-6">
                Point your camera at a QR code to scan payment details
              </p>
              <Button
                onClick={() => setScannerOpen(true)}
                className="bg-[#006a4e] hover:bg-[#005a3f] text-white gap-2"
              >
                <QrCode className="w-4 h-4" />
                Open Camera
              </Button>
            </Card>

            {/* Manual Input Option */}
            <Card className="p-6 border-0 shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Or Enter Manually</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="manualInput">Paste QR Data</Label>
                  <textarea
                    id="manualInput"
                    placeholder="Paste the QR code data here..."
                    className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
                    rows={4}
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleManualInput}
                  disabled={!manualInput.trim()}
                  className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white"
                >
                  Process Data
                </Button>
              </div>
            </Card>

            {/* Info */}
            <Card className="p-4 border-0 shadow-md bg-blue-50 border-l-4 border-blue-400">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-700">
                    <strong>How it works:</strong> Scan a payment QR code to instantly see payment details and confirm.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Payment Confirmation */}
            <Card className="p-6 border-0 shadow-md bg-green-50 border-l-4 border-green-400">
              <p className="text-sm text-green-700 font-medium">QR Code Scanned Successfully</p>
            </Card>

            <Card className="p-6 border-0 shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Payment Details</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">From</p>
                  <p className="text-lg font-medium text-gray-800 mt-1">{scannedData.username}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-3xl font-bold text-[#006a4e] mt-1">
                    ${scannedData.amount.toFixed(2)}
                  </p>
                </div>

                {scannedData.description && (
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-lg text-gray-800 mt-1">{scannedData.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">Your Balance After</p>
                  <p className="text-lg font-medium text-gray-800 mt-1">
                    ${Math.max(0, (wallet?.balance || 0) - scannedData.amount).toFixed(2)}
                  </p>
                </div>
              </div>

              {scannedData.amount > (wallet?.balance || 0) && (
                <Card className="p-4 mb-6 bg-red-50 border-l-4 border-red-400">
                  <p className="text-sm text-red-700">Insufficient balance to complete this payment</p>
                </Card>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleConfirmPayment}
                  disabled={confirming || scannedData.amount > (wallet?.balance || 0)}
                  className="flex-1 bg-[#006a4e] hover:bg-[#005a3f] text-white"
                >
                  {confirming ? 'Processing...' : 'Confirm Payment'}
                </Button>
                <Button
                  onClick={() => setScannedData(null)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Scanner Dialog */}
        <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
            </DialogHeader>
            <div className="w-full">
              <Html5QrcodePlugin
                onScan={handleQRScanned}
              />
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
