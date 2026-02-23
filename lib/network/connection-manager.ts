export class ConnectionManager {
  private isOnline = typeof navigator !== "undefined" ? navigator.onLine : true
  private listeners: Set<(isOnline: boolean) => void> = new Set()

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.setOnline(true))
      window.addEventListener("offline", () => this.setOnline(false))
    }
  }

  private setOnline(isOnline: boolean) {
    this.isOnline = isOnline
    this.listeners.forEach((listener) => listener(isOnline))
  }

  getIsOnline(): boolean {
    return this.isOnline
  }

  subscribe(listener: (isOnline: boolean) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}

export const connectionManager = new ConnectionManager()
