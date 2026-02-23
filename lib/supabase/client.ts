import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return null if Supabase is not configured
  if (!url || !anonKey) {
    console.warn('[TorquePay] Supabase not configured. Database features will be disabled.')
    return null
  }

  client = createBrowserClient(url, anonKey)
  return client
}

// Export singleton instance - may be null if not configured
export const supabase = createClient()

// Helper to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!supabase
}
