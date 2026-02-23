# TorquePay - Payment Platform Setup Guide

## Overview

TorquePay is a comprehensive payment platform supporting three main user types:
- **Merchants** - Accept payments via hosted checkout
- **Admins** - Manage system, users, and disputes
- **MFS Users** - Send/receive money, manage wallets

## Project Structure

\`\`\`
├── /app
│   ├── (merchant)/
│   │   ├── dashboard/page.tsx
│   │   ├── api-keys/page.tsx
│   │   ├── checkout/page.tsx
│   │   └── payments/page.tsx
│   ├── (admin)/
│   │   ├── dashboard/page.tsx
│   │   ├── users/page.tsx
│   │   ├── disputes/page.tsx
│   │   └── settings/page.tsx
│   └── (mfs)/
│       ├── wallet/page.tsx
│       ├── send-money/page.tsx
│       ├── scanner/page.tsx
│       ├── security/page.tsx
│       └── payment-methods/page.tsx
├── /components
│   ├── merchant/
│   │   ├── dashboard-overview.tsx
│   │   ├── api-key-manager.tsx
│   │   └── checkout-settings.tsx
│   ├── admin/
│   │   ├── dashboard.tsx
│   │   ├── user-management.tsx
│   │   └── dispute-management.tsx
│   └── mfs/
│       ├── wallet-dashboard.tsx
│       ├── saved-payment-methods.tsx
│       ├── security-settings.tsx
│       └── qr-scanner.tsx
├── /lib/services
│   ├── merchant-service.ts
│   ├── admin-service.ts
│   └── mfs-service.ts
└── /scripts
    └── 01_create_torquepay_schema.sql
\`\`\`

## Database Schema

### Core Tables

#### profiles
- User/merchant/admin accounts
- KYC status tracking
- 2FA configuration
- Transaction PIN storage

#### wallets
- User wallet balances
- Currency support
- Status management

#### merchants
- Merchant business information
- Commission rates
- Settlement accounts

#### api_keys
- Merchant API credentials
- Test/live mode support

#### merchant_checkouts
- Hosted checkout configuration
- Webhook settings
- Payment method selection

#### transactions
- All payment records
- Gateway integration
- Settlement tracking

#### payment_tokens
- Saved payment methods
- Gateway tokens
- Default method flag

#### disputes
- Dispute records
- Resolution tracking
- Refund management

#### webhooks
- Merchant webhook endpoints
- Event configuration

#### notifications
- User notifications
- Unread status tracking

## Authentication & Authorization

### Setup Required

1. Configure Supabase authentication
2. Setup Row Level Security (RLS) policies
3. Implement role-based access control (RBAC)

### User Types

\`\`\`typescript
type UserType = 'user' | 'merchant' | 'admin';

// Policies
- Users: Can only see own data
- Merchants: Can manage own account and payments
- Admins: Full system access
\`\`\`

## API Keys for Merchants

### Generate New Key
\`\`\`typescript
const key = await merchantService.generateApiKey(merchantId, 'Production');
// Returns: { publicKey, secretKey, testMode }
\`\`\`

### Key Usage
- **Public Key**: For client-side initialization
- **Secret Key**: For server-side API calls (keep secure!)

## Payment Flow

### Hosted Checkout

\`\`\`
1. Merchant creates checkout via API
2. Customer redirected to TorquePay hosted page
3. Customer selects payment method
4. Payment processed (SSLCommerz, WeChat Pay, Alipay)
5. Customer redirected back to merchant
6. Webhook notifies merchant of result
\`\`\`

### Webhook Setup

\`\`\`typescript
// In merchant checkout settings:
{
  webhookUrl: "https://your-domain.com/webhooks/payment",
  webhookSecret: "whsec_xxxxx",
  paymentMethods: ["card", "bkash", "nagad", "wechat", "alipay"]
}

// Webhook payload verification
function verifyWebhook(body, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return hash === signature;
}
\`\`\`

## Component Usage Examples

### Merchant Dashboard

\`\`\`typescript
import { MerchantDashboardOverview } from '@/components/merchant/dashboard-overview';

<MerchantDashboardOverview
  transactions={500}
  volume={125000}
  settlementBalance={23500}
  pendingSettlement={5200}
  recentPayments={[...]}
/>
\`\`\`

### Admin User Management

\`\`\`typescript
import { UserManagement } from '@/components/admin/user-management';

<UserManagement
  users={users}
  onApproveMerchant={async (id) => { /* ... */ }}
  onRejectMerchant={async (id) => { /* ... */ }}
  onSuspendUser={async (id) => { /* ... */ }}
/>
\`\`\`

### MFS Wallet

\`\`\`typescript
import { WalletDashboard } from '@/components/mfs/wallet-dashboard';

<WalletDashboard
  balance={5000}
  currency="USD"
  recentTransactions={[...]}
  onSendMoney={() => {}}
  onAddMoney={() => {}}
  onScanQR={() => {}}
/>
\`\`\`

## Environment Variables

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Payment Gateways
SSLCOMMERZ_STORE_ID=xxxxx
SSLCOMMERZ_API_KEY=xxxxx

WECHAT_PAY_MERCHANT_ID=xxxxx
WECHAT_PAY_API_KEY=xxxxx

ALIPAY_APP_ID=xxxxx
ALIPAY_PRIVATE_KEY=xxxxx

# SMS Gateway (GENNET)
GENNET_API_KEY=xxxxx
GENNET_SENDER_ID=xxxxx

# Email
SENDGRID_API_KEY=xxxxx
\`\`\`

## Security Considerations

### Transaction PIN
- Set once, used for payment confirmation
- Never transmitted in plain text
- Hashed with bcrypt in production

### 2FA Methods
- SMS: Receive OTP via SMS
- Email: Receive OTP via email
- Authenticator: TOTP with Google Authenticator

### API Security
- All API endpoints require authentication
- Rate limiting: 100 requests/minute per API key
- IP whitelisting support
- Webhook signature verification required

## Deployment Checklist

- [ ] Configure Supabase RLS policies
- [ ] Setup environment variables
- [ ] Configure payment gateway credentials
- [ ] Setup SMTP for email notifications
- [ ] Setup SMS gateway (GENNET)
- [ ] Enable HTTPS
- [ ] Setup error tracking (Sentry)
- [ ] Configure CDN for assets
- [ ] Setup monitoring and alerting
- [ ] Load test the platform

## Next Steps

1. **Setup Database**: Run `/scripts/01_create_torquepay_schema.sql`
2. **Configure Auth**: Implement Supabase authentication
3. **Add Payment Gateways**: Integrate SSLCommerz, WeChat Pay, Alipay
4. **Complete Pages**: Add remaining pages for each interface
5. **Edge Functions**: Implement create-checkout, tokenized-payment, etc.
6. **Testing**: Comprehensive testing before production
7. **Deployment**: Deploy to Vercel/production environment

## Support

For issues or questions about TorquePay:
- Check the component documentation
- Review service implementation
- Consult Supabase documentation
- Contact payment gateway support
