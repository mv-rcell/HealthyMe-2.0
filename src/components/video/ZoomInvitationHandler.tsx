import React, { useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Video, ExternalLink, Phone, X } from 'lucide-react';
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
  // Play notification sound when invitation arrives
  useEffect(() => {
    if (meeting) {
      // Try to play a notification sound
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleEIYUp7H1rZuLxU8i7u0qIJMJVOKprCtjVYxVIqjn6KFWE1QjJ+bnX5fVUWFmZWVeGJaQ36TkY13Y2JHd42Jh3VmZ01yjYaBcGxvV2yIgHxudHRga4F7dHB6eWVqfHZxcX59aWh7c25vfn9tbHhxbG6AgXFuem9rbIGBcm96bWtsgYFybnpua2yBgXJuem5rbIGBcm56bmtsgYFybnpua2yBgXJuem5rbIGBcm56bmtsgYE=');
        audio.volume = 0.5;
        audio.play().catch(() => {
          // Audio play failed, ignore silently
        });
      } catch (e) {
        // Audio not supported, ignore
      }
    }
  }, [meeting]);

  if (!meeting) return null;

  return (
    <AlertDialog open={!!meeting}>
      <AlertDialogContent className="max-w-md border-2 border-primary/20 shadow-2xl">
        <AlertDialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <Avatar className="w-20 h-20 relative z-10 border-4 border-primary/30">
                <AvatarFallback className="text-2xl bg-primary/10">
                  <Phone className="h-10 w-10 text-primary animate-pulse" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <AlertDialogTitle className="text-xl font-bold">
            Incoming Zoom Call
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p className="text-lg font-medium text-foreground">
              {inviterName} is calling you
            </p>
            <div className="bg-muted p-4 rounded-lg text-left space-y-1">
              <p className="text-sm"><strong>Topic:</strong> {meeting.topic}</p>
              <p className="text-sm"><strong>Meeting ID:</strong> {meeting.meeting_id}</p>
              {meeting.password && (
                <p className="text-sm"><strong>Password:</strong> {meeting.password}</p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center gap-4 mt-4">
          <Button
            variant="destructive"
            size="lg"
            onClick={onDecline}
            className="flex-1 gap-2"
          >
            <X className="h-5 w-5" />
            Decline
          </Button>
          <Button
            size="lg"
            onClick={() => onJoinMeeting(meeting.join_url)}
            className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
          >
            <ExternalLink className="h-5 w-5" />
            Join Call
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ZoomInvitationHandler;