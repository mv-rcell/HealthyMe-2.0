
import React, { useState } from 'react';
import { Brain, Sparkles, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';

const AIRecommendations = () => {
  const [healthGoals, setHealthGoals] = useState('');
  const [currentConditions, setCurrentConditions] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [recommendation, setRecommendation] = useState('');
  
  const { loading, generateCarePlan, analyzeSymptoms } = useAIRecommendations();

  const handleGenerateCarePlan = async () => {
    const plan = await generateCarePlan(healthGoals, currentConditions);
    if (plan) {
      setRecommendation(plan);
    }
  };

  const handleAnalyzeSymptoms = async () => {
    const analysis = await analyzeSymptoms(symptoms);
    if (analysis) {
      setRecommendation(analysis);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Care Plan Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Health Goals</label>
            <Textarea
              placeholder="Describe your health and wellness goals..."
              value={healthGoals}
              onChange={(e) => setHealthGoals(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Current Conditions</label>
            <Textarea
              placeholder="Any current health conditions or medications..."
              value={currentConditions}
              onChange={(e) => setCurrentConditions(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleGenerateCarePlan}
            disabled={loading || !healthGoals.trim()}
            className="w-full"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? 'Generating...' : 'Generate Personalized Care Plan'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Symptom Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Symptoms</label>
            <Textarea
              placeholder="Describe your symptoms in detail..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleAnalyzeSymptoms}
            disabled={loading || !symptoms.trim()}
            className="w-full"
          >
            <Brain className="h-4 w-4 mr-2" />
            {loading ? 'Analyzing...' : 'Get AI Analysis'}
          </Button>
        </CardContent>
      </Card>

      {recommendation && (
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{recommendation}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIRecommendations;