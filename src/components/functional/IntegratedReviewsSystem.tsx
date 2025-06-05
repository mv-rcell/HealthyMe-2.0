import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, User, ThumbsUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useReviews } from '@/hooks/useReviews';
import { supabase } from '@/integrations/supabase/client';

interface Specialist {
  id: string;
  full_name: string;
  specialist_type: string;
  profile_picture_url?: string;
}

const IntegratedReviewsSystem = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [overallRating, setOverallRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [professionalismRating, setProfessionalismRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { reviews, createReview, getSpecialistReviews } = useReviews();
  const [specialistReviews, setSpecialistReviews] = useState<any[]>([]);
  const client_id = user?.id; 

  useEffect(() => {
    fetchSpecialists();
  }, []);

  useEffect(() => {
    if (selectedSpecialist) {
      loadSpecialistReviews();
    }
  }, [selectedSpecialist]);

  const fetchSpecialists = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'specialist')
        .not('specialist_type', 'is', null);

      if (error) throw error;
      setSpecialists(data || []);
    } catch (error: any) {
      toast.error(`Failed to fetch specialists: ${error.message}`);
    }
  };

  const loadSpecialistReviews = async () => {
    if (!selectedSpecialist) return;
    
    try {
      const reviews = await getSpecialistReviews(selectedSpecialist);
      setSpecialistReviews(reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please log in to submit a review');
      return;
    }

    if (!selectedSpecialist || overallRating === 0) {
      toast.error('Please select a specialist and provide ratings');
      return;
    }

    setLoading(true);
    try {
      await createReview({
        client_id,
        specialist_id: selectedSpecialist,
        overall_rating: overallRating,
        service_rating: serviceRating,
        communication_rating: communicationRating,
        professionalism_rating: professionalismRating,
        comment
      });
      
      // Reset form
      setSelectedSpecialist('');
      setOverallRating(0);
      setServiceRating(0);
      setCommunicationRating(0);
      setProfessionalismRating(0);
      setComment('');
      
      toast.success('Review submitted successfully!');
      loadSpecialistReviews();
    } catch (error: any) {
      toast.error(`Failed to submit review: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, label }: { rating: number; onRatingChange: (rating: number) => void; label: string }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer transition-colors ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Submit a Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Specialist</label>
            <Select value={selectedSpecialist} onValueChange={setSelectedSpecialist}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a specialist to review" />
              </SelectTrigger>
              <SelectContent>
                {specialists.map((specialist) => (
                  <SelectItem key={specialist.id} value={specialist.id}>
                    {specialist.full_name} - {specialist.specialist_type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StarRating 
              rating={overallRating} 
              onRatingChange={setOverallRating} 
              label="Overall Rating" 
            />
            <StarRating 
              rating={serviceRating} 
              onRatingChange={setServiceRating} 
              label="Service Quality" 
            />
            <StarRating 
              rating={communicationRating} 
              onRatingChange={setCommunicationRating} 
              label="Communication" 
            />
            <StarRating 
              rating={professionalismRating} 
              onRatingChange={setProfessionalismRating} 
              label="Professionalism" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this specialist..."
              rows={4}
            />
          </div>

          <Button onClick={handleSubmitReview} disabled={loading} className="w-full">
            <MessageSquare className="h-4 w-4 mr-2" />
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </CardContent>
      </Card>

      {/* Reviews Display */}
      {selectedSpecialist && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Reviews for {specialists.find(s => s.id === selectedSpecialist)?.full_name}</CardTitle>
          </CardHeader>
          <CardContent>
            {specialistReviews.length > 0 ? (
              <div className="space-y-4">
                {specialistReviews.map((review) => (
                  <div key={review.id} className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.overall_rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                          {review.is_verified && (
                            <Badge variant="secondary" className="text-xs">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        {review.comment && (
                          <p className="text-sm text-foreground">{review.comment}</p>
                        )}
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Service: {review.service_rating}/5</span>
                          <span>Communication: {review.communication_rating}/5</span>
                          <span>Professionalism: {review.professionalism_rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No reviews yet</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IntegratedReviewsSystem;