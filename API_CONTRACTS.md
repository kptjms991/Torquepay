# TorquePay API Contracts & Service Integration

## Overview

TorquePay uses three coordinated services:
- **Frontend Services** (React components calling these services)
- **Business Logic Services** (`lib/services/`)
- **Supabase Backend** (Database + Auth + Edge Functions)

---

## Merchant Service API

### `merchantService.getDashboard(merchantId: string)`

**Purpose**: Fetch merchant dashboard overview

**Request**:
```typescript
const dashboard = await merchantService.getDashboard('merchant-123')
```

**Response**:
```typescript
{
  transactions: Transaction[],    // Last 10 transactions
  merchant: Merchant,              // Merchant details
  apiKeys: ApiKey[]                // All API keys for this merchant
}
```

**Backend**: Supabase table `merchants`, `transactions`, `api_keys`

**Error Handling**:
```typescript
try {
  const dashboard = await merchantService.getDashboard(merchantId)
} catch (error) {
  toast.error('Failed to load dashboard')
  console.error(error)
}
```

---

### `merchantService.generateApiKey(merchantId: string, keyName: string)`

**Purpose**: Generate new API key pair

**Request**:
```typescript
const apiKey = await merchantService.generateApiKey('merchant-123', 'Production Key')
```

**Response**:
```typescript
{
  id: string,
  public_key: 'pk_live_xxxxxx',
  secret_key: 'sk_live_xxxxxx',
  key_name: 'Production Key',
  test_mode: false,
  created_at: '2026-02-24T...'
}
```

**Backend**: Insert into `api_keys` table, return encrypted secret

**Validation**:
- ✅ keyName must be 3-50 characters
- ✅ keyName must be unique per merchant
- ✅ Merchant must be active

**Error Handling**:
```typescript
if (!keyName || keyName.length < 3) {
  throw new Error('Key name must be at least 3 characters')
}
```

---

### `merchantService.getCheckoutSettings(merchantId: string)`

**Purpose**: Fetch merchant checkout configuration

**Request**:
```typescript
const settings = await merchantService.getCheckoutSettings('merchant-123')
```

**Response**:
```typescript
{
  merchant_id: string,
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel',
  webhook_url: 'https://example.com/webhook',
  enabled_methods: ['card', 'wallet'],
  test_mode: true,
  created_at: string
}
```

**Backend**: Supabase table `merchant_checkouts`

---

### `merchantService.updateCheckoutSettings(merchantId: string, settings: CheckoutSettings)`

**Purpose**: Update checkout configuration

**Request**:
```typescript
await merchantService.updateCheckoutSettings('merchant-123', {
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel',
  webhook_url: 'https://example.com/webhook',
  enabled_methods: ['card', 'wallet']
})
```

**Response**:
```typescript
{
  success: true,
  message: 'Checkout settings updated'
}
```

**Backend**: Update `merchant_checkouts` table

**Validation**:
- ✅ URLs must be valid HTTP(S)
- ✅ At least one payment method must be enabled
- ✅ Webhook URL must be reachable (tested)

---

### `merchantService.getTransactions(merchantId: string, filters?: TransactionFilters)`

**Purpose**: Fetch paginated transaction history

**Request**:
```typescript
const { transactions, total } = await merchantService.getTransactions(
  'merchant-123',
  {
    status: 'completed',
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-02-24'),
    limit: 20,
    offset: 0
  }
)
```

**Response**:
```typescript
{
  transactions: Transaction[],
  total: number,
  page: number,
  pageSize: number
}
```

**Backend**: Supabase table `transactions` with filters

**Pagination**: Offset-based, max 100 per page

---

## Admin Service API

### `adminService.getDashboard()`

**Purpose**: Fetch platform overview for admin

**Request**:
```typescript
const dashboard = await adminService.getDashboard()
```

**Response**:
```typescript
{
  totalUsers: number,
  activeMerchants: number,
  totalVolume: number,
  openDisputes: number,
  recentTransactions: Transaction[]
}
```

**Backend**: Aggregates from `profiles`, `merchants`, `transactions`, `disputes` tables

**Authorization**: Admin only (checked in middleware)

---

### `adminService.getUsers(filters?: UserFilters)`

**Purpose**: Fetch all users with filtering

**Request**:
```typescript
const { users, total } = await adminService.getUsers({
  type: 'merchant',  // 'user' | 'merchant' | 'admin'
  kycStatus: 'pending',  // 'pending' | 'verified' | 'rejected'
  limit: 20,
  offset: 0
})
```

**Response**:
```typescript
{
  users: Profile[],
  total: number
}
```

**Backend**: Supabase table `profiles`

---

### `adminService.updateUserKyc(userId: string, status: 'verified' | 'rejected', notes?: string)`

