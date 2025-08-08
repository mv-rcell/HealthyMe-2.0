import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface VideoSession {
  id: string;
  appointment_id: number;
  client_id: string;
  specialist_id: string;
  session_token?: string;
  status: string;
  started_at?: string;
  ended_at?: string;
  created_at: string;
}

// 🔌 Mock Zoom Integration (replace with real API call)
const createZoomMeeting = async () => {
  // Replace with actual call to Zoom/Twilio backend
  return {
    join_url: `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`,
    start_url: 'https://zoom.us/start',
    meeting_id: `${Date.now()}`
  };
};

export const useVideoCall = () => {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<VideoSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [incomingCall, setIncomingCall] = useState<VideoSession | null>(null);

  const startVideoCall = async (
    appointmentId: number,
    targetUserId: string,
    role: 'client' | 'specialist'
  ) => {
    if (!user?.id || !targetUserId) {
      toast.error('User info missing. Cannot start call.');
      return null;
    }

    const appointment_id = Number(appointmentId);
    if (isNaN(appointment_id)) {
      toast.error('Invalid appointment ID.');
      return null;
    }

    try {
      setLoading(true);

      const zoomMeeting = await createZoomMeeting();

      const sessionData = {
        appointment_id,
        client_id: role === 'client' ? user.id : targetUserId,
        specialist_id: role === 'specialist' ? user.id : targetUserId,
        session_token: zoomMeeting.join_url,
        status: 'pending',
        started_at: new Date().toISOString()
      };

      console.log('Creating video session:', sessionData);

      const { data, error } = await supabase
        .from('video_sessions')
        .insert([sessionData])
        .select()
        .single();

      if (error) throw error;

      setActiveSession(data);
      toast.success('Video call started!');
      return data;
    } catch (error: any) {
      toast.error(`Error starting video call: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const answerCall = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('video_sessions')
        .update({
          status: 'active',
          started_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      setIncomingCall(null);
      setActiveSession(data);
      toast.success('Call answered');
    } catch (error: any) {
      toast.error(`Error answering call: ${error.message}`);
    }
  };

  const declineCall = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('video_sessions')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      setIncomingCall(null);
      toast.success('Call declined');
    } catch (error: any) {
      toast.error(`Error declining call: ${error.message}`);
    }
  };

  const endVideoCall = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('video_sessions')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      setActiveSession(null);
      toast.success('Video call ended');
    } catch (error: any) {
      toast.error(`Error ending video call: ${error.message}`);
    }
  };

  useEffect(() => {
    if (!user || !user.id) return;

    console.log('Subscribing to video session events...');

    const channel = supabase
      .channel('video_sessions_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'video_sessions',
          filter: `or(client_id.eq.${user.id},specialist_id.eq.${user.id})`,
        },
        (payload) => {
          console.log('New video session received:', payload);
          const newSession = payload.new as VideoSession;

          if (
            newSession.status === 'pending' &&
            ((newSession.specialist_id === user.id && newSession.client_id !== user.id) ||
              (newSession.client_id === user.id && newSession.specialist_id !== user.id))
          ) {
            setIncomingCall(newSession);
            toast.info('Incoming video call!');
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'video_sessions',
          filter: `or(client_id.eq.${user.id},specialist_id.eq.${user.id})`,
        },
        (payload) => {
          console.log('Video session update received:', payload);
          const updatedSession = payload.new as VideoSession;

          if (updatedSession.status === 'active') {
            setActiveSession(updatedSession);
            setIncomingCall(null);
          } else if (updatedSession.status === 'ended') {
            setActiveSession(null);
            setIncomingCall(null);
            toast.info('Video call ended');
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Unsubscribing from video session channel...');
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    activeSession,
    incomingCall,
    loading,
    startVideoCall, // now supports role: 'client' | 'specialist'
    answerCall,
    declineCall,
    endVideoCall,
  };
};
