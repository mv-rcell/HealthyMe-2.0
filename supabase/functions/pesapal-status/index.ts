import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Change to frontend domain in production
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PESAPAL_BASE_URL = "https://cybqa.pesapal.com/pesapalv3/api"; // Sandbox
const CONSUMER_KEY = Deno.env.get("PESAPAL_CONSUMER_KEY") || "";
const CONSUMER_SECRET = Deno.env.get("PESAPAL_CONSUMER_SECRET") || "";

// 🔑 Auth Header
function getAuthHeader() {
  const raw = `${CONSUMER_KEY}:${CONSUMER_SECRET}`;
  return "Basic " + btoa(unescape(encodeURIComponent(raw)));
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 }
      );
    }

    const { orderTrackingId } = await req.json();

    if (!orderTrackingId) {
      return new Response(
        JSON.stringify({ error: "Missing orderTrackingId" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // ✅ Step 1: Get Access Token
    const tokenResponse = await fetch(`${PESAPAL_BASE_URL}/Auth/RequestToken`, {
      method: "POST",
      headers: {
        "Authorization": getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const tokenData = await tokenResponse.json();
    console.log("🔑 Token response:", tokenData);

    if (!tokenResponse.ok || !tokenData.token) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch token", details: tokenData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const accessToken = tokenData.token;

    // ✅ Step 2: Get Transaction Status
    const statusResponse = await fetch(
      `${PESAPAL_BASE_URL}/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const statusData = await statusResponse.json();
    console.log("📦 Transaction status response:", statusData);

    if (!statusResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to get transaction status", details: statusData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // ✅ Return payment status
    return new Response(
      JSON.stringify({
        success: true,
        status: statusData.payment_status_description, // COMPLETED, PENDING, FAILED
        payment_method: statusData.payment_method,
        amount: statusData.amount,
        merchant_reference: statusData.merchant_reference,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (err: any) {
    console.error("🔥 Error in pesapal-status:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Unexpected error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
