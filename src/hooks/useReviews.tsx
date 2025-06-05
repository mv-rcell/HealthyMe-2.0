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
      setReviews((data || []) as Review[]);
    } catch (error: any) {
      toast.error(`Error fetching reviews: ${error.message}`);
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
      return (data || []) as Review[];
    } catch (error: any) {
      console.error('Error fetching specialist reviews:', error);
      return [];
    }
  };

  const createReview = async (reviewData: Omit<Review, 'id' | 'created_at' | 'is_verified'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          ...reviewData,
          client_id: user.id,
          is_verified: true
        }])
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

  const getSpecialistRating = (specialistId: string) => {
    const specialistReviews = reviews.filter(r => r.specialist_id === specialistId);
    if (specialistReviews.length === 0) return 0;
    
    const totalRating = specialistReviews.reduce((sum, review) => sum + review.overall_rating, 0);
    return Math.round((totalRating / specialistReviews.length) * 10) / 10;
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews,
    loading,
    createReview,
    fetchReviews,
    getSpecialistReviews,
    getSpecialistRating
  };
};
