export interface QueuedMessage {
  id: string
  recipientPublicKey: string
  content: string
  encryptedContent: string
  timestamp: number
  status: "queued" | "sent" | "failed"
}

const QUEUE_KEY = "p2p_message_queue"

export class MessageQueue {
  static addToQueue(message: Omit<QueuedMessage, "id" | "timestamp">): QueuedMessage {
    const queued: QueuedMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    }

    const queue = this.getQueue()
    queue.push(queued)
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
    return queued
  }

  static getQueue(): QueuedMessage[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(QUEUE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  static markAsSent(messageId: string): void {
    const queue = this.getQueue()
    const message = queue.find((m) => m.id === messageId)
    if (message) {
      message.status = "sent"
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
    }
  }

  static clearQueue(): void {
    localStorage.removeItem(QUEUE_KEY)
  }
}
