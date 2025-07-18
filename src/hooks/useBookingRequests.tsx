import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface BookingRequest {
  id: string;
  client_id: string;
  specialist_id: string;
  service_type: string;
  preferred_date: string;
  duration: number;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
}

export const useBookingRequests = () => {
  const { user, profile } = useAuth();
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookingRequests = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase.from('booking_requests').select('*');
      
      // If user is a specialist, get requests sent to them
      // If user is a client, get requests they sent
      if (profile?.role === 'specialist') {
        query = query.eq('specialist_id', user.id);
      } else {
        query = query.eq('client_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setBookingRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching booking requests:', error);
      toast.error(`Error fetching booking requests: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createBookingRequest = async (requestData: Omit<BookingRequest, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .insert([requestData])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Booking request sent successfully!');
      fetchBookingRequests();
      return data;
    } catch (error: any) {
      console.error('Error creating booking request:', error);
      toast.error(`Error sending booking request: ${error.message}`);
      return null;
    }
  };

  const updateBookingRequestStatus = async (requestId: string, status: BookingRequest['status']) => {
    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', requestId);

      if (error) throw error;
      
      toast.success(`Booking request ${status} successfully!`);
      fetchBookingRequests();
    } catch (error: any) {
      console.error('Error updating booking request:', error);
      toast.error(`Error updating booking request: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchBookingRequests();

    // Subscribe to real-time updates for booking requests
    const channel = supabase
      .channel('booking_requests_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'booking_requests'
      }, (payload) => {
        console.log('Booking request update:', payload);
        fetchBookingRequests(); // Refetch to get updated data
        
        // Show notification for new requests (specialists only)
        if (payload.eventType === 'INSERT' && profile?.role === 'specialist' && payload.new?.specialist_id === user?.id) {
          toast.info('New booking request received!', {
            description: 'Check your dashboard for details.'
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile]);

  return {
    bookingRequests,
    loading,
    createBookingRequest,
    updateBookingRequestStatus,
    refetchBookingRequests: fetchBookingRequests
  };
};
