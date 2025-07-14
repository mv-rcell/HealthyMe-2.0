
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PesaPalTokenResponse {
  token: string;
  expiryDate: string;
  error?: any;
  status: string;
}

interface PesaPalSubmitOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error?: any;
  status: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    console.log('=== PesaPal Payment Function Started ===')
    
    // Parse request body
    let body;
    try {
      body = await req.json()
    } catch (error) {
      console.error('Failed to parse request body:', error)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid request body format',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { amount, phoneNumber, userId, membershipTier } = body
    console.log('Payment request received:', { amount, phoneNumber, userId, membershipTier })

    // Validate required fields
    if (!amount || !phoneNumber || !userId) {
      console.error('Missing required fields:', { amount: !!amount, phoneNumber: !!phoneNumber, userId: !!userId })
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: amount, phoneNumber, or userId',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate amount
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      console.error('Invalid amount:', amount)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid amount provided',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Server configuration error - Supabase',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get PesaPal credentials from environment
    const consumerKey = Deno.env.get('PESAPAL_CONSUMER_KEY')
    const consumerSecret = Deno.env.get('PESAPAL_CONSUMER_SECRET')
    const pesapalEnv = Deno.env.get('PESAPAL_ENV') || 'sandbox'
    const ipnId = Deno.env.get('PESAPAL_IPN_ID')

    console.log('Environment check:', {
      hasConsumerKey: !!consumerKey,
      hasConsumerSecret: !!consumerSecret,
      pesapalEnv,
      hasIpnId: !!ipnId,
      consumerKeyLength: consumerKey?.length,
      consumerSecretLength: consumerSecret?.length
    })

    // Debug: Log the actual values (first few characters only for security)
    console.log('Credential preview:', {
      consumerKeyStart: consumerKey?.substring(0, 8) + '...',
      consumerSecretStart: consumerSecret?.substring(0, 8) + '...',
      ipnIdValue: ipnId
    })

    if (!consumerKey || !consumerSecret || !ipnId) {
      console.error('Missing PesaPal configuration - Please check your Supabase secrets')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Payment service configuration error - Missing PesaPal credentials. Please contact support.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate credentials format
    if (consumerKey.length < 10 || consumerSecret.length < 10) {
      console.error('PesaPal credentials appear to be invalid format')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Payment service configuration error - Invalid credential format. Please contact support.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use correct PesaPal URL based on environment
    const baseUrl = pesapalEnv === 'sandbox' 
      ? 'https://cybqa.pesapal.com/pesapalv3' 
      : 'https://pay.pesapal.com/v3'
    
    const callbackUrl = `${supabaseUrl}/functions/v1/pesapal-callback`

    console.log('PesaPal configuration:', {
      environment: pesapalEnv,
      baseUrl,
      callbackUrl
    })

    // Step 1: Get OAuth token with simplified authentication
    console.log('Requesting PesaPal token...')
    
    // Try simple Basic auth first
    const authString = `${consumerKey}:${consumerSecret}`
    const encodedAuth = btoa(authString)
    
    console.log('Auth string length:', authString.length)
    console.log('Encoded auth length:', encodedAuth.length)
    
    let tokenResponse;
    try {
      console.log('Making token request to:', `${baseUrl}/api/Auth/RequestToken`)
      tokenResponse = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${encodedAuth}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
    } catch (error) {
      console.error('Network error during token request:', error)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Network error connecting to payment service. Please try again.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Token response status:', tokenResponse.status)
    console.log('Token response headers:', Object.fromEntries(tokenResponse.headers.entries()))

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token request failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText,
        url: `${baseUrl}/api/Auth/RequestToken`,
        authHeaderUsed: `Basic ${encodedAuth.substring(0, 20)}...`
      })
      
      // Try to parse the error response
      let parsedError;
      try {
        parsedError = JSON.parse(errorText)
        console.error('Parsed error:', parsedError)
      } catch (parseError) {
        console.error('Could not parse error response:', parseError)
      }
      
      let userError = 'Payment service authentication failed'
      if (errorText.includes('authentication_error') || errorText.includes('Invalid Access Token')) {
        userError = 'Payment service configuration error - Invalid credentials. Please contact support.'
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          error: userError,
          debug: {
            status: tokenResponse.status,
            response: errorText.substring(0, 500) // First 500 chars for debugging
          }
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let tokenData: PesaPalTokenResponse
    try {
      const responseText = await tokenResponse.text()
      console.log('Raw token response:', responseText)
      tokenData = JSON.parse(responseText)
    } catch (error) {
      console.error('Failed to parse token response:', error)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid response from payment service',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Token response received:', { 
      status: tokenData.status, 
      hasToken: !!tokenData.token,
      error: tokenData.error 
    })

    if (tokenData.error || !tokenData.token) {
      console.error('Token error:', tokenData.error)
      return new Response(
        JSON.stringify({
          success: false,
          error: `Payment service authentication error. Please contact support.`,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 2: Format phone number properly
    let formattedPhone = phoneNumber.replace(/\D/g, '') // Remove non-digits
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+254' + formattedPhone.slice(1)
    } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
      formattedPhone = '+254' + formattedPhone
    } else if (formattedPhone.startsWith('254')) {
      formattedPhone = '+' + formattedPhone
    } else if (!formattedPhone.startsWith('+254')) {
      formattedPhone = '+254' + formattedPhone
    }

    console.log('Phone number formatted:', { original: phoneNumber, formatted: formattedPhone })

    // Generate unique merchant reference
    const merchantReference = `HM_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log('Generated merchant reference:', merchantReference)

    // Step 3: Prepare order data
    const orderData = {
      id: merchantReference,
      currency: "KES",
      amount: numAmount,
      description: membershipTier ? `HealthyMe ${membershipTier} Membership` : "HealthyMe Payment",
      callback_url: callbackUrl,
      notification_id: ipnId,
      billing_address: {
        phone_number: formattedPhone,
        email_address: `user_${userId}@healthyme.app`,
        country_code: "KE",
        first_name: "HealthyMe",
        last_name: "User",
        line_1: "Nairobi",
        line_2: "",
        city: "Nairobi",
        state: "Nairobi",
        postal_code: "00100",
        zip_code: "00100"
      }
    }

    console.log('Order data prepared:', {
      id: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      description: orderData.description
    })

    // Step 4: Submit order to PesaPal
    console.log('Submitting order to PesaPal...')
    let submitResponse;
    try {
      submitResponse = await fetch(`${baseUrl}/api/Transactions/SubmitOrderRequest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
    } catch (error) {
      console.error('Network error during order submission:', error)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Network error submitting payment order',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Submit response status:', submitResponse.status)

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text()
      console.error('Submit order failed:', {
        status: submitResponse.status,
        statusText: submitResponse.statusText,
        error: errorText
      })
      return new Response(
        JSON.stringify({
          success: false,
          error: `Order submission failed: ${submitResponse.status} - ${errorText}`,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let submitData: PesaPalSubmitOrderResponse
    try {
      const responseText = await submitResponse.text()
      console.log('Raw submit response:', responseText)
      submitData = JSON.parse(responseText)
    } catch (error) {
      console.error('Failed to parse submit response:', error)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid response from payment service during order submission',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('PesaPal submit response:', {
      hasOrderTrackingId: !!submitData.order_tracking_id,
      hasRedirectUrl: !!submitData.redirect_url,
      status: submitData.status,
      error: submitData.error
    })

    if (submitData.error) {
      console.error('PesaPal submit error:', submitData.error)
      return new Response(
        JSON.stringify({
          success: false,
          error: `PesaPal submit error: ${JSON.stringify(submitData.error)}`,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!submitData.order_tracking_id || !submitData.redirect_url) {
      console.error('Missing required response data:', submitData)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid response from payment service - missing tracking ID or redirect URL',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 5: Store payment record in database
    const paymentData = {
      user_id: userId,
      amount: numAmount,
      currency: 'KES',
      payment_method: 'pesapal',
      payment_status: 'pending',
      transaction_id: submitData.order_tracking_id,
      membership_plan: membershipTier || ''
    }

    console.log('Storing payment record in database...')
    const { data: payment, error: dbError } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({
          success: false,
          error: `Database error: ${dbError.message}`,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Payment record created successfully:', {
      paymentId: payment.id,
      orderTrackingId: submitData.order_tracking_id,
      status: 'pending'
    })

    // Return success response
    const successResponse = {
      success: true,
      message: 'Payment initiated successfully',
      orderTrackingId: submitData.order_tracking_id,
      merchantReference: submitData.merchant_reference,
      redirectUrl: submitData.redirect_url,
      paymentId: payment.id,
      environment: pesapalEnv
    }

    console.log('=== PesaPal Payment Function Completed Successfully ===')
    return new Response(
      JSON.stringify(successResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error: any) {
    console.error('=== PesaPal Payment Function Error ===')
    console.error('Unexpected error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Payment processing failed. Please try again.',
        details: 'An unexpected error occurred during payment processing'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})