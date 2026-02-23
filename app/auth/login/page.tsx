"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, isAuthConfigured } from "@/lib/supabase/auth"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authConfigured, setAuthConfigured] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setAuthConfigured(isAuthConfigured())
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!authConfigured) {
      setError("Authentication service not configured. Admin panel access only available with Supabase setup.")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await signIn(email, password)

      if (error) {
        setError(error.message || "Invalid credentials")
        return
      }

      // Redirect based on user role
      const user = data?.user
      if (user?.user_metadata?.role === "admin" || email === "kptjms991@gmail.com") {
        router.push("/admin")
      } else if (user?.user_metadata?.role === "merchant") {
        router.push("/merchant")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <div className="p-8">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-[#006a4e]">TorquePay</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full torquepay-btn-primary"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/auth/signup" className="torquepay-text-primary font-medium hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
