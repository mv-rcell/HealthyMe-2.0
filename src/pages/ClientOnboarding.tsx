import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ClientOnboarding = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  
  // Redirect if not logged in or not a client
  React.useEffect(() => {
    if (!loading && (!user || profile?.role !== 'client')) {
      navigate('/auth');
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to HealthyMe!</CardTitle>
            <CardDescription>
              Complete your health profile to get personalized health recommendations and connect with specialists.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2">Next steps:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Complete your health profile</li>
                  <li>Set your health goals</li>
                  <li>Browse specialists based on your needs</li>
                  <li>Book your first appointment</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/client-dashboard')} className="ml-auto">
              Continue to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ClientOnboarding;