import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

interface NotificationSettings {
  appointments: boolean;
  reminders: boolean;
  health_tips: boolean;
  follow_ups: boolean;
}

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    appointments: true,
    reminders: true,
    health_tips: true,
    follow_ups: true
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadNotificationSettings();
      setupReminders();
    }
  }, [user]);

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
          appointments: data.appointments,
          reminders: data.reminders,
          health_tips: data.health_tips,
          follow_ups: data.follow_ups
        });
      }
    } catch (error: any) {
      console.error('Error loading notification settings:', error);
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
      toast.success('Notification settings updated');
    } catch (error: any) {
      toast.error(`Failed to update settings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const setupReminders = () => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const sendNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  };

  const scheduleAppointmentReminder = async (appointmentId: string, appointmentDate: Date) => {
    try {
      // Schedule reminder 24 hours before appointment
      const reminderTime = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
      
      const { error } = await supabase.functions.invoke('schedule-notification', {
        body: {
          user_id: user?.id,
          appointment_id: appointmentId,
          scheduled_for: reminderTime.toISOString(),
          type: 'appointment_reminder',
          title: 'Upcoming Appointment',
          message: 'You have an appointment tomorrow. Please prepare accordingly.'
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error scheduling reminder:', error);
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    sendNotification,
    scheduleAppointmentReminder
  };
};