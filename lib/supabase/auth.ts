import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG, APP_CONFIG } from '@/lib/config/env'

let supabase: any = null
let supabaseAdmin: any = null

// Initialize only if configured
if (SUPABASE_CONFIG.isConfigured) {
  supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)
  if (SUPABASE_CONFIG.serviceRoleKey) {
    supabaseAdmin = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.serviceRoleKey)
  }
} else {
  console.warn('[TorquePay Auth] Supabase not configured. Auth features disabled. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable.')
}

// Admin email to auto-grant access
const ADMIN_EMAIL = APP_CONFIG.adminEmail

export async function signUpWithAdminCheck(email: string, password: string) {
  if (!supabase) {
    return {
      data: null,
      error: new Error('Authentication service not configured. Please configure Supabase.'),
    }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${APP_CONFIG.appUrl}/auth/callback`,
      },
    })

    if (error) throw error

    // If this is the admin email, grant admin role
    if (email === ADMIN_EMAIL && supabaseAdmin && data.user) {
      try {
        await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
          user_metadata: {
            role: 'admin',
            permissions: ['read', 'write', 'delete', 'manage_users', 'manage_merchants'],
          },
        })

        // Create admin profile
        await supabaseAdmin.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          role: 'admin',
          status: 'active',
        })
      } catch (adminError) {
        console.warn('[TorquePay] Could not set admin role:', adminError)
      }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function signIn(email: string, password: string) {
  if (!supabase) {
    return {
      data: null,
      error: new Error('Authentication service not configured.'),
    }
  }
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  if (!supabase) return null
  return await supabase.auth.signOut()
}

export async function getCurrentUser() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data?.session?.user
}

export async function getUserRole(userId: string) {
  if (!supabaseAdmin) return null

  try {
    const { data: user } = await supabaseAdmin.auth.admin.getUserById(userId)
    return user?.user_metadata?.role || 'user'
  } catch (error) {
    console.warn('[TorquePay] Could not get user role:', error)
    return null
  }
}

export function isAuthConfigured(): boolean {
  return !!supabase
}

export { supabase, supabaseAdmin }
