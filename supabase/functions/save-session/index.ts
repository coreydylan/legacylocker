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
    const supabaseAdmin = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase Service Role Key - env var exported by default.
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { id, session_data, email, updated_at, expires_at } = payload;

    // --- Security Check: Prevent overwriting sessions with mismatched emails --- 
    const { data: existingSession, error: selectError } = await supabaseAdmin
      .from('sessions')
      .select('email')
      .eq('id', id)
      .maybeSingle(); // Use maybeSingle to handle both existing and new sessions

    if (selectError) {
      console.error('Error checking existing session:', selectError);
      throw new Error(`Failed to check session existence: ${selectError.message}`);
    }

    if (existingSession) {
      // If the session exists, ensure the email hasn't changed or wasn't added unexpectedly.
      // Allow updates if: 
      // 1. The existing email is null/undefined (session was previously anonymous)
      // 2. The new email matches the existing email
      // 3. The new email is null/undefined (purchaser removed their email - less likely but possible)
      const existingEmail = existingSession.email;
      const newEmail = email;

      // Compare emails in a case‑insensitive manner to avoid false mismatches
      const existingEmailLower = existingEmail ? existingEmail.toLowerCase() : null;
      const newEmailLower = newEmail ? newEmail.toLowerCase() : null;

      if (existingEmailLower && newEmailLower && existingEmailLower !== newEmailLower) {
          console.warn(`Potential session hijack attempt: Session ${id} exists with email ${existingEmail}, but request provides ${newEmail}.`);
          // Optionally: Allow update if existingEmail was null/undefined? Depends on desired logic.
          // For now, strict check: If existing email exists, new one must match.
         return new Response(JSON.stringify({ error: 'Email mismatch for existing session.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 403, // Forbidden
          })
      }
       console.log(`Email check passed for existing session ${id}. Proceeding with upsert.`);
    } else {
       console.log(`Session ${id} does not exist yet. Proceeding with upsert.`);
    }
    // --- End Security Check ---

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
