import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  appointment_id?: number;
  message_text: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
}

export const useMessaging = (currentUserId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationPartnerId, setConversationPartnerId] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchMessages = async (partnerId: string) => {
    if (!currentUserId) return;

    setLoading(true);
    setConversationPartnerId(partnerId);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${currentUserId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${currentUserId})`
        )
        .order('created_at', { ascending: true })
        .limit(100); // <-- Prevent massive payloads

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };
  const sendMessage = async (
recipientId: string, messageText: string, sessionId: number,
   // appointmentId?: number
  ) => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: currentUserId,
        recipient_id: recipientId,
        message_text: messageText,
        message_type: 'text', // Add this if your table expects a type
        is_read: false     
      });

      if (error) throw error;
      toast.success('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  useEffect(() => {
    if (!currentUserId || !conversationPartnerId) return;

    console.log('🔄 Setting up real-time subscription for messaging');

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel('messages_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as Message;

          const isRelevant =
            (newMessage.sender_id === currentUserId &&
              newMessage.recipient_id === conversationPartnerId) ||
            (newMessage.sender_id === conversationPartnerId &&
              newMessage.recipient_id === currentUserId);

          if (!isRelevant) return;

          console.log('📨 New message received:', newMessage);
          setMessages((prev) => [...prev, newMessage]);

          if (newMessage.sender_id !== currentUserId) {
            markAsRead(newMessage.id);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const updatedMessage = payload.new as Message;

          const isRelevant =
            (updatedMessage.sender_id === currentUserId &&
              updatedMessage.recipient_id === conversationPartnerId) ||
            (updatedMessage.sender_id === conversationPartnerId &&
              updatedMessage.recipient_id === currentUserId);

          if (!isRelevant) return;

          console.log('📝 Message updated:', updatedMessage);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      console.log('🧹 Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [currentUserId, conversationPartnerId]);

  return {
    messages,
    loading,
    fetchMessages,
    sendMessage,
    markAsRead
  };
};
