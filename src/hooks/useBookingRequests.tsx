import { ReactNode, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BookingRequest {
  client_id: string;
  patient_name: ReactNode;
  reason: ReactNode;
  service_type: string;
  preferred_date: string | number | Date;
  duration: number;
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

  const notificationBuffer = useRef<BookingRequest[]>([]);
  const notificationTimeout = useRef<NodeJS.Timeout | null>(null);

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
        setRequests(data || []);
      }
      setLoading(false);
    };

    const showBrowserNotification = (title: string, options?: NotificationOptions) => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
        });
      }
    };

    const queueNotification = (newRequest: BookingRequest) => {
      notificationBuffer.current.push(newRequest);

      if (!notificationTimeout.current) {
        notificationTimeout.current = setTimeout(() => {
          const buffered = [...notificationBuffer.current];
          notificationBuffer.current = [];
          notificationTimeout.current = null;

          if (buffered.length === 1) {
            toast.info(`New booking request: ${buffered[0].service_type}`);
          } else if (buffered.length > 1) {
            toast.info(`${buffered.length} new booking requests`);
          }
        }, 3000);
      }
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
                  showBrowserNotification('New Booking Request', {
                    body: `New ${newRecord.service_type} booking request received`,
                    tag: 'booking-request',
                    requireInteraction: true,
                  });
                  queueNotification(newRecord);
                  return [newRecord, ...prev];

                case 'UPDATE':
                  return prev.map((req) =>
                    req.id === newRecord.id ? newRecord : req
                  );

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

    const requestNotificationPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    };

    requestNotificationPermission();
    fetchRequests();
    subscribeToChanges();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        console.log(`Unsubscribed from booking_requests_${specialistId}`);
      }
      if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current);
      }
    };
  }, [specialistId]);

  const createBookingRequest = async (
    request: Omit<BookingRequest, 'id' | 'created_at' | 'updated_at'>
  ): Promise<BookingRequest | null> => {
    const { data, error } = await supabase
      .from('booking_requests')
      .insert(request)
      .select()
      .single();

    if (error) {
      toast.error('Failed to create booking request');
      throw error;
    }

    toast.success('Booking request created');
    return data;
  };

  const updateBookingRequestStatus = async (
    id: string,
    status: BookingRequest['status']
  ) => {
    const { error } = await supabase
      .from('booking_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update booking request');
      throw error;
    }
    toast.success(`Booking request ${status}`);
  };

  return {
    bookingRequests: requests,
    loading,
    createBookingRequest,
    updateBookingRequestStatus,
  };
};
