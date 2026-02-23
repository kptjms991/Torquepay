"use client"

import type React from "react"

import { Button, type ButtonProps } from "@/components/ui/button"
import type { ReactNode } from "react"

interface HapticButtonProps extends ButtonProps {
  children: ReactNode
  haptic?: "light" | "medium" | "heavy"
}

export function HapticButton({ children, haptic = "medium", ...props }: HapticButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if ("vibrate" in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 20],
      }
      navigator.vibrate(patterns[haptic])
    }
    props.onClick?.(e)
  }

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  )
}
