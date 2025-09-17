import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import { useZoomIntegration } from '@/hooks/useZoomIntegration';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ZoomInvitationHandler from './video/ZoomInvitationHandler';

interface ZoomMeetingManagerProps {
  specialist: {
    id: string;
    full_name: string;
    email?: string;
    specialist_type?: string;
  };
  userRole: 'client' | 'specialist';
}

export const ZoomMeetingManager: React.FC<ZoomMeetingManagerProps> = ({
  specialist,
  userRole
}) => {
  const [user, setUser] = useState<any>(null);
  const { createMeeting, isLoading } = useZoomIntegration();
  const [showInvitation, setShowInvitation] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const startZoomMeeting = async () => {
    if (!user || !specialist.email) {
      toast.error('Unable to start meeting - missing user information');
      return;
    }

    try {
      const topic = `Medical Consultation with ${specialist.full_name}`;
      const invitees = [specialist.email];
      
      const meeting = await createMeeting(topic, 60, invitees);
      
      if (meeting) {
        setCurrentMeeting(meeting);
        setShowInvitation(true);
        toast.success(`Zoom meeting created and invitation sent to ${specialist.full_name}!`);
      } else {
        toast.error('Failed to create Zoom meeting');
      }
    } catch (error: any) {
      console.error('Error creating zoom meeting:', error);
      toast.error(`Failed to create meeting: ${error.message}`);
    }
  };

  const handleJoinMeeting = (meetingUrl: string) => {
    window.open(meetingUrl, '_blank', 'noopener,noreferrer');
    setShowInvitation(false);
    toast.success('Opening Zoom meeting...');
  };

  const handleDeclineMeeting = () => {
    setShowInvitation(false);
    setCurrentMeeting(null);
    toast.info('Meeting invitation declined');
  };

  return (
    <>
      <Button
        onClick={startZoomMeeting}
        disabled={isLoading || !specialist.email}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Video className="h-4 w-4 mr-2" />
        {isLoading ? 'Creating Meeting...' : 'Start Zoom Meeting'}
      </Button>

      {!specialist.email && (
        <p className="text-xs text-muted-foreground mt-1">
          Email required for Zoom invitations
        </p>
      )}

      {showInvitation && currentMeeting && (
        <ZoomInvitationHandler
          meeting={{
            id: currentMeeting.id,
            topic: currentMeeting.topic,
            meeting_id: currentMeeting.meeting_id,
            password: currentMeeting.password,
            duration: currentMeeting.duration,
            start_url: currentMeeting.start_url,
            join_url: currentMeeting.join_url,
            created_at: currentMeeting.created_at
          }}
          inviterName={user?.user_metadata?.full_name || 'Medical Client'}
          userRole={userRole}
          onJoinMeeting={handleJoinMeeting}
          onDecline={handleDeclineMeeting}
        />
      )}
    </>
  );
};

export default ZoomMeetingManager;