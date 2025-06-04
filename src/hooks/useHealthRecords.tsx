import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface HealthRecord {
  id: string;
  client_id: string;
  record_type: string;
  title: string;
  description?: string;
  date: string;
  attachments: any[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useHealthRecords = () => {
  const { user } = useAuth();
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHealthRecords = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('client_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setHealthRecords(data || []);
    } catch (error: any) {
      toast.error(`Error fetching health records: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createHealthRecord = async (recordData: Omit<HealthRecord, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('health_records')
        .insert([{ ...recordData, client_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Health record added successfully!');
      fetchHealthRecords();
      return data;
    } catch (error: any) {
      toast.error(`Error creating health record: ${error.message}`);
      return null;
    }
  };

  useEffect(() => {
    fetchHealthRecords();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('health_records_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'health_records',
        filter: user ? `client_id=eq.${user.id}` : undefined
      }, () => {
        fetchHealthRecords();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    healthRecords,
    loading,
    createHealthRecord,
    refetchHealthRecords: fetchHealthRecords
  };
};