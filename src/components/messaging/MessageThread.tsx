
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Video, Send, Phone } from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import { useZoomIntegration } from '@/hooks/useZoomIntegration';
import { useVideoCall } from '@/hooks/useVideoCall';
import { toast } from 'sonner';
import IncomingCallAlert from '../video/IncomingCallAlert';

interface MessageThreadProps {
  currentUserId: string;
  recipientId: string;
  recipientName: string;
  appointmentId?: number;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  currentUserId,
  recipientId,
  recipientName,
  appointmentId
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, fetchMessages, sendMessage } = useMessaging(currentUserId);
  const { createZoomMeeting, loading: zoomLoading } = useZoomIntegration();
  const { 
    startVideoCall, 
    answerCall, 
    declineCall, 
    incomingCall, 
    activeSession,
    loading: videoLoading 
  } = useVideoCall();

  useEffect(() => {
    fetchMessages(recipientId);
  }, [recipientId, fetchMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await sendMessage(recipientId, newMessage, appointmentId);
    setNewMessage('');
  };

  const handleStartVideoCall = async () => {
    try {
      const appointmentId = Math.floor(Math.random() * 1000000);
      const session = await startVideoCall(appointmentId, recipientId);
      
      if (session) {
        toast.success(`Video call started with ${recipientName}!`);
        // Send notification message
        await sendMessage(recipientId, `📹 Video call started`, appointmentId);
      }
    } catch (error) {
      toast.error('Failed to start video call');
    }
  };

  const handleStartZoomCall = async () => {
    try {
      const meeting = await createZoomMeeting(
        `Consultation with ${recipientName}`,
        'client@example.com'
      );
      
      if (meeting) {
        toast.success('Zoom meeting created!');
        // Send meeting link as a message
        await sendMessage(recipientId, `🎥 Zoom meeting: ${meeting.join_url}`, appointmentId);
      }
    } catch (error) {
      toast.error('Failed to create Zoom meeting');
    }
  };

  return (
    <>
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
              </Avatar>
              {recipientName}
              {activeSession && (
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  In Call
                </span>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleStartVideoCall}
                disabled={videoLoading || !!activeSession}
              >
                <Video className="h-4 w-4 mr-2" />
                {activeSession ? 'In Call' : 'Video Call'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleStartZoomCall}
                disabled={zoomLoading}
              >
                <Phone className="h-4 w-4 mr-2" />
                Zoom Call
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-4">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {loading ? (
              <div className="text-center text-muted-foreground">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-muted-foreground">No messages yet. Start a conversation!</div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender_id === currentUserId
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.message_text}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs opacity-70">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                      {message.sender_id === currentUserId && (
                        <p className="text-xs opacity-70">
                          {message.is_read ? '✓✓' : '✓'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <IncomingCallAlert
        incomingCall={incomingCall}
        onAnswer={answerCall}
        onDecline={declineCall}
        callerName={recipientName}
      />
    </>
  );
};

export default MessageThread;
