export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export class PWAManager {
  private deferredPrompt: InstallPromptEvent | null = null

  setupInstallPrompt(): void {
    if (typeof window === "undefined") return

    window.addEventListener("beforeinstallprompt", (e: Event) => {
      e.preventDefault()
      this.deferredPrompt = e as InstallPromptEvent
    })
  }

  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) return false

    this.deferredPrompt.prompt()
    const choice = await this.deferredPrompt.userChoice
    this.deferredPrompt = null

    return choice.outcome === "accepted"
  }

  isInstalled(): boolean {
    if (typeof window === "undefined") return false
    return window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true
  }

  canInstall(): boolean {
    return this.deferredPrompt !== null
  }
}

export const pwaManager = new PWAManager()
