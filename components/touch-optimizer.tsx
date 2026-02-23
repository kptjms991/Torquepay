"use client"

import type React from "react"

import type { ReactNode } from "react"

interface TouchOptimizerProps {
  children: ReactNode
  onTap?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  hapticFeedback?: boolean
}

export default function TouchOptimizer({
  children,
  onTap,
  onSwipeLeft,
  onSwipeRight,
  hapticFeedback = true,
}: TouchOptimizerProps) {
  const startX = { current: 0 }
  const startY = { current: 0 }

  const triggerHaptic = () => {
    if (hapticFeedback && "vibrate" in navigator) {
      navigator.vibrate(10)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const deltaX = endX - startX.current
    const deltaY = endY - startY.current

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      triggerHaptic()
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      triggerHaptic()
      onTap?.()
    }
  }

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="touch-none select-none">
      {children}
    </div>
  )
}
