import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

/* ---------- CORS ---------- */
const cors = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age":       "86400",
};

/* ---------- Helpers ---------- */
const describe = (e: unknown) =>
  e instanceof Error ? `${e.name}: ${e.message}\n${e.stack}` : JSON.stringify(e);

/* ---------- Edge Function ---------- */
serve(async (req) => {
  /* ----- Pre‑flight ----- */
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  /* ----- Safe JSON parsing ----- */
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const email = body.email?.trim();
  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  /* ----- Supabase insert ----- */
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { error } = await supabase
    .from("newsletter_subscriptions")
    .insert([{ email }]); // subscribed_at defaults to now()

  if (error) {
    /* Duplicate email */
    if (error.code === "23505") {
      return new Response(
        JSON.stringify({ success: false, message: "Email already subscribed" }),
        {
          status: 409, // Conflict
          headers: { ...cors, "Content-Type": "application/json" },
        },
      );
    }

    /* Other DB errors */
    console.error("Newsletter subscription error:", describe(error));
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  /* ----- Success ----- */
  console.log(`New newsletter subscription: ${email}`);
  return new Response(
    JSON.stringify({ success: true, message: "Successfully subscribed" }),
    { headers: { ...cors, "Content-Type": "application/json" } },
  );
});