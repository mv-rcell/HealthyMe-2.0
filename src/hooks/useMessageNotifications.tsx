import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

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
                console.log('View message clicked');
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
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          message_text,
          created_at,
          is_read,
          profiles!messages_sender_id_fkey(full_name)
        `)
        .eq('recipient_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedNotifications: MessageNotification[] = data?.map(msg => ({
        id: msg.id,
        sender_id: msg.sender_id,
        sender_name: (msg.profiles as any)?.full_name || 'Unknown User',
        message_text: msg.message_text,
        created_at: msg.created_at,
        is_read: msg.is_read
      })) || [];

      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.length);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
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

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markNotificationAsRead,
    clearAllNotifications,
    fetchUnreadMessages
  };
};