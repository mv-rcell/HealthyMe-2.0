
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, ActivityIcon, UserIcon, HeartIcon, ClipboardListIcon, CreditCardIcon, SettingsIcon } from 'lucide-react';
import HealthDashboard from '@/components/functional/HealthDashboard';
import HabitTracker from '@/components/functional/HabitTracker';
import AppointmentHistory from '@/components/functional/AppointmentHistory';
import HealthRecordsTab from '@/components/functional/HealthRecordsTab';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const quickActions = [
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
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name || 'User'}!</h1>
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
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={action.action}>
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

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ActivityIcon className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Your recent health activities will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentHistory />
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

export default ClientDashboard;