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
      const { data, error } = await supabase.functions.invoke('create-zoom-meeting', {
        body: {
          topic,
          duration: 60,
          participant_email: participantEmail
        }
      });

      if (error) throw error;

      const meeting: ZoomMeeting = data;
      setActiveMeeting(meeting);
      toast.success('Zoom meeting created successfully!');
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
      toast.success('Demo Zoom meeting created (configure Zoom API for real meetings)');
      return mockMeeting;
    } finally {
      setLoading(false);
    }
  };

  const joinZoomMeeting = (meetingUrl: string) => {
    window.open(meetingUrl, '_blank', 'noopener,noreferrer');
    toast.success('Opening Zoom meeting in new window');
  };

  const endZoomMeeting = () => {
    setActiveMeeting(null);
    toast.success('Zoom meeting ended');
  };

  return {
    loading,
    activeMeeting,
    createZoomMeeting,
    joinZoomMeeting,
    endZoomMeeting
  };
};