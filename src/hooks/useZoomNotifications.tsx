import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { ZoomMeeting } from './useZoomIntegration';
import { toast } from 'sonner';

export interface ZoomInvitation {
  id: string;
  meeting_id: string;
  topic: string;
  join_url: string;
  password?: string;
  duration: number;
  inviter_id: string;
  invitee_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export const useZoomNotifications = () => {
  const { user } = useAuth();
  const [pendingInvitation, setPendingInvitation] = useState<ZoomInvitation | null>(null);
  const [inviterName, setInviterName] = useState<string>('Unknown User');

  // Listen for new Zoom invitations
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('zoom_invitations_realtime')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'zoom_invitations',
        filter: `invitee_id=eq.${user.id}`
      }, async (payload) => {
        const newInvitation = payload.new as ZoomInvitation;
        
        if (newInvitation.status === 'pending') {
          setPendingInvitation(newInvitation);
          
          // Fetch inviter's name
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', newInvitation.inviter_id)
              .single();

            if (data && !error) {
              setInviterName(data.full_name || 'Unknown User');
            }
          } catch (error) {
            console.error('Error fetching inviter name:', error);
          }
          
          toast.info('New Zoom meeting invitation received!');
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const sendZoomInvitation = async (meeting: ZoomMeeting, inviteeId: string) => {
    if (!user) return;

    try {
      const { error } = await (supabase as any)
        .from('zoom_invitations')
        .insert([{
          meeting_id: meeting.meeting_id,
          topic: meeting.topic,
          join_url: meeting.join_url,
          password: meeting.password,
          duration: meeting.duration,
          inviter_id: user.id,
          invitee_id: inviteeId,
          status: 'pending'
        }]);

      if (error) throw error;
      
      toast.success('Zoom invitation sent!');
    } catch (error: any) {
      toast.error(`Error sending invitation: ${error.message}`);
    }
  };

  const respondToInvitation = async (invitationId: string, response: 'accepted' | 'declined') => {
    try {
      const { error } = await (supabase as any)
        .from('zoom_invitations')
        .update({ status: response })
        .eq('id', invitationId);

      if (error) throw error;
      
      setPendingInvitation(null);
      toast.success(`Invitation ${response}`);
    } catch (error: any) {
      toast.error(`Error responding to invitation: ${error.message}`);
    }
  };

  return {
    pendingInvitation,
    inviterName,
    sendZoomInvitation,
    respondToInvitation
  };
};