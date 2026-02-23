/**
 * Safe Environment Configuration
 * All variables are optional until admin panel approves
 */

// Supabase configuration - optional until admin panel enables
export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  isConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}

// Application configuration
export const APP_CONFIG = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'kptjms991@gmail.com',
}

// Feature flags - all optional
export const FEATURES = {
  velocityRemit: process.env.NEXT_PUBLIC_ENABLE_VELOCITY_REMIT !== 'false',
  smartCheckout: process.env.NEXT_PUBLIC_ENABLE_SMART_CHECKOUT !== 'false',
  educationPayments: process.env.NEXT_PUBLIC_ENABLE_EDUCATION_PAYMENTS !== 'false',
  torqueShield: process.env.NEXT_PUBLIC_ENABLE_TORQUE_SHIELD !== 'false',
  torqueCopilot: process.env.NEXT_PUBLIC_ENABLE_TORQUE_COPILOT !== 'false',
  cryptoEnabled: process.env.NEXT_PUBLIC_CRYPTO_ENABLED !== 'false',
  e2eeEnabled: process.env.NEXT_PUBLIC_E2EE_ENABLED !== 'false',
  biometricAuth: process.env.NEXT_PUBLIC_BIOMETRIC_AUTH_ENABLED !== 'false',
  analyticsEnabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'false',
}

// Payment methods - optional
export const PAYMENT_METHODS = {
  bkash: {
    enabled: process.env.NEXT_PUBLIC_BKASH_ENABLED !== 'false',
    appKey: process.env.NEXT_PUBLIC_BKASH_APP_KEY,
    appSecret: process.env.NEXT_PUBLIC_BKASH_APP_SECRET,
  },
  nagad: {
    enabled: process.env.NEXT_PUBLIC_NAGAD_ENABLED !== 'false',
    apiKey: process.env.NEXT_PUBLIC_NAGAD_API_KEY,
  },
  mastercardMove: {
    enabled: process.env.NEXT_PUBLIC_MASTERCARD_MOVE_ENABLED !== 'false',
    apiKey: process.env.NEXT_PUBLIC_MASTERCARD_MOVE_API_KEY,
  },
}

// WebRTC configuration
export const WEBRTC_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_WEBRTC_ENABLED !== 'false',
  turnServers: process.env.NEXT_PUBLIC_TURN_SERVERS
    ? JSON.parse(process.env.NEXT_PUBLIC_TURN_SERVERS)
    : [
        { urls: ['stun:stun.l.google.com:19302'] },
        { urls: ['stun:global.stun.twilio.com:3478'] },
        { urls: ['stun:stun.voip.blackberry.com:3478'] },
      ],
}

// Debug configuration
export const DEBUG_CONFIG = {
  enabled: process.env.DEBUG_MODE === 'true',
}

/**
 * Validate essential configuration
 * Returns warnings for missing but optional configs
 */
export function validateConfig() {
  const warnings: string[] = []

  if (!SUPABASE_CONFIG.isConfigured) {
    warnings.push(
      'Supabase not configured. Features requiring database will be disabled. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable.'
    )
  }

  return {
    isValid: SUPABASE_CONFIG.isConfigured,
    warnings,
    hasCriticalConfig: SUPABASE_CONFIG.isConfigured,
  }
}
