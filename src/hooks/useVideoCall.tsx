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
    if (!user) return;

    // Subscribe to real-time video session updates
    const channel = supabase
      .channel('video_sessions_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'video_sessions',
        filter: `client_id=eq.${user.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          setActiveSession(payload.new as VideoSession);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    activeSession,
    loading,
    startVideoCall,
    endVideoCall
  };
};