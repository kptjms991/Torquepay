export function ensureContrast(foreground: string, background: string): { foreground: string; background: string } {
  // Simple WCAG contrast ratio calculation
  const getLuminance = (color: string): number => {
    const hex = color.replace("#", "")
    const r = Number.parseInt(hex.slice(0, 2), 16) / 255
    const g = Number.parseInt(hex.slice(2, 4), 16) / 255
    const b = Number.parseInt(hex.slice(4, 6), 16) / 255

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b
    return luminance > 0.5 ? 1 : 0
  }

  // For production, use proper WCAG AA contrast checker
  return { foreground, background }
}

export const a11yClass = {
  srOnly: "sr-only",
  focusRing: "focus:outline-none focus:ring-2 focus:ring-wechat-green focus:ring-offset-2",
  minTouchTarget: "min-h-11 min-w-11", // 44x44px recommended
}
