import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

// Enhanced notification settings interface
interface NotificationSettings {
  appointments: boolean;
  reminders: boolean;
  health_tips: boolean;
  follow_ups: boolean;
  emergency_alerts: boolean;
  medication_reminders: boolean;
  lab_results: boolean;
  system_updates: boolean;
}

interface DeliverySettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  in_app: boolean;
}

interface TimingSettings {
  quiet_hours_start: string;
  quiet_hours_end: string;
  appointment_reminder_time: number; // minutes before
}

interface NotificationData {
  id?: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  scheduled_for?: string;
  appointment_id?: string;
  medication_id?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  delivery_methods: string[];
  read: boolean;
  created_at?: string;
}

interface ScheduledNotification {
  id: string;
  timeoutId: NodeJS.Timeout;
  data: NotificationData;
}

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    appointments: true,
    reminders: true,
    health_tips: true,
    follow_ups: true,
    emergency_alerts: true,
    medication_reminders: true,
    lab_results: true,
    system_updates: false
  });

  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    email: true,
    sms: false,
    push: true,
    in_app: true
  });

  const [timingSettings, setTimingSettings] = useState<TimingSettings>({
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    appointment_reminder_time: 60
  });

  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  
  const { user } = useAuth();
  const scheduledNotifications = useRef<Map<string, ScheduledNotification>>(new Map());
  const notificationChannel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (user) {
      loadAllSettings();
      setupNotificationChannel();
      loadUnreadNotifications();
      checkNotificationPermission();
    }

    return () => {
      // Cleanup scheduled notifications
      scheduledNotifications.current.forEach(({ timeoutId }) => {
        clearTimeout(timeoutId);
      });
      scheduledNotifications.current.clear();
      
      // Cleanup broadcast channel
      if (notificationChannel.current) {
        notificationChannel.current.close();
      }
    };
  }, [user]);

  const checkNotificationPermission = useCallback(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const setupNotificationChannel = useCallback(() => {
    if ('BroadcastChannel' in window) {
      notificationChannel.current = new BroadcastChannel('health-notifications');
      notificationChannel.current.onmessage = (event) => {
        if (event.data.type === 'notification_received') {
          loadUnreadNotifications();
        }
      };
    }
  }, []);

  const loadAllSettings = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadNotificationSettings(),
        loadDeliverySettings(),
        loadTimingSettings()
      ]);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_notification_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings({
          appointments: data.appointments ?? true,
          reminders: data.reminders ?? true,
          health_tips: data.health_tips ?? true,
          follow_ups: data.follow_ups ?? true,
          emergency_alerts: data.emergency_alerts ?? true,
          medication_reminders: data.medication_reminders ?? true,
          lab_results: data.lab_results ?? true,
          system_updates: data.system_updates ?? false
        });
      }
    } catch (error: any) {
      console.error('Error loading notification settings:', error);
    }
  };

  const loadDeliverySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_delivery_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setDeliverySettings({
          email: data.email ?? true,
          sms: data.sms ?? false,
          push: data.push ?? true,
          in_app: data.in_app ?? true
        });
      }
    } catch (error: any) {
      console.error('Error loading delivery settings:', error);
    }
  };

  const loadTimingSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_timing_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setTimingSettings({
          quiet_hours_start: data.quiet_hours_start ?? '22:00',
          quiet_hours_end: data.quiet_hours_end ?? '08:00',
          appointment_reminder_time: data.appointment_reminder_time ?? 60
        });
      }
    } catch (error: any) {
      console.error('Error loading timing settings:', error);
    }
  };

  const loadUnreadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.length || 0);
    } catch (error: any) {
      console.error('Error loading notifications:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    if (!user) return;

    setLoading(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('user_notification_settings')
        .upsert({
          user_id: user.id,
          ...updatedSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(updatedSettings);
      toast.success('Notification preferences updated successfully');

      // Handle special cases
      if (newSettings.emergency_alerts === false) {
        toast.warning('Emergency alerts have been disabled', {
          description: 'You will not receive critical health notifications'
        });
      }

      if (newSettings.medication_reminders === false) {
        toast.warning('Medication reminders have been disabled', {
          description: 'Please ensure you have alternative reminder methods'
        });
      }

    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast.error(`Failed to update settings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliverySettings = async (newSettings: Partial<DeliverySettings>) => {
    if (!user) return;

    setLoading(true);
    try {
      const updatedSettings = { ...deliverySettings, ...newSettings };
      
      const { error } = await supabase
        .from('user_delivery_settings')
        .upsert({
          user_id: user.id,
          ...updatedSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setDeliverySettings(updatedSettings);
      toast.success('Delivery preferences updated');

    } catch (error: any) {
      console.error('Error updating delivery settings:', error);
      toast.error(`Failed to update delivery settings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateTimingSettings = async (newSettings: Partial<TimingSettings>) => {
    if (!user) return;

    setLoading(true);
    try {
      const updatedSettings = { ...timingSettings, ...newSettings };
      
      const { error } = await supabase
        .from('user_timing_settings')
        .upsert({
          user_id: user.id,
          ...updatedSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setTimingSettings(updatedSettings);
      toast.success('Timing preferences updated');

    } catch (error: any) {
      console.error('Error updating timing settings:', error);
      toast.error(`Failed to update timing settings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        toast.success('Notification permission granted');
        return true;
      } else {
        toast.error('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request notification permission');
      return false;
    }
  };

  const isQuietHours = useCallback((): boolean => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = timingSettings.quiet_hours_start.split(':').map(Number);
    const [endHour, endMin] = timingSettings.quiet_hours_end.split(':').map(Number);
    
    const quietStart = startHour * 60 + startMin;
    const quietEnd = endHour * 60 + endMin;

    if (quietStart <= quietEnd) {
      return currentTime >= quietStart && currentTime < quietEnd;
    } else {
      return currentTime >= quietStart || currentTime < quietEnd;
    }
  }, [timingSettings]);

  const sendNotification = useCallback(async (
    title: string, 
    body: string, 
    options: {
      priority?: 'low' | 'medium' | 'high' | 'critical';
      icon?: string;
      badge?: string;
      tag?: string;
      data?: any;
      actions?: NotificationData[];
    } = {}
  ) => {
    const { priority = 'medium', icon = '/favicon.ico', badge = '/favicon.ico', ...otherOptions } = options;
    
    // Check if notifications should be sent during quiet hours
    if (isQuietHours() && priority !== 'critical') {
      console.log('Notification suppressed during quiet hours:', title);
      return;
    }

    // Store notification in database
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user?.id,
          type: 'general',
          title,
          message: body,
          priority,
          delivery_methods: deliverySettings.push ? ['push'] : [],
          read: false
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error storing notification:', error);
    }

    // Send browser notification if permission granted and push notifications enabled
    if (deliverySettings.push && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon,
          badge,
          ...otherOptions
        });
      } catch (error) {
        console.error('Error sending browser notification:', error);
      }
    }

    // Broadcast to other tabs
    if (notificationChannel.current) {
      notificationChannel.current.postMessage({
        type: 'notification_received',
        data: { title, body, priority }
      });
    }

    // Update unread count
    setUnreadCount(prev => prev + 1);
  }, [user, deliverySettings, isQuietHours]);

  const scheduleNotification = useCallback(async (
    notificationData: Omit<NotificationData, 'user_id' | 'read'>,
    scheduledFor: Date
  ) => {
    if (!user) return null;

    const delay = scheduledFor.getTime() - Date.now();
    
    if (delay <= 0) {
      // Send immediately if scheduled time has passed
      await sendNotification(notificationData.title, notificationData.message, {
        priority: notificationData.priority
      });
      return null;
    }

    // Store in database
    try {
      const { data, error } = await supabase
        .from('scheduled_notifications')
        .insert({
          user_id: user.id,
          ...notificationData,
          scheduled_for: scheduledFor.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Schedule local timeout
      const timeoutId = setTimeout(async () => {
        await sendNotification(notificationData.title, notificationData.message, {
          priority: notificationData.priority
        });
        
        // Remove from scheduled notifications
        scheduledNotifications.current.delete(data.id);
        
        // Mark as sent in database
        await supabase
          .from('scheduled_notifications')
          .update({ sent: true })
          .eq('id', data.id);
      }, delay);

      // Store reference
      const scheduledNotification: ScheduledNotification = {
        id: data.id,
        timeoutId,
        data: { ...notificationData, user_id: user.id, read: false }
      };

      scheduledNotifications.current.set(data.id, scheduledNotification);
      
      return data.id;
    } catch (error: any) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }, [user, sendNotification]);

  const scheduleAppointmentReminder = async (appointmentId: string, appointmentDate: Date) => {
    if (!settings.appointments) return;

    try {
      const reminderTime = new Date(
        appointmentDate.getTime() - timingSettings.appointment_reminder_time * 60 * 1000
      );

      await scheduleNotification({
        type: 'appointment_reminder',
        title: 'Upcoming Appointment',
        message: `You have an appointment scheduled for ${appointmentDate.toLocaleString()}. Please prepare accordingly.`,
        appointment_id: appointmentId,
        priority: 'high',
        delivery_methods: ['push', 'email']
      }, reminderTime);

      console.log(`Appointment reminder scheduled for ${reminderTime.toLocaleString()}`);
    } catch (error: any) {
      console.error('Error scheduling appointment reminder:', error);
    }
  };

  const scheduleMedicationReminder = async (medicationId: string, reminderTime: Date, medicationName: string) => {
    if (!settings.medication_reminders) return;

    try {
      await scheduleNotification({
        type: 'medication_reminder',
        title: 'Medication Reminder',
        message: `Time to take your ${medicationName}`,
        medication_id: medicationId,
        priority: 'high',
        delivery_methods: ['push', 'sms']
      }, reminderTime);

      console.log(`Medication reminder scheduled for ${reminderTime.toLocaleString()}`);
    } catch (error: any) {
      console.error('Error scheduling medication reminder:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const testNotifications = async () => {
    const testMessage = 'This is a test notification to verify your settings are working correctly.';
    
    await sendNotification('Test Notification', testMessage, {
      priority: 'medium',
      tag: 'test-notification'
    });

    return true;
  };

  return {
    // Settings
    settings,
    deliverySettings,
    timingSettings,
    loading,
    permissionStatus,
    
    // Notifications
    notifications,
    unreadCount,
    
    // Update functions
    updateSettings,
    updateDeliverySettings,
    updateTimingSettings,
    
    // Notification functions
    sendNotification,
    scheduleNotification,
    scheduleAppointmentReminder,
    scheduleMedicationReminder,
    
    // Utility functions
    requestNotificationPermission,
    markAsRead,
    markAllAsRead,
    testNotifications,
    isQuietHours
  };
};