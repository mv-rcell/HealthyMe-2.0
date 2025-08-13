
import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Activity, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useLabTests } from '@/hooks/useLabTests';
import { useRealSpecialists } from '@/hooks/useRealSpecialists';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Recommendation {
  id: string;
  category: 'health' | 'wellness' | 'preventive' | 'specialist';
  title: string;
  description: string;
  actionText: string;
  priority: 'low' | 'medium' | 'high';
  relevanceScore: number;
  metadata?: any;
}

const EnhancedAIRecommendations = () => {
  const { user, profile } = useAuth();
  const { labTests } = useLabTests();
  const { specialists } = useRealSpecialists();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const generatePersonalizedRecommendations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Gather user context with safe property access
      const userContext = {
        profile: {
          role: profile?.role || 'client',
          membershipTier: profile?.membership_tier || null,
          specialistType: profile?.specialist_type || null,
          experience: profile?.experience || null
        },
        healthHistory: {
          totalTests: labTests.length,
          recentTests: labTests.filter(test => {
            const testDate = new Date(test.scheduled_date);
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            return testDate >= threeMonthsAgo;
          }),
          completedTests: labTests.filter(t => t.status === 'completed'),
          pendingFollowUps: labTests.filter(t => t.follow_up_scheduled && !t.follow_up_date)
        },
        availableResources: {
          nearbySpecialists: specialists.filter(s => s.is_active),
          onlineSpecialists: specialists.filter(s => s.is_online && s.is_active)
        }
      };

      const newRecommendations: Recommendation[] = [];

      // Health screening recommendations
      if (labTests.length === 0) {
        newRecommendations.push({
          id: 'health_screening_start',
          category: 'preventive',
          title: 'Start Your Health Journey',
          description: 'Begin with a comprehensive health screening to establish your health baseline.',
          actionText: 'Book Basic Health Panel',
          priority: 'high',
          relevanceScore: 0.9,
          metadata: { testType: 'Blood Test (Complete)' }
        });
      }

      // Follow-up recommendations
      const completedTestsNeedingFollowUp = labTests.filter(test => 
        test.status === 'completed' && 
        !test.follow_up_scheduled &&
        new Date(test.scheduled_date) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );

      if (completedTestsNeedingFollowUp.length > 0) {
        newRecommendations.push({
          id: 'follow_up_needed',
          category: 'health',
          title: 'Schedule Follow-Up Consultations',
          description: `You have ${completedTestsNeedingFollowUp.length} completed test(s) that may benefit from follow-up consultation.`,
          actionText: 'Schedule Follow-Up',
          priority: 'medium',
          relevanceScore: 0.8,
          metadata: { tests: completedTestsNeedingFollowUp }
        });
      }

      // Specialist recommendations based on test history
      const testTypes = labTests.map(test => test.test_name);
      if (testTypes.includes('ECG') || testTypes.includes('Cholesterol Test')) {
        const cardiologists = specialists.filter(s => 
          s.specialist_type?.toLowerCase().includes('cardio') && s.is_active
        );
        if (cardiologists.length > 0) {
          newRecommendations.push({
            id: 'cardio_specialist',
            category: 'specialist',
            title: 'Cardiovascular Health Consultation',
            description: 'Based on your cardiac tests, consider a consultation with a cardiovascular specialist.',
            actionText: 'Find Cardiologist',
            priority: 'medium',
            relevanceScore: 0.7,
            metadata: { specialistType: 'cardiologist', count: cardiologists.length }
          });
        }
      }

      // Wellness recommendations
      if (labTests.length >= 3) {
        newRecommendations.push({
          id: 'wellness_maintenance',
          category: 'wellness',
          title: 'Maintain Your Health Momentum',
          description: 'You\'re doing great with regular health monitoring! Consider adding wellness coaching to optimize your health.',
          actionText: 'Explore Wellness Programs',
          priority: 'low',
          relevanceScore: 0.6,
          metadata: { programs: ['nutrition', 'fitness', 'mental_health'] }
        });
      }

      // Seasonal health recommendations
      const currentMonth = new Date().getMonth();
      if (currentMonth >= 9 || currentMonth <= 2) { // Oct-Feb (flu season)
        newRecommendations.push({
          id: 'seasonal_health',
          category: 'preventive',
          title: 'Seasonal Health Protection',
          description: 'Flu season is here. Consider immune system support and preventive health measures.',
          actionText: 'Book Immune Panel',
          priority: 'medium',
          relevanceScore: 0.5,
          metadata: { season: 'flu_season', tests: ['Complete Blood Count', 'Vitamin D Level'] }
        });
      }

      // Membership-based recommendations
      if (!profile?.membership_tier) {
        newRecommendations.push({
          id: 'membership_upgrade',
          category: 'wellness',
          title: 'Unlock Premium Health Features',
          description: 'Get access to advanced health tracking, priority bookings, and exclusive specialist consultations.',
          actionText: 'View Membership Plans',
          priority: 'low',
          relevanceScore: 0.4,
          metadata: { upgrade: 'premium' }
        });
      }

      // Sort by relevance score and priority
      newRecommendations.sort((a, b) => {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityWeight[a.priority];
        const bPriority = priorityWeight[b.priority];
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        return b.relevanceScore - a.relevanceScore;
      });

      setRecommendations(newRecommendations.slice(0, 6));
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback recommendations
      setRecommendations([
        {
          id: 'fallback_1',
          category: 'health',
          title: 'Regular Health Check-ups',
          description: 'Schedule regular health screenings to maintain optimal health.',
          actionText: 'Book Health Screening',
          priority: 'medium',
          relevanceScore: 0.5
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePersonalizedRecommendations();
  }, [user, labTests, specialists, profile]);

  const handleRecommendationAction = (recommendation: Recommendation) => {
    switch (recommendation.category) {
      case 'preventive':
      case 'health':
        toast.success(`Redirecting to book ${recommendation.metadata?.testType || 'health screening'}...`);
        // Navigate to lab test booking
        window.location.href = '/smart-features';
        break;
      case 'specialist':
        toast.success(`Finding ${recommendation.metadata?.specialistType || 'specialists'}...`);
        // Navigate to specialist search
        window.location.href = '/specialists';
        break;
      case 'wellness':
        if (recommendation.id === 'membership_upgrade') {
          toast.success('Redirecting to membership plans...');
          window.location.href = '/membership';
        } else {
          toast.success('Exploring wellness programs...');
        }
        break;
      default:
        toast.success('Taking recommended action...');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return <Heart className="h-4 w-4" />;
      case 'wellness': return <Activity className="h-4 w-4" />;
      case 'preventive': return <Calendar className="h-4 w-4" />;
      case 'specialist': return <TrendingUp className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Personalized AI Recommendations
          {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <div key={recommendation.id} className="border border-border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getCategoryIcon(recommendation.category)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{recommendation.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          {recommendation.priority} priority
                        </Badge>
                        <Badge variant="outline">
                          {Math.round(recommendation.relevanceScore * 100)}% relevant
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => handleRecommendationAction(recommendation)}
                          className="ml-auto"
                        >
                          {recommendation.actionText}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            {loading ? 'Generating personalized recommendations...' : 'No recommendations available at the moment'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedAIRecommendations;