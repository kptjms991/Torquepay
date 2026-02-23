# P2P Wallet - Deployment Guide

## Production Checklist

### Security
- [x] Content Security Policy headers configured
- [x] XSS protection headers enabled
- [x] Rate limiting for API endpoints
- [x] Input sanitization on all user inputs
- [x] HTTPS enforced
- [x] Secure cookie handling
- [x] No sensitive data in logs

### Performance
- [x] Image optimization and lazy loading
- [x] Virtual scrolling for large lists
- [x] Service worker caching strategy
- [x] Code splitting and dynamic imports
- [x] CSS and JS minification
- [x] CDN-ready asset paths

### Privacy
- [x] End-to-end encryption enabled
- [x] IP masking available
- [x] No analytics by default
- [x] No external tracking
- [x] Local-first data storage
- [x] P2P communication

### Accessibility
- [x] WCAG AA compliant
- [x] Keyboard navigation support
- [x] Screen reader compatible
- [x] Min 44x44px touch targets
- [x] Proper color contrast
- [x] Focus indicators

### Mobile
- [x] PWA installable
- [x] Offline support
- [x] Safe area inset handling
- [x] Haptic feedback
- [x] Touch optimized
- [x] Status bar color matching

## Environment Variables

Create `.env.local` with these values:

\`\`\`env
NEXT_PUBLIC_CRYPTO_ENABLED=true
NEXT_PUBLIC_E2EE_ENABLED=true
NEXT_PUBLIC_IP_MASKING_ENABLED=true
NEXT_PUBLIC_DEFAULT_PRIVACY_LEVEL=city
NEXT_PUBLIC_WEBRTC_ENABLED=true
NEXT_PUBLIC_PWA_ENABLED=true
NEXT_PUBLIC_OFFLINE_MODE=true
NEXT_PUBLIC_HAPTIC_FEEDBACK=true
NEXT_PUBLIC_ANALYTICS_ENABLED=false
DEBUG_MODE=false
\`\`\`

## Deployment to Vercel

1. Push code to GitHub
2. Connect repo to Vercel project
3. Set environment variables in Vercel dashboard
4. Enable Web Analytics (optional, privacy-first)
5. Configure custom domain
6. Deploy

\`\`\`bash
vercel deploy --prod
\`\`\`

## Local Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit `http://localhost:3000`

## Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Testing

- Run diagnostics: `npm run diagnose`
- Test PWA: Use Chrome DevTools -> Application -> Service Workers
- Test offline: DevTools -> Network -> Offline
- Test accessibility: Use Lighthouse audits

## Monitoring

- Check Vercel Analytics for performance metrics
- Monitor Web Vitals (CLS, LCP, FID)
- Track error rates via Sentry (optional)

## Performance Targets

- Lighthouse Score: 90+
- First Contentful Paint: <2s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
- Time to Interactive: <3.8s

## Security Headers

All security headers are automatically configured via `next.config.mjs`:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy
- Strict-Transport-Security
