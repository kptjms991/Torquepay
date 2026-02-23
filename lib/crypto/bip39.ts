const WORDLIST = [
  "abandon",
  "ability",
  "able",
  "about",
  "above",
  "absent",
  "absorb",
  "abstract",
  "abuse",
  "access",
  "accident",
  "account",
  "accuse",
  "achieve",
  "acid",
  "acknowledge",
  "acquire",
  "across",
  "act",
  "action",
  "active",
  "actor",
  "actual",
  "acuate",
  "acute",
  "ad",
  "adapt",
  "add",
  "added",
  "addict",
  // Simplified list - in production use full BIP39 wordlist
].slice(0, 100)

export function generateMnemonic(): string {
  const words: string[] = []
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * WORDLIST.length)
    words.push(WORDLIST[randomIndex])
  }
  return words.join(" ")
}

export function validateMnemonic(mnemonic: string): boolean {
  const words = mnemonic.trim().split(/\s+/)
  if (words.length !== 12) return false
  return words.every((word) => WORDLIST.includes(word))
}

export function mnemonicToSeed(mnemonic: string): string {
  // Simplified - in production use PBKDF2 with proper implementation
  const hash = require("crypto").createHash("sha256")
  hash.update(mnemonic + "mnemonic")
  return hash.digest("hex")
}
