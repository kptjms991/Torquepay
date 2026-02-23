// Biometric authentication utilities
export class BiometricAuth {
  static async isAvailable(): Promise<boolean> {
    if (!window.PublicKeyCredential) return false

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      return available
    } catch {
      return false
    }
  }

  static async registerBiometric(userId: string): Promise<void> {
    if (!window.PublicKeyCredential) {
      throw new Error("WebAuthn not supported")
    }

    const registration = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array(32),
        rp: {
          name: "WeChat",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: userId,
          displayName: "WeChat User",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 },
        ],
        timeout: 60000,
        attestation: "direct",
      },
    })

    if (!registration) {
      throw new Error("Biometric registration failed")
    }
  }

  static async authenticate(): Promise<boolean> {
    if (!window.PublicKeyCredential) {
      throw new Error("WebAuthn not supported")
    }

    try {
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          timeout: 60000,
          userVerification: "preferred",
        },
      })

      return !!assertion
    } catch {
      return false
    }
  }
}
