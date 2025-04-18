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

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
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