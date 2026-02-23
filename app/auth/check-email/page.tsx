"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-sm border-wechat-green/20">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">We sent you a confirmation link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <p className="text-5xl mb-4">📧</p>
            <p className="text-muted-foreground mb-4">
              Please check your email and click the confirmation link to activate your account.
            </p>
          </div>
          <Link href="/auth/login" className="block">
            <Button className="w-full bg-wechat-green hover:bg-wechat-green/90 rounded-full">Back to Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
