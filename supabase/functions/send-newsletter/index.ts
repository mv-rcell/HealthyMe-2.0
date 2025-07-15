import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, subject, content } = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get all newsletter subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from('newsletter_subscriptions')
      .select('email')

    if (fetchError) {
      throw fetchError
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No subscribers found' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Send emails to all subscribers
    const emailPromises = subscribers.map(subscriber => 
      resend.emails.send({
        from: 'HealthyMe <updates@healthyme.com>',
        to: [subscriber.email],
        subject: subject || 'HealthyMe Newsletter Update',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
              <h1>HealthyMe Newsletter</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
              ${content || `
                <h2>Latest Updates from HealthyMe</h2>
                <p>We're excited to share the latest features and improvements to your health platform:</p>
                <ul>
                  <li><strong>New AI Health Recommendations</strong> - Get personalized health advice powered by advanced AI</li>
                  <li><strong>Enhanced Specialist Search</strong> - Find and book appointments with specialists more easily</li>
                  <li><strong>Improved Dashboard</strong> - Better tracking of your health journey and progress</li>
                  <li><strong>Mobile Optimization</strong> - Seamless experience across all devices</li>
                </ul>
                <p>Login to your dashboard to explore these new features!</p>
              `}
            </div>
            <div style="padding: 20px; text-align: center; background: #333; color: white;">
              <p>Thank you for being part of the HealthyMe community!</p>
              <p><a href="https://healthyme.com" style="color: #667eea;">Visit HealthyMe</a></p>
            </div>
          </div>
        `
      })
    )

    const results = await Promise.allSettled(emailPromises)
    const successful = results.filter(result => result.status === 'fulfilled').length
    const failed = results.filter(result => result.status === 'rejected').length

    console.log(`Newsletter sent: ${successful} successful, ${failed} failed`)

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Newsletter sent to ${successful} subscribers`,
      stats: { successful, failed, total: subscribers.length }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Newsletter sending error:', error)
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
