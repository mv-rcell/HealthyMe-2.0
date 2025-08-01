import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

export interface MessageNotification {
  id: string;
  sender_id: string;
  sender_name?: string;
  message_text: string;
  created_at: string;
  is_read: boolean;
}

export const useMessageNotifications = () => {
  const [notifications, setNotifications] = useState<MessageNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();


  // Fetch unread messages on mount
  useEffect(() => {
    if (user) {
      fetchUnreadMessages();
    }
  }, [user]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    console.log('Setting up message notifications subscription');
    
    const channel = supabase
      .channel('message_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('New message notification:', payload);
          const newMessage = payload.new;
          
          // Fetch sender profile to get name
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', newMessage.sender_id)
            .single();

          const notification: MessageNotification = {
            id: newMessage.id,
            sender_id: newMessage.sender_id,
            sender_name: senderProfile?.full_name || 'Unknown User',
            message_text: newMessage.message_text,
            created_at: newMessage.created_at,
            is_read: false
          };

          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast notification
          toast.info(`New message from ${notification.sender_name}`, {
            description: newMessage.message_text.length > 50 
              ? newMessage.message_text.substring(0, 50) + '...' 
              : newMessage.message_text,
            action: {
              label: 'View',
              onClick: () => {
                // This could trigger opening the message thread
                navigate(`/messages/${newMessage.sender_id}`);

              }
            }
          });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up message notifications subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchUnreadMessages = async () => {
    if (!user) return;
  
    try {
      // Step 1: Fetch unread messages
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('id, sender_id, message_text, created_at, is_read')
        .eq('recipient_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });
  
      if (msgError) throw msgError;
      if (!messages || messages.length === 0) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
  
      // Step 2: Get unique sender_ids
      const senderIds = [...new Set(messages.map(msg => msg.sender_id))];
  
      // Step 3: Fetch sender profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', senderIds);
  
      if (profileError) throw profileError;
  
      const profileMap = new Map(profiles.map(p => [p.id, p.full_name]));
  
      // Step 4: Merge profile names into messages
      const formattedNotifications: MessageNotification[] = messages.map(msg => ({
        id: msg.id,
        sender_id: msg.sender_id,
        sender_name: profileMap.get(msg.sender_id) || 'Unknown User',
        message_text: msg.message_text,
        created_at: msg.created_at,
        is_read: msg.is_read
      }));
  
      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.length);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      toast.error('Failed to load unread messages');
    }
  };
  

  const markNotificationAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === messageId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const navigateToMessage = (senderId: string) => {
    navigate(`/messages/${senderId}`);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markNotificationAsRead,
    clearAllNotifications,
    fetchUnreadMessages,
    navigateToMessage,

  };
};