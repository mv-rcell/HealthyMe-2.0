import { ReactNode, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BookingRequest {
  patient_name: ReactNode;
  reason: ReactNode;
  service_type: ReactNode;
  preferred_date: string | number | Date;
  duration: ReactNode;
  id: string;
  patient_id: string;
  specialist_id: string;
  status: 'pending' | 'accepted' | 'declined';
  scheduled_time: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useBookingRequests = (specialistId: string | null) => {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!specialistId) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;

    const fetchRequests = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .eq('specialist_id', specialistId)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to fetch booking requests');
        console.error(error);
      } else {
        setRequests(data);
      }

      setLoading(false);
    };

    const subscribeToChanges = () => {
      channel = supabase
        .channel(`booking_requests_${specialistId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'booking_requests',
            filter: `specialist_id=eq.${specialistId}`,
          },
          (payload) => {
            const newRecord = payload.new as BookingRequest;
            const oldRecord = payload.old as BookingRequest;

            setRequests((prev) => {
              switch (payload.eventType) {
                case 'INSERT':
                  return [newRecord, ...prev];
                case 'UPDATE':
                  return prev.map((req) => (req.id === newRecord.id ? newRecord : req));
                case 'DELETE':
                  return prev.filter((req) => req.id !== oldRecord.id);
                default:
                  return prev;
              }
            });
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`Subscribed to booking_requests_${specialistId}`);
          }
        });
    };

    fetchRequests();
    subscribeToChanges();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        console.log(`Unsubscribed from booking_requests_${specialistId}`);
      }
    };
  }, [specialistId]);

  const createBookingRequest = async (
    request: Omit<BookingRequest, 'id' | 'created_at' | 'updated_at'>
  ) => {
    const { error } = await supabase.from('booking_requests').insert(request);
    if (error) {
      toast.error('Failed to create booking request');
      throw error;
    }
    toast.success('Booking request created');
  };

  return {
    bookingRequests: requests,
    loading,
    createBookingRequest,
  };
};
