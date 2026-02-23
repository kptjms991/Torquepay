-- TorquePay Database Schema

-- Profiles table (extended with merchant info)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  full_name TEXT,
  phone TEXT,
  user_type TEXT DEFAULT 'user', -- 'user', 'merchant', 'admin'
  kyc_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  kyc_data JSONB,
  profile_image_url TEXT,
  transaction_pin TEXT, -- hashed PIN
  two_fa_enabled BOOLEAN DEFAULT FALSE,
  two_fa_method TEXT, -- 'sms', 'email', 'authenticator'
  two_fa_secret TEXT, -- for TOTP
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  balance DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'active', -- 'active', 'frozen', 'closed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Merchants table
CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT,
  website_url TEXT,
  description TEXT,
  logo_url TEXT,
  settlement_account JSONB, -- Bank account details
  commission_rate DECIMAL(5, 2) DEFAULT 2.5,
  status TEXT DEFAULT 'active', -- 'active', 'suspended', 'closed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  public_key TEXT UNIQUE NOT NULL,
  secret_key TEXT NOT NULL,
  test_mode BOOLEAN DEFAULT TRUE,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Hosted Checkout Settings
CREATE TABLE IF NOT EXISTS merchant_checkouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  success_url TEXT,
  cancel_url TEXT,
  webhook_url TEXT,
  webhook_secret TEXT,
  return_method TEXT DEFAULT 'GET', -- 'GET', 'POST'
  payment_methods JSONB, -- ['card', 'bkash', 'nagad', 'alipay', 'wechat']
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(merchant_id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT UNIQUE NOT NULL,
  merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES profiles(id),
  wallet_id UUID REFERENCES wallets(id),
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT, -- 'card', 'bkash', 'nagad', 'alipay', 'wechat', 'wallet'
  gateway TEXT, -- 'sslcommerz', 'wechat_pay', 'alipay'
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled', 'refunded'
  description TEXT,
  metadata JSONB,
  gateway_response JSONB,
  commission_amount DECIMAL(15, 2) DEFAULT 0,
  settlement_status TEXT DEFAULT 'pending', -- 'pending', 'settled', 'failed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  INDEX idx_merchant_id (merchant_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Payment Tokens (saved payment methods)
CREATE TABLE IF NOT EXISTS payment_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token_name TEXT,
  token_type TEXT NOT NULL, -- 'card', 'bkash', 'nagad', 'alipay', 'wechat'
  gateway_token TEXT NOT NULL, -- Token from payment gateway
  last_four TEXT,
  expiry_date TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Peer-to-Peer Transfers
CREATE TABLE IF NOT EXISTS p2p_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id),
  receiver_id UUID NOT NULL REFERENCES profiles(id),
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'failed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- QR Codes
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  qr_type TEXT NOT NULL, -- 'payment', 'wallet', 'transfer'
  qr_data JSONB NOT NULL,
  qr_image_url TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Disputes
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  complainant_id UUID NOT NULL REFERENCES profiles(id),
  respondent_id UUID REFERENCES profiles(id),
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'closed'
  resolution TEXT,
  amount_claimed DECIMAL(15, 2),
  amount_refunded DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Webhooks
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'payment.completed', 'payment.failed', 'refund.created'
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Webhook Logs
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status_code INTEGER,
  response TEXT,
  retry_count INTEGER DEFAULT 0,
  next_retry_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'payment_received', 'payment_sent', 'transfer', 'security', 'system'
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- Admin Logs (for audit trail)
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_merchants_user_id ON merchants(user_id);
CREATE INDEX idx_api_keys_merchant_id ON api_keys(merchant_id);
CREATE INDEX idx_payment_tokens_user_id ON payment_tokens(user_id);
CREATE INDEX idx_p2p_sender ON p2p_transfers(sender_id);
CREATE INDEX idx_p2p_receiver ON p2p_transfers(receiver_id);
CREATE INDEX idx_disputes_transaction_id ON disputes(transaction_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);

-- Row Level Security (RLS) - Users can only see their own data
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR (SELECT user_type FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can view their own wallet"
  ON wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM merchants WHERE id = merchant_id
  ));

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);
