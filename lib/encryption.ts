// End-to-end encryption utilities
import crypto from "crypto"

export async function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  })

  return { publicKey, privateKey }
}

export function encryptMessage(message: string, publicKey: string): string {
  const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(message))
  return encrypted.toString("base64")
}

export function decryptMessage(encryptedMessage: string, privateKey: string): string {
  const decrypted = crypto.privateDecrypt(privateKey, Buffer.from(encryptedMessage, "base64"))
  return decrypted.toString("utf-8")
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
}
