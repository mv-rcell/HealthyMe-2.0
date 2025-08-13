import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface VideoSession {
  id: string;
  appointment_id?: number | null;
  client_id: string;
  specialist_id: string;
  session_token?: string;
  status: 'waiting' | 'active' | 'ended';
  started_at?: string;
  ended_at?: string;
  created_at: string;
}

export const useVideoCall = () => {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<VideoSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [incomingCall, setIncomingCall] = useState<VideoSession | null>(null);

  // Start a video call instantly
  const startVideoCall = async (appointmentId: number | null, otherUserId: string) => {
    if (!user) return null;
    setLoading(true);

    try {
      const isClient = user.user_metadata?.role !== 'specialist';

      const sessionData: Partial<VideoSession> = {
        appointment_id: appointmentId ?? null,
        client_id: isClient ? user.id : otherUserId,
        specialist_id: isClient ? otherUserId : user.id,
        status: 'waiting',
        started_at: new Date().toISOString(),
        // Placeholder for actual SDK token generation
        session_token: `session_${crypto.randomUUID()}`
      };

      const { data, error } = await supabase
        .from('video_sessions')
        .insert([sessionData])
        .select()
        .single();

      if (error) throw error;

      setActiveSession(data);
      toast.success('Video call initiated! Waiting for response...');
      return data;
    } catch (error: any) {
      console.error('Error starting video call:', error);
      toast.error(`Error starting video call: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const answerCall = async (sessionId: string) => {
    try {
      // Ensure the call is still waiting
      const { data: current } = await supabase
        .from('video_sessions')
        .select('status')
        .eq('id', sessionId)
        .single();

      if (current?.status !== 'waiting') {
        toast.error('Call is no longer available.');
        return;
      }

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

  // Real-time listener for new or updated calls
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('video_sessions_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'video_sessions',
          filter: `or(client_id=eq.${user.id},specialist_id=eq.${user.id})`
        },
        (payload) => {
          const newSession = payload.new as VideoSession;

          if (
            newSession.status === 'waiting' &&
            ((newSession.specialist_id === user.id && newSession.client_id !== user.id) ||
              (newSession.client_id === user.id && newSession.specialist_id !== user.id))
          ) {
            if (!incomingCall || incomingCall.id !== newSession.id) {
              setIncomingCall(newSession);
              toast.info('Incoming video call!');
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'video_sessions',
          filter: `or(client_id=eq.${user.id},specialist_id=eq.${user.id})`
        },
        (payload) => {
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
      supabase.removeChannel(channel);
    };
  }, [user, incomingCall]);

  return {
    activeSession,
    incomingCall,
    loading,
    startVideoCall,
    answerCall,
    declineCall,
    endVideoCall
  };
};
