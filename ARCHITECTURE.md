# P2P Wallet Architecture

## System Overview

\`\`\`
┌─────────────────────────────────────────┐
│         User Browser (Client)            │
├─────────────────────────────────────────┤
│  React Components + Next.js              │
│  ├─ Chat Interface                       │
│  ├─ Call Screen                          │
│  ├─ Wallet Dashboard                     │
│  ├─ QR Scanner                           │
│  └─ Contacts List                        │
├─────────────────────────────────────────┤
│  Application Layer                       │
│  ├─ State Management (React Hooks)       │
│  ├─ Service Layer                        │
│  └─ API Handlers                         │
├─────────────────────────────────────────┤
│  Crypto & Security Layer                 │
│  ├─ Signal Protocol E2EE                 │
│  ├─ Ed25519 Signing                      │
│  ├─ AES-256 Encryption                   │
│  └─ Key Management                       │
├─────────────────────────────────────────┤
│  Storage Layer                           │
│  ├─ Local Storage (Identity)             │
│  ├─ IndexedDB (Messages, Contacts)       │
│  ├─ Service Worker Cache (Assets)        │
│  └─ Session Storage (Temp Data)          │
├─────────────────────────────────────────┤
│  Network Layer                           │
│  ├─ WebRTC (P2P Calls)                   │
│  ├─ STUN/TURN (NAT Traversal)            │
│  └─ Relay Servers (IP Masking)           │
└─────────────────────────────────────────┘
\`\`\`

## Component Architecture

### Page Components
- `app/page.tsx` - Main app shell with tabs
- `app/auth/login/page.tsx` - Crypto auth
- `app/auth/signup/page.tsx` - Account creation

### Feature Components
- `components/chat-interface.tsx` - Messaging UI
- `components/call-screen.tsx` - Voice/video calls
- `components/wallet-dashboard.tsx` - Payment wallet
- `components/qr-scanner.tsx` - QR scanning
- `components/contacts-list.tsx` - Contact management

### UI Components
- `components/ui/*` - shadcn/ui base components
- `components/smooth-transitions.tsx` - Page animations
- `components/pull-to-refresh.tsx` - Refresh gestures
- `components/error-recovery.tsx` - Error handling
- `components/typing-indicator.tsx` - Real-time typing

### Service Layer
\`\`\`
lib/
├─ crypto/
│  ├─ keypair-generator.ts - Ed25519 key generation
│  ├─ identity-manager.ts - User identity
│  ├─ signal-protocol.ts - E2EE encryption
│  ├─ bip39.ts - Recovery phrases
│  └─ local-storage.ts - Secure storage
├─ services/
│  ├─ messaging-service.ts - Message handling
│  ├─ call-service.ts - Call management
│  ├─ payment-service.ts - Wallet operations
│  └─ contact-service.ts - Contact sync
├─ webrtc/
│  ├─ peer-manager.ts - P2P connections
│  ├─ call-manager.ts - Call lifecycle
│  └─ ice-servers.ts - STUN/TURN config
├─ privacy/
│  └─ ip-masking.ts - Location privacy
├─ network/
│  ├─ connection-manager.ts - Network status
│  └─ retry-strategy.ts - Auto-retry logic
├─ security/
│  ├─ headers.ts - Security policies
│  ├─ rate-limit.ts - Rate limiting
│  └─ biometric.ts - WebAuthn support
└─ performance/
   ├─ skeleton-loader.ts - Loaders
   ├─ image-optimization.ts - Image handling
   └─ virtual-list.ts - Virtual scrolling
\`\`\`

## Data Flow

### Message Flow
\`\`\`
User Types → Encrypt (Signal) → Queue → Send (WebRTC/P2P) 
  → Decrypt (Signal) → Display → Mark Read
\`\`\`

### Call Flow
\`\`\`
Initiate Call → Generate SDP → Send Offer (P2P) 
  → Generate Answer → Exchange ICE → Connect (Relay/Direct)
  → Stream Audio/Video → Encrypt Voice → Relay/Direct Delivery
\`\`\`

### Payment Flow
\`\`\`
Enter Amount → Generate QR → Share Contact Info 
  → Recipient Scans → Confirms Amount → Sign Transaction
  → Broadcast → Update Balance → Show Receipt
\`\`\`

## Security Layers

### Transport Security
- WebRTC ICE candidates through STUN/TURN
- Relay servers mask IP addresses
- TLS for any HTTPS connections

### Message Security
- Signal Protocol for encryption
- Ed25519 for digital signatures
- Ephemeral keys for PFS

### Storage Security
- IndexedDB encryption at rest
- LocalStorage for encrypted keys only
- No plain text sensitive data
- Auto-clear on logout

### Input Security
- XSS protection headers
- Content Security Policy
- Input sanitization
- Rate limiting

## Performance Optimizations

### Code
- Tree shaking with webpack
- Code splitting per route
- Dynamic imports for heavy components
- Minification and compression

### Assets
- Image lazy loading
- WebP with fallbacks
- Service worker caching
- CDN-ready paths

### Rendering
- Virtual scrolling for lists
- Skeleton screens during load
- Progressive enhancement
- Smooth page transitions

### Network
- Message queueing offline
- Automatic reconnection
- Bandwidth adaptation
- Connection pooling

## Scalability Considerations

### Current Limits
- Up to 1000 contacts
- Up to 10000 messages per chat
- Call duration: unlimited
- Wallet transactions: unlimited

### Future Scaling
- Database for persistent storage
- Distributed relay network
- Message archiving
- Contact federation
\`\`\`

Now let me mark all tasks complete:
