import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAIRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendation = async (data: { type: string; data: any }) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Generating AI recommendation:', data);
      
      const { data: result, error } = await supabase.functions.invoke('generate-health-ai', {
        body: { 
          type: data.type,
          ...data.data 
        }
      });

      if (error) {
        console.error('AI function error:', error);
        // Fallback to simulated response
        return generateFallbackRecommendation(data);
      }

      console.log('AI recommendation result:', result);
      return result?.recommendation || generateFallbackRecommendation(data);
    } catch (err: any) {
      console.error('AI recommendation error:', err);
      setError(err.message);
      toast.error('AI service temporarily unavailable. Using fallback recommendations.');
      return generateFallbackRecommendation(data);
    } finally {
      setLoading(false);
    }
  };

  const generateCarePlan = async (healthGoals: string, currentConditions: string) => {
    return await generateRecommendation({
      type: 'care_plan',
      data: { healthGoals, currentConditions }
    });
  };

  const analyzeSymptoms = async (symptoms: string) => {
    return await generateRecommendation({
      type: 'symptom_analysis',
      data: { symptoms }
    });
  };

  const generateFallbackRecommendation = (data: { type: string; data: any }) => {
    console.log('Using fallback AI recommendation for:', data.type);
    
    switch (data.type) {
      case 'specialist':
        return `Based on your symptoms: "${data.data.symptoms}", I recommend consulting with:
        
1. **General Medicine** - For initial assessment and diagnosis
2. **Internal Medicine** - If symptoms persist or are complex
3. **Specialist Referral** - Based on specific symptom patterns

Please book an appointment through our platform for proper medical evaluation.`;

      case 'care_plan':
        return `**Personalized Care Plan**

**Health Goals:** ${data.data.healthGoals}
**Current Conditions:** ${data.data.currentConditions}

**Recommendations:**
1. **Regular Monitoring** - Track vital signs and symptoms daily
2. **Lifestyle Modifications** - Diet, exercise, and stress management
3. **Medical Follow-ups** - Schedule regular check-ups with specialists
4. **Preventive Care** - Vaccinations and health screenings
5. **Emergency Planning** - Know when to seek immediate medical attention

**Next Steps:**
- Book consultation with relevant specialists
- Start habit tracking for health goals
- Review and update care plan monthly`;

      case 'symptom_analysis':
        return `**Symptom Analysis Report**

**Symptoms Reported:** ${data.data.symptoms}

**Preliminary Assessment:**
- Symptoms may indicate need for medical evaluation
- Consider timing, severity, and associated factors
- Monitor for any worsening or new symptoms

**Recommended Actions:**
1. **Immediate:** If severe symptoms, seek emergency care
2. **Short-term:** Book appointment with general practitioner
3. **Ongoing:** Keep symptom diary for healthcare provider

**Important:** This is not a medical diagnosis. Please consult healthcare professionals for proper evaluation.`;

      default:
        return 'AI recommendation service is being updated. Please try again later or consult with our specialists directly.';
    }
  };

  return {
    generateRecommendation,
    generateCarePlan,
    analyzeSymptoms,
    loading,
    error
  };
};