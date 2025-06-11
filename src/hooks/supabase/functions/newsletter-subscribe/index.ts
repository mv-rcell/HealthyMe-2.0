import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      throw new Error('Email is required')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Insert newsletter subscription
    const { error: insertError } = await supabase
      .from('newsletter_subscriptions')
      .insert([{ email, subscribed_at: new Date().toISOString() }])

    if (insertError) {
      if (insertError.code === '23505') { // Unique constraint violation
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Email already subscribed' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      throw insertError
    }

    // Here you could integrate with email service like SendGrid, Mailchimp, etc.
    console.log(`New newsletter subscription: ${email}`)

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Successfully subscribed to newsletter' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})