
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Try Our Features</h2>
        <p className="text-muted-foreground">
          Experience the full functionality of our comprehensive health platform
        </p>
      </div>

      <Tabs defaultValue="booking" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9 gap-1">
          <TabsTrigger value="chat" className="text-xs">Virtual Chat</TabsTrigger>
          <TabsTrigger value="search" className="text-xs">Find Specialists</TabsTrigger>
          <TabsTrigger value="habits" className="text-xs">Habit Tracker</TabsTrigger>
          <TabsTrigger value="dashboard" className="text-xs">Health Dashboard</TabsTrigger>
          <TabsTrigger value="homecare" className="text-xs">Home Care</TabsTrigger>
          <TabsTrigger value="programs" className="text-xs">Programs</TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs">Reviews</TabsTrigger>
          <TabsTrigger value="labtests" className="text-xs">Lab Tests</TabsTrigger>
        </TabsList>

       

        <TabsContent value="chat" className="mt-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Virtual Consultations</h3>
            <p className="text-muted-foreground">Connect with specialists via video and chat</p>
          </div>
          <VirtualChat />
        </TabsContent>

        <TabsContent value="search" className="mt-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Specialist Discovery</h3>
            <p className="text-muted-foreground">Find the right healthcare provider for you</p>
          </div>
          <IntegratedSpecialistSearch />
        </TabsContent>

        <TabsContent value="habits" className="mt-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Habit Tracker</h3>
            <p className="text-muted-foreground">Track your daily wellness habits</p>
          </div>
          <HabitTracker />
        </TabsContent>

        <TabsContent value="dashboard" className="mt-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Health Dashboard</h3>
            <p className="text-muted-foreground">Monitor your health metrics and activities</p>
          </div>
          <HealthDashboard />
        </TabsContent>

        <TabsContent value="homecare" className="mt-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Home Care & On-Demand Services</h3>
            <p className="text-muted-foreground">Book caregivers and therapists for home visits with real-time tracking</p>
          </div>
          <IntegratedHomeCareBooking />
        </TabsContent>

        <TabsContent value="programs" className="mt-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Health Programs & Challenges</h3>
            <p className="text-muted-foreground">Join 21-day programs with community leaderboards</p>
          </div>
          <HealthPrograms />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Doctor & Specialist Reviews</h3>
            <p className="text-muted-foreground">Verified user feedback and comprehensive ratings</p>
          </div>
          <IntegratedReviewsSystem />
        </TabsContent>

        <TabsContent value="labtests" className="mt-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Test & Health Checkup Bookings</h3>
            <p className="text-muted-foreground">Book lab tests with digital report delivery and automatic follow-ups</p>
          </div>
          <IntegratedLabTestBooking />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FunctionalFeatures;