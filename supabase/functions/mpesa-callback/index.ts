
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const callbackData = await req.json()
    console.log('M-Pesa callback received:', JSON.stringify(callbackData, null, 2))

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { Body } = callbackData
    if (!Body || !Body.stkCallback) {
      console.error('Invalid callback data structure:', callbackData)
      throw new Error('Invalid callback data structure')
    }

    const { stkCallback } = Body
    const checkoutRequestId = stkCallback.CheckoutRequestID
    const resultCode = stkCallback.ResultCode
    const resultDesc = stkCallback.ResultDesc

    console.log('Processing callback for:', checkoutRequestId, 'Result:', resultCode, resultDesc)

    let paymentStatus = 'failed'
    let mpesaReceiptNumber = null
    let amount = null
    let phoneNumber = null

    if (resultCode === 0) {
      // Payment successful
      paymentStatus = 'successful'
      
      // Extract payment details from callback items
      if (stkCallback.CallbackMetadata && stkCallback.CallbackMetadata.Item) {
        const items = stkCallback.CallbackMetadata.Item
        
        const receiptItem = items.find((item: any) => item.Name === 'MpesaReceiptNumber')
        const amountItem = items.find((item: any) => item.Name === 'Amount')
        const phoneItem = items.find((item: any) => item.Name === 'PhoneNumber')
        
        if (receiptItem) mpesaReceiptNumber = receiptItem.Value
        if (amountItem) amount = amountItem.Value
        if (phoneItem) phoneNumber = phoneItem.Value
        
        console.log('Payment details:', { mpesaReceiptNumber, amount, phoneNumber })
      }
    } else {
      console.log('Payment failed with code:', resultCode, 'Description:', resultDesc)
    }

    // Get payment record to check for membership tier
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .select('user_id, metadata')
      .eq('transaction_id', checkoutRequestId)
      .single()

    if (paymentError) {
      console.error('Error fetching payment record:', paymentError)
    } else {
      console.log('Payment record found:', paymentRecord)
    }

    // Update payment record in database
    const updateData: any = {
      payment_status: paymentStatus,
      updated_at: new Date().toISOString()
    }

    if (mpesaReceiptNumber) {
      updateData.transaction_id = mpesaReceiptNumber
    }

    const { error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('transaction_id', checkoutRequestId)

    if (error) {
      console.error('Database update error:', error)
      throw error
    }

    console.log('Payment record updated successfully')

    // If payment successful and has membership tier, update user profile
    if (paymentStatus === 'successful' && paymentRecord?.metadata?.membership_tier && paymentRecord.user_id) {
      console.log('Updating user membership tier:', paymentRecord.metadata.membership_tier)
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          membership_tier: paymentRecord.metadata.membership_tier,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentRecord.user_id)

      if (profileError) {
        console.error('Error updating user membership:', profileError)
      } else {
        console.log('User membership tier updated successfully to:', paymentRecord.metadata.membership_tier)
      }
    }

    console.log(`Payment ${checkoutRequestId} processed with status: ${paymentStatus}`)

    // Return success response to M-Pesa
    return new Response(
      JSON.stringify({ 
        ResultCode: 0, 
        ResultDesc: "Confirmation received successfully" 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Callback processing error:', error)
    
    // Still return success to M-Pesa to avoid retries
    return new Response(
      JSON.stringify({ 
        ResultCode: 0, 
        ResultDesc: "Confirmation received" 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  }
})