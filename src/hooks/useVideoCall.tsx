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

export const useVideoCall = () => {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<VideoSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [incomingCall, setIncomingCall] = useState<VideoSession | null>(null);

  const startVideoCall = async (appointmentId: number, otherUserId: string) => {
    if (!user) return null;

    setLoading(true);
    try {
      const sessionData = {
        appointment_id: appointmentId,
        client_id: user.id,
        specialist_id: otherUserId,
        status: 'active',
        started_at: new Date().toISOString()
      };

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
      const { error } = await supabase
        .from('video_sessions')
        .update({ status: 'active' })
        .eq('id', sessionId);

      if (error) throw error;
      
      setIncomingCall(null);
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

  // Real-time subscription for video sessions
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscription for video sessions');

    const channel = supabase
      .channel('video_sessions_realtime')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'video_sessions',
        filter: `or(client_id.eq.${user.id},specialist_id.eq.${user.id})`
      }, (payload) => {
        console.log('New video session:', payload);
        const newSession = payload.new as VideoSession;
        
        // If this is an incoming call (user is not the one who started it)
        if (newSession.client_id !== user.id && newSession.specialist_id === user.id) {
          setIncomingCall(newSession);
          toast.info('Incoming video call!');
        } else if (newSession.client_id === user.id) {
          setActiveSession(newSession);
        }
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'video_sessions',
        filter: `or(client_id.eq.${user.id},specialist_id.eq.${user.id})`
      }, (payload) => {
        console.log('Video session updated:', payload);
        const updatedSession = payload.new as VideoSession;
        
        if (updatedSession.status === 'active') {
          setActiveSession(updatedSession);
          setIncomingCall(null);
        } else if (updatedSession.status === 'ended') {
          setActiveSession(null);
          setIncomingCall(null);
          toast.info('Video call ended');
        }
      })
      .subscribe();

    return () => {
      console.log('Cleaning up video session subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

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
