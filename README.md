# TorquePay - Unified Payment Platform

A comprehensive payment platform combining merchant payment gateway (like SSLCommerz), consumer mobile wallet (like WeChat Pay/Alipay), and admin dashboard for platform operators.

## Architecture

TorquePay consists of three integrated user interfaces:

### 1. Merchant Dashboard (`/merchant`)
- API Key management with test/live modes
- Checkout configuration and customization
- Transaction monitoring and settlement tracking
- Revenue analytics and reporting

### 2. Admin Panel (`/admin`)
- User and merchant management
- KYC verification and approval
- Real-time transaction monitoring
- Dispute resolution and escalation
- System settings and compliance configuration

### 3. MFS Consumer Wallet (`/dashboard`)
- P2P money transfers
- QR code payments (generate & scan)
- Payment method management
- Transaction PIN and 2FA security
- Add money/top-up functionality
- Transaction history and receipts

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Forms**: react-hook-form with zod validation
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **QR Code**: qrcode.react (generation), html5-qrcode (scanning)
- **UI Tables**: shadcn/ui Table with sorting/pagination
- **Real-time**: Supabase subscriptions

## Prerequisites

- Node.js 18+
- Supabase account with configured database
- Environment variables from `.env.example`

## Getting Started

### 1. Clone & Install

\`\`\`bash
git clone https://github.com/kptjms991/Torquepay.git
cd Torquepay
npm install
\`\`\`

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Then fill in your Supabase credentials:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
\`\`\`

### 3. Verify Setup

\`\`\`bash
npm run validate  # Checks environment and dependencies
npm run type-check  # TypeScript validation
\`\`\`

### 4. Start Development

\`\`\`bash
npm run dev
# Open http://localhost:3000
\`\`\`

## Project Structure

\`\`\`
src/
├── app/
│   ├── merchant/          # Merchant dashboard routes
│   ├── admin/             # Admin panel routes
│   ├── dashboard/         # MFS wallet routes
│   ├── send/              # P2P transfer page
│   ├── payment-methods/   # Payment token management
│   ├── qr/                # QR generation & scanning
│   └── security/          # PIN & 2FA setup
├── components/
│   ├── merchant/          # Merchant-specific components
│   ├── admin/             # Admin-specific components
│   ├── mfs/               # Wallet components
│   └── shared/            # Reusable components
├── lib/
│   ├── services/          # Business logic (merchant, admin, mfs)
│   ├── supabase/          # Database client
│   └── utils/             # Utilities (format, validation)
└── types/
    └── database.ts        # Supabase table interfaces
\`\`\`

## Key Features

### Merchant Features
- Generate unlimited API keys with public/secret key pairs
- Configure webhook endpoints for payment notifications
- Track all checkout sessions and payments
- View settlement information
- Test mode for development

### Admin Features
- User management with role-based access
- Merchant KYC verification and approval workflow
- Real-time transaction monitoring with filters
- Dispute management with resolution notes
- Commission and settlement configuration
- System settings for email/SMS templates

### Consumer Features
- Instant P2P transfers between users
- QR code payment generation (share or display)
- QR code scanning for quick payments
- Saved payment methods for faster transactions
- Transaction PIN for security
- Two-factor authentication with backup codes
- Full transaction history with receipts

## Configuration
NEXT_PUBLIC_OFFLINE_MODE=true
\`\`\`

## Architecture

### Client-Side
- React 19 with Server Components
- Tailwind CSS v4 for styling
- Web Crypto API for encryption
- IndexedDB for local storage
- Service Worker for offline support

### P2P Communication
- WebRTC for voice/video
- Signal Protocol for E2EE messaging
- Relay servers for IP masking
- DHT for peer discovery

### Storage
- Local storage for identity
- IndexedDB for messages/contacts
- Service worker cache for assets
- No cloud backend

## Performance

- Lighthouse score: 95+
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2s
- Time to Interactive: <3s

## Security Considerations

- All encryption happens client-side
- Private keys never leave the device
- BIP39 recovery for account recovery
- Biometric auth for sensitive operations
- Rate limiting on operations
- XSS protection headers enabled
- CSP headers configured

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Mobile browsers with WebRTC

## Development

\`\`\`bash
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
\`\`\`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment guide.

## Privacy Policy

This app collects zero personal data:
- No analytics
- No tracking
- No server storage
- No cloud sync
- No email required

All communication is P2P encrypted.

## License

MIT

## Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Submit a pull request

## Support

- GitHub Issues for bugs
- Discussions for feature requests
- Email: support@p2p-wallet.app

## Roadmap

- Group video calls
- Voice messages
- Message reactions/stickers
- Payment confirmations with signatures
- DeFi integrations
- DAO governance
