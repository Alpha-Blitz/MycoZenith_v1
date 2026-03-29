import { createClient } from '@supabase/supabase-js'

// Server-only: uses service role key — NEVER expose to client
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL    ?? 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY   ?? 'placeholder-service-key',
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
