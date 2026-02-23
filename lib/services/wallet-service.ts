import type { Transaction } from "@/types/chat"

export class WalletService {
  private static readonly WALLET_KEY = "p2p_wallet"
  private static readonly TRANSACTIONS_KEY = "p2p_transactions"

  static async getBalance(): Promise<number> {
    const wallet = this.getLocalWallet()
    return wallet.balance
  }

  static async transferMoney(recipientId: string, amount: number): Promise<Transaction> {
    const wallet = this.getLocalWallet()

    if (wallet.balance < amount) {
      throw new Error("Insufficient balance")
    }

    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: "send",
      amount,
      contact: recipientId,
      time: new Date().toLocaleTimeString(),
      status: "completed",
    }

    // Deduct from sender
    wallet.balance -= amount
    localStorage.setItem(this.WALLET_KEY, JSON.stringify(wallet))

    // Store transaction
    const transactions = this.getLocalTransactions()
    transactions.push(transaction)
    localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions))

    return transaction
  }

  static async getTransactions(): Promise<Transaction[]> {
    return this.getLocalTransactions()
  }

  static async addTransaction(transaction: Transaction): Promise<void> {
    const transactions = this.getLocalTransactions()
    transactions.push(transaction)
    localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions))
  }

  private static getLocalWallet() {
    try {
      const data = localStorage.getItem(this.WALLET_KEY)
      return data ? JSON.parse(data) : { balance: 2450.75, createdAt: new Date().toISOString() }
    } catch {
      return { balance: 2450.75, createdAt: new Date().toISOString() }
    }
  }

  private static getLocalTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(this.TRANSACTIONS_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }
}
