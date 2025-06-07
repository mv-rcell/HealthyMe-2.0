import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import VirtualChat from './VirtualChat';
import HabitTracker from './HabitTracker';
import HealthDashboard from './HealthDashboard';
import HealthPrograms from './HealthPrograms';
import IntegratedHomeCareBooking from './IntegratedHomeCareBooking';
import IntegratedSpecialistSearch from './IntegratedSpecialistSearch';
import IntegratedReviewsSystem from './IntegratedReviewsSystem';
import IntegratedLabTestBooking from './IntegratedLabTestBooking';

const FunctionalFeatures = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">Try Our Features</h2>
        <p className="text-muted-foreground text-base">
          Experience the full functionality of our comprehensive health platform
        </p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <div className="overflow-x-auto mb-6">
          <TabsList className="inline-flex gap-2">
            <TabsTrigger value="chat" className="text-sm px-4 py-2 rounded-md border hover:bg-accent">Virtual Chat</TabsTrigger>
            <TabsTrigger value="search" className="text-sm px-4 py-2 rounded-md border hover:bg-accent">Find Specialists</TabsTrigger>
            <TabsTrigger value="habits" className="text-sm px-4 py-2 rounded-md border hover:bg-accent">Habit Tracker</TabsTrigger>
            <TabsTrigger value="dashboard" className="text-sm px-4 py-2 rounded-md border hover:bg-accent">Health Dashboard</TabsTrigger>
            <TabsTrigger value="homecare" className="text-sm px-4 py-2 rounded-md border hover:bg-accent">Home Care</TabsTrigger>
            <TabsTrigger value="programs" className="text-sm px-4 py-2 rounded-md border hover:bg-accent">Programs</TabsTrigger>
            <TabsTrigger value="reviews" className="text-sm px-4 py-2 rounded-md border hover:bg-accent">Reviews</TabsTrigger>
            <TabsTrigger value="labtests" className="text-sm px-4 py-2 rounded-md border hover:bg-accent">Lab Tests</TabsTrigger>
          </TabsList>
        </div>

        {/* Each Feature */}
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Virtual Consultations</CardTitle>
              <p className="text-muted-foreground">Connect with specialists via video and chat</p>
            </CardHeader>
            <CardContent>
              <VirtualChat />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Specialist Discovery</CardTitle>
              <p className="text-muted-foreground">Find the right healthcare provider for you</p>
            </CardHeader>
            <CardContent>
              <IntegratedSpecialistSearch />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habits">
          <Card>
            <CardHeader>
              <CardTitle>Habit Tracker</CardTitle>
              <p className="text-muted-foreground">Track your daily wellness habits</p>
            </CardHeader>
            <CardContent>
              <HabitTracker />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Health Dashboard</CardTitle>
              <p className="text-muted-foreground">Monitor your health metrics and activities</p>
            </CardHeader>
            <CardContent>
              <HealthDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homecare">
          <Card>
            <CardHeader>
              <CardTitle>Home Care & On-Demand Services</CardTitle>
              <p className="text-muted-foreground">Book caregivers and therapists for home visits with real-time tracking</p>
            </CardHeader>
            <CardContent>
              <IntegratedHomeCareBooking />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs">
          <Card>
            <CardHeader>
              <CardTitle>Health Programs & Challenges</CardTitle>
              <p className="text-muted-foreground">Join 21-day programs with community leaderboards</p>
            </CardHeader>
            <CardContent>
              <HealthPrograms />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Doctor & Specialist Reviews</CardTitle>
              <p className="text-muted-foreground">Verified user feedback and comprehensive ratings</p>
            </CardHeader>
            <CardContent>
              <IntegratedReviewsSystem specialistId={''} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labtests">
          <Card>
            <CardHeader>
              <CardTitle>Test & Health Checkup Bookings</CardTitle>
              <p className="text-muted-foreground">Book lab tests with digital report delivery and automatic follow-ups</p>
            </CardHeader>
            <CardContent>
              <IntegratedLabTestBooking />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FunctionalFeatures;