**Purpose**: Approve or reject merchant KYC

**Request**:
```typescript
await adminService.updateUserKyc(
  'user-123',
  'verified',
  'Documents verified and approved'
)
```

**Response**:
```typescript
{
  success: true,
  message: 'User KYC status updated'
}
```

**Backend**: Update `profiles` table, trigger email notification

**Validation**:
- ✅ User must be merchant type
- ✅ Current status must be 'pending'
- ✅ Notes must be 10-500 characters if rejecting

---

### `adminService.getTransactions(filters?: TransactionFilters)`

**Purpose**: Fetch all platform transactions

**Request**:
```typescript
const { transactions, total } = await adminService.getTransactions({
  status: 'completed',
  minAmount: 100,
  maxAmount: 10000,
  limit: 50
})
```

**Response**:
```typescript
{
  transactions: Transaction[],
  total: number
}
```

**Backend**: Supabase table `transactions` (all rows, no merchant filter)

---

### `adminService.getDisputes(filters?: DisputeFilters)`

**Purpose**: Fetch all platform disputes

**Request**:
```typescript
const { disputes, total } = await adminService.getDisputes({
  status: 'open',
  limit: 20
})
```

**Response**:
```typescript
{
  disputes: Dispute[],
  total: number
}
```

**Backend**: Supabase table `disputes`

---

### `adminService.updateDisputeStatus(disputeId: string, status: DisputeStatus, resolutionNotes: string)`

**Purpose**: Resolve a dispute

**Request**:
```typescript
await adminService.updateDisputeStatus(
  'dispute-123',
  'resolved',
  'Refund approved. User verified ownership.'
)
```

**Response**:
```typescript
{
  success: true,
  message: 'Dispute resolved'
}
```

**Backend**: Update `disputes` table, trigger refund logic

---

## MFS Service API

### `mfsService.getWallet(userId: string)`

**Purpose**: Fetch user wallet

**Request**:
```typescript
const wallet = await mfsService.getWallet('user-123')
```

**Response**:
```typescript
{
  id: string,
  user_id: string,
  balance: 5000,  // In cents
  currency: 'BDT',
  status: 'active',
  created_at: string
}
```

**Backend**: Supabase table `wallets`

---

### `mfsService.sendMoney(fromUserId: string, toUserId: string, amount: number, pin: string)`

**Purpose**: Send P2P transfer

**Request**:
```typescript
const transfer = await mfsService.sendMoney(
  'user-123',
  'user-456',
  10000,  // Amount in cents (100 BDT)
  '1234'  // Transaction PIN
)
```

**Response**:
```typescript
{
  id: string,
  from_user_id: string,
  to_user_id: string,
  amount: 10000,
  status: 'completed',
  created_at: string
}
```

**Backend**: 
1. Verify PIN matches user's transaction PIN
2. Verify sufficient balance
3. Create transaction record
4. Update both wallets
5. Return transaction ID

**Validation**:
- ✅ PIN must be exactly 4 digits
- ✅ Amount must be > 0
- ✅ Amount must be <= sender balance
- ✅ Recipient must exist
- ✅ Cannot send to self

**Error Handling**:
```typescript
try {
  await mfsService.sendMoney(from, to, amount, pin)
  toast.success('Money sent successfully')
} catch (error) {
  if (error.message === 'Insufficient balance') {
    toast.error('You don\'t have enough balance')
  } else if (error.message === 'Invalid PIN') {
    toast.error('Incorrect PIN. Please try again')
  } else {
    toast.error('Transfer failed. Please try again')
  }
}
```

---

### `mfsService.getTransactionHistory(userId: string, limit?: number)`

**Purpose**: Fetch user transaction history

**Request**:
```typescript
const transactions = await mfsService.getTransactionHistory('user-123', 50)
```

**Response**:
```typescript
Transaction[]
```

**Backend**: Query `transactions` table where user_id or merchant_id matches

---

### `mfsService.generateQrCode(userId: string, amount: number, description?: string)`

**Purpose**: Generate QR payment code

**Request**:
```typescript
const qrCode = await mfsService.generateQrCode(
  'user-123',
  50000,  // 500 BDT
  'Concert tickets'
)
```

**Response**:
```typescript
{
  id: string,
  user_id: string,
  amount: 50000,
  description: 'Concert tickets',
  qr_data: 'payment://user-123?amount=50000&qr_id=abc123',
  status: 'active',
  expires_at: string
}
```

**Backend**: Insert into `qr_codes` table, encode payment data

**Expiry**: QR codes expire in 24 hours

---

### `mfsService.confirmQrPayment(qrCodeId: string, payerUserId: string, pin: string)`

**Purpose**: Confirm and complete QR payment

