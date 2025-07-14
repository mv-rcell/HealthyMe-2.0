import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

  const createZoomMeeting = async (topic: string, participantEmail: string) => {
    setLoading(true);
    try {
      console.log('Creating Zoom meeting:', { topic, participant_email: participantEmail });

      const { data, error } = await supabase.functions.invoke('create-zoom-meeting', {
        headers: { 'Content-Type': 'application/json' },
        body: {
          topic,
          duration: 60,
          participant_email: participantEmail
        }
      });

      if (error) {
        console.error('Zoom API error:', error);
        toast.error(error.message || 'Failed to create Zoom meeting');
        throw error;
      }

      const meeting = data as ZoomMeeting;
      setActiveMeeting(meeting);

      console.log('Zoom meeting created successfully:', meeting);
      toast.success('Zoom meeting created successfully!');
      return meeting;

    } catch (error: any) {
      console.error('Error creating Zoom meeting:', error);

      // Optional fallback for dev/testing only
      if (import.meta.env.DEV) {
        const mockMeeting: ZoomMeeting = {
          id: Math.random().toString(36).substr(2, 9),
          topic,
          start_time: new Date().toISOString(),
          duration: 60,
          join_url: `https://zoom.us/j/${Math.random().toString().substr(2, 10)}`,
          password: Math.random().toString(36).substr(2, 6),
          meeting_id: Math.random().toString().substr(2, 10)
        };

        setActiveMeeting(mockMeeting);
        toast.success('Demo Zoom meeting created (DEV mode)');
        return mockMeeting;
      }

      toast.error('Failed to create Zoom meeting');
      throw error;

    } finally {
      setLoading(false);
    }
  };

  const joinZoomMeeting = (meetingUrl: string) => {
    console.log('Joining Zoom meeting:', meetingUrl);
    window.open(meetingUrl, '_blank', 'noopener,noreferrer');
    toast.success('Opening Zoom meeting in new window');
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
    joinZoomMeeting,
    endZoomMeeting,
    shareMeetingLink,
  };
};
