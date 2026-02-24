'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { User, FileText, CheckCircle, AlertCircle } from 'lucide-react'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
  })
  const [kycFile, setKycFile] = useState<File | null>(null)
  const [kycSubmitting, setKycSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        setUser(user)
        setProfile(profileData)
        setFormData({
          fullName: profileData?.full_name || '',
          phone: profileData?.phone || '',
        })
      } catch (error) {
        console.error('Error loading profile:', error)
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
        })
        .eq('id', user.id)

      if (error) throw error

      setProfile({ ...profile, full_name: formData.fullName, phone: formData.phone })
      setEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  const handleKYCUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!kycFile) {
      toast.error('Please select a file')
      return
    }

    setKycSubmitting(true)
    try {
      // Simulate file upload
      // In a real app, would upload to Supabase Storage
      const fileName = `kyc-${user.id}-${Date.now()}`
      
      const { error } = await supabase
        .from('profiles')
        .update({
          kyc_status: 'pending',
          kyc_document_url: `/${fileName}`,
        })
        .eq('id', user.id)

      if (error) throw error

      setProfile({ ...profile, kyc_status: 'pending' })
      setKycFile(null)
      toast.success('KYC document submitted for verification')
    } catch (error) {
      console.error('Error uploading KYC:', error)
      toast.error('Failed to upload KYC document')
    } finally {
      setKycSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#006a4e]/20 border-t-[#006a4e] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
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
            <User className="w-8 h-8 text-[#006a4e]" />
            <div>
              <h1 className="text-2xl font-bold text-[#006a4e]">My Profile</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your account information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Information */}
        <Card className="p-6 border-0 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
            {!editing && (
              <Button
                onClick={() => setEditing(true)}
                variant="outline"
              >
                Edit
              </Button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-1 bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={submitting}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={submitting}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#006a4e] hover:bg-[#005a3f] text-white"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(false)
                    setFormData({
                      fullName: profile?.full_name || '',
                      phone: profile?.phone || '',
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg text-gray-800 mt-1">{user?.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="text-lg text-gray-800 mt-1">{profile?.full_name || 'Not set'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="text-lg text-gray-800 mt-1">{profile?.phone || 'Not set'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Account Type</p>
                <p className="text-lg text-gray-800 mt-1 capitalize">{profile?.user_type}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg text-gray-800 mt-1">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* KYC Status */}
        <Card className="p-6 border-0 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Know Your Customer (KYC)</h2>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  {profile?.kyc_status === 'verified' ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-green-700 font-medium">Verified</span>
                    </>
                  ) : profile?.kyc_status === 'pending' ? (
                    <>
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                      <span className="text-yellow-700 font-medium">Pending Review</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-6 h-6 text-gray-600" />
                      <span className="text-gray-700 font-medium">Not Submitted</span>
                    </>
                  )}
                </div>

                {profile?.kyc_status === 'verified' ? (
                  <p className="text-gray-600 mb-4">Your identity has been verified. You have full access to all features.</p>
                ) : profile?.kyc_status === 'pending' ? (
                  <p className="text-gray-600 mb-4">Your KYC documents are under review. This typically takes 1-2 business days.</p>
                ) : (
                  <p className="text-gray-600 mb-4">Submit your identity documents to unlock higher transaction limits.</p>
                )}
              </div>

              {profile?.kyc_status !== 'verified' && (
                <form onSubmit={handleKYCUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="kycFile">Upload Document</Label>
                    <p className="text-xs text-gray-600 mb-2">
                      Accepted formats: PDF, JPG, PNG (Max 5MB)
                    </p>
                    <Input
                      id="kycFile"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setKycFile(e.target.files?.[0] || null)}
                      disabled={kycSubmitting}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!kycFile || kycSubmitting}
                    className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    {kycSubmitting ? 'Uploading...' : 'Submit Document'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Card>

        {/* Account Settings */}
        <Card className="p-6 border-0 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Account Settings</h2>

          <div className="space-y-4">
            <Button
              onClick={() => router.push('/security/pin')}
              className="w-full bg-white text-[#006a4e] border border-gray-200 hover:bg-gray-50 justify-between"
            >
              <span>Transaction PIN</span>
              <span className="text-xs">Manage →</span>
            </Button>

            <Button
              onClick={() => router.push('/security/2fa')}
              className="w-full bg-white text-[#006a4e] border border-gray-200 hover:bg-gray-50 justify-between"
            >
              <span>Two-Factor Authentication</span>
              <span className="text-xs">Manage →</span>
            </Button>

            <Button
              onClick={() => router.push('/payment-methods')}
              className="w-full bg-white text-[#006a4e] border border-gray-200 hover:bg-gray-50 justify-between"
            >
              <span>Payment Methods</span>
              <span className="text-xs">Manage →</span>
            </Button>

            <Button
              onClick={async () => {
                await supabase.auth.signOut()
                router.push('/auth/login')
              }}
              variant="destructive"
              className="w-full mt-4"
            >
              Logout
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
