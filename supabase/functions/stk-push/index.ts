import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MpesaTokenResponse {
  access_token: string;
  expires_in: string;
}

interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { amount, phoneNumber, userId, membershipTier } = body

    if (!amount || !phoneNumber || !userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: amount, phoneNumber, or userId',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // M-Pesa credentials
    const consumerKey = Deno.env.get('CONSUMER_KEY')!
    const consumerSecret = Deno.env.get('CONSUMER_SECRET')!
    const shortcode = Deno.env.get('MPESA_SHORTCODE')!
    const passkey = Deno.env.get('MPESA_PASSKEY')!
    const baseUrl = 'https://sandbox.safaricom.co.ke'
    const callbackUrl = Deno.env.get('MPESA_CALLBACK_URL')!

    console.log('Starting M-Pesa payment process for:', { amount, phoneNumber, userId, membershipTier })

    // Step 1: Get OAuth token
    const auth = btoa(`${consumerKey}:${consumerSecret}`)
    const tokenResponse = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token request failed:', errorData)
      throw new Error(`Token request failed: ${tokenResponse.status} - ${errorData}`)
    }

    const tokenData: MpesaTokenResponse = await tokenResponse.json()
    console.log('Token obtained successfully')

    // Step 2: Generate timestamp & password
    const timestampRaw = new Date()
    const timestamp = timestampRaw.toISOString().replace(/[^0-9]/g, '').slice(0, 14)
    const password = btoa(`${shortcode}${passkey}${timestamp}`)

    // Step 3: Format phone number
    let formattedPhone = phoneNumber.replace(/\D/g, '')
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1)
    } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
      formattedPhone = '254' + formattedPhone
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone
    }

    console.log('Formatted phone number:', formattedPhone)

    // Step 4: Initiate STK Push
    const stkPushPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: parseInt(amount),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: `HealthyMe_${userId}`,
      TransactionDesc: membershipTier ? `HealthyMe ${membershipTier} Membership` : "HealthyMe Payment"
    }

    console.log('Initiating STK Push with payload:', JSON.stringify(stkPushPayload, null, 2))

    const stkResponse = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushPayload),
    })

    const stkData: STKPushResponse = await stkResponse.json()
    console.log('STK Push response:', JSON.stringify(stkData, null, 2))

    if (stkData.ResponseCode === "0") {
      const { data: payment, error } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          amount: parseInt(amount),
          currency: 'KES',
          payment_method: 'mpesa',
          payment_status: 'pending',
          transaction_id: stkData.CheckoutRequestID,
          metadata: membershipTier ? { membership_tier: membershipTier } : null
        })
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        throw error
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: stkData.CustomerMessage,
          checkoutRequestId: stkData.CheckoutRequestID,
          merchantRequestId: stkData.MerchantRequestID,
          paymentId: payment.id
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      console.error('❌ STK Push failed:', JSON.stringify(stkData, null, 2));
      throw new Error(`STK Push failed: ${stkData.ResponseDescription || 'Unknown error'}`);
    }

  } catch (error: any) {
    console.error('M-Pesa payment error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || 'Payment processing failed'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
