import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface RequestBody {
  id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { id } = await req.json() as RequestBody;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id field' }), { headers: corsHeaders, status: 400 })
    }

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

    const { data, error } = await supabaseAdmin
      .from('sessions')
      .select('session_data, expires_at')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('DB error:', error)
      return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 400 })
    }

    if (!data) {
      return new Response(JSON.stringify({ error: 'Session not found' }), { headers: corsHeaders, status: 404 })
    }

    return new Response(JSON.stringify({ success: true, session: data }), { headers: corsHeaders, status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { headers: corsHeaders, status: 400 })
  }
}) 