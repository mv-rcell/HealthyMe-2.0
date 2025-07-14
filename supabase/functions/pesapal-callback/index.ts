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

interface PesaPalTransactionStatus {
  payment_method: string;
  amount: number;
  created_date: string;
  confirmation_code: string;
  payment_status_description: string;
  currency: string;
  error?: any;
  status: number;
  description?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('PesaPal callback received:', req.method, req.url)

    // Parse callback data from PesaPal
    const url = new URL(req.url)
    const orderTrackingId = url.searchParams.get('OrderTrackingId')
    const merchantReference = url.searchParams.get('OrderMerchantReference')

    console.log('Callback parameters:', { orderTrackingId, merchantReference })

    if (!orderTrackingId) {
      console.error('Missing OrderTrackingId in callback')
      return new Response(
        JSON.stringify({ error: 'Missing OrderTrackingId' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration')
      throw new Error('Server configuration error')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get PesaPal credentials
    const consumerKey = Deno.env.get('PESAPAL_CONSUMER_KEY')
    const consumerSecret = Deno.env.get('PESAPAL_CONSUMER_SECRET')
    const pesapalEnv = Deno.env.get('PESAPAL_ENV') || 'production'

    if (!consumerKey || !consumerSecret) {
      console.error('Missing PesaPal configuration')
      throw new Error('Payment service configuration error')
    }

    const baseUrl = pesapalEnv === 'sandbox' 
      ? 'https://cybqa.pesapal.com/pesapalv3' 
      : 'https://pay.pesapal.com/v3'

    console.log('Using PesaPal environment:', pesapalEnv)

    // Step 1: Get OAuth token
    const auth = btoa(`${consumerKey}:${consumerSecret}`)
    const tokenResponse = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token request failed:', {
        status: tokenResponse.status,
        error: errorText
      })
      throw new Error(`Token request failed: ${tokenResponse.status}`)
    }

    const tokenData: PesaPalTokenResponse = await tokenResponse.json()
    if (tokenData.error || !tokenData.token) {
      console.error('Token error:', tokenData.error)
      throw new Error(`PesaPal token error: ${JSON.stringify(tokenData.error)}`)
    }

    console.log('Token obtained successfully')

    // Step 2: Get transaction status
    const statusResponse = await fetch(`${baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text()
      console.error('Status request failed:', {
        status: statusResponse.status,
        error: errorText
      })
      throw new Error(`Status request failed: ${statusResponse.status}`)
    }

    const statusData: PesaPalTransactionStatus = await statusResponse.json()
    console.log('Transaction status received:', {
      status: statusData.status,
      payment_status_description: statusData.payment_status_description,
      amount: statusData.amount,
      currency: statusData.currency,
      confirmation_code: statusData.confirmation_code
    })

    // Step 3: Determine payment status
    let paymentStatus = 'failed'
    const statusDescription = statusData.payment_status_description?.toLowerCase() || ''
    
    if (statusData.status === 200 && (
      statusDescription === 'completed' || 
      statusDescription === 'success' || 
      statusDescription === 'successful'
    )) {
      paymentStatus = 'successful'
    } else if (statusDescription === 'pending' || statusDescription === 'processing') {
      paymentStatus = 'pending'
    }

    console.log('Determined payment status:', paymentStatus)

    // Step 4: Get existing payment record
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', orderTrackingId)
      .single()

    if (paymentError) {
      console.error('Error fetching payment record:', paymentError)
      throw new Error('Payment record not found')
    }

    console.log('Payment record found:', {
      id: paymentRecord.id,
      user_id: paymentRecord.user_id,
      current_status: paymentRecord.payment_status,
      membership_plan: paymentRecord.membership_plan
    })

    // Step 5: Update payment record
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('transaction_id', orderTrackingId)

    if (updateError) {
      console.error('Database update error:', updateError)
      throw new Error(`Database update failed: ${updateError.message}`)
    }

    console.log('Payment record updated successfully')

    // Step 6: Update user membership if payment successful
    if (paymentStatus === 'successful' && paymentRecord.membership_plan && paymentRecord.user_id) {
      const membershipTier = paymentRecord.membership_plan.toLowerCase()
      
      console.log('Updating user membership:', {
        userId: paymentRecord.user_id,
        membershipTier: membershipTier
      })
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          membership_tier: membershipTier,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentRecord.user_id)

      if (profileError) {
        console.error('Error updating user membership:', profileError)
        // Log error but don't fail the callback
      } else {
        console.log('User membership tier updated successfully to:', membershipTier)
      }
    }

    console.log(`Payment ${orderTrackingId} processed with status: ${paymentStatus}`)

    // Step 7: Return success response
    return new Response(
      JSON.stringify({ 
        status: 'success', 
        message: 'Payment callback processed successfully',
        orderTrackingId,
        paymentStatus,
        confirmationCode: statusData.confirmation_code,
        environment: pesapalEnv
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error: any) {
    console.error('Callback processing error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: 'Callback processing failed',
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
