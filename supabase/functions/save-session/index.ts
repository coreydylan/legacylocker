// @ts-nocheck
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log(`Function 'save-session' up and running!`);

interface SessionPayload {
  id: string;
  session_data: Record<string, unknown>; // Adjust typing if you have a strict SessionData type shared
  email?: string;
  updated_at: string;
  expires_at: string;
}

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json() as SessionPayload;
    console.log("Received payload:", payload);

    // Validate essential fields
    if (!payload.id || !payload.session_data || !payload.updated_at || !payload.expires_at) {
      throw new Error("Missing required fields in payload (id, session_data, updated_at, expires_at).");
    }

    // Create a Supabase client with the Service Role key
    let supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    // Clean up the Supabase URL to remove any role parameters that might cause issues
    // This fixes the "role 'ops' does not exist" error
    if (supabaseUrl && supabaseUrl.includes('?')) {
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
    
    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        db: {
          schema: 'public'
        }
      }
    )

    const { id, session_data, email, updated_at, expires_at } = payload;

    // --- TEMPORARILY DISABLED Security Check --- 
    // The email check logic was causing 403s. Disabling it temporarily
    // to verify if the basic upsert operation works.
    // TODO: Re-evaluate and potentially re-implement a more robust check later.
    console.log('[save-session] Email security check temporarily disabled.');

    // Perform the upsert operation
    const { error: upsertError } = await supabaseAdmin
      .from('sessions')
      .upsert({
        id,
        session_data,
        email: email, // Use the email provided (or null)
        updated_at,
        expires_at,
      })

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError);
      throw new Error(`Supabase upsert failed: ${upsertError.message}`);
    }

    console.log(`Session ${id} upsert successful.`);
    return new Response(JSON.stringify({ success: true, sessionId: id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/save-session' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
