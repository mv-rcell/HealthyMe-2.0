import React, { useState, useEffect } from 'react';
import { Brain, Activity, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useLabTests } from '@/hooks/useLabTests';
import { useRealSpecialists } from '@/hooks/useRealSpecialists';
import { useRealtimeData } from '@/hooks/useRealTimeData';
import { supabase } from '@/integrations/supabase/client';

interface AIInsight {
  id: string;
  type: 'health_trend' | 'recommendation' | 'alert' | 'opportunity';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  actionable: boolean;
}

const RealTimeAIInsights = () => {
  const { user } = useAuth();
  const { labTests } = useLabTests();
  const { specialists } = useRealSpecialists();
  const { realtimeUpdates } = useRealtimeData();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate real-time AI insights based on current data
  const generateInsights = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const healthData = {
        labTests: labTests.length,
        completedTests: labTests.filter(t => t.status === 'completed').length,
        upcomingTests: labTests.filter(t => t.status === 'scheduled').length,
        availableSpecialists: specialists.filter(s => s.is_active).length,
        recentActivity: realtimeUpdates.slice(-5)
      };

      // Call AI analysis function
      const { data, error } = await supabase.functions.invoke('generate-health-ai', {
        body: {
          userId: user.id,
          healthData,
          analysisType: 'real_time_insights'
        }
      });

      if (error) throw error;

      // Generate contextual insights based on real data
      const newInsights: AIInsight[] = [];

      // Health trend analysis
      if (labTests.length > 0) {
        const recentTests = labTests.filter(test => {
          const testDate = new Date(test.scheduled_date);
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return testDate >= monthAgo;
        });

        if (recentTests.length >= 2) {
          newInsights.push({
            id: 'health_trend_1',
            type: 'health_trend',
            title: 'Consistent Health Monitoring',
            description: `You've scheduled ${recentTests.length} tests this month, showing excellent commitment to your health monitoring.`,
            priority: 'low',
            timestamp: new Date().toISOString(),
            actionable: false
          });
        }
      }

      // Specialist recommendations
      if (specialists.length > 0) {
        const onlineSpecialists = specialists.filter(s => s.is_online && s.is_active);
        if (onlineSpecialists.length > 0) {
          newInsights.push({
            id: 'opportunity_1',
            type: 'opportunity',
            title: 'Specialists Available Now',
            description: `${onlineSpecialists.length} qualified specialists are currently online and available for consultation.`,
            priority: 'medium',
            timestamp: new Date().toISOString(),
            actionable: true
          });
        }
      }

      // Follow-up recommendations
      const overdueFollowUps = labTests.filter(test => {
        if (!test.follow_up_date || test.follow_up_scheduled) return false;
        return new Date(test.follow_up_date) < new Date();
      });

      if (overdueFollowUps.length > 0) {
        newInsights.push({
          id: 'alert_1',
          type: 'alert',
          title: 'Follow-up Required',
          description: `You have ${overdueFollowUps.length} test(s) requiring follow-up consultation.`,
          priority: 'high',
          timestamp: new Date().toISOString(),
          actionable: true
        });
      }

      // Real-time activity insights
      if (realtimeUpdates.length > 0) {
        const recentUpdate = realtimeUpdates[realtimeUpdates.length - 1];
        if (recentUpdate.type === 'specialist' && recentUpdate.event === 'UPDATE') {
          newInsights.push({
            id: 'activity_1',
            type: 'recommendation',
            title: 'Specialist Profile Updated',
            description: 'A specialist you might be interested in has updated their availability or services.',
            priority: 'low',
            timestamp: new Date().toISOString(),
            actionable: true
          });
        }
      }

      // Add AI-generated insights if available
      if (data?.insights) {
        newInsights.push(...data.insights);
      }

      setInsights(newInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
      // Fallback to static insights if AI fails
      setInsights([
        {
          id: 'fallback_1',
          type: 'recommendation',
          title: 'Stay Healthy',
          description: 'Regular health check-ups are important for maintaining good health.',
          priority: 'medium',
          timestamp: new Date().toISOString(),
          actionable: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInsights();
    
    // Regenerate insights every 5 minutes or when data changes
    const interval = setInterval(generateInsights, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user, labTests, specialists, realtimeUpdates]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'health_trend': return <TrendingUp className="h-4 w-4" />;
      case 'recommendation': return <Brain className="h-4 w-4" />;
      case 'alert': return <AlertCircle className="h-4 w-4" />;
      case 'opportunity': return <Zap className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Real-Time AI Health Insights
          {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="border border-border rounded-lg p-4 bg-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority} priority
                        </Badge>
                        {insight.actionable && (
                          <Badge variant="outline">Actionable</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(insight.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            {loading ? 'Analyzing your health data...' : 'No insights available at the moment'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeAIInsights;
