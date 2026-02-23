"use client"

import type React from "react"

import { useEffect } from "react"

interface KeyboardNavProps {
  onArrowUp?: () => void
  onArrowDown?: () => void
  onEnter?: () => void
  onEscape?: () => void
  disabled?: boolean
}

export function useKeyboardNav({ onArrowUp, onArrowDown, onEnter, onEscape, disabled = false }: KeyboardNavProps) {
  useEffect(() => {
    if (disabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          onArrowUp?.()
          break
        case "ArrowDown":
          e.preventDefault()
          onArrowDown?.()
          break
        case "Enter":
          e.preventDefault()
          onEnter?.()
          break
        case "Escape":
          e.preventDefault()
          onEscape?.()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onArrowUp, onArrowDown, onEnter, onEscape, disabled])
}

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  ariaLabel?: string
  ariaPressed?: boolean
}

export function AccessibleButton({
  children,
  ariaLabel,
  ariaPressed,
  className = "",
  ...props
}: AccessibleButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className={`focus:outline-none focus:ring-2 focus:ring-wechat-green focus:ring-offset-2 rounded transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
