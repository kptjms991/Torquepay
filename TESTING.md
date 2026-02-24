# TorquePay Integration Testing Guide

## Pre-Deployment Checklist

### Phase 1: Build Verification

```bash
# 1. Dependency check
npm install

# 2. Type checking
npm run type-check

# 3. Build testing
npm run build

# 4. Environment validation
npm run validate
```

**Success Criteria**:
- ✅ `npm install` completes without errors
- ✅ TypeScript type-check passes
- ✅ Build completes in under 3 minutes
- ✅ No console errors during validation

---

## Critical User Journey Tests

### Journey 1: Merchant Checkout Flow

**Test Case**: Merchant generates API key and creates checkout

**Steps**:
1. Login as merchant (navigate to `/login`)
2. Go to `/merchant/api-keys`
3. Click "Generate New Key"
4. Fill in key name: "Test Key"
5. Copy public and secret keys
6. Navigate to `/merchant/checkout-settings`
7. Configure success URL: `http://localhost:3000/success`
8. Configure cancel URL: `http://localhost:3000/cancel`
9. Select payment methods (card, mobile wallet)
10. Save settings

**Expected Results**:
- ✅ API keys generated with unique pk_ and sk_ prefixes
- ✅ Keys can be copied to clipboard
- ✅ Checkout settings persisted in database
- ✅ Dashboard shows total API keys and recent transactions
- ✅ Navigation between pages smooth and quick (<1s)

**Error Handling**:
- ✅ Attempting to generate key without name shows validation error
- ✅ Network errors display toast notification
- ✅ Invalid URL shows inline validation

---

### Journey 2: Admin User Management & Approval

**Test Case**: Admin approves a merchant application

**Steps**:
1. Login as admin (navigate to `/login` with admin account)
2. Go to `/admin` (dashboard)
3. Verify dashboard loads with user counts and transaction volume
4. Navigate to `/admin/users`
5. Search for a pending merchant
6. Click merchant row to view details
7. Change KYC status from "pending" to "approved"
8. Save changes
9. Return to dashboard
10. Verify merchant is now listed in active merchants

**Expected Results**:
- ✅ Dashboard shows platform overview (user count, volume, disputes)
- ✅ User list loads with pagination (10 per page)
- ✅ Search/filter works correctly
- ✅ KYC status update triggers backend update
- ✅ Toast notification confirms save
- ✅ Approval changes visible after page refresh
- ✅ Admin can view transaction history per merchant

**Error Handling**:
- ✅ Unauthorized users blocked from `/admin` routes
- ✅ Invalid KYC status shows error
- ✅ Network timeout shows retry button

---

### Journey 3: Consumer P2P Transfer with QR

**Test Case**: User sends money and receives via QR scan

**Sub-Test 3A: Send Money**
1. Login as consumer user
2. Navigate to `/dashboard` (wallet)
3. Verify balance displays correctly
4. Click "Send Money"
5. Search recipient by phone number
6. Enter amount: 500
7. Review transaction details
8. Enter transaction PIN (4 digits)
9. Confirm send
10. Verify transaction appears in history

**Expected Results**:
- ✅ Wallet balance loaded correctly
- ✅ Recent transactions displayed with status
- ✅ Search returns matching recipients
- ✅ Amount input validated (must be > 0, <= balance)
- ✅ PIN form accepts exactly 4 digits
- ✅ Success toast and redirect to dashboard
- ✅ Transaction shows in history with status "completed"
- ✅ Recipient balance updated in real-time

**Error Handling**:
- ✅ Insufficient balance shows error
- ✅ Invalid PIN shows retry
- ✅ Network error shows retry button

---

**Sub-Test 3B: QR Generation & Scanning**
1. Navigate to `/qr/generate`
2. Enter amount: 1000
3. Enter description: "Lunch payment"
4. Click "Generate QR Code"
5. QR code displays with amount and description
6. In another browser tab, navigate to `/qr/scan`
7. Click "Open Camera"
8. Point camera at QR code (or upload QR image)
9. Once scanned, confirm payment details
10. Enter transaction PIN
11. Confirm payment

**Expected Results**:
- ✅ QR code generates with encoded payment data
- ✅ QR code contains amount, user ID, and description
- ✅ Camera opens with proper permissions request
- ✅ Scanning reads QR code correctly
- ✅ Payment details pre-filled after scan
- ✅ PIN verification required
- ✅ Funds transferred successfully
- ✅ Both users see transaction in history

**Error Handling**:
- ✅ Camera permission denied shows helpful message
- ✅ Invalid QR code shows error
- ✅ Expired QR shows error
- ✅ Insufficient balance shows error before PIN

---

### Journey 4: Security Setup (PIN & 2FA)

**Test Case 4A: Set Transaction PIN**
1. Navigate to `/security/pin`
2. Leave current PIN blank (first time)
3. Enter new PIN: 1234
4. Confirm PIN: 1234
5. Click "Save PIN"

**Expected Results**:
- ✅ PIN must be exactly 4 digits
- ✅ Confirmation must match
- ✅ Success notification displayed
- ✅ PIN persisted in database (hashed)

**Error Handling**:
- ✅ PIN < 4 digits rejected
- ✅ Mismatched confirmation shows error
- ✅ Non-numeric input rejected

**Test Case 4B: Enable 2FA**
1. Navigate to `/security/2fa`
2. Select "Authenticator App"
3. QR code displays
4. Scan with authenticator app (Google Authenticator, Authy)
5. Enter 6-digit code from app
6. Click "Verify & Enable"
7. Backup codes display
8. Copy and save backup codes
9. Click "Complete Setup"

