export interface EncryptedMessage {
  ciphertext: string
  nonce: string
  senderPublicKey: string
}

export async function encryptMessage(
  message: string,
  recipientPublicKey: string,
  senderSecretKey: string,
): Promise<EncryptedMessage> {
  const nonce = crypto.getRandomValues(new Uint8Array(12))

  const algorithm = {
    name: "AES-GCM",
    iv: nonce,
  }

  const key = await crypto.subtle.importKey("raw", Buffer.from(senderSecretKey, "hex").slice(0, 32), algorithm, false, [
    "encrypt",
  ])

  const messageBytes = new TextEncoder().encode(message)
  const ciphertext = await crypto.subtle.encrypt(algorithm, key, messageBytes)

  return {
    ciphertext: Buffer.from(ciphertext).toString("hex"),
    nonce: Buffer.from(nonce).toString("hex"),
    senderPublicKey: recipientPublicKey,
  }
}

export async function decryptMessage(encrypted: EncryptedMessage, recipientSecretKey: string): Promise<string | null> {
  try {
    const nonce = Buffer.from(encrypted.nonce, "hex")
    const ciphertext = Buffer.from(encrypted.ciphertext, "hex")

    const algorithm = {
      name: "AES-GCM",
      iv: nonce,
    }

    const key = await crypto.subtle.importKey(
      "raw",
      Buffer.from(recipientSecretKey, "hex").slice(0, 32),
      algorithm,
      false,
      ["decrypt"],
    )

    const decrypted = await crypto.subtle.decrypt(algorithm, key, ciphertext)
    return new TextDecoder().decode(decrypted)
  } catch {
    return null
  }
}
