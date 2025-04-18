import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createServiceRoleClient = () => {
  // Ensure environment variables are available
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.')
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