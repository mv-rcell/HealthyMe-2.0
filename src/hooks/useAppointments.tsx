import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Appointment {
  id: number;
  client_id: string;
  specialist_id: string;
  service_type: string;
  appointment_date: string;
  duration: number;
  status: string;
  notes?: string;
  price?: number;
  created_at: string;
  updated_at: string;
}

export const useAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments_new')
        .select('*')
        .or(`client_id.eq.${user.id},specialist_id.eq.${user.id}`)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      toast.error(`Error fetching appointments: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('appointments_new')
        .insert([appointmentData])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Appointment booked successfully!');
      fetchAppointments();
      return data;
    } catch (error: any) {
      toast.error(`Error booking appointment: ${error.message}`);
      return null;
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments_new')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', appointmentId);

      if (error) throw error;
      
      toast.success('Appointment updated successfully!');
      fetchAppointments();
    } catch (error: any) {
      toast.error(`Error updating appointment: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchAppointments();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('appointments_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'appointments_new',
        filter: user ? `client_id=eq.${user.id}` : undefined
      }, () => {
        fetchAppointments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    appointments,
    loading,
    createAppointment,
    updateAppointmentStatus,
    refetchAppointments: fetchAppointments
  };
};