import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("🔔 PesaPal Callback Received:", body);

    const { OrderTrackingId, MerchantReference, Status } = body;

    if (!OrderTrackingId || !MerchantReference || !Status) {
      console.error("❌ Missing fields in callback body:", body);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing OrderTrackingId, MerchantReference, or Status",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // SUPABASE CLIENT
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(
      `🔍 Looking for payment with transaction_id = ${OrderTrackingId}`,
    );

    // FIND PAYMENT RECORD
    const { data: paymentRecord, error: findError } = await supabase
      .from("payments")
      .select("*")
      .eq("transaction_id", OrderTrackingId)
      .single();

    if (findError) {
      console.error("❌ Payment lookup failed:", findError);
      throw new Error("Payment not found for this OrderTrackingId");
    }

    console.log("✅ Payment record found:", paymentRecord);

    // DETERMINE NEW STATUS
    const newStatus =
      Status.toLowerCase() === "completed"
        ? "success"
        : Status.toLowerCase() === "failed"
        ? "failed"
        : "pending";

    console.log(`🔄 Updating payment status → ${newStatus}`);

    // UPDATE PAYMENT STATUS
    const { error: updateError } = await supabase
      .from("payments")
      .update({ payment_status: newStatus })
      .eq("id", paymentRecord.id);

    if (updateError) {
      console.error("❌ Error updating payment:", updateError);
      throw updateError;
    }

    console.log("💾 Payment status updated successfully.");

    // IF SUCCESSFUL → UPGRADE MEMBERSHIP
    if (newStatus === "success") {
      const membershipTier = paymentRecord.metadata?.membership_tier;

      if (membershipTier) {
        console.log(`🌟 Updating user membership → ${membershipTier}`);

        const { error: membershipError } = await supabase
          .from("users")
          .update({ membership_tier: membershipTier })
          .eq("id", paymentRecord.user_id);

        if (membershipError) {
          console.error("❌ Membership update failed:", membershipError);
          throw membershipError;
        }

        console.log("🎉 User membership updated successfully.");
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Callback processed successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err: any) {
    console.error("🔥 Callback Error:", err);

    return new Response(
      JSON.stringify({
        success: false,
        error: err?.message || "Callback processing failed",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
