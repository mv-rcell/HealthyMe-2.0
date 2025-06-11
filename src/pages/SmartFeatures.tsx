
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIRecommendations from '@/components/smart-features/AIRecommendations';
import NotificationCenter from '@/components/smart-features/NotificationCenter.tsx';
import ReferralDashboard from '@/components/smart-features/ReferralDashboard';

const SmartFeatures = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold">Smart Health Features</h1>
            <p className="text-xl text-muted-foreground">
              AI-powered tools and intelligent features to enhance your healthcare experience
            </p>
          </div>

          <Tabs defaultValue="ai-recommendations" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ai-recommendations">AI Recommendations</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="referrals">Referrals & Rewards</TabsTrigger>
            </TabsList>

            <TabsContent value="ai-recommendations" className="mt-6">
              <AIRecommendations />
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <NotificationCenter />
            </TabsContent>

            <TabsContent value="referrals" className="mt-6">
              <ReferralDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SmartFeatures;