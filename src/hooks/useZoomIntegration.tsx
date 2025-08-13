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
      console.log('Creating Zoom meeting:', { topic, participantEmail });

      const { data, error } = await supabase.functions.invoke('create-zoom-meeting', {
        body: {
          topic,
          duration: 60, // minutes
          participant_email: participantEmail
        }
      });

      if (error) {
        console.error('Zoom API error:', error);
        toast.error('Failed to create Zoom meeting');
        return null;
      }

      const meeting: ZoomMeeting = {
        id: data.id,
        topic: data.topic,
        start_time: data.start_time,
        duration: data.duration,
        join_url: data.join_url,
        password: data.password,
        meeting_id: data.id
      };

      setActiveMeeting(meeting);
      console.log('Zoom meeting created successfully:', meeting);
      toast.success('Zoom meeting created successfully!');
      return meeting;
    } catch (err: any) {
      console.error('Error creating Zoom meeting:', err);
      toast.error('Unexpected error creating Zoom meeting');
      return null;
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
    shareMeetingLink
  };
};
