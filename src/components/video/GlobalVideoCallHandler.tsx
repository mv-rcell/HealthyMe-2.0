import React from 'react';
import { useVideoCall } from '@/hooks/useVideoCall';
import { useAuth } from '@/hooks/useAuth';
import IncomingCallAlert from './IncomingCallAlert';
import { supabase } from '@/integrations/supabase/client';

const GlobalVideoCallHandler: React.FC = () => {
  const { incomingCall, answerCall, declineCall } = useVideoCall();
  const { user } = useAuth();
  const [callerName, setCallerName] = React.useState<string>('Unknown User');

  // Fetch caller's name when there's an incoming call
  React.useEffect(() => {
    if (!incomingCall || !user) return;

    const fetchCallerName = async () => {
      try {
        // Determine the caller ID (the other person in the call)
        const callerId = incomingCall.client_id === user.id 
          ? incomingCall.specialist_id 
          : incomingCall.client_id;

        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', callerId)
          .single();

        if (data && !error) {
          setCallerName(data.full_name || 'Unknown User');
        }
      } catch (error) {
        console.error('Error fetching caller name:', error);
      }
    };

    fetchCallerName();
  }, [incomingCall, user]);

  return (
    <IncomingCallAlert
      incomingCall={incomingCall}
      onAnswer={answerCall}
      onDecline={declineCall}
      callerName={callerName}
    />
  );
};

export default GlobalVideoCallHandler;