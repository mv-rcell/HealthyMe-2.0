import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Review {
  id: string;
  client_id: string;
  specialist_id: string;
  appointment_id?: number;
  overall_rating: number;
  service_rating: number;
  communication_rating: number;
  professionalism_rating: number;
  comment?: string;
  is_verified: boolean;
  created_at: string;
}

export const useReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async (specialistId?: string) => {
    setLoading(true);
    try {
      let query = supabase.from('reviews').select('*');
      
      if (specialistId) {
        query = query.eq('specialist_id', specialistId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      toast.error(`Error fetching reviews: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData: Omit<Review, 'id' | 'is_verified' | 'created_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{ ...reviewData, client_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Review submitted successfully!');
      fetchReviews();
      return data;
    } catch (error: any) {
      toast.error(`Error submitting review: ${error.message}`);
      return null;
    }
  };

  const getSpecialistRating = async (specialistId: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('overall_rating')
        .eq('specialist_id', specialistId);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const average = data.reduce((sum, review) => sum + review.overall_rating, 0) / data.length;
        return Math.round(average * 10) / 10;
      }
      return 0;
    } catch (error: any) {
      console.error('Error calculating rating:', error);
      return 0;
    }
  };

  return {
    reviews,
    loading,
    createReview,
    fetchReviews,
    getSpecialistRating
  };
};