**Expected Results**:
- ✅ QR code displays with user email encoded
- ✅ After enabling, login requires 2FA code
- ✅ Backup codes can be used if app unavailable
- ✅ Each backup code works only once
- ✅ Settings show 2FA status as "enabled"

**Error Handling**:
- ✅ Wrong 6-digit code shows error with retry
- ✅ Using invalid backup code shows error

---

## Integration Points Testing

### Supabase Connection

```typescript
// Test in browser console
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
const { data, error } = await supabase.from('profiles').select().limit(1)
console.log(error || data)  // Should return 1 row or null error
```

**Verify**:
- ✅ Connection established without errors
- ✅ Query returns data
- ✅ Auth token is valid

### Service Layer Testing

```typescript
// Test merchant service
import { merchantService } from '@/lib/services/merchant-service'
const dashboard = await merchantService.getDashboard('merchant-id')
console.log(dashboard)  // Should have transactions, merchant, apiKeys

// Test admin service
import { adminService } from '@/lib/services/admin-service'
const admin = await adminService.getDashboard()
console.log(admin)  // Should have totalUsers, activeM erchants, etc.

// Test MFS service
import { mfsService } from '@/lib/services/mfs-service'
const wallet = await mfsService.getWallet('user-id')
console.log(wallet)  // Should have balance, status
```

---

## Performance Testing

### Load Time Benchmarks

| Page | Target | Current |
|------|--------|---------|
| `/dashboard` | <2s | ___ |
| `/merchant` | <2s | ___ |
| `/admin` | <2.5s | ___ |
| `/merchant/transactions` | <3s | ___ |
| `/admin/users` | <3s | ___ |

**Test with Chrome DevTools**:
1. Open DevTools (F12)
2. Go to Performance tab
3. Record page load
4. Check main thread activity and time to interactive

### Database Query Performance

Monitor Supabase dashboard for query times:
- ✅ All queries complete in <500ms
- ✅ No N+1 queries detected
- ✅ Pagination working for large datasets

---

## Security Testing

### Authentication & Authorization

- ✅ Unauthenticated users redirect to `/login`
- ✅ Admin pages reject non-admin users (403)
- ✅ Merchant pages reject non-merchant users (403)
- ✅ Session persists across page refresh
- ✅ Logout clears session and redirects to login

### Secrets & Credentials

```bash
# Scan for exposed secrets
git log --all -p | grep -iE "password|api_key|secret|token"
```

**Must be clean** of any credentials in commit history.

### CORS & CSP Headers

Verify in browser DevTools Network tab:
- ✅ No CORS errors on API calls
- ✅ No CSP violations in console

---

## Database Migration Testing

### Schema Validation

Connect to Supabase SQL Editor and run:

```sql
-- Verify all required tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verify RLS is enabled on critical tables
SELECT * FROM pg_tables 
WHERE tablename IN ('profiles', 'merchants', 'transactions', 'wallets')
AND rowsecurity = true;
```

**Verify**:
- ✅ All 13 required tables exist
- ✅ RLS enabled on sensitive tables
- ✅ Proper indexes on frequently queried columns

---

## Staging Deployment Testing

### Pre-Deployment

```bash
# Build artifact must be < 200MB
du -sh .next

# Verify build output
npm run build
npm run start  # Test production build locally
```

### Post-Deployment to Staging

1. Visit staging URL
2. Test all three user journeys (merchant, admin, consumer)
3. Verify performance metrics
4. Check error tracking (Sentry/LogRocket if configured)
5. Load test with 50 concurrent users

---

## Rollback Procedures

### If Critical Issues Detected

```bash
# Revert to previous commit
git revert <deployment-commit>

# Or rollback deployment
vercel rollback

# Verify previous version stable
curl https://staging-url.com
```

### Post-Rollback Investigation

1. Check Supabase logs for errors
2. Review browser console errors
3. Check network requests in DevTools
4. Compare changes between versions
5. Fix root cause in separate branch

---

## Success Criteria for Production Ready

- ✅ Build: All three user journeys complete without errors
- ✅ Performance: Dashboard loads in <2 seconds
- ✅ Security: No unhandled auth errors
- ✅ Data: Transactions persisted correctly
- ✅ UX: Forms validate properly with clear error messages
- ✅ Monitoring: Error tracking active
- ✅ Database: All migrations applied successfully
- ✅ Environment: All required env vars set

---

## Test Accounts

Create test accounts for each user type:

**Merchant Test Account**
- Email: `merchant@test.torquepay.local`
- Password: `TorqueTest123!`
- User Type: `merchant`
- Status: `active`

**Admin Test Account**
- Email: `admin@test.torquepay.local`
- Password: `TorqueAdmin123!`
- User Type: `admin`

**Consumer Test Accounts**
- Email: `user1@test.torquepay.local`, Password: `TorqueUser123!`
- Email: `user2@test.torquepay.local`, Password: `TorqueUser123!`

---

## Continuous Monitoring (Post-Deployment)

### First Hour
- Check error logs every 5 minutes
- Monitor API response times
- Verify user sessions working

### First 24 Hours
- Daily error rate analysis
- User feedback monitoring
- Performance baseline establishment

### Ongoing
- Weekly error trend analysis
- Monthly performance review
- Quarterly security audit
