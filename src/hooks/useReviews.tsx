import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ReviewData {
  client_id: string;
  specialist_id: string;
  overall_rating: number;
  service_rating: number;
  communication_rating: number;
  professionalism_rating: number;
  comment?: string;
  appointment_id?: number;
}

export const useReviews = () => {
  const [loading, setLoading] = useState(false);

  const createReview = async (reviewData: ReviewData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Review submitted successfully!');
      return data;
    } catch (error: any) {
      toast.error(`Error submitting review: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSpecialistReviews = async (specialistId: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('specialist_id', specialistId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  };

  const getAverageRating = async (specialistId: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('overall_rating')
        .eq('specialist_id', specialistId);

      if (error) throw error;

      if (!data || data.length === 0) {
        return { avg: 0, count: 0 };
      }

      const avg = data.reduce((sum, review) => sum + review.overall_rating, 0) / data.length;
      return { avg: Number(avg.toFixed(1)), count: data.length };
    } catch (error: any) {
      console.error('Error calculating average rating:', error);
      return { avg: 0, count: 0 };
    }
  };

  return {
    loading,
    createReview,
    getSpecialistReviews,
    getAverageRating
  };
};