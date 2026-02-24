'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { merchantService } from '@/lib/services/merchant-service'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { ApiKey } from '@/types/database'

export default function ApiKeysPage() {
  const [loading, setLoading] = useState(true)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [user, setUser] = useState<any>(null)
  const [merchant, setMerchant] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        // Get user profile and merchant info
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

        // Fetch API keys
        const { data: keys } = await supabase
          .from('api_keys')
          .select('*')
          .eq('merchant_id', merchantData?.id)
          .order('created_at', { ascending: false })

        setApiKeys(keys || [])
      } catch (error) {
        console.error('Error loading API keys:', error)
        toast.error('Failed to load API keys')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!keyName.trim() || !merchant) {
      toast.error('Please enter a key name')
      return
    }

    setSubmitting(true)
    try {
      const newKey = await merchantService.generateApiKey(merchant.id, keyName)
      setApiKeys([newKey, ...apiKeys])
      setKeyName('')
      setDialogOpen(false)
      toast.success('API key generated successfully')
    } catch (error) {
      console.error('Error generating API key:', error)
      toast.error('Failed to generate API key')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return

    try {
      await merchantService.deleteApiKey(keyId)
      setApiKeys(apiKeys.filter(k => k.id !== keyId))
      toast.success('API key deleted')
    } catch (error) {
      console.error('Error deleting API key:', error)
      toast.error('Failed to delete API key')
    }
  }

  const handleCopyKey = (value: string) => {
    navigator.clipboard.writeText(value)
    toast.success('Copied to clipboard')
  }

  const toggleSecretVisibility = (keyId: string) => {
    const newVisible = new Set(visibleSecrets)
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId)
    } else {
      newVisible.add(keyId)
    }
    setVisibleSecrets(newVisible)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#006a4e]/20 border-t-[#006a4e] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading API keys...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#006a4e]">API Keys</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your merchant API keys for integrations</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#006a4e] hover:bg-[#005a3f] text-white gap-2">
                <Plus className="w-4 h-4" />
                Generate New Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New API Key</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleGenerateKey} className="space-y-4">
                <div>
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., Production API"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    disabled={submitting}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white"
                >
                  {submitting ? 'Generating...' : 'Generate Key'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {apiKeys.length === 0 ? (
          <Card className="p-12 text-center border-0 shadow-md">
            <div className="text-gray-400 mb-4">
              <Plus className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No API Keys Yet</h3>
            <p className="text-gray-600 mb-6">Generate your first API key to get started with integrations</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#006a4e] hover:bg-[#005a3f] text-white gap-2">
                  <Plus className="w-4 h-4" />
                  Generate API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate New API Key</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleGenerateKey} className="space-y-4">
                  <div>
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      placeholder="e.g., Production API"
                      value={keyName}
                      onChange={(e) => setKeyName(e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#006a4e] hover:bg-[#005a3f] text-white"
                  >
                    {submitting ? 'Generating...' : 'Generate Key'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </Card>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <Card key={key.id} className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{key.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        key.is_test_mode
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {key.is_test_mode ? 'Test Mode' : 'Live Mode'}
                      </span>
                      {!key.is_active && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                          Inactive
                        </span>
                      )}
                    </div>

                    {/* Public Key */}
                    <div className="mb-4">
                      <label className="text-sm text-gray-600 font-medium block mb-2">Public Key</label>
                      <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                        <code className="text-xs text-gray-700 font-mono flex-1 break-all">{key.public_key}</code>
                        <button
                          onClick={() => handleCopyKey(key.public_key)}
                          className="text-gray-500 hover:text-gray-700 transition"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Secret Key */}
                    <div className="mb-4">
                      <label className="text-sm text-gray-600 font-medium block mb-2">Secret Key</label>
                      <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                        <code className="text-xs text-gray-700 font-mono flex-1 break-all">
                          {visibleSecrets.has(key.id) ? key.secret_key : '••••••••••••••••'}
                        </code>
                        <button
                          onClick={() => toggleSecretVisibility(key.id)}
                          className="text-gray-500 hover:text-gray-700 transition"
                        >
                          {visibleSecrets.has(key.id) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopyKey(key.secret_key)}
                          className="text-gray-500 hover:text-gray-700 transition"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Created: {new Date(key.created_at).toLocaleDateString()}
                      {key.last_used_at && ` • Last used: ${new Date(key.last_used_at).toLocaleDateString()}`}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteKey(key.id)}
                    className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
