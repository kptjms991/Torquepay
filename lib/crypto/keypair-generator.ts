import { generateMnemonic } from './bip39'

export interface KeyPair {
  publicKey: string
  secretKey: string
  publicKeyBytes: Uint8Array
  secretKeyBytes: Uint8Array
}

// Re-export BIP39 function for convenience
export const generateBIP39Phrase = generateMnemonic

export async function generateKeyPair(): Promise<KeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "Ed25519",
      namedCurve: "Ed25519",
    },
    true,
    ["sign", "verify"],
  )

  const publicKeyBytes = await crypto.subtle.exportKey("raw", keyPair.publicKey)
  const secretKeyBytes = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey)

  return {
    publicKey: Buffer.from(publicKeyBytes).toString("hex"),
    secretKey: Buffer.from(secretKeyBytes).toString("hex"),
    publicKeyBytes: new Uint8Array(publicKeyBytes),
    secretKeyBytes: new Uint8Array(secretKeyBytes),
  }
}

export async function signMessage(message: string, secretKey: string): Promise<string> {
  const secretKeyBytes = Buffer.from(secretKey, "hex")
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    secretKeyBytes,
    { name: "Ed25519", namedCurve: "Ed25519" },
    false,
    ["sign"],
  )

  const messageBytes = new TextEncoder().encode(message)
  const signature = await crypto.subtle.sign("Ed25519", privateKey, messageBytes)
  return Buffer.from(signature).toString("hex")
}

export async function verifyMessage(signedMessage: string, publicKey: string): Promise<string | null> {
  try {
    const signatureBytes = Buffer.from(signedMessage, "hex")
    const publicKeyBytes = Buffer.from(publicKey, "hex")

    const publicKeyObj = await crypto.subtle.importKey(
      "raw",
      publicKeyBytes,
      { name: "Ed25519", namedCurve: "Ed25519" },
      false,
      ["verify"],
    )

    const isValid = await crypto.subtle.verify(
      "Ed25519",
      publicKeyObj,
      signatureBytes,
      new TextEncoder().encode(signedMessage),
    )

    return isValid ? signedMessage : null
  } catch {
    return null
  }
}
