'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Shield, QrCode, Copy, CheckCircle } from 'lucide-react'
import QRCodeComponent from 'qrcode.react'

export default function TwoFactorSetupPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [twoFaEnabled, setTwoFaEnabled] = useState(false)
  const [mode, setMode] = useState<'view' | 'setup' | 'verify' | 'backup'>('view')
  const [qrCode, setQrCode] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [copiedCode, setCopiedCode] = useState<number | null>(null)
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
        // In a real app, would check if 2FA is enabled
        setTwoFaEnabled(false)
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load security settings')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  const generateQRCode = () => {
    // Simulate QR code generation
    const secret = `JBSWY3DPEBLW64TMMQ======`
    const qrValue = `otpauth://totp/TorquePay:${user?.email}?secret=${secret}&issuer=TorquePay`
    setQrCode(qrValue)
    setMode('setup')

    // Generate backup codes
    const codes = Array(10)
      .fill(0)
      .map(() => Math.random().toString(36).substring(2, 10).toUpperCase())
    setBackupCodes(codes)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }

    setSubmitting(true)
    try {
      // In a real app, would verify the code against the secret
      // For demo, accept any 6-digit code
      if (/^\d{6}$/.test(verificationCode)) {
        setMode('backup')
      } else {
        toast.error('Invalid verification code')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleEnableTwoFa = async () => {
    setSubmitting(true)
    try {
      // In a real app, would save the secret to database
      setTwoFaEnabled(true)
      setMode('view')
      setQrCode('')
      setVerificationCode('')
      toast.success('Two-Factor Authentication enabled successfully')
    } catch (error) {
      console.error('Error enabling 2FA:', error)
      toast.error('Failed to enable 2FA')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDisableTwoFa = async () => {
    if (!confirm('Are you sure? This will disable 2FA for your account.')) return

    setSubmitting(true)
    try {
      setTwoFaEnabled(false)
      setBackupCodes([])
      toast.success('Two-Factor Authentication disabled')
    } catch (error) {
      console.error('Error disabling 2FA:', error)
      toast.error('Failed to disable 2FA')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopyBackupCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(index)
    setTimeout(() => setCopiedCode(null), 2000)
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
            <Shield className="w-8 h-8 text-[#006a4e]" />
            <div>
              <h1 className="text-2xl font-bold text-[#006a4e]">Two-Factor Authentication</h1>
              <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <Card className={`p-6 border-0 shadow-md mb-8 ${twoFaEnabled ? 'bg-green-50 border-l-4 border-green-400' : 'bg-yellow-50 border-l-4 border-yellow-400'}`}>
          <div className="flex items-center gap-3">
            {twoFaEnabled ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Two-Factor Authentication Active</p>
                  <p className="text-sm text-green-700">Your account is protected with 2FA</p>
                </div>
              </>
            ) : (
              <>
                <Shield className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-900">2FA Not Enabled</p>
                  <p className="text-sm text-yellow-700">Enable 2FA to secure your account</p>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* View Mode */}
        {mode === 'view' && (
          <Card className="p-6 border-0 shadow-md text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Two-Factor Authentication</h2>
            <p className="text-gray-600 mb-6">
              {twoFaEnabled
                ? 'Your account is protected with 2FA. You can disable it or generate new backup codes.'
                : 'Require a verification code in addition to your password when signing in.'}
            </p>

            {!twoFaEnabled ? (
              <Button
                onClick={generateQRCode}
                className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white gap-2"
              >
                <QrCode className="w-4 h-4" />
                Enable Two-Factor Auth
              </Button>
            ) : (
              <Button
                onClick={handleDisableTwoFa}
                variant="destructive"
                className="w-full"
              >
                Disable Two-Factor Auth
              </Button>
            )}
          </Card>
        )}

        {/* Setup Mode - QR Code */}
        {mode === 'setup' && qrCode && (
          <div className="space-y-6">
            <Card className="p-6 border-0 shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Step 1: Scan QR Code</h2>
              <p className="text-gray-600 mb-6">
                Use an authenticator app (Google Authenticator, Authy, Microsoft Authenticator) to scan this QR code:
              </p>

              <div className="bg-white p-4 rounded-lg border border-gray-200 w-fit mx-auto mb-6">
                <QRCodeComponent
                  value={qrCode}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-medium mb-2">Or enter manually:</p>
                <code className="text-sm font-mono text-gray-800 break-all">
                  JBSWY3DPEBLW64TMMQ======
                </code>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Step 2: Verify Code</h2>
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <Label htmlFor="verificationCode">
                    Enter the 6-digit code from your authenticator app
                  </Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    disabled={submitting}
                    inputMode="numeric"
                    className="mt-2 text-center text-2xl tracking-widest"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting || verificationCode.length !== 6}
                  className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white"
                >
                  {submitting ? 'Verifying...' : 'Verify Code'}
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* Backup Codes Mode */}
        {mode === 'backup' && backupCodes.length > 0 && (
          <Card className="p-6 border-0 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Step 3: Save Backup Codes</h2>
            <p className="text-gray-600 mb-6">
              Save these backup codes in a safe place. You can use them to access your account if you lose access to your authenticator app.
            </p>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-sm text-red-700">
                <strong>Important:</strong> Keep these codes secure. Anyone with these codes can access your account.
              </p>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 mb-4">
                <Checkbox
                  checked={showBackupCodes}
                  onCheckedChange={(checked) => setShowBackupCodes(checked as boolean)}
                />
                <span className="text-sm text-gray-700">I have saved the backup codes in a safe place</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm flex items-center justify-between gap-2"
                  >
                    <span>{code}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyBackupCode(code, index)}
                      className="text-gray-500 hover:text-gray-700 transition"
                    >
                      {copiedCode === index ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleEnableTwoFa}
              disabled={!showBackupCodes || submitting}
              className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white"
            >
              {submitting ? 'Enabling 2FA...' : 'Enable Two-Factor Authentication'}
            </Button>
          </Card>
        )}
      </main>
    </div>
  )
}
