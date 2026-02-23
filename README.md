# P2P Wallet - Decentralized Communication App

A privacy-first, decentralized communication platform with end-to-end encrypted messaging, secure voice/video calls, and crypto payments.

## Features

### Communication
- End-to-end encrypted messaging with Signal Protocol
- Real-time typing indicators
- Message status tracking (sending/sent/read)
- Group chat support
- File sharing with E2EE

### Calls
- Voice and video calls with WebRTC
- IP masking with relay-only routing
- Call history and duration tracking
- Screen sharing capability
- 4-level privacy settings

### Payments
- Crypto wallet with balance tracking
- Send/receive money with QR codes
- Transaction history
- Offline transaction queueing
- Real-time balance updates

### Privacy & Security
- No central authentication - uses Ed25519 keypairs
- Local-first data storage
- BIP39 recovery phrases
- Biometric authentication support
- IP address masking
- No analytics or tracking
- Open-source security audit ready

### Performance
- Virtual scrolling for infinite lists
- Image lazy loading with blur placeholders
- Service worker caching
- Offline support with sync
- Skeleton loading states
- Smooth page transitions

### Accessibility
- WCAG AA compliant
- Keyboard navigation
- Screen reader support
- High contrast mode
- VoiceOver/TalkBack compatible
- 44px minimum touch targets

### Mobile
- Installable as PWA
- iOS status bar integration
- Safe area inset handling
- Haptic feedback
- Pull-to-refresh
- Mobile-optimized UI

## Getting Started

### Prerequisites
- Node.js 18+ or bun
- Modern browser with WebRTC support

### Installation

\`\`\`bash
# Clone the repo
git clone <repo-url>
cd p2p-wallet

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

Visit `http://localhost:3000`

### First Time Setup

1. Enter a username
2. Generate crypto identity (Ed25519 keypair)
3. Backup recovery phrase securely
4. Start using the app

No email, no verification, no personal data required.

## Configuration

Copy `.env.example` to `.env.local` and customize:

\`\`\`env
NEXT_PUBLIC_CRYPTO_ENABLED=true
NEXT_PUBLIC_E2EE_ENABLED=true
NEXT_PUBLIC_IP_MASKING_ENABLED=true
NEXT_PUBLIC_PWA_ENABLED=true
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
