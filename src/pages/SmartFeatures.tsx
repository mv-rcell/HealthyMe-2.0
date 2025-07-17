
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Sparkles, Bell, Users, MessageSquare } from 'lucide-react';
import AppQueryAI from '@/components/AppQueryAI';
import EnhancedAIRecommendations from '@/components/smart-features/EnhancedAIRecommendations';
import RealTimeAIInsights from '@/components/smart-features/RealTimeAIInsights';
import NotificationCenter from '@/components/smart-features/NotificationCenter';
import ReferralDashboard from '@/components/smart-features/ReferralDashboard';

const SmartFeatures = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Smart AI Features</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of AI-driven healthcare insights, real-time recommendations, and intelligent assistance.
          </p>
        </div>

        <Tabs defaultValue="ai-query" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="ai-query" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Real-Time Insights
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Recommendations
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Smart Notifications
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Referral System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-query" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  AI Health Assistant
                </CardTitle>
                <CardDescription>
                  Ask any questions about the app, your health data, available services, or get personalized guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AppQueryAI />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6" />
                  Real-Time Health Insights
                </CardTitle>
                <CardDescription>
                  Get live analysis of your health data, trends, and actionable insights powered by AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RealTimeAIInsights />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6" />
                  Personalized AI Recommendations
                </CardTitle>
                <CardDescription>
                  Receive tailored health recommendations based on your profile, history, and current health status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedAIRecommendations />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-6 w-6" />
                  Smart Notification Center
                </CardTitle>
                <CardDescription>
                  Stay updated with intelligent notifications about your health, appointments, and app features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationCenter />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Referral Dashboard
                </CardTitle>
                <CardDescription>
                  Manage your referrals and help others discover quality healthcare services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReferralDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default SmartFeatures;

