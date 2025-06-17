
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ClientProgress {
  id: string;
  client_id: string;
  specialist_id: string;
  appointment_id?: number;
  issue_description?: string;
  recommendations?: string;
  progress_notes?: string;
  follow_up_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useClientProgress = (specialistId?: string) => {
  const [progressRecords, setProgressRecords] = useState<ClientProgress[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClientProgress = async () => {
    if (!specialistId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_progress')
        .select('*')
        .eq('specialist_id', specialistId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProgressRecords(data || []);
    } catch (error) {
      console.error('Error fetching client progress:', error);
      toast.error('Failed to load client progress');
    } finally {
      setLoading(false);
    }
  };

  const createProgressRecord = async (record: Omit<ClientProgress, 'id' | 'specialist_id' | 'created_at' | 'updated_at'>) => {
    if (!specialistId) return;

    try {
      const { error } = await supabase
        .from('client_progress')
        .insert({
          ...record,
          specialist_id: specialistId
        });

      if (error) throw error;
      toast.success('Progress record created');
      fetchClientProgress();
    } catch (error) {
      console.error('Error creating progress record:', error);
      toast.error('Failed to create progress record');
    }
  };

  const updateProgressRecord = async (recordId: string, updates: Partial<ClientProgress>) => {
    try {
      const { error } = await supabase
        .from('client_progress')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', recordId);

      if (error) throw error;
      toast.success('Progress updated');
      fetchClientProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  useEffect(() => {
    fetchClientProgress();
  }, [specialistId]);

  return {
    progressRecords,
    loading,
    createProgressRecord,
    updateProgressRecord,
    refetch: fetchClientProgress
  };
};