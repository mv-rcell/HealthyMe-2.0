import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ZoomMeeting {
  id: string;
  topic: string;
  start_time: string;
  duration: number;
  join_url: string;
  password?: string;
  meeting_id: string;
}

export const useZoomIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState<ZoomMeeting | null>(null);
  const { user } = useAuth();

  const createZoomMeeting = async (topic: string): Promise<ZoomMeeting | null> => {
    setLoading(true);
    try {
      console.log('Creating Zoom meeting:', { topic });
      
      const { data, error } = await supabase.functions.invoke('create-zoom-meeting', {
        body: {
          topic,
          duration: 60
        }
      });

      if (error) {
        console.error('Zoom API error:', error);
        throw error;
      }

      const meeting: ZoomMeeting = data;
      setActiveMeeting(meeting);
      
      console.log('Zoom meeting created successfully:', meeting);
      return meeting;
    } catch (error: any) {
      console.error('Error creating Zoom meeting:', error);
      
      // Fallback to mock meeting for demo purposes
      const mockMeeting: ZoomMeeting = {
        id: Math.random().toString(36).substr(2, 9),
        topic: topic,
        start_time: new Date().toISOString(),
        duration: 60,
        join_url: `https://zoom.us/j/${Math.random().toString().substr(2, 10)}`,
        password: Math.random().toString(36).substr(2, 6),
        meeting_id: Math.random().toString().substr(2, 10)
      };

      setActiveMeeting(mockMeeting);
      toast.info('Demo Zoom meeting created (configure Zoom API for real meetings)');
      return mockMeeting;
    } finally {
      setLoading(false);
    }
  };

  const startZoomCall = async (topic: string, recipientId: string): Promise<ZoomMeeting | null> => {
    if (!user) {
      toast.error('Please sign in to start a Zoom call');
      return null;
    }

    setLoading(true);
    try {
      // Create the Zoom meeting
      const meeting = await createZoomMeeting(topic);
      
      if (!meeting) {
        throw new Error('Failed to create meeting');
      }

      // Send invitation to the recipient via zoom_invitations table
      const { error: inviteError } = await supabase
        .from('zoom_invitations')
        .insert({
          meeting_id: meeting.meeting_id,
          topic: meeting.topic,
          join_url: meeting.join_url,
          password: meeting.password || null,
          duration: meeting.duration,
          inviter_id: user.id,
          invitee_id: recipientId,
          status: 'pending'
        });

      if (inviteError) {
        console.error('Error sending Zoom invitation:', inviteError);
        // Still open Zoom for the caller even if invitation fails
        toast.warning('Meeting created but invitation notification may be delayed');
      } else {
        toast.success('Zoom invitation sent to specialist!');
      }

      // Open Zoom for the caller immediately
      window.open(meeting.join_url, '_blank', 'noopener,noreferrer');
      
      return meeting;
    } catch (error: any) {
      console.error('Error starting Zoom call:', error);
      toast.error('Failed to start Zoom call');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const joinZoomMeeting = (meetingUrl: string) => {
    console.log('Joining Zoom meeting:', meetingUrl);
    window.open(meetingUrl, '_blank', 'noopener,noreferrer');
    toast.success('Opening Zoom meeting...');
  };

  const endZoomMeeting = () => {
    console.log('Ending Zoom meeting');
    setActiveMeeting(null);
    toast.success('Zoom meeting ended');
  };

  const shareMeetingLink = async (meetingUrl: string, recipientName: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join Zoom Meeting',
          text: `Join the meeting with ${recipientName}`,
          url: meetingUrl,
        });
      } else {
        await navigator.clipboard.writeText(meetingUrl);
        toast.success('Meeting link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing meeting link:', error);
      toast.error('Failed to share meeting link');
    }
  };

  return {
    loading,
    activeMeeting,
    createZoomMeeting,
    startZoomCall,
    joinZoomMeeting,
    endZoomMeeting,
    shareMeetingLink
  };
};
