import React, { useState } from 'react';
import { Send, Video, Phone, MessageSquare, ExternalLink, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useZoomIntegration } from '@/hooks/useZoomIntegration';
import { useZoomNotifications } from '@/hooks/useZoomNotifications';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'specialist';
  timestamp: Date;
}

interface VirtualChatProps {
  recipientId?: string;
  recipientName?: string;
  recipientEmail?: string;
}

const VirtualChat: React.FC<VirtualChatProps> = ({ 
  recipientId, 
  recipientName = 'Healthcare Professional',
  recipientEmail 
}) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello! I'm ${recipientName}. How can I help you today?`,
      sender: 'specialist',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoCall, setIsVideoCall] = useState(false);
  
  const { loading, activeMeeting, startZoomCall, joinZoomMeeting, endZoomMeeting } = useZoomIntegration();
  const { sendZoomInvitation } = useZoomNotifications();

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate specialist response
    setTimeout(() => {
      const response: Message = {
        id: messages.length + 2,
        text: "Thank you for your message. I understand your concern. Let me help you with that...",
        sender: 'specialist',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const startVideoCall = () => {
    setIsVideoCall(true);
    toast.success(`Video call started with ${recipientName}`);
  };

  const handleStartZoomMeeting = async () => {
    if (!user || !profile) {
      toast.error('Please log in to start a meeting');
      return;
    }

    if (!recipientId) {
      toast.error('No recipient specified for the call');
      return;
    }

    // Determine meeting topic based on user role
    const meetingTopic = profile.role === 'specialist' 
      ? `Virtual Consultation with ${profile.full_name || 'Specialist'}`
      : `Client Consultation with ${recipientName}`;
    
    const meeting = await startZoomCall(meetingTopic, recipientId);
    
    if (meeting) {
      const meetingMessage: Message = {
        id: messages.length + 1,
        text: `Zoom meeting created and invitation sent to ${recipientName}! Meeting ID: ${meeting.meeting_id}${meeting.password ? ` | Password: ${meeting.password}` : ''}`,
        sender: profile.role === 'specialist' ? 'specialist' : 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, meetingMessage]);
    }
  };

  const copyMeetingInfo = () => {
    if (activeMeeting) {
      const meetingInfo = `Zoom Meeting Details:
Meeting ID: ${activeMeeting.meeting_id}
Join URL: ${activeMeeting.join_url}
${activeMeeting.password ? `Password: ${activeMeeting.password}` : ''}`;
      
      navigator.clipboard.writeText(meetingInfo);
      toast.success('Meeting details copied to clipboard');
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Virtual Consultation
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={startVideoCall}>
              <Video className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Phone className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleStartZoomMeeting}
              disabled={loading}
            >
              Zoom
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isVideoCall && (
          <div className="mb-4 p-4 bg-muted rounded-lg text-center">
            <Video className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Video call active with {recipientName}</p>
          </div>
        )}

        {activeMeeting && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Zoom Meeting Active
              </Badge>
              <Button size="sm" variant="outline" onClick={copyMeetingInfo}>
                <Copy className="h-3 w-3 mr-1" />
                Copy Details
              </Button>
            </div>
            <p className="text-sm font-medium mb-1">Meeting ID: {activeMeeting.meeting_id}</p>
            {activeMeeting.password && (
              <p className="text-sm mb-2">Password: {activeMeeting.password}</p>
            )}
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => joinZoomMeeting(activeMeeting.join_url)}
                className="flex-1"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Join Meeting
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={endZoomMeeting}
              >
                End
              </Button>
            </div>
          </div>
        )}
        
        <div className="h-64 overflow-y-auto border rounded-lg p-3 mb-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VirtualChat;