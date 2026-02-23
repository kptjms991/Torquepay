import { createClient } from "@/lib/supabase/server"

export interface PaymentRequest {
  recipientId: string
  amount: number
  description?: string
  qrData?: string
}

export class PaymentService {
  static async generatePaymentQR(userId: string, amount = 0): Promise<string> {
    const paymentData = {
      user_id: userId,
      amount,
      timestamp: Date.now(),
    }
    return Buffer.from(JSON.stringify(paymentData)).toString("base64")
  }

  static async processQRPayment(qrData: string): Promise<{ recipientId: string; amount: number; valid: boolean }> {
    try {
      const decoded = Buffer.from(qrData, "base64").toString("utf-8")
      const paymentData = JSON.parse(decoded)
      return {
        recipientId: paymentData.user_id,
        amount: paymentData.amount,
        valid: true,
      }
    } catch {
      return { recipientId: "", amount: 0, valid: false }
    }
  }

  static async sendMoney(recipientId: string, amount: number): Promise<{ success: boolean; message: string }> {
    try {
      // Validate amount
      if (amount <= 0) {
        throw new Error("Amount must be positive")
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 500))

      return { success: true, message: "Payment sent successfully" }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : "Payment failed" }
    }
  }

  static async getTransactionHistory(userId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }
}
