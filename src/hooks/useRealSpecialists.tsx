
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RealSpecialist {
  id: string;
  full_name: string;
  specialist_type: string;
  experience: string;
  bio: string;
  profile_picture_url: string | null;
  consultation_fee: number | null;
  location: string | null;
  languages: string | null;
  is_online: boolean | null;
  is_active: boolean | null;
  availability: string | null;
}

export const useRealSpecialists = () => {
  const [specialists, setSpecialists] = useState<RealSpecialist[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSpecialists = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'specialist')
        .eq('is_active', true)
        .not('full_name', 'is', null)
        .not('specialist_type', 'is', null);

      if (error) throw error;

      setSpecialists(data || []);
    } catch (error) {
      console.error('Error fetching specialists:', error);
      toast.error('Failed to load specialists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialists();

    // Set up real-time subscription for specialist updates
    const channel = supabase
      .channel('specialists_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: 'role=eq.specialist'
        },
        () => {
          fetchSpecialists();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    specialists,
    loading,
    refetch: fetchSpecialists
  };
};