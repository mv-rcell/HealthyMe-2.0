import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for better type safety
interface RecommendationData {
  type: string;
  data: any;
}

interface SpecialistRecommendation {
  specialist: string;
  reason: string;
  urgency: string;
  priority?: 'high' | 'medium' | 'low';
}

interface SymptomKeywords {
  [key: string]: {
    specialists: string[];
    urgency: 'high' | 'medium' | 'low';
    keywords: string[];
  };
}

export const useAIRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Symptom mapping configuration for better maintainability
  const symptomMappings: SymptomKeywords = {
    cardiac: {
      specialists: ['Cardiologist'],
      urgency: 'high',
      keywords: ['chest pain', 'heart', 'palpitation', 'cardiac', 'angina', 'heart attack']
    },
    respiratory: {
      specialists: ['Pulmonologist'],
      urgency: 'medium',
      keywords: ['cough', 'breathing', 'shortness of breath', 'asthma', 'pneumonia', 'lung']
    },
    dermatological: {
      specialists: ['Dermatologist'],
      urgency: 'low',
      keywords: ['rash', 'skin', 'itching', 'eczema', 'psoriasis', 'acne', 'mole']
    },
    gastrointestinal: {
      specialists: ['Gastroenterologist'],
      urgency: 'medium',
      keywords: ['stomach', 'abdominal', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'bloating']
    },
    mental_health: {
      specialists: ['Psychiatrist', 'Psychologist'],
      urgency: 'medium',
      keywords: ['anxiety', 'depression', 'stress', 'panic', 'mood', 'mental health']
    },
    neurological: {
      specialists: ['Neurologist'],
      urgency: 'high',
      keywords: ['headache', 'migraine', 'seizure', 'dizziness', 'numbness', 'tremor']
    },
    orthopedic: {
      specialists: ['Orthopedist'],
      urgency: 'medium',
      keywords: ['joint pain', 'back pain', 'fracture', 'sprain', 'arthritis', 'bone']
    }
  };

  const generateRecommendation = useCallback(async (data: RecommendationData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Generating AI recommendation:', data);
      
      const { data: result, error } = await supabase.functions.invoke('generate-health-ai', {
        body: { 
          type: data.type,
          ...data.data 
        }
      });

      if (error) {
        console.error('AI function error:', error);
        toast.error('AI service temporarily unavailable, using enhanced fallback recommendations');
        return generateEnhancedFallbackRecommendation(data);
      }

      console.log('AI recommendation result:', result);
      return result?.recommendation || generateEnhancedFallbackRecommendation(data);
    } catch (err: any) {
      console.error('AI recommendation error:', err);
      setError(err.message);
      toast.error('Error generating recommendation, using fallback analysis');
      return generateEnhancedFallbackRecommendation(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateCarePlan = useCallback(async (healthGoals: string, currentConditions: string) => {
    if (!healthGoals.trim() || !currentConditions.trim()) {
      toast.error('Please provide both health goals and current conditions');
      return null;
    }

    return await generateRecommendation({
      type: 'care_plan',
      data: { healthGoals, currentConditions }
    });
  }, [generateRecommendation]);

  const analyzeSymptoms = useCallback(async (symptoms: string) => {
    if (!symptoms.trim()) {
      toast.error('Please provide symptom details for analysis');
      return null;
    }

    return await generateRecommendation({
      type: 'symptom_analysis',
      data: { symptoms }
    });
  }, [generateRecommendation]);

  const recommendSpecialist = useCallback(async (symptoms: string) => {
    if (!symptoms.trim()) {
      toast.error('Please provide symptoms to get specialist recommendations');
      return null;
    }

    return await generateRecommendation({
      type: 'specialist',
      data: { symptoms }
    });
  }, [generateRecommendation]);

  const generateEnhancedFallbackRecommendation = (data: RecommendationData) => {
    console.log('Using enhanced fallback AI recommendation for:', data.type);
    
    switch (data.type) {
      case 'specialist':
        return generateSpecialistRecommendation(data.data.symptoms);
      case 'care_plan':
        return generateCarePlanRecommendation(data.data.healthGoals, data.data.currentConditions);
      case 'symptom_analysis':
        return generateSymptomAnalysis(data.data.symptoms);
      default:
        return 'AI recommendation service is being updated. Please try again later or consult with our specialists directly.';
    }
  };

  const analyzeSymptomSeverity = (symptoms: string): { severity: string; urgency: string; priority: 'high' | 'medium' | 'low' } => {
    const symptomsLower = symptoms.toLowerCase();
    
    // High priority indicators
    if (symptomsLower.includes('severe') || 
        symptomsLower.includes('intense') || 
        symptomsLower.includes('chest pain') ||
        symptomsLower.includes('difficulty breathing') ||
        symptomsLower.includes('seizure') ||
        symptomsLower.includes('unconscious')) {
      return {
        severity: 'High',
        urgency: 'Seek immediate medical attention or call emergency services',
        priority: 'high'
      };
    }
    
    // Medium priority indicators
    if (symptomsLower.includes('moderate') || 
        symptomsLower.includes('persistent') || 
        symptomsLower.includes('worsening') ||
        symptomsLower.includes('fever') ||
        symptomsLower.includes('pain')) {
      return {
        severity: 'Medium',
        urgency: 'Schedule appointment within 1-3 days',
        priority: 'medium'
      };
    }
    
    return {
      severity: 'Low to Medium',
      urgency: 'Schedule within 1-2 weeks',
      priority: 'low'
    };
  };

  const generateSpecialistRecommendation = (symptoms: string): string => {
    const symptomsLower = symptoms.toLowerCase();
    const recommendations: SpecialistRecommendation[] = [];

    // Analyze symptoms against mappings
    Object.entries(symptomMappings).forEach(([category, config]) => {
      const hasSymptom = config.keywords.some(keyword => symptomsLower.includes(keyword));
      
      if (hasSymptom) {
        config.specialists.forEach(specialist => {
          recommendations.push({
            specialist,
            reason: `For evaluation of ${category.replace('_', ' ')} symptoms`,
            urgency: config.urgency === 'high' ? 'High - seek immediate attention if severe' :
                    config.urgency === 'medium' ? 'Medium - schedule within a week' :
                    'Low - can be scheduled within 2 weeks',
            priority: config.urgency
          });
        });
      }
    });

    // Remove duplicates and sort by priority
    const uniqueRecommendations = recommendations.filter((rec, index, self) => 
      index === self.findIndex(r => r.specialist === rec.specialist)
    ).sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority || 'low'] - priorityOrder[b.priority || 'low'];
    });

    // Default to General Practitioner if no specific matches
    if (uniqueRecommendations.length === 0) {
      uniqueRecommendations.push({
        specialist: 'General Practitioner',
        reason: 'For initial evaluation and comprehensive diagnosis',
        urgency: 'Medium - good starting point for any health concern'
      });
    }

    let response = `**Specialist Recommendations Based on Your Symptoms: "${symptoms}"**\n\n`;
    
    uniqueRecommendations.forEach((rec, index) => {
      response += `**${index + 1}. ${rec.specialist}**\n`;
      response += `• Reason: ${rec.reason}\n`;
      response += `• Priority: ${rec.urgency}\n\n`;
    });

    response += `**Next Steps:**\n`;
    response += `• Book an appointment through our platform\n`;
    response += `• Prepare a detailed list of symptoms, duration, and severity\n`;
    response += `• Gather relevant medical history and current medications\n`;
    response += `• Consider keeping a symptom diary until your appointment\n\n`;
    response += `**Important:** This is AI-generated guidance based on symptom keywords. Please consult healthcare professionals for proper medical evaluation and diagnosis.`;

    return response;
  };

  const generateCarePlanRecommendation = (healthGoals: string, currentConditions: string): string => {
    const timeline = {
      immediate: "Next 1-2 weeks",
      shortTerm: "1-3 months", 
      longTerm: "3-12 months"
    };

    return `**Personalized Care Plan**\n\n**Your Health Goals:** ${healthGoals}\n**Current Conditions:** ${currentConditions}\n\n**Recommended Action Plan:**\n\n**1. Immediate Steps (${timeline.immediate})**\n• Schedule comprehensive health assessment with primary care physician\n• Complete baseline health screenings relevant to your conditions\n• Start detailed symptom and wellness tracking\n• Research and identify specialists if needed\n\n**2. Short-term Goals (${timeline.shortTerm})**\n• Establish regular monitoring schedule with healthcare team\n• Implement evidence-based lifestyle modifications\n• Begin recommended treatments, therapies, or interventions\n• Set up support systems (family, friends, support groups)\n\n**3. Long-term Objectives (${timeline.longTerm})**\n• Regular progress evaluation and plan adjustments\n• Focus on sustainable lifestyle changes\n• Preventive care and health maintenance\n• Achievement of specific health milestones\n\n**Recommended Healthcare Team:**\n• Primary Care Physician - overall health coordination\n• Specialists relevant to your specific conditions\n• Nutritionist/Dietitian - dietary guidance and meal planning\n• Mental Health Professional - emotional wellbeing support\n• Physical Therapist - if mobility or pain management needed\n\n**Monitoring & Evaluation:**\n• Monthly progress reviews for first 3 months\n• Quarterly assessments thereafter\n• Regular biomarker tracking as appropriate\n• Quality of life and symptom severity measurements\n\n**Important Note:** This is a general framework tailored to your inputs. Please work with qualified healthcare professionals to develop a detailed, medically appropriate care plan.`;
  };

  const generateSymptomAnalysis = (symptoms: string): string => {
    const { severity, urgency, priority } = analyzeSymptomSeverity(symptoms);
    
    const redFlags = [
      'If symptoms suddenly worsen or become severe',
      'If you experience difficulty breathing or chest pain',
      'If you have severe, uncontrolled pain',
      'If symptoms significantly interfere with daily activities',
      'If you develop fever, confusion, or loss of consciousness'
    ];

    return `**Symptom Analysis Report**\n\n**Symptoms Reported:** ${symptoms}\n\n**Preliminary Assessment:**\n• Severity Level: ${severity}\n• Recommended Timeline: ${urgency}\n• Priority Classification: ${priority.toUpperCase()}\n\n**Symptom Tracking Recommendations:**\n• Document symptom onset, duration, and triggers\n• Rate severity on a scale of 1-10\n• Note associated symptoms or circumstances\n• Track any medications or treatments tried\n• Monitor patterns (time of day, activities, etc.)\n\n**When to Seek Immediate Care:**\n${redFlags.map(flag => `• ${flag}`).join('\n')}\n\n**Preparation for Healthcare Visit:**\n• Compile comprehensive symptom history\n• List all current medications and supplements\n• Prepare questions about diagnosis and treatment options\n• Consider bringing a trusted person for support\n• Gather any relevant medical records or test results\n\n**Self-Care While Awaiting Appointment:**\n• Stay hydrated and maintain nutrition\n• Get adequate rest\n• Avoid known triggers if identified\n• Practice stress management techniques\n• Follow any previously given medical advice\n\n**Important Medical Disclaimer:** This analysis is for informational and educational purposes only. It does not constitute medical advice, diagnosis, or treatment. Please consult qualified healthcare professionals for proper medical evaluation, diagnosis, and treatment recommendations.`;
  };

  return {
    recommendSpecialist,
    generateCarePlan,
    analyzeSymptoms,
    loading,
    error,
  };
};