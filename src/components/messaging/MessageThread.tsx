import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Video } from 'lucide-react';
import { useMessaging, Message } from '@/hooks/useMessaging.tsx';
import { useZoomIntegration } from '@/hooks/useZoomIntegration';

interface MessageThreadProps {
  currentUserId: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  appointmentId?: number;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  currentUserId,
  partnerId,
  partnerName,
  partnerAvatar,
  appointmentId
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, fetchMessages, sendMessage } = useMessaging(currentUserId);
  const { createMeeting, loading: zoomLoading } = useZoomIntegration();

  useEffect(() => {
    fetchMessages(partnerId);
  }, [partnerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await sendMessage(partnerId, newMessage, appointmentId);
    setNewMessage('');
    fetchMessages(partnerId);
  };

  const handleVideoCall = async () => {
    if (appointmentId) {
      await createMeeting(appointmentId);
    }
  };

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={partnerAvatar} />
              <AvatarFallback>{partnerName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{partnerName}</span>
          </div>
          {appointmentId && (
            <Button size="sm" onClick={handleVideoCall} disabled={zoomLoading}>
              <Video className="h-4 w-4 mr-1" />
              Video Call
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2 mb-3">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground">No messages yet</div>
          ) : (
            messages.map((message: Message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender_id === currentUserId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.message_text}
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button size="sm" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageThread;
