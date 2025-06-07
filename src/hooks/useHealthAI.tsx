import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useHealthAI = () => {
  const [loading, setLoading] = useState(false);

  const generateWorkoutPlan = async (preferences: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-health-ai', {
        body: {
          type: 'workout',
          preferences
        }
      });

      if (error) throw error;
      return data.plan;
    } catch (error: any) {
      toast.error(`Error generating workout plan: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const analyzeVitals = async (vitals: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-health-ai', {
        body: {
          type: 'vitals',
          vitals
        }
      });

      if (error) throw error;
      return data.analysis;
    } catch (error: any) {
      toast.error(`Error analyzing vitals: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const suggestCheckup = async (healthProfile: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-health-ai', {
        body: {
          type: 'checkup',
          healthProfile
        }
      });

      if (error) throw error;
      return data.suggestion;
    } catch (error: any) {
      toast.error(`Error generating checkup suggestion: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generateWorkoutPlan,
    analyzeVitals,
    suggestCheckup
  };
};