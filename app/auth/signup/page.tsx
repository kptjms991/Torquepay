"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signUpWithAdminCheck, isAuthConfigured } from "@/lib/supabase/auth"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [authConfigured, setAuthConfigured] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setAuthConfigured(isAuthConfigured())
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (!authConfigured) {
      setError("Registration is currently disabled. Please contact admin.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: signupError } = await signUpWithAdminCheck(email, password)

      if (signupError) {
        setError(signupError.message || "Failed to create account")
        return
      }

      setShowSuccess(true)

      // If admin email, redirect to admin dashboard
      if (email === "kptjms991@gmail.com") {
        setTimeout(() => router.push("/admin"), 3000)
      } else {
        setTimeout(() => router.push("/auth/login"), 3000)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: signupError } = await signUpWithAdminCheck(email, password)

      if (signupError) {
        setError(signupError.message)
        return
      }

      setShowSuccess(true)
      
      // If admin email, redirect to admin dashboard
      if (email === "kptjms991@gmail.com") {
        setTimeout(() => router.push("/admin"), 3000)
      } else {
        setTimeout(() => router.push("/auth/login"), 3000)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md shadow-xl border-0">
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#006a4e]">Account Created!</h2>
              <p className="text-gray-600 mt-2">Check your email to verify your account</p>
            </div>
            {email === "kptjms991@gmail.com" && (
              <p className="text-sm text-[#006a4e] font-medium">Admin access granted automatically</p>
            )}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-xl border-0">
        <div className="p-8">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-[#006a4e]">TorquePay</h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <Input
                type="password"
                placeholder="Enter password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
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
              disabled={isLoading}
              className="w-full torquepay-btn-primary"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="torquepay-text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
