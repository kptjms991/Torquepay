// Supabase Database Types for TorquePay

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  user_type: "user" | "merchant" | "admin"
  kyc_status: "pending" | "verified" | "rejected"
  kyc_document_url: string | null
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface Wallet {
  id: string
  user_id: string
  balance: number
  currency: string
  pin_hash: string | null
  pin_set: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  transaction_type: "transfer" | "payment" | "add_money" | "settlement"
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "cancelled"
  description: string | null
  related_user_id: string | null
  payment_method: string | null
  reference_id: string | null
  created_at: string
  updated_at: string
}

export interface Merchant {
  id: string
  user_id: string
  business_name: string
  business_type: string
  settlement_account: string | null
  settlement_balance: number
  commission_rate: number
  status: "pending" | "active" | "suspended"
  website_url: string | null
  created_at: string
  updated_at: string
}

export interface ApiKey {
  id: string
  merchant_id: string
  public_key: string
  secret_key: string
  name: string
  is_test_mode: boolean
  is_active: boolean
  last_used_at: string | null
  created_at: string
}

export interface MerchantCheckout {
  id: string
  merchant_id: string
  session_id: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "cancelled"
  success_url: string
  cancel_url: string
  webhook_url: string | null
  customer_email: string | null
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface PaymentToken {
  id: string
  user_id: string
  token_type: "card" | "mobile_wallet" | "bank"
  token_value: string
  is_default: boolean
  is_active: boolean
  last_four: string | null
  created_at: string
  updated_at: string
}

export interface P2pTransfer {
  id: string
  sender_id: string
  recipient_id: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed"
  description: string | null
  created_at: string
  updated_at: string
}

export interface QrCode {
  id: string
  user_id: string
  qr_type: "payment" | "profile"
  amount: number | null
  description: string | null
  is_active: boolean
  expires_at: string | null
  created_at: string
}

export interface Dispute {
  id: string
  transaction_id: string
  complainant_id: string
  reason: string
  status: "open" | "investigating" | "resolved" | "closed"
  resolution_notes: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
}

export interface Webhook {
  id: string
  merchant_id: string
  endpoint_url: string
  events: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "transaction" | "system" | "promotion"
  is_read: boolean
  action_url: string | null
  created_at: string
}

export interface AdminLog {
  id: string
  admin_id: string
  action: string
  resource_type: string
  resource_id: string
  changes: Record<string, any> | null
  created_at: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
