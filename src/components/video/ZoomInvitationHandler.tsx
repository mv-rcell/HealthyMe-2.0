import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Video, ExternalLink } from 'lucide-react';
import { ZoomMeeting } from '@/hooks/useZoomIntegration';

interface ZoomInvitationHandlerProps {
  meeting: ZoomMeeting | null;
  inviterName: string;
  onJoinMeeting: (meetingUrl: string) => void;
  onDecline: () => void;
}

const ZoomInvitationHandler: React.FC<ZoomInvitationHandlerProps> = ({
  meeting,
  inviterName,
  onJoinMeeting,
  onDecline
}) => {
  if (!meeting) return null;

  return (
    <AlertDialog open={!!meeting}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-2xl bg-blue-100">
                <Video className="h-8 w-8 text-blue-600" />
              </AvatarFallback>
            </Avatar>
          </div>
          <AlertDialogTitle className="text-lg">
            Zoom Meeting Invitation
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p><strong>{inviterName}</strong> has invited you to a Zoom meeting:</p>
            <div className="bg-muted p-3 rounded-lg text-left">
              <p><strong>Topic:</strong> {meeting.topic}</p>
              <p><strong>Meeting ID:</strong> {meeting.meeting_id}</p>
              {meeting.password && (
                <p><strong>Password:</strong> {meeting.password}</p>
              )}
              <p><strong>Duration:</strong> {meeting.duration} minutes</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={onDecline}
          >
            Decline
          </Button>
          <Button
            onClick={() => onJoinMeeting(meeting.join_url)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Join Meeting
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ZoomInvitationHandler;