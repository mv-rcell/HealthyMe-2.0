import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Specialist {
  id: string;
  full_name: string | null;
  specialist_type: string | null;
  location: string | null;
  bio: string | null;
  consultation_fee: number | null;
  subsequent_visits_fee: number | null;
  availability: string | null;
  languages: string | null;
  is_online: boolean | null;
  experience: string | null;
  profile_picture_url: string | null;
  verification_status: string | null;
  created_at: string;
  updated_at: string;
}

export const useRealSpecialists = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'specialist')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setSpecialists(data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching specialists:', err);
        setError(err.message);
        setSpecialists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialists();

    // Set up real-time subscription
    const channel = supabase
      .channel('specialists-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: 'role=eq.specialist'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSpecialists(prev => [payload.new as Specialist, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setSpecialists(prev =>
              prev.map(s => s.id === payload.new.id ? payload.new as Specialist : s)
            );
          } else if (payload.eventType === 'DELETE') {
            setSpecialists(prev => prev.filter(s => s.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { specialists, loading, error };
};