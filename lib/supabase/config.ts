/**
 * Supabase Configuration
 * 
 * This file contains the configuration for the Supabase project:
 * URL: https://xefljcwouaqfmefxnhzo.supabase.co
 * Project ID: xefljcwouaqfmefxnhzo
 */

export const SUPABASE_CONFIG = {
  // Supabase project URL
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xefljcwouaqfmefxnhzo.supabase.co",
  
  // Public anonymous key (safe to expose in frontend)
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_HWmxYTajyDn-R4n0mXHDaA_PsvN6vSh",
  
  // Service role key (keep in server-side only, never expose to frontend)
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
} as const

/**
 * Verify Supabase configuration is properly loaded
 */
export function verifySupabaseConfig(): boolean {
  const hasUrl = !!SUPABASE_CONFIG.url
  const hasAnonKey = !!SUPABASE_CONFIG.anonKey
  
  if (!hasUrl || !hasAnonKey) {
    console.error("[Supabase Config] Missing required environment variables")
    return false
  }
  
  console.log("[Supabase Config] ✓ Configuration loaded successfully")
  return true
}

/**
 * Get Supabase configuration for client-side use
 */
export function getSupabaseConfig() {
  return {
    url: SUPABASE_CONFIG.url,
    anonKey: SUPABASE_CONFIG.anonKey,
  }
}
