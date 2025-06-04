import React, { useState } from 'react';
import { Activity, Heart, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface HealthMetric {
  id: number;
  name: string;
  value: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'stable';
}

const HealthDashboard = () => {
  const [metrics] = useState<HealthMetric[]>([
    {
      id: 1,
      name: "Steps",
      value: 8500,
      target: 10000,
      unit: "steps",
      icon: <Activity className="h-4 w-4" />,
      trend: 'up'
    },
    {
      id: 2,
      name: "Heart Rate",
      value: 72,
      target: 80,
      unit: "bpm",
      icon: <Heart className="h-4 w-4" />,
      trend: 'stable'
    },
    {
      id: 3,
      name: "Sleep",
      value: 7,
      target: 8,
      unit: "hours",
      icon: <Calendar className="h-4 w-4" />,
      trend: 'down'
    }
  ]);

  const [recentActivities] = useState([
    { id: 1, activity: "Morning Walk", duration: "30 min", time: "7:00 AM" },
    { id: 2, activity: "Yoga Session", duration: "45 min", time: "6:00 PM" },
    { id: 3, activity: "Meditation", duration: "15 min", time: "9:00 PM" }
  ]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {metric.name}
                </CardTitle>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">
                    {metric.value.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    /{metric.target} {metric.unit}
                  </span>
                </div>
                <Progress 
                  value={(metric.value / metric.target) * 100} 
                  className="h-2"
                />
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp 
                    className={`h-3 w-3 ${
                      metric.trend === 'up' ? 'text-green-500' : 
                      metric.trend === 'down' ? 'text-red-500' : 
                      'text-gray-500'
                    }`} 
                  />
                  <span className="text-muted-foreground">
                    {metric.trend === 'up' ? 'Improving' : 
                     metric.trend === 'down' ? 'Needs attention' : 
                     'Stable'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{activity.activity}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {activity.duration}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Log Exercise
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Record Vitals
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Checkup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthDashboard;