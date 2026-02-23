"use client"

import type { ReactNode } from "react"

interface SafeAreaInsetsProps {
  children: ReactNode
  className?: string
}

export default function SafeAreaInsets({ children, className = "" }: SafeAreaInsetsProps) {
  return (
    <div
      className={className}
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
      }}
    >
      {children}
    </div>
  )
}
