"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface KeyboardAwareInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onKeyboardShow?: () => void
  onKeyboardHide?: () => void
}

export default function KeyboardAwareInput({ onKeyboardShow, onKeyboardHide, ...props }: KeyboardAwareInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleFocus = () => {
      onKeyboardShow?.()
      // Scroll input into view with offset for keyboard
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }

    const handleBlur = () => {
      onKeyboardHide?.()
    }

    const input = inputRef.current
    input?.addEventListener("focus", handleFocus)
    input?.addEventListener("blur", handleBlur)

    return () => {
      input?.removeEventListener("focus", handleFocus)
      input?.removeEventListener("blur", handleBlur)
    }
  }, [onKeyboardShow, onKeyboardHide])

  return <Input ref={inputRef} {...props} />
}
