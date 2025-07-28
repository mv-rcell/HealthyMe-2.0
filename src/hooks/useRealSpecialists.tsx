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
  subsequent_visits_fee: number;
  location: string | null;
  languages: string | null;
  is_online: boolean | null;
  is_active: boolean | null;
  availability: string | null;
}

export const useRealSpecialists = () => {
  const [specialists, setSpecialists] = useState<RealSpecialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecialists = async (isRefetch = false) => {
    if (isRefetch) setRefetching(true);
    else setLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          specialist_type,
          experience,
          bio,
          profile_picture_url,
          consultation_fee,
          subsequent_visits_fee,
          location,
          languages,
          is_online,
          is_active,
          availability
        `)
        .ilike('role', 'specialist') // case-insensitive match
        .in('is_active', [true, 'true', 1]) // support multiple truthy values
        .not('full_name', 'is', null)
        .not('specialist_type', 'is', null)
        .neq('full_name', '')
        .neq('specialist_type', '');

      if (error) throw error;

      console.log('✅ Fetched specialists:', data?.length);
      console.table(data);

      setSpecialists(data || []);
      setError(null);
    } catch (err) {
      console.error('❌ Failed to fetch specialists:', err);
      toast.error('Failed to load specialists');
      setError('Failed to load specialists');
    } finally {
      setLoading(false);
      setRefetching(false);
    }
  };

  useEffect(() => {
    fetchSpecialists();

    const channel = supabase
      .channel('specialists_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          fetchSpecialists(true);
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
    refetching,
    error,
    refetch: () => fetchSpecialists(true)
  };
};
