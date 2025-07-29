import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useRealtimeData = () => {
  const { user } = useAuth();
  const [realtimeUpdates, setRealtimeUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const channels = [];

    // Appointments
    const appointmentsChannel = supabase
      .channel('appointments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments_new',
          filter: `client_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Appointment update:', payload);
          setRealtimeUpdates(prev => [...prev, {
            type: 'appointment',
            event: payload.eventType,
            data: payload.new || payload.old,
            timestamp: new Date().toISOString()
          }]);
        }
      );
    channels.push(appointmentsChannel);

    // Lab Tests
    const labTestsChannel = supabase
      .channel('lab_tests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lab_tests',
          filter: `client_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Lab test update:', payload);
          setRealtimeUpdates(prev => [...prev, {
            type: 'lab_test',
            event: payload.eventType,
            data: payload.new || payload.old,
            timestamp: new Date().toISOString()
          }]);
        }
      );
    channels.push(labTestsChannel);

    // Messages
    const messagesChannel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Message update:', payload);
          setRealtimeUpdates(prev => [...prev, {
            type: 'message',
            event: payload.eventType,
            data: payload.new || payload.old,
            timestamp: new Date().toISOString()
          }]);
        }
      );
    channels.push(messagesChannel);

    // Specialists — IMPORTANT FIX HERE
    const specialistsChannel = supabase
      .channel('specialists_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          // ❗ FIX: 'filter' is NOT supported here — use `.on()` without it, then filter in code
        },
        (payload) => {
          if (payload.new?.role?.trim().toLowerCase() === 'specialist') {
            console.log('Specialist update:', payload);
            setRealtimeUpdates(prev => [...prev, {
              type: 'specialist',
              event: payload.eventType,
              data: payload.new || payload.old,
              timestamp: new Date().toISOString()
            }]);
          }
        }
      );
    channels.push(specialistsChannel);

    // Subscribe all
    channels.forEach((ch) => ch.subscribe());

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [user]);

  return { realtimeUpdates };
};
