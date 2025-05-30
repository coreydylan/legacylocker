import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

// Read environment variables
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

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
  
  console.log('[Supabase] Cleaned URL to remove role parameters');
}

// Configuration shared by every Supabase client that might be instantiated.
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  // Explicitly set the database schema to public
  db: {
    schema: 'public'
  },
  // Ensure we're using the correct auth headers
  global: {
    headers: {
      'x-my-custom-header': 'legacylocker'
    }
  }
} as const;

// ----------------------------------------------------------------------------------
// Ensure **exactly one** Supabase client is ever created in the browser.                
// In development, hot‑module‑reloading can cause files to be evaluated multiple times, 
// which would normally trigger `createClient` again and lead to the                     
// "Multiple GoTrueClient instances detected …" warning.                               
// We attach the created client to `globalThis` (works in both browser and Node) and   
// reuse it on subsequent evaluations.                                                 
// ----------------------------------------------------------------------------------

declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/naming-convention
  var __supabase__: SupabaseClient<any, any, any> | undefined;
}

function createSupabaseSingleton() {
  // If running in a browser/deno/node environment that already has a cached client,
  // return it instead of creating a new one.
  if (globalThis.__supabase__) {
    return globalThis.__supabase__;
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);
  globalThis.__supabase__ = client;
  return client;
}

export const supabase = createSupabaseSingleton();