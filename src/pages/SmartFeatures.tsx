
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIRecommendations from "@/components/smart-features/AIRecommendations";
import AppQueryAI from "@/components/AppQueryAI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, MessageCircle, Sparkles } from "lucide-react";

const SmartFeatures = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              Smart AI Features
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Leverage the power of artificial intelligence to enhance your health journey with personalized recommendations and instant app assistance.
            </p>
          </div>

          <div className="grid gap-8">
            {/* App Query AI */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Ask About HealthyMe
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Get instant answers about app features, how to book appointments, find specialists, and more.
                </p>
              </CardHeader>
              <CardContent>
                <AppQueryAI />
              </CardContent>
            </Card>

            {/* Health AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Health Recommendations
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Get personalized health guidance, care plans, and symptom analysis powered by advanced AI.
                </p>
              </CardHeader>
              <CardContent>
                <AIRecommendations />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SmartFeatures;
