# TorquePay Deployment & Environment Management Guide

## Environment Variable Management

### Local Development Setup

1. **Create `.env.local`** (never commit):
```bash
cp .env.example .env.local
```

2. **Fill in your values**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Verify setup**:
```bash
npm run validate  # Should pass all checks
```

### Vercel Production Setup

**Via Vercel Dashboard**:
1. Navigate to Project Settings → Environment Variables
2. Add each variable with proper environment scope:

| Variable | Scope | Value |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production/Preview | Production Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production/Preview | Production anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production only | Production service role key |
| `NEXT_PUBLIC_APP_URL` | Production | https://yourdomain.com |

### Security Best Practices

**DO**:
- ✅ Use `.env.example` with placeholder values
- ✅ Rotate secrets every 30-60 days
- ✅ Use different keys for dev/staging/production
- ✅ Store service keys in Vercel Encrypted Secrets only
- ✅ Audit who has access to production secrets
- ✅ Enable 2FA on Vercel account

**DON'T**:
- ❌ Commit `.env.local` to git
- ❌ Share secrets via email/chat
- ❌ Use production keys in development
- ❌ Hardcode credentials in code
- ❌ Log sensitive values
- ❌ Use same keys for multiple environments

---

## Secret Rotation Schedule

### Monthly (API Keys & Tokens)
- Supabase Anon Key
- API Gateway tokens
- Third-party integration keys

### Quarterly (Database Credentials)
- Supabase Service Role Key
- Database passwords

### Rotation Procedure

**Step 1: Generate New Secret** (in Supabase Dashboard)
**Step 2: Update in Vercel** environment variables
**Step 3: Redeploy** with new secrets
**Step 4: Invalidate Old Secret** after 24 hours

---

## Staged Deployment Process

### Stage 1: Local Development

```bash
# Install dependencies
npm install

# Validate environment
npm run validate

# Type checking
npm run type-check

# Run development server
npm run dev
# Visit http://localhost:3000
```

### Stage 2: Staging Deployment

**Prerequisites**:
- [ ] All changes committed to feature branch
- [ ] Code review approved
- [ ] `npm run build` succeeds locally
- [ ] Staging env vars set in Vercel

**Deploy**:
```bash
# Push to staging branch
git push origin feature-branch
# Vercel auto-deploys to preview URL
```

### Stage 3: Production Deployment

**Prerequisites**:
- [ ] Staging tests passed
- [ ] Database backups created
- [ ] Team notified

**Deploy**:
```bash
# Create PR to main, get approval
# Merge to main (Vercel auto-deploys)
# Or manual: vercel deploy --prod
```

---

## Pre-Deployment Checklist

**Code Quality**:
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] TypeScript type-check passes
- [ ] ESLint passes
- [ ] Code reviewed

**Security**:
- [ ] No hardcoded credentials in code
- [ ] No secrets in commit history
- [ ] Environment variables properly set
- [ ] No sensitive data in logs

**Performance**:
- [ ] Build completes in <3 minutes
- [ ] Bundle size < 200MB
- [ ] Main thread blocked < 3s

**Database**:
- [ ] All migrations applied
- [ ] RLS policies verified
- [ ] Database backups created

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Page Load Time (p99) | <2s |
| API Response Time (p99) | <500ms |
| Error Rate | <0.1% |
| Database Query Time (p99) | <500ms |
| Uptime | >99.9% |

---

## Rollback Procedures

**Quick Rollback** (if critical issues):
```bash
# Option 1: Via Vercel Dashboard
# Deployments → Find previous version → Rollback

# Option 2: Via CLI
vercel rollback

# Option 3: Redeploy previous commit
git checkout <stable-commit>
vercel deploy --prod
```

---

## Monitoring (First 24 Hours)

### Every 15 minutes (First Hour)
- Check error logs
- Monitor dashboard response times
- Verify no critical errors

### Every Hour (First 24 Hours)
- Review error rates
- Check database performance
- Monitor API response times

### End of Day
- Generate summary report
- Document any issues
- Update runbooks

---

## Post-Deployment Verification

```bash
# Test critical endpoints
curl https://yourdomain.com/                    # Should load
curl https://yourdomain.com/api/health         # Should return 200
curl https://yourdomain.com/merchant            # Should load/redirect
curl https://yourdomain.com/admin               # Should load/redirect
```

---

## Incident Response

**P1 (Critical)**: Service unavailable
- Response time: < 5 minutes
- Action: Immediate rollback or fix

**P2 (High)**: Major feature broken
- Response time: < 30 minutes
- Action: Today

**P3 (Medium)**: Minor issue
- Response time: < 24 hours
- Action: This sprint

**P4 (Low)**: Documentation/cosmetic
- Response time: < 1 week
- Action: When convenient

---

## Security Headers

All security headers configured via `next.config.mjs`:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy
- Strict-Transport-Security

---

## Scaling Considerations

As TorquePay grows:

- Add Redis caching (Upstash) for frequently accessed data
- Partition large transaction tables in Supabase
- Use Vercel Edge Functions for API routes
- Implement connection pooling for database
- Add rate limiting per user/IP
