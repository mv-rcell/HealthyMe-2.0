
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import HealthDashboard from './HealthDashboard';
import IntegratedSpecialistSearch from '../../pages/IntegratedSpecialistSearch';
import VirtualChat from '../../pages/VirtualChat';
import IntegratedLabTestBooking from '../../pages/IntegratedLabTestBooking';
import IntegratedHomeCareBooking from '../../pages/IntegratedHomeCareBooking';
import IntegratedReviewsSystem from './IntegratedReviewsSystem';
import HabitTracker from '../../pages/HabitTracker';
import HealthPrograms from '../../pages/HealthPrograms';

const FunctionalFeatures = () => {
  return (
    <div className="w-full max-w-7xl mx-auto mobile-padding py-6 space-y-6 mobile-safe-area">
      <div className="text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Health & Wellness Platform
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
          Your comprehensive healthcare companion with AI-powered insights, specialist connections, and personalized wellness tracking.
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        {/* Mobile-optimized tab navigation */}
        <div className="overflow-x-auto pb-2">
          <TabsList className="grid w-max grid-cols-4 lg:grid-cols-8 gap-1 mx-auto">
            <TabsTrigger value="dashboard" className="text-xs px-2 py-1">Dashboard</TabsTrigger>
            <TabsTrigger value="specialists" className="text-xs px-2 py-1">Specialists</TabsTrigger>
            <TabsTrigger value="booking" className="text-xs px-2 py-1">Booking</TabsTrigger>
            <TabsTrigger value="chat" className="text-xs px-2 py-1">Virtual Chat</TabsTrigger>
            <TabsTrigger value="lab-tests" className="text-xs px-2 py-1">Lab Tests</TabsTrigger>
            <TabsTrigger value="home-care" className="text-xs px-2 py-1">Home Care</TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs px-2 py-1">Reviews</TabsTrigger>
            <TabsTrigger value="wellness" className="text-xs px-2 py-1">Wellness</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="space-y-4">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle>Health Dashboard</CardTitle>
              <CardDescription>
                Track your health metrics, activities, and get AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HealthDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specialists" className="space-y-4">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle>Find Healthcare Specialists</CardTitle>
              <CardDescription>
                Search and connect with qualified healthcare professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IntegratedSpecialistSearch />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking" className="space-y-4">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle>Appointment Booking</CardTitle>
              <CardDescription>
                Schedule appointments with your preferred specialists
              </CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle>Virtual Consultation</CardTitle>
              <CardDescription>
                Connect with specialists through video calls and messaging
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VirtualChat />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab-tests" className="space-y-4">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle>Lab Test Booking</CardTitle>
              <CardDescription>
                Schedule laboratory tests and view results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IntegratedLabTestBooking />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="home-care" className="space-y-4">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle>Home Care Services</CardTitle>
              <CardDescription>
                Book healthcare services at your home
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IntegratedHomeCareBooking />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle>Reviews & Feedback</CardTitle>
              <CardDescription>
                Share and read reviews for healthcare services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IntegratedReviewsSystem specialistId="demo-specialist" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wellness" className="space-y-4">
          <div className="responsive-grid">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Habit Tracker</CardTitle>
                <CardDescription>
                  Track your daily health habits and build consistency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HabitTracker />
              </CardContent>
            </Card>
            
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Wellness Programs</CardTitle>
                <CardDescription>
                  Join structured health and wellness programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HealthPrograms />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FunctionalFeatures;