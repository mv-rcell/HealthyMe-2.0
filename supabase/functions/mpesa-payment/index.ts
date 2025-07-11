
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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get M-Pesa credentials from secrets - using production endpoints
    const consumerKey = Deno.env.get('CONSUMER_KEY')!
    const consumerSecret = Deno.env.get('CONSUMER_SECRET')!
    const shortcode = Deno.env.get('MPESA_SHORTCODE')!
    const passkey = Deno.env.get('MPESA_PASSKEY')!
    const baseUrl = Deno.env.get("MPESA_BASE_URL")!
    const callbackUrl = Deno.env.get('MPESA_CALLBACK_URL')!

    console.log('Starting M-Pesa payment process for:', { amount, phoneNumber, userId, membershipTier })
    console.log("Base URL:", baseUrl)
    console.log("Consumer Key:", consumerKey)
    console.log("Consumer Secret:", consumerSecret)


    // Step 1: Get OAuth token
    if (!consumerKey || !consumerSecret) {
      throw new Error("Missing M-Pesa API credentials (CONSUMER_KEY or CONSUMER_SECRET)")
    }
    
    const auth = btoa(unescape(encodeURIComponent(`${consumerKey}:${consumerSecret}`)))
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

    // Step 2: Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
    const password = btoa(`${shortcode}${passkey}${timestamp}`)

    // Step 3: Format phone number (ensure it starts with 254)
    let formattedPhone = phoneNumber.replace(/\D/g, '') // Remove non-digits
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
      // Store payment record in database with membership tier metadata
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

      console.log('Payment record created:', payment)

      return new Response(
        JSON.stringify({
          success: true,
          message: stkData.CustomerMessage,
          checkoutRequestId: stkData.CheckoutRequestID,
          merchantRequestId: stkData.MerchantRequestID,
          paymentId: payment.id
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      console.error('STK Push failed:', stkData)
      throw new Error(stkData.ResponseDescription || 'STK Push failed')
    }

  } catch (error: any) {
    console.error('M-Pesa payment error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || 'Payment processing failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})