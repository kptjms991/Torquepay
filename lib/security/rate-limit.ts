interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()

  check(key: string, maxRequests = 10, windowMs = 60000): boolean {
    const now = Date.now()
    const entry = this.limits.get(key)

    if (!entry || now > entry.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (entry.count < maxRequests) {
      entry.count++
      return true
    }

    return false
  }

  reset(key: string): void {
    this.limits.delete(key)
  }
}

export const rateLimiter = new RateLimiter()
