# TorquePay Bangladesh - Production Dashboard

## Overview
TorquePay is a high-fidelity, 2026-era fintech platform for Bangladesh featuring global remittance, localized payments, education financing, advanced security, and AI-powered merchant intelligence.

## Design System: Digital Bengal
- **Primary Color**: Deep Forest Green (#006A4E) - Trust, stability
- **Accent Color**: Electric Red (#F42A41) - Action, urgency
- **Background**: Slate-50 (#FAFAF9) - Clean, professional
- **Typography**: Inter + Noto Sans Bengali
- **Components**: Glassmorphism cards, smooth animations, high-contrast buttons

## Core Features

### 1. Velocity Remit (Global Remittance)
**File**: `/components/torquepay/features/velocity-remit.tsx`

- Hero card supporting 60+ countries
- 60-second countdown timer for instant fund arrival
- Live BDT/USD exchange rate ticker
- 0% transparency fee badges
- Mastercard Move logic integration
- Direct routing to bKash/Nagad wallets

**Key Elements**:
- Animated countdown (updates every second)
- Live exchange rate with dynamic updates every 3 seconds
- Supported countries grid with flag emojis
- Three-step process explanation

### 2. Smart Checkout (Torque One-Link)
**File**: `/components/torquepay/features/smart-checkout.tsx`

- Mobile-responsive tabbed interface
- Three payment methods:
  - MFS (bKash, Nagad, Rocket)
  - Cards (Visa, Mastercard, Amex)
  - Bangla QR
- Tokenized checkout with one-click pay
- Saved payment methods for returning customers
- Bank-level encryption badge

**Key Elements**:
- Dynamic amount input with BDT symbol
- Tab navigation with active state
- Saved tokens display with last 4 digits
- Security lock indicator

### 3. Education Payments
**File**: `/components/torquepay/features/education-payments.tsx`

- 1,000+ university database
- Searchable with region filters
- Quota-based foreign exchange system
- Annual FX allowance tracking
- Real-time quota progress visualization

**Key Elements**:
- Annual quota status card (FX allowance)
- Progress bar showing used percentage
- University cards with quota status
- Region-based filtering

### 4. TorqueShield (Security & Agentic Payments)
**File**: `/components/torquepay/features/torque-shield.tsx`

- Agentic payment system for utility bills
- Real-time risk scanning with millisecond tracking
- Antom Shield-style fraud detection
- South Asian corridor-specific patterns:
  - SIM-clone detection
  - Device fingerprinting
  - Behavioral analytics
- Biometric authentication (FaceID/Fingerprint)

**Key Elements**:
- Toggle for agentic payments
- Approved utilities list with monthly limits
- Live risk log feed (auto-updates every 8s)
- Real-time fraud detection indicators

### 5. Torque Copilot (AI Merchant Assistant)
**File**: `/components/torquepay/features/torque-copilot.tsx`

- AI chatbot for dispute management
- Real-time settlement tracking
- T+0 settlement status for merchants
- Blockchain-backed clearing for travel/gaming
- Dispute management dashboard

**Key Elements**:
- Chat interface with message history
- Quick action buttons for common queries
- Settlement status card
- Dispute management with status tracking

## File Structure

```
/components/torquepay/
├── layout/
│   └── app-header.tsx          # Global navigation header
├── features/
│   ├── velocity-remit.tsx      # Global remittance hub
│   ├── smart-checkout.tsx      # Localized payment widget
│   ├── education-payments.tsx  # Education financing system
│   ├── torque-shield.tsx       # Security command center
│   └── torque-copilot.tsx      # AI merchant assistant

/lib/theme/
└── torquepay-theme.ts         # Design system & colors

/app/
└── dashboard/
    └── page.tsx               # Main dashboard page
```

## Styling & Components

### TailwindCSS Classes
```css
.torquepay-card              /* Rounded 3xl cards with shadow */
.torquepay-btn-primary       /* Deep green buttons */
.torquepay-btn-accent        /* Electric red buttons */
.torquepay-glassmorphism     /* Frosted glass effect */
.torquepay-gradient-primary  /* Green gradient */
.torquepay-gradient-accent   /* Red gradient */
```

### Color Variables (CSS)
```
--torquepay-primary: #006a4e
--torquepay-accent: #f42a41
--torquepay-success: #10b981
--torquepay-warning: #f59e0b
--torquepay-info: #3b82f6
```

## Interactive Features

### Real-Time Updates
- **Countdown Timer** (Velocity Remit): Updates every 1 second
- **Exchange Rate** (Velocity Remit): Updates every 3 seconds with scale animation
- **Risk Logs** (TorqueShield): New entries every 8 seconds
- **Status Indicators**: Animated pulse effects for live status

### User Interactions
- Tab navigation between payment methods
- One-click pay selection with radio buttons
- Filter buttons for university regions
- Quick action buttons for AI queries
- Biometric simulation prompts

## Development Notes

### Dependencies
- React 18+ with hooks
- Tailwind CSS v4
- Lucide React for icons
- Recharts for analytics (optional)

### Component Props
All components are self-contained and use `useState` for local state management. They don't require external props and work independently.

### Performance Optimizations
- Virtual scrolling for long lists
- Lazy loading for images
- Debounced search inputs
- Memoized components for filtered lists

## Deployment Checklist

- [ ] Update environment variables for payment gateways
- [ ] Configure Supabase tables (merchants, transactions, wallets)
- [ ] Set up SSL certificates for production
- [ ] Enable 2FA and biometric authentication
- [ ] Configure email/SMS notifications
- [ ] Set up rate limiting (recommend 100 requests/min per IP)
- [ ] Enable CORS for approved domains only
- [ ] Set up monitoring and alerting

## Next Steps

1. **Backend Integration**: Connect to Supabase for real data
2. **Payment Gateway**: Integrate SSLCommerz, WeChat Pay, Alipay APIs
3. **Authentication**: Implement Supabase Auth or custom JWT
4. **Real WebRTC**: Replace mock call system with actual peer connections
5. **AI Integration**: Connect Copilot to actual LLM backend
6. **Mobile App**: Use React Native to create companion mobile app

## Support

For issues or questions, refer to:
- Supabase docs: https://supabase.com/docs
- Recharts: https://recharts.org/
- Tailwind CSS: https://tailwindcss.com/
- Lucide Icons: https://lucide.dev/
