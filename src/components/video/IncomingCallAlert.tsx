import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Video, Phone, PhoneOff } from 'lucide-react';
import { VideoSession } from '@/hooks/useVideoCall';

interface IncomingCallAlertProps {
  incomingCall: VideoSession | null;
  onAnswer: (sessionId: string) => void;
  onDecline: (sessionId: string) => void;
  callerName?: string;
}

const IncomingCallAlert: React.FC<IncomingCallAlertProps> = ({
  incomingCall,
  onAnswer,
  onDecline,
  callerName = 'Unknown User'
}) => {
  if (!incomingCall) return null;

  return (
    <AlertDialog open={!!incomingCall}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-2xl">
                {callerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <AlertDialogTitle className="text-lg">
            Incoming Video Call
          </AlertDialogTitle>
          <AlertDialogDescription>
            {callerName} is calling you...
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center gap-4">
          <Button
            variant="destructive"
            size="lg"
            onClick={() => onDecline(incomingCall.id)}
            className="rounded-full w-14 h-14"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={() => onAnswer(incomingCall.id)}
            className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600"
          >
            <Phone className="h-6 w-6" />
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default IncomingCallAlert;
