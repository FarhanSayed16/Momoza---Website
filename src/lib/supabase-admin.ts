import { createClient } from '@supabase/supabase-js'

// Use this client ONLY in server environments where you need to bypass RLS.
// E.g., API routes that handle webhooks or perform administrative background tasks.
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
