
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      console.log('OpenAI API key not configured, using fallback response')
      return new Response(JSON.stringify({ 
        response: generateFallbackResponse(query)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const appKnowledge = `
    You are a helpful AI assistant for HealthyMe, a comprehensive health platform. Here's what you need to know about the app:

    MAIN FEATURES:
    - Client Dashboard: Personal health tracking, appointments, and records
    - Specialist Search: Find and book healthcare professionals
    - AI Health Recommendations: Personalized care plans and symptom analysis
    - Health Records Management: Store and manage medical history
    - Lab Test Booking: Schedule and track laboratory tests
    - Video Consultations: Remote appointments with specialists
    - Appointment Booking: Schedule in-person and virtual visits
    - Health Programs: Wellness and fitness tracking
    - Habit Tracking: Monitor daily health habits
    - Messaging System: Communicate with healthcare providers
    - Membership Plans: Different tiers of service access
    - Newsletter: Regular health updates and platform news

    SPECIALIST TYPES AVAILABLE:
    - General Practitioners, Cardiologists, Dermatologists, Neurologists
    - Psychiatrists, Orthopedic Surgeons, Pediatricians, Gynecologists
    - Dentists, Ophthalmologists, ENT Specialists, Endocrinologists

    HOW TO USE THE APP:
    1. Sign up and complete your profile
    2. Access your dashboard to view health overview
    3. Search for specialists by specialty, location, or availability
    4. Book appointments (in-person or virtual)
    5. Use AI recommendations for health guidance
    6. Track your health journey and progress
    7. Manage medical records and lab results

    PRICING & MEMBERSHIP:
    - Basic Plan: Essential features
    - Premium Plan: Advanced features and priority support
    - Family Plans: Multiple user accounts

    Always provide helpful, accurate information about these features and guide users on how to use them effectively.
    `

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: appKnowledge
          },
          {
            role: 'user',
            content: `User question about HealthyMe app: ${query}`
          }
        ],
        max_tokens: 800,
        temperature: 0.3
      })
    })

    if (!response.ok) {
      console.log(`OpenAI API error: ${response.statusText}, using fallback`)
      return new Response(JSON.stringify({ 
        response: generateFallbackResponse(query)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const aiResponse = await response.json()
    const content = aiResponse.choices[0]?.message?.content

    if (!content) {
      return new Response(JSON.stringify({ 
        response: generateFallbackResponse(query)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ response: content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in app-query-ai function:', error)
    return new Response(JSON.stringify({ 
      response: generateFallbackResponse('')
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function generateFallbackResponse(query: string): string {
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.includes('appointment') || lowerQuery.includes('book')) {
    return `To book an appointment on HealthyMe:
1. Go to your dashboard and click "Book Appointment"
2. Search for specialists by specialty or location
3. Choose available time slots
4. Select in-person or video consultation
5. Confirm your booking

You can also use our specialist search feature to find healthcare providers that match your specific needs.`
  }
  
  if (lowerQuery.includes('specialist') || lowerQuery.includes('doctor')) {
    return `HealthyMe offers access to various specialists including:
- General Practitioners for primary care
- Cardiologists for heart conditions
- Dermatologists for skin issues
- Neurologists for nervous system disorders
- Psychiatrists for mental health
- And many more specialties

Use our specialist search feature to find providers by location, specialty, and availability.`
  }
  
  if (lowerQuery.includes('ai') || lowerQuery.includes('recommendation')) {
    return `Our AI Health Recommendations feature provides:
- Personalized care plans based on your health goals
- Symptom analysis and guidance
- Specialist recommendations
- Health insights and tips

Access this feature through your dashboard under "Smart Features" or "AI Recommendations".`
  }
  
  if (lowerQuery.includes('dashboard') || lowerQuery.includes('features')) {
    return `Your HealthyMe dashboard includes:
- Health overview and vital statistics
- Upcoming appointments
- Health records management
- Lab test results
- AI-powered recommendations
- Messaging with healthcare providers
- Habit tracking and wellness programs

Access your dashboard after logging in to explore all features.`
  }
  
  return `HealthyMe is your comprehensive health platform offering:

🏥 **Main Features:**
- Specialist search and appointment booking
- AI-powered health recommendations
- Health records management
- Video consultations
- Lab test booking and tracking
- Personal health dashboard

👩‍⚕️ **Healthcare Services:**
- Access to various medical specialists
- In-person and virtual consultations
- Health monitoring and tracking
- Personalized care plans

📱 **How to Get Started:**
1. Create your account and complete your profile
2. Explore your dashboard
3. Search for specialists or book appointments
4. Use AI recommendations for health guidance

For specific questions about features, appointments, or account setup, please provide more details and I'll give you targeted guidance!`
}