**Request**:
```typescript
const payment = await mfsService.confirmQrPayment(
  'qr-abc123',
  'user-456',  // Person scanning/paying
  '1234'       // Their PIN
)
```

**Response**:
```typescript
{
  transaction_id: string,
  status: 'completed',
  amount: 50000,
  from_user_id: string,
  to_user_id: string
}
```

**Backend**:
1. Verify QR code is not expired
2. Verify PIN
3. Verify sufficient balance
4. Create transaction
5. Update both wallets
6. Mark QR as used

**Validation**:
- ✅ QR code must exist and not be expired
- ✅ QR code must be active (not already used)
- ✅ Payer must have sufficient balance
- ✅ PIN must be correct

---

### `mfsService.getSavedPaymentMethods(userId: string)`

**Purpose**: Fetch saved payment cards/wallets

**Request**:
```typescript
const methods = await mfsService.getSavedPaymentMethods('user-123')
```

**Response**:
```typescript
PaymentToken[]
```

**Backend**: Supabase table `payment_tokens`

---

### `mfsService.addPaymentMethod(userId: string, token: PaymentToken)`

**Purpose**: Add new payment card/wallet

**Request**:
```typescript
const method = await mfsService.addPaymentMethod('user-123', {
  token_type: 'card',
  card_last4: '4242',
  card_brand: 'visa',
  exp_month: 12,
  exp_year: 2026
})
```

**Response**:
```typescript
{
  id: string,
  user_id: string,
  token_type: 'card',
  card_last4: '4242',
  is_default: false,
  created_at: string
}
```

**Backend**: Insert into `payment_tokens` table

---

### `mfsService.setTransactionPin(userId: string, pin: string)`

**Purpose**: Set or update transaction PIN

**Request**:
```typescript
await mfsService.setTransactionPin('user-123', '5678')
```

**Response**:
```typescript
{
  success: true,
  message: 'PIN set successfully'
}
```

**Backend**: 
1. Hash PIN using bcrypt
2. Update `profiles` table
3. Return success

**Validation**:
- ✅ PIN must be exactly 4 digits
- ✅ All digits (cannot be alphabetic)

---

### `mfsService.setupTwoFa(userId: string, method: '2fa_method')`

**Purpose**: Enable 2FA

**Request**:
```typescript
const setup = await mfsService.setupTwoFa('user-123', 'authenticator')
```

**Response**:
```typescript
{
  qr_code: 'otpauth://totp/TorquePay:user@example.com...',
  backup_codes: ['code1', 'code2', ...],  // 10 codes
  secret: 'JBSWY3DPEBLW64TMMQ======'
}
```

**Backend**: Generate TOTP secret, create backup codes

**Verification**: User scans QR code with authenticator app, verifies by entering code

---

### `mfsService.verifyTwoFa(userId: string, code: string)`

**Purpose**: Verify 2FA code during login

**Request**:
```typescript
const verified = await mfsService.verifyTwoFa('user-123', '123456')
```

**Response**:
```typescript
{
  valid: true,
  message: 'Code verified'
}
```

**Backend**: Verify TOTP code against stored secret

---

## Error Response Format

All services follow this error response format:

```typescript
{
  error: true,
  code: 'ERROR_CODE',  // e.g., 'INSUFFICIENT_BALANCE'
  message: 'Human readable error',
  details?: object  // Additional context if needed
}
```

**Common Error Codes**:
- `AUTHENTICATION_REQUIRED` - User not logged in
- `AUTHORIZATION_FAILED` - User doesn't have permission
- `INVALID_INPUT` - Validation failed
- `RESOURCE_NOT_FOUND` - Record doesn't exist
- `INSUFFICIENT_BALANCE` - Not enough money
- `INVALID_PIN` - Wrong PIN
- `NETWORK_ERROR` - Backend connection failed
- `DATABASE_ERROR` - Query failed
- `DUPLICATE_ENTRY` - Record already exists

---

## Type Definitions

All types are defined in `types/database.ts`:

```typescript
interface Transaction {
  id: string
  user_id?: string
  merchant_id?: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  description?: string
  created_at: string
}

interface Merchant {
  id: string
  user_id: string
  name: string
  status: 'pending' | 'active' | 'suspended'
  kyc_status: 'pending' | 'verified' | 'rejected'
}

interface ApiKey {
  id: string
  merchant_id: string
  public_key: string
  secret_key: string  // Only returned on creation
  key_name: string
  test_mode: boolean
  created_at: string
}

interface Wallet {
  id: string
  user_id: string
  balance: number  // In cents
  currency: string
  status: 'active' | 'frozen'
}
```

---

## Rate Limiting

- Public endpoints: 100 requests/minute per IP
- Authenticated endpoints: 1000 requests/minute per user
- Payment endpoints: 50 requests/minute per user

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

