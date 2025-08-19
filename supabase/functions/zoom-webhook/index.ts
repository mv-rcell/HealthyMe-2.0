// supabase/functions/zoom-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const body = await req.json();

  // 🔹 Handle Zoom verification challenge
  if (body.event === "endpoint.url_validation") {
    const plainToken = body.payload.plainToken;
    const encryptedToken = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(`${plainToken}${Deno.env.get("ZOOM_VERIFICATION_TOKEN")}`)
    );
    const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedToken)));
    return new Response(
      JSON.stringify({ plainToken, encryptedToken: hashBase64 }),
      { headers: corsHeaders, status: 200 }
    );
  }

  // 🔹 Handle actual events
  if (body.event === "meeting.started") {
    const meetingId = body.payload.object.id;
    const topic = body.payload.object.topic;

    // Broadcast to Supabase channel so frontend gets "Incoming Call"
    await supabase.channel("zoom_calls").send({
      type: "broadcast",
      event: "incoming_call",
      payload: { meetingId, topic }
    });
  }

  return new Response(JSON.stringify({ status: "ok" }), {
    headers: corsHeaders,
    status: 200,
  });
});
