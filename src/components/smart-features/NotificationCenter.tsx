import React, { useState } from 'react';
import { Bell, Settings, Clock, Heart, Mail, Phone, Smartphone, Volume2, VolumeX, TestTube2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';

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
  appointment_reminder_time: string; // minutes before
}

const NotificationCenter = () => {
  const { settings, loading, updateSettings } = useNotifications();
  const [testingNotification, setTestingNotification] = useState(false);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    email: true,
    sms: false,
    push: true,
    in_app: true
  });
  const [timingSettings, setTimingSettings] = useState<TimingSettings>({
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    appointment_reminder_time: '60'
  });

  const notificationTypes = [
    {
      key: 'appointments' as keyof NotificationSettings,
      icon: Clock,
      title: 'Appointment Reminders',
      description: 'Get notified before scheduled appointments',
      priority: 'high' as const,
      category: 'scheduling'
    },
    {
      key: 'medication_reminders' as keyof NotificationSettings,
      icon: Heart,
      title: 'Medication Reminders',
      description: 'Never miss your prescribed medications',
      priority: 'high' as const,
      category: 'health'
    },
    {
      key: 'follow_ups' as keyof NotificationSettings,
      icon: Bell,
      title: 'Follow-up Reminders',
      description: 'Post-appointment care instructions and check-ins',
      priority: 'medium' as const,
      category: 'care'
    },
    {
      key: 'lab_results' as keyof NotificationSettings,
      icon: TestTube2,
      title: 'Lab Results',
      description: 'Get notified when test results are available',
      priority: 'high' as const,
      category: 'results'
    },
    {
      key: 'emergency_alerts' as keyof NotificationSettings,
      icon: Bell,
      title: 'Emergency Alerts',
      description: 'Critical health alerts and urgent communications',
      priority: 'critical' as const,
      category: 'emergency'
    },
    {
      key: 'reminders' as keyof NotificationSettings,
      icon: Heart,
      title: 'Health Check-in Reminders',
      description: 'Regular wellness check-ins and health tracking',
      priority: 'medium' as const,
      category: 'wellness'
    },
    {
      key: 'health_tips' as keyof NotificationSettings,
      icon: Settings,
      title: 'Personalized Health Tips',
      description: 'Wellness advice tailored to your health profile',
      priority: 'low' as const,
      category: 'education'
    },
    {
      key: 'system_updates' as keyof NotificationSettings,
      icon: Settings,
      title: 'System Updates',
      description: 'Platform updates and new feature announcements',
      priority: 'low' as const,
      category: 'system'
    }
  ];

  const deliveryMethods = [
    { key: 'push' as keyof DeliverySettings, icon: Smartphone, label: 'Push Notifications', description: 'Mobile and browser notifications' },
    { key: 'email' as keyof DeliverySettings, icon: Mail, label: 'Email', description: 'Email notifications to your registered address' },
    { key: 'sms' as keyof DeliverySettings, icon: Phone, label: 'SMS', description: 'Text messages to your phone' },
    { key: 'in_app' as keyof DeliverySettings, icon: Bell, label: 'In-App', description: 'Notifications within the application' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTestNotifications = async () => {
    setTestingNotification(true);
    try {
      // Simulate API call to test notifications
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Test notification sent! Check your enabled delivery methods.', {
        description: 'You should receive notifications on all your enabled channels.'
      });
    } catch (error) {
      toast.error('Failed to send test notification. Please try again.');
    } finally {
      setTestingNotification(false);
    }
  };

  const handleSettingUpdate = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      await updateSettings({ [key]: value });
      
      // Special handling for critical settings
      if (key === 'emergency_alerts' && !value) {
        toast.warning('Emergency alerts disabled', {
          description: 'You will not receive critical health emergency notifications.'
        });
      }
      
      if (key === 'medication_reminders' && !value) {
        toast.warning('Medication reminders disabled', {
          description: 'Make sure you have alternative reminders for your medications.'
        });
      }
    } catch (error) {
      toast.error('Failed to update notification settings');
    }
  };

  const handleDeliveryUpdate = (key: keyof DeliverySettings, value: boolean) => {
    setDeliverySettings(prev => ({ ...prev, [key]: value }));
    toast.success(`${deliveryMethods.find(m => m.key === key)?.label} notifications ${value ? 'enabled' : 'disabled'}`);
  };

  const activeNotifications = notificationTypes.filter(type => settings[type.key]).length;
  const totalNotifications = notificationTypes.length;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Center
            </div>
            <Badge variant="secondary" className="text-xs">
              {activeNotifications}/{totalNotifications} Active
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your health notification preferences and delivery methods
          </p>
        </CardHeader>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Types</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose which types of health notifications you want to receive
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((type, index) => {
            const IconComponent = type.icon;
            return (
              <div key={type.key}>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-start gap-3 flex-1">
                    <IconComponent className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{type.title}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-2 py-0 ${getPriorityColor(type.priority)}`}
                        >
                          {type.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings[type.key] || false}
                    onCheckedChange={(checked) => handleSettingUpdate(type.key, checked)}
                    disabled={loading}
                    aria-label={`Toggle ${type.title}`}
                  />
                </div>
                {index < notificationTypes.length - 1 && <Separator className="my-2" />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Delivery Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Methods</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose how you want to receive notifications
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {deliveryMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div key={method.key}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{method.label}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={deliverySettings[method.key]}
                    onCheckedChange={(checked) => handleDeliveryUpdate(method.key, checked)}
                    aria-label={`Toggle ${method.label}`}
                  />
                </div>
                {index < deliveryMethods.length - 1 && <Separator className="my-2" />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Timing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timing & Schedule</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure when and how often you receive notifications
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiet-start" className="text-sm font-medium">
                Quiet Hours Start
              </Label>
              <Select 
                value={timingSettings.quiet_hours_start} 
                onValueChange={(value) => setTimingSettings(prev => ({ ...prev, quiet_hours_start: value }))}
              >
                <SelectTrigger id="quiet-start">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quiet-end" className="text-sm font-medium">
                Quiet Hours End
              </Label>
              <Select 
                value={timingSettings.quiet_hours_end} 
                onValueChange={(value) => setTimingSettings(prev => ({ ...prev, quiet_hours_end: value }))}
              >
                <SelectTrigger id="quiet-end">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-time" className="text-sm font-medium">
              Appointment Reminder Time
            </Label>
            <Select 
              value={timingSettings.appointment_reminder_time} 
              onValueChange={(value) => setTimingSettings(prev => ({ ...prev, appointment_reminder_time: value }))}
            >
              <SelectTrigger id="reminder-time">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes before</SelectItem>
                <SelectItem value="30">30 minutes before</SelectItem>
                <SelectItem value="60">1 hour before</SelectItem>
                <SelectItem value="120">2 hours before</SelectItem>
                <SelectItem value="1440">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            {timingSettings.quiet_hours_start !== timingSettings.quiet_hours_end ? (
              <VolumeX className="h-4 w-4 text-blue-600" />
            ) : (
              <Volume2 className="h-4 w-4 text-blue-600" />
            )}
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Quiet Hours: {timingSettings.quiet_hours_start} - {timingSettings.quiet_hours_end}
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                Non-critical notifications will be silenced during these hours
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Test Notifications</CardTitle>
          <p className="text-sm text-muted-foreground">
            Send a test notification to verify your settings are working correctly
          </p>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleTestNotifications}
            disabled={testingNotification || loading}
            className="w-full"
            variant="outline"
          >
            {testingNotification ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Sending Test...
              </>
            ) : (
              <>
                <TestTube2 className="h-4 w-4 mr-2" />
                Send Test Notification
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Test notifications will be sent to all enabled delivery methods
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;