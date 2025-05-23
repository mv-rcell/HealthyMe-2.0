
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, HeartIcon, SearchIcon, UserIcon } from 'lucide-react';
import { toast } from 'sonner';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, profileLoading } = useAuth();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      toast.info("Please login to access your dashboard");
      navigate('/auth');
      return;
    }
    
    // If user is logged in but has no profile or is not a client, redirect to onboarding
    if (!loading && !profileLoading && user && (!profile || profile.role !== 'client')) {
      toast.info("Please complete your profile setup");
      navigate('/client-onboarding');
    }
  }, [user, profile, loading, profileLoading, navigate]);

  // Show loading when checking authentication or profile
  if (loading || profileLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // Safety check - shouldn't reach here if there's no profile, but just in case
  if (!user) {
    return null;
  }

  const dashboardItems = [
    {
      title: 'My Appointments',
      description: 'View and manage your upcoming appointments',
      icon: <CalendarIcon className="w-10 h-10 text-primary" />,
      action: () => navigate('/client/appointments')
    },
    {
      title: 'Find Specialists',
      description: 'Browse and book specialists based on your needs',
      icon: <SearchIcon className="w-10 h-10 text-primary" />,
      action: () => navigate('/specialists')
    },
    {
      title: 'Health Records',
      description: 'View your health history and progress',
      icon: <HeartIcon className="w-10 h-10 text-primary" />,
      action: () => navigate('/client/health-records')
    },
    {
      title: 'My Profile',
      description: 'Update your personal and health information',
      icon: <UserIcon className="w-10 h-10 text-primary" />,
      action: () => navigate('/profile')
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Client Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back, {profile?.full_name || 'Client'}!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardItems.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={item.action}>
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

export default ClientDashboard;