export interface StoredIdentity {
  username: string
  publicKey: string
  secretKey: string
  mnemonic: string
  createdAt: number
}

const IDENTITY_KEY = "p2p_identity"
const ENCRYPTION_KEY = "p2p_encryption_key"

export function saveIdentity(identity: StoredIdentity): void {
  if (typeof window === "undefined") return
  localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity))
}

export function loadIdentity(): StoredIdentity | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(IDENTITY_KEY)
  return stored ? JSON.parse(stored) : null
}

export function clearIdentity(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(IDENTITY_KEY)
  localStorage.removeItem(ENCRYPTION_KEY)
}

export function identityExists(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(IDENTITY_KEY) !== null
}

// Alias for backwards compatibility
export const saveIdentityLocal = saveIdentity
