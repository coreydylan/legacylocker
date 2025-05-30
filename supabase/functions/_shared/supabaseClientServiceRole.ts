import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const createServiceRoleClient = () => {
  // Ensure environment variables are available using the names set via 'supabase secrets set'
  let supabaseUrl = Deno.env.get('PROJECT_SUPABASE_URL') || Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('PROJECT_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing PROJECT_SUPABASE_URL or PROJECT_SERVICE_ROLE_KEY environment variables. Ensure secrets are set via `supabase secrets set`.')
  }

  // Clean up the Supabase URL to remove any role parameters that might cause issues
  // This fixes the "role 'ops' does not exist" error
  if (supabaseUrl && supabaseUrl.includes('?')) {
    // Parse the URL and clean up problematic parameters
    const url = new URL(supabaseUrl);
    const params = new URLSearchParams(url.search);
    
    // Remove any 'options' parameter that might contain role settings
    if (params.has('options')) {
      params.delete('options');
    }
    
    // Reconstruct the URL without the problematic parameters
    url.search = params.toString();
    supabaseUrl = url.toString();
  }

  // Create and return the Supabase client
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      // Required for service_role key to work
      autoRefreshToken: false,
      persistSession: false,
    },
    // Explicitly set the database schema to public
    db: {
      schema: 'public'
    }
  })
}

// Helper for consistent responses
export const createJsonResponse = (body: unknown, status: number = 200, headers: Record<string, string> = {}) => {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json', ...headers },
    status: status,
  })
} 