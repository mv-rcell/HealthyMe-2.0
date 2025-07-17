
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useRealtimeData = () => {
  const { user } = useAuth();
  const [realtimeUpdates, setRealtimeUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Set up realtime subscriptions for multiple tables
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
      )
      .subscribe();

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
      )
      .subscribe();

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
      )
      .subscribe();

    const specialistsChannel = supabase
      .channel('specialists_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: 'role=eq.specialist'
        },
        (payload) => {
          console.log('Specialist update:', payload);
          setRealtimeUpdates(prev => [...prev, {
            type: 'specialist',
            event: payload.eventType,
            data: payload.new || payload.old,
            timestamp: new Date().toISOString()
          }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(labTestsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(specialistsChannel);
    };
  }, [user]);

  return { realtimeUpdates };
};
