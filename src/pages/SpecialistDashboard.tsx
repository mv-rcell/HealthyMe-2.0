import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, ListIcon, SettingsIcon, UsersIcon } from 'lucide-react';

const SpecialistDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, profileLoading } = useAuth();
  
  // Redirect if not logged in or not a specialist
  React.useEffect(() => {
    if (!loading && !profileLoading && (!user || profile?.role !== 'specialist')) {
      navigate('/auth');
    }
  }, [user, profile, loading, profileLoading, navigate]);

  if (loading || profileLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const dashboardItems = [
    {
      title: 'Appointments',
      description: 'View and manage your upcoming appointments',
      icon: <CalendarIcon className="w-10 h-10 text-primary" />,
      action: () => navigate('/specialist/appointments')
    },
    {
      title: 'Clients',
      description: 'See all your clients and their progress',
      icon: <UsersIcon className="w-10 h-10 text-primary" />,
      action: () => navigate('/specialist/clients')
    },
    {
      title: 'Services',
      description: 'Manage your services and pricing',
      icon: <ListIcon className="w-10 h-10 text-primary" />,
      action: () => navigate('/specialist/services')
    },
    {
      title: 'Settings',
      description: 'Update your profile and account settings',
      icon: <SettingsIcon className="w-10 h-10 text-primary" />,
      action: () => navigate('/profile')
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Specialist Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back, {profile?.full_name}!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardItems.map((item, index) => (
            <Card key={index} className="hover-lift cursor-pointer" onClick={item.action}>
              <CardHeader className="flex flex-col items-center pb-2">
                {item.icon}
                <CardTitle className="mt-4 text-center">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-500">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SpecialistDashboard;
