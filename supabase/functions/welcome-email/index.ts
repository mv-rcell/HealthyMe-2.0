import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

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
    const { email } = await req.json()

    if (!email) {
      throw new Error('Email is required')
    }

    const { error } = await resend.emails.send({
      from: 'HealthyMe <welcome@healthyme.com>',
      to: [email],
      subject: 'Welcome to HealthyMe Newsletter! 🌟',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to HealthyMe! 🌟</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Thank you for subscribing!</h2>
            <p>You're now part of our health community and will receive:</p>
            <ul style="color: #555; line-height: 1.6;">
              <li><strong>🔬 Latest Health Insights</strong> - Evidence-based health tips and research updates</li>
              <li><strong>🆕 New Feature Announcements</strong> - Be the first to know about platform improvements</li>
              <li><strong>👩‍⚕️ Specialist Spotlights</strong> - Meet our featured healthcare professionals</li>
              <li><strong>💡 Wellness Tips</strong> - Practical advice for better health outcomes</li>
              <li><strong>📱 Platform Updates</strong> - New services and enhanced features</li>
            </ul>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #667eea;">What's New This Week:</h3>
              <p>🤖 <strong>AI Health Recommendations</strong> - Get personalized care plans and symptom analysis</p>
              <p>🔍 <strong>Enhanced Specialist Search</strong> - Find the right healthcare provider faster</p>
              <p>📊 <strong>Improved Health Dashboard</strong> - Better tracking and insights</p>
            </div>
            <p>Ready to start your health journey? <a href="https://healthyme.com/client-dashboard" style="color: #667eea; text-decoration: none; font-weight: bold;">Access Your Dashboard →</a></p>
          </div>
          <div style="padding: 20px; text-align: center; background: #333; color: white;">
            <p style="margin: 0;">Questions? Reply to this email or contact our support team.</p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #ccc;">HealthyMe - Your Health, Our Priority</p>
          </div>
        </div>
      `
    })

    if (error) {
      throw error
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Welcome email sent successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Welcome email error:', error)
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
