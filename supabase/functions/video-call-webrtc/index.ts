import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { sessionId, offer, answer } = await req.json();

    if (req.method === 'POST') {
      if (offer) {
        // Store WebRTC offer for the session
        const { error } = await supabase
          .from('video_sessions')
          .update({ 
            session_token: JSON.stringify({ offer }),
            status: 'connecting'
          })
          .eq('id', sessionId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (answer) {
        // Store WebRTC answer for the session
        const { error } = await supabase
          .from('video_sessions')
          .update({ 
            session_token: JSON.stringify({ answer }),
            status: 'active'
          })
          .eq('id', sessionId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (req.method === 'GET') {
      // Get WebRTC signaling data for the session
      const url = new URL(req.url);
      const sessionId = url.searchParams.get('sessionId');

      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      const { data, error } = await supabase
        .from('video_sessions')
        .select('session_token, status')
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Method not allowed');

  } catch (error: any) {
    console.error('Error in video call handler:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});