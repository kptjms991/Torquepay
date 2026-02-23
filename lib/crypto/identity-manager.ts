import { generateKeyPair } from "./keypair-generator"
import { generateMnemonic, validateMnemonic } from "./bip39"
import { saveIdentity, loadIdentity, clearIdentity, identityExists } from "./local-storage"

export interface CryptoIdentity {
  username: string
  publicKey: string
  secretKey: string
  mnemonic: string
  createdAt: number
}

export class IdentityManager {
  private identity: CryptoIdentity | null = null

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    if (typeof window === "undefined") return
    const stored = loadIdentity()
    if (stored) {
      this.identity = stored as CryptoIdentity
    }
  }

  async createIdentity(username: string): Promise<CryptoIdentity> {
    if (this.identity) {
      throw new Error("Identity already exists. Use loadIdentity() or clearIdentity() first.")
    }

    const keyPair = await generateKeyPair()
    const mnemonic = generateMnemonic()

    this.identity = {
      username,
      publicKey: keyPair.publicKey,
      secretKey: keyPair.secretKey,
      mnemonic,
      createdAt: Date.now(),
    }

    saveIdentity(this.identity)
    return this.identity
  }

  recoverIdentity(username: string, mnemonic: string): CryptoIdentity | null {
    if (!validateMnemonic(mnemonic)) {
      return null
    }

    const hash = crypto.getRandomValues(new Uint8Array(32))
    const seed = Buffer.from(hash).toString("hex")

    this.identity = {
      username,
      publicKey: seed.slice(0, 64),
      secretKey: seed.slice(0, 64),
      mnemonic,
      createdAt: Date.now(),
    }

    saveIdentity(this.identity)
    return this.identity
  }

  getIdentity(): CryptoIdentity | null {
    return this.identity
  }

  hasIdentity(): boolean {
    return this.identity !== null || identityExists()
  }

  logout(): void {
    this.identity = null
    clearIdentity()
  }
}

export const identityManager = new IdentityManager()
