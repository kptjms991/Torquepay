"use client"

import type { ReactNode } from "react"

interface SmoothTransitionsProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function PageTransition({ children, className = "", delay = 0 }: SmoothTransitionsProps) {
  return (
    <div
      className={`animate-in fade-in slide-in-from-bottom-2 duration-500 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function TabTransition({
  children,
  className = "",
  isActive = true,
}: SmoothTransitionsProps & { isActive?: boolean }) {
  return (
    <div
      className={`transition-all duration-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"} ${className}`}
    >
      {children}
    </div>
  )
}
