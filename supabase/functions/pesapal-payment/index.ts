import { serve } from "server";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PesaPalTokenResponse {
  token: string;
  expiryDate: string;
  status: string;
  error?: any;
}

interface PesaPalSubmitOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  status: string;
  error?: any;
}

// ---------------------------------------
// PHONE FORMATTER
// ---------------------------------------
function formatPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) return "+254" + cleaned.slice(1);
  if (cleaned.startsWith("7") || cleaned.startsWith("1"))
    return "+254" + cleaned;
  if (cleaned.startsWith("254")) return "+" + cleaned;

  return "+254" + cleaned;
}

// ---------------------------------------
// EDGE FUNCTION (NODE RUNTIME, NOT DENO)
// ---------------------------------------
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { amount, phoneNumber, userId, membershipTier } = body;

    if (!amount || !phoneNumber || !userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: amount, phoneNumber, or userId",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // -------------------------------
    // SUPABASE CLIENT
    // -------------------------------
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // -------------------------------
    // PESAPAL CREDS
    // -------------------------------
    const consumerKey = process.env.PESAPAL_CONSUMER_KEY!;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET!;
    const notificationId = process.env.PESAPAL_IPN_ID!;

    const baseUrl = "https://cybqa.pesapal.com/pesapalv3";
    const callbackUrl = `${process.env.SUPABASE_URL}/functions/v1/pesapal-callback`;

    console.log("Starting Pesapal payment", {
      amount,
      phoneNumber,
      userId,
      membershipTier,
    });

    // -------------------------------
    // STEP 1 — AUTH TOKEN
    // -------------------------------
    const authHeader = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString("base64");

    const tokenRes = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
    });

    const tokenRaw = await tokenRes.text();
    if (!tokenRes.ok) {
      throw new Error(`Pesapal token error ${tokenRes.status}: ${tokenRaw}`);
    }

    const tokenData: PesaPalTokenResponse = JSON.parse(tokenRaw);
    if (tokenData.error) {
      throw new Error(`Pesapal Token Error: ${JSON.stringify(tokenData.error)}`);
    }

    // -------------------------------
    // STEP 2 — FORMAT PHONE
    // -------------------------------
    const formattedPhone = formatPhone(phoneNumber);

    // -------------------------------
    // STEP 3 — SUBMIT ORDER
    // -------------------------------
    const merchantReference = `HM_${userId}_${Date.now()}`;

    const orderPayload = {
      id: merchantReference,
      currency: "KES",
      amount: parseFloat(amount),
      description: membershipTier
        ? `HealthyMe ${membershipTier} Membership`
        : "HealthyMe Payment",
      callback_url: callbackUrl,
      notification_id: notificationId,
      billing_address: {
        phone_number: formattedPhone,
        email_address: `user_${userId}@healthyme.app`,
        country_code: "KE",
        first_name: "HealthyMe",
        last_name: "User",
        line_1: "Nairobi",
        city: "Nairobi",
        state: "Nairobi",
        postal_code: "00100",
        zip_code: "00100",
      },
    };

    const submitRes = await fetch(
      `${baseUrl}/api/Transactions/SubmitOrderRequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      }
    );

    const submitRaw = await submitRes.text();
    if (!submitRes.ok) {
      throw new Error(`Pesapal Submit Error ${submitRes.status}: ${submitRaw}`);
    }

    const submitData: PesaPalSubmitOrderResponse = JSON.parse(submitRaw);
    if (submitData.error) {
      throw new Error(`Pesapal Submit Error: ${JSON.stringify(submitData.error)}`);
    }

    // -------------------------------
    // STEP 4 — SAVE PAYMENT
    // -------------------------------
    const { data: payment, error: dbError } = await supabase
      .from("payments")
      .insert({
        user_id: userId,
        amount: parseFloat(amount),
        currency: "KES",
        payment_method: "pesapal",
        payment_status: "pending",
        transaction_id: submitData.order_tracking_id,
        metadata: {
          membership_tier: membershipTier,
          merchant_reference: merchantReference,
          phone_number: formattedPhone,
        },
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment initiated",
        orderTrackingId: submitData.order_tracking_id,
        merchantReference: submitData.merchant_reference,
        redirectUrl: submitData.redirect_url,
        paymentId: payment.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Pesapal Payment Error:", err);

    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || "Payment failed",
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
