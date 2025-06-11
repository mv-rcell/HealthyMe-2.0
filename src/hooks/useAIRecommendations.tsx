import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RecommendationRequest {
  type: 'specialist' | 'care-plan' | 'symptoms';
  data: any;
}

export const useAIRecommendations = () => {
  const [loading, setLoading] = useState(false);

  const generateRecommendation = async (request: RecommendationRequest) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-health-ai', {
        body: {
          type: `${request.type}-recommendation`,
          ...request.data
        }
      });

      if (error) throw error;
      return data.recommendation;
    } catch (error: any) {
      toast.error(`Error generating recommendation: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateCarePlan = async (healthGoals: string, currentConditions: string) => {
    return generateRecommendation({
      type: 'care-plan',
      data: { healthGoals, currentConditions }
    });
  };

  const analyzeSymptoms = async (symptoms: string) => {
    return generateRecommendation({
      type: 'symptoms',
      data: { symptoms }
    });
  };

  return {
    loading,
    generateRecommendation,
    generateCarePlan,
    analyzeSymptoms
  };
};