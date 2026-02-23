import { createClient } from "@/lib/supabase/server"
import { PaymentService } from "@/lib/services/payment-service"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recipientId, amount } = await request.json()

    if (!recipientId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid payment data" }, { status: 400 })
    }

    const transaction = await PaymentService.sendMoney(user.id, recipientId, amount)

    return NextResponse.json({ success: true, transaction })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment processing failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
