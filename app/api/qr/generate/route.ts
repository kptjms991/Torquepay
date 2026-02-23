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

    const { amount = 0 } = await request.json()

    const qrData = await PaymentService.generatePaymentQR(user.id, amount)

    return NextResponse.json({ success: true, qrData, qrUrl: `data:image/png;base64,${qrData}` })
  } catch (error) {
    const message = error instanceof Error ? error.message : "QR generation failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
