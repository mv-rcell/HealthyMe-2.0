import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface LabTest {
  id: string;
  client_id: string;
  test_name: string;
  test_type: string;
  scheduled_date: string;
  status: string;
  results?: any;
  report_url?: string;
  price?: number;
  follow_up_scheduled: boolean;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

export const useLabTests = () => {
  const { user } = useAuth();
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLabTests = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lab_tests')
        .select('*')
        .eq('client_id', user.id)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      setLabTests(data || []);
    } catch (error: any) {
      toast.error(`Error fetching lab tests: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const bookLabTest = async (testData: Omit<LabTest, 'id' | 'client_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('lab_tests')
        .insert([{ ...testData, client_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Lab test booked successfully!');
      fetchLabTests();
      return data;
    } catch (error: any) {
      toast.error(`Error booking lab test: ${error.message}`);
      return null;
    }
  };

  const downloadReport = async (reportUrl: string, testName: string) => {
    try {
      const link = document.createElement('a');
      link.href = reportUrl;
      link.download = `${testName}_report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      toast.error('Error downloading report');
    }
  };

  const scheduleFollowUp = async (testId: string, followUpDate: string) => {
    try {
      const { error } = await supabase
        .from('lab_tests')
        .update({ 
          follow_up_scheduled: true,
          follow_up_date: followUpDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', testId);

      if (error) throw error;
      
      toast.success('Follow-up scheduled successfully!');
      fetchLabTests();
    } catch (error: any) {
      toast.error(`Error scheduling follow-up: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchLabTests();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('lab_tests_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'lab_tests',
        filter: user ? `client_id=eq.${user.id}` : undefined
      }, () => {
        fetchLabTests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    labTests,
    loading,
    bookLabTest,
    downloadReport,
    scheduleFollowUp,
    refetchLabTests: fetchLabTests
  };
};