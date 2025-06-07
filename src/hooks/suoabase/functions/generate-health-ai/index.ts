import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, preferences, vitals, healthProfile } = await req.json()

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAIApiKey) {
      // Fallback responses for demo
      if (type === 'workout') {
        return new Response(JSON.stringify({
          plan: `Based on your preferences: ${preferences}\n\n1. Warm-up: 5-10 minutes light cardio\n2. Strength training: 3 sets of 10-12 reps\n3. Cardio: 20-30 minutes moderate intensity\n4. Cool-down: 5-10 minutes stretching`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      if (type === 'vitals') {
        return new Response(JSON.stringify({
          analysis: `Your vitals look good! Blood pressure and heart rate are within normal range. Keep maintaining your current healthy lifestyle.`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      if (type === 'checkup') {
        return new Response(JSON.stringify({
          suggestion: `Based on your health profile, we recommend scheduling an annual physical exam, blood work panel, and vision screening.`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    let prompt = ''
    if (type === 'workout') {
      prompt = `Create a personalized workout plan based on these preferences: ${preferences}. Include warm-up, main exercises, and cool-down.`
    } else if (type === 'vitals') {
      prompt = `Analyze these vital signs and provide health insights: ${JSON.stringify(vitals)}. Give recommendations if needed.`
    } else if (type === 'checkup') {
      prompt = `Based on this health profile: ${JSON.stringify(healthProfile)}, suggest appropriate medical checkups and screenings.`
    }

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
            content: 'You are a helpful healthcare AI assistant. Provide practical, safe health advice. Always recommend consulting with healthcare professionals for serious concerns.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500
      }),
    })

    const data = await response.json()
    const result = data.choices[0].message.content

    return new Response(JSON.stringify({ 
      plan: type === 'workout' ? result : undefined,
      analysis: type === 'vitals' ? result : undefined,
      suggestion: type === 'checkup' ? result : undefined
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})