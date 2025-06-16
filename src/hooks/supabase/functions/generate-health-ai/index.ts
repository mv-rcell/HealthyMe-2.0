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
    const { type, ...data } = await req.json()
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      console.log('OpenAI API key not configured, using fallback responses')
      // Return fallback response instead of throwing error
      return new Response(JSON.stringify({ 
        recommendation: generateFallbackResponse(type, data)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    let prompt = ''
    
    switch (type) {
      case 'care_plan':
        prompt = `Create a comprehensive care plan for someone with these health goals: "${data.healthGoals}" 
        and current conditions: "${data.currentConditions}". Include lifestyle recommendations, 
        monitoring suggestions, and timeline milestones.`
        break
        
      case 'symptom_analysis':
        prompt = `Analyze these symptoms: "${data.symptoms}" and provide general health guidance. 
        Include when to seek medical attention, possible causes (educational only), and self-care tips. 
        Always emphasize consulting healthcare professionals for proper diagnosis.`
        break
        
      case 'specialist':
        prompt = `Based on these symptoms/conditions: "${data.symptoms}", 
        recommend the most suitable medical specialists and explain why each would be helpful. 
        Prioritize them based on the symptoms described.`
        break
        
      default:
        prompt = `Provide general health guidance for: ${JSON.stringify(data)}`
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
            content: `You are a helpful AI health assistant. Provide informative, personalized guidance while always emphasizing that your suggestions are educational and not a substitute for professional medical advice. Be encouraging and supportive while maintaining appropriate medical disclaimers.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      console.log(`OpenAI API error: ${response.statusText}, using fallback`)
      return new Response(JSON.stringify({ 
        recommendation: generateFallbackResponse(type, data)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const aiResponse = await response.json()
    const content = aiResponse.choices[0]?.message?.content

    if (!content) {
      return new Response(JSON.stringify({ 
        recommendation: generateFallbackResponse(type, data)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ recommendation: content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in generate-health-ai function:', error)
    return new Response(JSON.stringify({ 
      recommendation: generateFallbackResponse('error', { error: error.message })
    }), {
      status: 200, // Return 200 to avoid client errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function generateFallbackResponse(type: string, data: any): string {
  switch (type) {
    case 'care_plan':
      return `**Personalized Care Plan**

**Health Goals:** ${data.healthGoals || 'General wellness improvement'}
**Current Conditions:** ${data.currentConditions || 'To be assessed'}

**Recommendations:**
1. **Regular Monitoring** - Track vital signs and symptoms daily
2. **Lifestyle Modifications** - Focus on balanced diet, regular exercise, and stress management
3. **Medical Follow-ups** - Schedule regular check-ups with healthcare providers
4. **Preventive Care** - Stay up to date with vaccinations and health screenings
5. **Emergency Planning** - Know when to seek immediate medical attention

**Next Steps:**
- Book consultation with relevant specialists
- Start habit tracking for health goals
- Review and update care plan monthly

*Note: This is general guidance. Please consult healthcare professionals for personalized medical advice.*`

    case 'symptom_analysis':
      return `**Symptom Analysis Report**

**Symptoms Reported:** ${data.symptoms || 'General health concerns'}

**Preliminary Assessment:**
- Symptoms warrant medical evaluation for proper diagnosis
- Consider timing, severity, and associated factors
- Monitor for any worsening or new symptoms

**Recommended Actions:**
1. **Immediate:** If experiencing severe symptoms, seek emergency care
2. **Short-term:** Schedule appointment with general practitioner
3. **Ongoing:** Keep symptom diary for healthcare provider

**Important:** This is not a medical diagnosis. Please consult healthcare professionals for proper evaluation and treatment.`

    case 'specialist':
      return `**Specialist Recommendations**

Based on your symptoms: "${data.symptoms || 'health concerns'}", consider consulting:

1. **General Medicine** - For initial assessment and comprehensive evaluation
2. **Internal Medicine** - For complex or persistent symptoms
3. **Specialist Referral** - Based on specific symptom patterns and initial findings

**Next Steps:**
- Book appointment through our platform
- Prepare symptom history and questions
- Bring any relevant medical records

**Important:** Professional medical evaluation is essential for proper diagnosis and treatment planning.`

    default:
      return 'AI health guidance is temporarily unavailable. Please consult with our medical specialists directly for personalized advice.'
  }
}
