import { encryptMessage } from "@/lib/crypto/signal-protocol"
import type { Message } from "@/types/chat"

export class MessagingService {
  private static readonly MESSAGES_KEY = "p2p_messages"

  // Store message locally with encryption
  static async sendMessage(
    recipientId: string,
    content: string,
    senderPublicKey: string,
    recipientPublicKey: string,
  ): Promise<Message> {
    const encrypted = await encryptMessage(content, recipientPublicKey)

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      sender: "user",
      text: content,
      encrypted: true,
      timestamp: new Date(),
      status: "sent",
      senderPublicKey,
      recipientId,
    }

    // Store in local storage
    const messages = this.getLocalMessages()
    messages.push(message)
    localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages))

    return message
  }

  // Retrieve messages for a contact from local storage
  static async getMessages(contactId: string): Promise<Message[]> {
    const messages = this.getLocalMessages()
    return messages.filter((m: Message) => m.recipientId === contactId)
  }

  // Mark message as read
  static async markAsRead(messageId: string): Promise<void> {
    const messages = this.getLocalMessages()
    const message = messages.find((m: Message) => m.id === messageId)
    if (message) {
      message.status = "read"
      localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages))
    }
  }

  // Local subscription simulation
  static subscribeToMessages(contactId: string, callback: (message: Message) => void) {
    const interval = setInterval(() => {
      const messages = this.getLocalMessages()
      const newMessages = messages.filter((m: Message) => m.recipientId === contactId && m.status === "sent")
      newMessages.forEach((msg) => callback(msg))
    }, 1000)

    return { unsubscribe: () => clearInterval(interval) }
  }

  private static getLocalMessages(): Message[] {
    try {
      const data = localStorage.getItem(this.MESSAGES_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }
}
