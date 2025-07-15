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
      
      // Send welcome email
      try {
        await supabase.functions.invoke('welcome-email', {
          body: { email }
        });
        console.log('Welcome email sent successfully');
      } catch (welcomeError) {
        console.error('Welcome email failed:', welcomeError);
        // Don't fail the subscription if welcome email fails
      }
      
      toast.success('Successfully subscribed to newsletter!', {
        description: 'Check your email for a welcome message.'
      });
      return true;
    } catch (error: any) {
      toast.error(`Subscription failed: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendNewsletter = async (subject?: string, content?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: { 
          type: 'update',
          subject: subject || 'HealthyMe Newsletter Update',
          content 
        }
      });

      if (error) throw error;
      
      toast.success('Newsletter sent successfully!', {
        description: data?.message || 'All subscribers have been notified.'
      });
      return data;
    } catch (error: any) {
      toast.error(`Newsletter sending failed: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    subscribe,
    sendNewsletter
  };
};
