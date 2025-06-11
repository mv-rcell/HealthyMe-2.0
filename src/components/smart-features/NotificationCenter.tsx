import React from 'react';
import { Bell, Settings, Clock, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationCenter = () => {
  const { settings, loading, updateSettings } = useNotifications();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Appointment Reminders</p>
                <p className="text-sm text-muted-foreground">Get notified before appointments</p>
              </div>
            </div>
            <Switch
              checked={settings.appointments}
              onCheckedChange={(checked) => updateSettings({ appointments: checked })}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Health Check-in Reminders</p>
                <p className="text-sm text-muted-foreground">Regular health status updates</p>
              </div>
            </div>
            <Switch
              checked={settings.reminders}
              onCheckedChange={(checked) => updateSettings({ reminders: checked })}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Health Tips</p>
                <p className="text-sm text-muted-foreground">Personalized wellness tips</p>
              </div>
            </div>
            <Switch
              checked={settings.health_tips}
              onCheckedChange={(checked) => updateSettings({ health_tips: checked })}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Follow-up Reminders</p>
                <p className="text-sm text-muted-foreground">Post-appointment follow-ups</p>
              </div>
            </div>
            <Switch
              checked={settings.follow_ups}
              onCheckedChange={(checked) => updateSettings({ follow_ups: checked })}
              disabled={loading}
            />
          </div>
        </div>

        <Button className="w-full" variant="outline">
          Test Notifications
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;