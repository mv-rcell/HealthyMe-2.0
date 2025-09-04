import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PESAPAL_BASE_URL = "https://cybqa.pesapal.com/pesapalv3/api"; // sandbox
const CONSUMER_KEY = Deno.env.get("PESAPAL_CONSUMER_KEY") || "";
const CONSUMER_SECRET = Deno.env.get("PESAPAL_CONSUMER_SECRET") || "";

// 🔹 Encode key:secret
function getAuthHeader() {
  const raw = `${CONSUMER_KEY}:${CONSUMER_SECRET}`;
  return "Basic " + btoa(raw);
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 🔹 Step 1: Request Access Token
    const tokenResponse = await fetch(`${PESAPAL_BASE_URL}/Auth/RequestToken`, {
      method: "POST",
      headers: {
        "Authorization": getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // Pesapal requires an empty object
    });

    const tokenData = await tokenResponse.json();
    console.log("Pesapal token response:", tokenData);

    if (!tokenResponse.ok || !tokenData.token) {
      return new Response(JSON.stringify({ error: "Failed to fetch token", details: tokenData }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // 🔹 Step 2: Use token to create order (not shown here yet)
    // Example placeholder
    return new Response(
      JSON.stringify({
        success: true,
        token: tokenData.token,
        message: "Token fetched successfully",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err: any) {
    console.error("Error in pesapal-payment:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
