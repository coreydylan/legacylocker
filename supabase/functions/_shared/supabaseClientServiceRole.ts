import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createServiceRoleClient = () => {
  // Ensure environment variables are available using the names set via 'supabase secrets set'
  const supabaseUrl = Deno.env.get('PROJECT_SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('PROJECT_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing PROJECT_SUPABASE_URL or PROJECT_SERVICE_ROLE_KEY environment variables. Ensure secrets are set via `supabase secrets set`.')
  }

  // Create and return the Supabase client
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      // Required for service_role key to work
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Helper for consistent responses
export const createJsonResponse = (body: unknown, status: number = 200, headers: Record<string, string> = {}) => {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json', ...headers },
    status: status,
  })
} 