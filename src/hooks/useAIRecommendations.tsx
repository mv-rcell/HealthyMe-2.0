
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAIRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendation = async (data: { type: string; data: any }) => {
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
        return generateEnhancedFallbackRecommendation(data);
      }

      console.log('AI recommendation result:', result);
      return result?.recommendation || generateEnhancedFallbackRecommendation(data);
    } catch (err: any) {
      console.error('AI recommendation error:', err);
      setError(err.message);
      return generateEnhancedFallbackRecommendation(data);
    } finally {
      setLoading(false);
    }
  };

  const generateCarePlan = async (healthGoals: string, currentConditions: string) => {
    return await generateRecommendation({
      type: 'care_plan',
      data: { healthGoals, currentConditions }
    });
  };

  const analyzeSymptoms = async (symptoms: string) => {
    return await generateRecommendation({
      type: 'symptom_analysis',
      data: { symptoms }
    });
  };

  const recommendSpecialist = async (symptoms: string) => {
    return await generateRecommendation({
      type: 'specialist',
      data: { symptoms }
    });
  };

  const generateEnhancedFallbackRecommendation = (data: { type: string; data: any }) => {
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

  const generateSpecialistRecommendation = (symptoms: string) => {
    const symptomsLower = symptoms.toLowerCase();
    let recommendations = [];

    // Heart-related symptoms
    if (symptomsLower.includes('chest pain') || symptomsLower.includes('heart') || symptomsLower.includes('palpitation')) {
      recommendations.push({
        specialist: 'Cardiologist',
        reason: 'For evaluation of chest pain and heart-related symptoms',
        urgency: 'High - seek immediate attention if severe'
      });
    }

    // Respiratory symptoms
    if (symptomsLower.includes('cough') || symptomsLower.includes('breathing') || symptomsLower.includes('shortness of breath')) {
      recommendations.push({
        specialist: 'Pulmonologist',
        reason: 'For evaluation of respiratory symptoms',
        urgency: 'Medium - schedule within a week'
      });
    }

    // Skin issues
    if (symptomsLower.includes('rash') || symptomsLower.includes('skin') || symptomsLower.includes('itching')) {
      recommendations.push({
        specialist: 'Dermatologist',
        reason: 'For skin condition evaluation and treatment',
        urgency: 'Low - can be scheduled within 2 weeks'
      });
    }

    // Digestive issues
    if (symptomsLower.includes('stomach') || symptomsLower.includes('abdominal') || symptomsLower.includes('nausea')) {
      recommendations.push({
        specialist: 'Gastroenterologist',
        reason: 'For digestive system evaluation',
        urgency: 'Medium - schedule within a week'
      });
    }

    // Mental health
    if (symptomsLower.includes('anxiety') || symptomsLower.includes('depression') || symptomsLower.includes('stress')) {
      recommendations.push({
        specialist: 'Psychiatrist/Psychologist',
        reason: 'For mental health evaluation and support',
        urgency: 'Medium - important for overall wellbeing'
      });
    }

    // Default to general practitioner
    if (recommendations.length === 0) {
      recommendations.push({
        specialist: 'General Practitioner',
        reason: 'For initial evaluation and diagnosis',
        urgency: 'Medium - good starting point for any health concern'
      });
    }

    let response = `**Specialist Recommendations Based on Your Symptoms: "${symptoms}"**\n\n`;
    
    recommendations.forEach((rec, index) => {
      response += `**${index + 1}. ${rec.specialist}**\n`;
      response += `• Reason: ${rec.reason}\n`;
      response += `• Priority: ${rec.urgency}\n\n`;
    });

    response += `**Next Steps:**\n`;
    response += `• Book an appointment through our platform\n`;
    response += `• Prepare a list of all symptoms and their duration\n`;
    response += `• Bring any relevant medical history or medications\n\n`;
    response += `**Important:** This is AI-generated guidance. Please consult healthcare professionals for proper medical evaluation.`;

    return response;
  };

  const generateCarePlanRecommendation = (healthGoals: string, currentConditions: string) => {
    return `**Personalized Care Plan**\n\n**Your Health Goals:** ${healthGoals}\n**Current Conditions:** ${currentConditions}\n\n**Recommended Action Plan:**\n\n**1. Immediate Steps (Next 1-2 weeks)**\n• Schedule initial consultation with relevant specialists\n• Complete baseline health assessments\n• Start symptom tracking diary\n\n**2. Short-term Goals (1-3 months)**\n• Establish regular check-up schedule\n• Implement lifestyle modifications\n• Begin recommended treatments or therapies\n\n**3. Long-term Objectives (3-12 months)**\n• Monitor progress toward health goals\n• Adjust treatment plans as needed\n• Focus on preventive care measures\n\n**Recommended Specialists to Consult:**\n• Primary Care Physician for overall health assessment\n• Relevant specialists based on your conditions\n• Nutritionist for dietary guidance\n\n**Note:** This is a general framework. Please consult with healthcare professionals for personalized medical advice.`;
  };

  const generateSymptomAnalysis = (symptoms: string) => {
    const symptomsLower = symptoms.toLowerCase();
    let severity = 'Low';
    let urgency = 'Schedule within 2 weeks';
    
    // Determine severity
    if (symptomsLower.includes('severe') || symptomsLower.includes('intense') || symptomsLower.includes('chest pain')) {
      severity = 'High';
      urgency = 'Seek immediate medical attention';
    } else if (symptomsLower.includes('moderate') || symptomsLower.includes('persistent') || symptomsLower.includes('worsening')) {
      severity = 'Medium';
      urgency = 'Schedule within 1 week';
    }

    return `**Symptom Analysis Report**\n\n**Symptoms Reported:** ${symptoms}\n\n**Preliminary Assessment:**\n• Severity Level: ${severity}\n• Recommended Timeline: ${urgency}\n\n**General Recommendations:**\n• Keep a detailed symptom diary\n• Note triggers, timing, and associated factors\n• Monitor for any changes or worsening\n\n**When to Seek Immediate Care:**\n• If symptoms suddenly worsen\n• If you experience difficulty breathing\n• If you have severe pain or discomfort\n• If symptoms interfere with daily activities\n\n**Next Steps:**\n• Book consultation with appropriate specialist\n• Prepare comprehensive symptom history\n• Consider bringing a support person to appointment\n\n**Important Disclaimer:** This analysis is for informational purposes only. Please consult qualified healthcare professionals for proper medical evaluation and diagnosis.`;
  };

  return {
    generateRecommendation,
    generateCarePlan,
    analyzeSymptoms,
    recommendSpecialist,
    loading,
    error
  };
};