import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarIcon,
  ActivityIcon,
  UserIcon,
  ClipboardListIcon,
  CreditCardIcon,
} from 'lucide-react';
import HealthDashboard from '@/components/functional/HealthDashboard';
import HabitTracker from '@/components/functional/HabitTracker';
import HealthRecordsTab from '@/components/functional/HealthRecordsTab';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AppointmentHistory from '@/pages/AppointmentHistory';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [recentActivity, setRecentActivity] = useState([]);

  const displayName = profile?.full_name ?? 'User';

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Fetch existing activity logs on initial load
    const fetchActivityLogs = async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) {
        setRecentActivity(data);
      }
    };

    fetchActivityLogs();

    const activityChannel = supabase
      .channel('realtime-activity')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs' }, (payload) => {
        setRecentActivity((prev) => [payload.new, ...prev]);
        toast.info('New activity logged');
      })
      .subscribe();

    const appointmentChannel = supabase
      .channel('realtime-appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, (payload) => {
        toast.success('Appointment updated');
      })
      .subscribe();

    const recordsChannel = supabase
      .channel('realtime-records')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'health_records' }, (payload) => {
        toast.success('New health record added');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(activityChannel);
      supabase.removeChannel(appointmentChannel);
      supabase.removeChannel(recordsChannel);
    };
  }, []);

  const quickActions = useMemo(() => [
    {
      title: 'Book Consultation',
      description: 'Schedule an appointment with a specialist',
      icon: <CalendarIcon className="w-8 h-8 text-primary" />,
      action: () => navigate('/book-consultation')
    },
    {
      title: 'Find Specialists',
      description: 'Browse our network of healthcare professionals',
      icon: <UserIcon className="w-8 h-8 text-primary" />,
      action: () => navigate('/specialists')
    },
    {
      title: 'Health Records',
      description: 'View and manage your medical records',
      icon: <ClipboardListIcon className="w-8 h-8 text-primary" />,
      action: () => setActiveTab('records')
    },
    {
      title: 'Payment History',
      description: 'View billing and payment information',
      icon: <CreditCardIcon className="w-8 h-8 text-primary" />,
      action: () => navigate('/payments')
    }
  ], [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName}!</h1>
          <p className="text-muted-foreground">Manage your health journey from your personalized dashboard.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Card
                  role="button"
                  aria-label={action.title}
                  key={index}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={action.action}
                >
                  <CardHeader className="flex flex-col items-center pb-2">
                    {action.icon}
                    <CardTitle className="mt-4 text-center">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground text-sm">{action.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ActivityIcon className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <ul className="space-y-2">
                    {recentActivity.map((activity, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {activity.description || 'New activity logged'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">Your recent health activities will appear here.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

         

          <TabsContent value="health">
            <HealthDashboard />
          </TabsContent>

          <TabsContent value="habits">
            <HabitTracker />
          </TabsContent>

          <TabsContent value="records">
            <HealthRecordsTab />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default AppointmentHistory;
