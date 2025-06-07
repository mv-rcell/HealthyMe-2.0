import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useNewsletter = () => {
  const [loading, setLoading] = useState(false);

  const subscribe = async (email: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { email }
      });

      if (error) throw error;
      
      toast.success('Successfully subscribed to newsletter!');
      return true;
    } catch (error: any) {
      toast.error(`Subscription failed: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    subscribe
  };
};
