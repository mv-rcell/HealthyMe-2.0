import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAppQuery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Asking app question:', query);
      
      const { data: result, error } = await supabase.functions.invoke('app-query-ai', {
        body: { query }
      });

      if (error) {
        console.error('App query function error:', error);
        throw new Error('Failed to get AI response');
      }

      console.log('App query result:', result);
      return result?.response || 'I apologize, but I cannot provide an answer at the moment. Please try again later.';
    } catch (err: any) {
      console.error('App query error:', err);
      setError(err.message);
      toast.error('Failed to get AI response');
      return 'I apologize, but I cannot provide an answer at the moment. Please try again later.';
    } finally {
      setLoading(false);
    }
  };

  return {
    askQuestion,
    loading,
    error
  };
};
