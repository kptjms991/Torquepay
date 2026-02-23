import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import ConnectionStatus from "@/components/connection-status"
import SkipToContent from "@/components/skip-to-content"
import PWAInstallPrompt from "@/components/pwa-install-prompt"
import { ErrorBoundary } from "@/components/error-boundary"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "P2P Wallet - Private Communication",
  description: "Decentralized encrypted messaging, calls, and crypto payments",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#07C160" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`font-sans antialiased`}>
        <ErrorBoundary>
          <SkipToContent />
          <div id="main-content">{children}</div>
          <ConnectionStatus />
          <PWAInstallPrompt />
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
