# Supabase Integration Update - TorquePay

## New Supabase Project Details

**Project URL:** https://xefljcwouaqfmefxnhzo.supabase.co  
**Project ID:** xefljcwouaqfmefxnhzo  
**Publishable Key:** `sb_publishable_HWmxYTajyDn-R4n0mXHDaA_PsvN6vSh`

## Environment Variables

The project has been updated with the following environment variables:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xefljcwouaqfmefxnhzo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_HWmxYTajyDn-R4n0mXHDaA_PsvN6vSh
\`\`\`

These are automatically configured in your Vercel project.

## Configuration Files Updated

1. **/.env.example** - Updated with new Supabase credentials
2. **/.env.local.example** - Updated with new Supabase credentials
3. **/lib/supabase/config.ts** - New configuration verification file

## Client Configuration

The Supabase client is already configured in `/lib/supabase/client.ts`:

\`\`\`typescript
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
\`\`\`

## Database Schema

The TorquePay payment platform uses the following Supabase tables:

### Core Tables
- **profiles** - User profiles and account information
- **wallets** - User wallet accounts and balances
- **transactions** - Payment transactions and history
- **merchants** - Merchant accounts and settings
- **api_keys** - API keys for merchant integrations
- **merchant_checkouts** - Hosted checkout configurations
- **payment_tokens** - Saved payment methods
- **p2p_transfers** - Peer-to-peer transfers
- **disputes** - Transaction disputes and chargebacks
- **webhooks** - Webhook configurations and deliveries
- **notifications** - User notifications and alerts

### Features Enabled
- Row Level Security (RLS) - Data isolation by user/merchant
- Real-time subscriptions - Live updates for wallet/transaction changes
- Database functions - For complex operations like settlements
- Edge Functions - For webhook processing and payment handling

## Running Database Setup

1. **Login to Supabase Dashboard:**
   - Navigate to https://app.supabase.com
   - Select project ID: xefljcwouaqfmefxnhzo

2. **Create Tables:**
   - Run the SQL scripts in `/scripts/01_create_torquepay_schema.sql`
   - Copy and paste the SQL into the Supabase SQL Editor

3. **Enable RLS:**
   - Enable Row Level Security on all tables
   - Create appropriate policies for data isolation

4. **Setup Webhooks:**
   - Configure webhook endpoints in the Supabase dashboard
   - Point to your app's `/api/webhooks/` endpoint

## Local Development

1. Copy environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

2. Verify Supabase connection:
\`\`\`typescript
import { verifySupabaseConfig } from '@/lib/supabase/config'
verifySupabaseConfig() // Returns true if configured
\`\`\`

3. Test client connection:
\`\`\`typescript
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
const { data, error } = await supabase.auth.getSession()
\`\`\`

## Services Using Supabase

The following services have been configured to use the new Supabase project:

- **Merchant Service** (`/lib/services/merchant-service.ts`) - API key management, checkout settings
- **Admin Service** (`/lib/services/admin-service.ts`) - User management, dispute resolution
- **MFS Service** (`/lib/services/mfs-service.ts`) - Wallet operations, P2P transfers
- **Payment Service** (`/lib/services/payment-service.ts`) - Transaction processing

## Migration Checklist

- [x] Environment variables set in Vercel
- [x] Configuration files updated
- [ ] Database tables created in new Supabase project
- [ ] RLS policies configured
- [ ] Webhooks configured
- [ ] API keys generated
- [ ] Test transactions processed

## Troubleshooting

### "Tenant or user not found"
This occurs when Supabase credentials are invalid. Verify:
- NEXT_PUBLIC_SUPABASE_URL is set correctly
- NEXT_PUBLIC_SUPABASE_ANON_KEY is valid
- Supabase project is active and not suspended

### Database connection failures
1. Check Supabase dashboard for service status
2. Verify RLS policies allow your auth user
3. Ensure tables exist in the project
4. Check browser console for detailed error messages

### Missing tables
Run the migration script in Supabase SQL Editor:
\`\`\`sql
-- Copy contents of /scripts/01_create_torquepay_schema.sql
-- Paste into Supabase SQL Editor and execute
\`\`\`

## Support

For issues with Supabase integration:
1. Check Supabase documentation: https://supabase.com/docs
2. Review TorquePay setup guide: `/TORQUEPAY_SETUP.md`
3. Check implementation guide: `/TORQUEPAY_IMPLEMENTATION.md`
