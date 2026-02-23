"use client"

import type React from "react"

import { useState, useRef } from "react"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startYRef.current || isRefreshing) return
    if (containerRef.current?.scrollTop !== 0) {
      startYRef.current = 0
      return
    }

    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startYRef.current)
    setPullDistance(Math.min(distance, 100))
  }

  const handleTouchEnd = async () => {
    if (pullDistance > 60 && !isRefreshing) {
      setIsRefreshing(true)
      await onRefresh()
      setIsRefreshing(false)
    }
    setPullDistance(0)
    startYRef.current = 0
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="h-full overflow-y-auto"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Pull-to-refresh indicator */}
      <div className="relative">
        <div
          className="flex justify-center py-4 transition-all duration-300"
          style={{
            opacity: pullDistance / 100,
            transform: `scaleY(${Math.max(0.5, pullDistance / 100)})`,
          }}
        >
          <div className="text-2xl animate-spin">↻</div>
        </div>
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  )
}
