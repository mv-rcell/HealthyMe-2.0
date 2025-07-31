import React, { useEffect, useRef, useState } from 'react';
import { SendHorizonalIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMessaging } from '@/hooks/useMessaging';

interface MessageThreadProps {
  currentUserId: string;
  recipientId: string;
  recipientName: string; // ← add this line 
  appointmentId?: number;
}

export const MessageThread: React.FC<MessageThreadProps> = ({ currentUserId, recipientId, appointmentId }) => {
  const { messages, loading, fetchMessages, sendMessage } = useMessaging(currentUserId);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const sessionId = appointmentId ?? Math.floor(Math.random() * 1000000);
    await sendMessage(recipientId, newMessage, null);    setNewMessage('');
    await fetchMessages(recipientId); // Add this line if needed
  };

  console.log('📤 Sending message ', );
  useEffect(() => {
    if (recipientId) {
      fetchMessages(recipientId);
    }
  }, [recipientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 p-2">
        {loading ? (
          <div className="text-center text-sm text-muted-foreground mt-4">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground mt-4">No messages yet</div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender_id === currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-2 p-2 border-t">
        <Input
          placeholder="Type your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          aria-label="Message input"
        />
        <Button
          size="sm"
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || loading}
          aria-label="Send message"
        >
          <SendHorizonalIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<{ message: any; isOwn: boolean }> = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-xl px-4 py-2 text-sm ${
          isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}
      >
        <p>{message.message_text}</p>
        <div className="text-[10px] opacity-60 mt-1 flex justify-between">
          <span>{new Date(message.created_at).toLocaleTimeString()}</span>
          {isOwn && <span>{message.is_read ? '✓✓' : '✓'}</span>}
        </div>
      </div>
    </div>
  );
};
 

export default MessageThread