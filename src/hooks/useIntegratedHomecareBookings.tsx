import { ReactNode, useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface IntegratedHomeCareBooking {
  id: string;
  client_id: string;
  patient_id: string;
  specialist_id: string;
  patient_name: ReactNode;
  reason: ReactNode;
  service_type: string;
  preferred_date: string | number | Date;
  duration: number;
  status: 'pending' | 'accepted' | 'declined';
  scheduled_time: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useIntegratedHomeCareBookings = (specialistId: string | null) => {
  const [bookings, setBookings] = useState<IntegratedHomeCareBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Notification grouping refs
  const notificationBuffer = useRef<IntegratedHomeCareBooking[]>([]);
  const notificationTimeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetch all integrated homecare bookings for the specialist
   */
  const fetchBookings = useCallback(async () => {
    if (!specialistId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('integrated_homecare_bookings')
      .select('*')
      .eq('specialist_id', specialistId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch home care bookings');
      console.error(error);
    } else {
      setBookings(data);
    }
    setLoading(false);
  }, [specialistId]);

  /**
   * Send email notification via Supabase Edge Function
   */
  const sendBookingNotificationEmail = useCallback(async (booking: IntegratedHomeCareBooking) => {
    try {
      const { error } = await supabase.functions.invoke('send-homecare-booking-notification', {
        body: {
          booking,
          specialistId: booking.specialist_id,
        },
      });
      if (error) {
        console.error('Error sending homecare booking notification email:', error);
      }
    } catch (err) {
      console.error('Error invoking homecare email function:', err);
    }
  }, []);

  /**
   * Browser push notification
   */
  const showBrowserNotification = useCallback((title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    }
  }, []);

  /**
   * Queue toast notifications (grouped)
   */
  const queueNotification = useCallback((newBooking: IntegratedHomeCareBooking) => {
    notificationBuffer.current.push(newBooking);

    if (!notificationTimeout.current) {
      notificationTimeout.current = setTimeout(() => {
        const buffered = [...notificationBuffer.current];
        notificationBuffer.current = [];
        notificationTimeout.current = null;

        if (buffered.length === 1) {
          toast.info(`New home care booking: ${buffered[0].service_type}`);
        } else if (buffered.length > 1) {
          toast.info(`${buffered.length} new home care bookings`);
        }
      }, 3000);
    }
  }, []);

  /**
   * Subscribe to realtime updates
   */
  const subscribeToChanges = useCallback(() => {
    if (!specialistId) return null;

    const channel = supabase
      .channel(`integrated_homecare_bookings_${specialistId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'integrated_homecare_bookings',
          filter: `specialist_id=eq.${specialistId}`,
        },
        (payload) => {
          const newRecord = payload.new as IntegratedHomeCareBooking;
          const oldRecord = payload.old as IntegratedHomeCareBooking;

          setBookings((prev) => {
            switch (payload.eventType) {
              case 'INSERT':
                showBrowserNotification('New Home Care Booking', {
                  body: `New ${newRecord.service_type} booking received`,
                  tag: 'homecare-booking',
                  requireInteraction: true,
                });

                sendBookingNotificationEmail(newRecord);
                queueNotification(newRecord);

                return [newRecord, ...prev];

              case 'UPDATE':
                return prev.map((b) => (b.id === newRecord.id ? newRecord : b));

              case 'DELETE':
                return prev.filter((b) => b.id !== oldRecord.id);

              default:
                return prev;
            }
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to integrated_homecare_bookings_${specialistId}`);
        }
      });

    return channel;
  }, [specialistId, sendBookingNotificationEmail, showBrowserNotification, queueNotification]);

  /**
   * Request notification permission
   */
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!specialistId) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;

    requestNotificationPermission();
    fetchBookings();
    channel = subscribeToChanges();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        console.log(`Unsubscribed from integrated_homecare_bookings_${specialistId}`);
      }
      if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current);
      }
    };
  }, [specialistId, fetchBookings, subscribeToChanges, requestNotificationPermission]);

  /**
   * Create a new home care booking
   */
  const createHomeCareBooking = async (
    booking: Omit<IntegratedHomeCareBooking, 'id' | 'created_at' | 'updated_at'>
  ) => {
    const { error } = await supabase.from('integrated_homecare_bookings').insert(booking);
    if (error) {
      toast.error('Failed to create home care booking');
      throw error;
    }
    toast.success('Home care booking created');
  };

  /**
   * Update booking status
   */
  const updateHomeCareBookingStatus = async (id: string, status: IntegratedHomeCareBooking['status']) => {
    const { error } = await supabase
      .from('integrated_homecare_bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update home care booking');
      throw error;
    }
    toast.success(`Home care booking ${status}`);
  };

  return {
    homeCareBookings: bookings,
    loading,
    createHomeCareBooking,
    updateHomeCareBookingStatus,
  };
};
