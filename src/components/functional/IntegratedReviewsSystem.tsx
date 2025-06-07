import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useReviews } from '@/hooks/useReviews';
import { toast } from 'sonner';

interface RatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

const Rating: React.FC<RatingProps> = ({ rating, setRating }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 cursor-pointer ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
};

interface Review {
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

const IntegratedReviewsSystem = ({ specialistId }: { specialistId: string }) => {
  const { user } = useAuth();
  const { createReview, getSpecialistReviews } = useReviews();
  const [overallRating, setOverallRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [professionalismRating, setProfessionalismRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const specialistReviews = await getSpecialistReviews(specialistId);
        setReviews(specialistReviews);
      } catch (error: any) {
        toast.error(`Error fetching reviews: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [specialistId, getSpecialistReviews]);

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please log in to submit a review');
      return;
    }

    const reviewData = {
      client_id: user.id,
      specialist_id: specialistId,
      overall_rating: overallRating,
      service_rating: serviceRating,
      communication_rating: communicationRating,
      professionalism_rating: professionalismRating,
      comment: comment
    };

    await createReview(reviewData);
    
    // Reset form
    setOverallRating(5);
    setServiceRating(5);
    setCommunicationRating(5);
    setProfessionalismRating(5);
    setComment('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Leave a Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="overall">Overall Rating</Label>
            <Rating rating={overallRating} setRating={setOverallRating} />
          </div>
          <div>
            <Label htmlFor="service">Service Quality</Label>
            <Rating rating={serviceRating} setRating={setServiceRating} />
          </div>
          <div>
            <Label htmlFor="communication">Communication</Label>
            <Rating rating={communicationRating} setRating={setCommunicationRating} />
          </div>
          <div>
            <Label htmlFor="professionalism">Professionalism</Label>
            <Rating rating={professionalismRating} setRating={setProfessionalismRating} />
          </div>
          <div>
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="Write your review here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmitReview}>Submit Review</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Specialist Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading reviews...</div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-md p-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{review.overall_rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                  <p className="text-xs text-gray-500">
                    Reviewed on {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div>No reviews yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegratedReviewsSystem;