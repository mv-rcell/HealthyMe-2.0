import { useState, useEffect } from 'react';
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
  start_url?: string; // host URL
}

export const useZoomIntegration = (currentUserId: string) => {
  const [loading, setLoading] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState<ZoomMeeting | null>(null);

  // 🔔 Listen for both incoming and outgoing Zoom meetings
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('zoom-meeting-listener')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'video_calls',
          filter: `callee_id=eq.${currentUserId}`,
        },
        (payload) => {
          const newMeeting = payload.new;
          if (newMeeting?.join_url) {
            // ✅ Incoming call (you are the callee)
            toast.info(`Incoming video call: ${newMeeting.topic}`, {
              description: 'Click to join now',
              action: {
                label: 'Join',
                onClick: () => joinZoomMeeting(newMeeting.join_url),
              },
            });

            setActiveMeeting({
              id: newMeeting.id,
              topic: newMeeting.topic,
              start_time: newMeeting.start_time,
              duration: newMeeting.duration,
              join_url: newMeeting.join_url,
              password: newMeeting.password,
              meeting_id: newMeeting.meeting_id,
              start_url: newMeeting.start_url,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'video_calls',
          filter: `caller_id=eq.${currentUserId}`,
        },
        (payload) => {
          const newMeeting = payload.new;
          if (newMeeting?.join_url) {
            // ✅ Outgoing call (you are the caller)
            setActiveMeeting({
              id: newMeeting.id,
              topic: newMeeting.topic,
              start_time: newMeeting.start_time,
              duration: newMeeting.duration,
              join_url: newMeeting.join_url,
              password: newMeeting.password,
              meeting_id: newMeeting.meeting_id,
              start_url: newMeeting.start_url,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // 📞 Create a Zoom meeting and notify callee
  const createZoomMeeting = async (topic: string, participantId: string) => {
    setLoading(true);
    try {
      console.log('Creating Zoom meeting:', { topic, participantId });

      // 1. Call Edge Function to create Zoom meeting
      const { data, error } = await supabase.functions.invoke('create-zoom-meeting', {
        body: { topic, duration: 60 },
      });

      if (error) {
        console.error('Zoom API error:', error);
        toast.error('Failed to create Zoom meeting');
        return null;
      }

      const meeting: ZoomMeeting = {
        id: data.meeting_id,
        topic: data.topic,
        start_time: data.start_time,
        duration: data.duration,
        join_url: data.join_url,
        password: data.password,
        meeting_id: data.meeting_id,
        start_url: data.start_url,
      };

      // 2. Insert into `video_calls` so callee is notified
      const { error: callError } = await supabase.from('video_calls').insert([
        {
          caller_id: currentUserId,
          callee_id: participantId,
          topic: meeting.topic,
          meeting_id: meeting.meeting_id,
          password: meeting.password,
          join_url: meeting.join_url,
          start_url: meeting.start_url,
          start_time: meeting.start_time,
          duration: meeting.duration,
        },
      ]);

      if (callError) {
        console.error('Failed to insert call record:', callError);
        toast.error('Could not notify specialist of the call');
      }

      console.log('Zoom meeting created & saved successfully:', meeting);
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
    shareMeetingLink,
  };
};
