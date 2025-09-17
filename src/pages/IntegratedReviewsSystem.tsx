import React, { useState, useEffect } from 'react';
import { Star, Search, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useReviews } from '@/hooks/useReviews';
import { useRealSpecialists } from '@/hooks/useRealSpecialists';
import { toast } from 'sonner';

interface RatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

const Rating: React.FC<RatingProps> = ({ rating, setRating }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-5 w-5 cursor-pointer ${
          star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
        }`}
        onClick={() => setRating(star)}
      />
    ))}
  </div>
);

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

interface Specialist {
  id: string;
  full_name: string | null;
  specialist_type: string | null;
  profile_picture_url: string | null;
  verification_status: string | null;
}

const IntegratedReviewsSystem = () => {
  const { user } = useAuth();
  const { createReview, getSpecialistReviews } = useReviews();
  const { specialists } = useRealSpecialists();
  
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [overallRating, setOverallRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [professionalismRating, setProfessionalismRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredSpecialists = specialists.filter(specialist =>
    specialist.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    specialist.specialist_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSpecialist = specialists.find(s => s.id === selectedSpecialistId);

  useEffect(() => {
    if (selectedSpecialistId) {
      const fetchReviews = async () => {
        setLoading(true);
        try {
          const specialistReviews = await getSpecialistReviews(selectedSpecialistId);
          setReviews(specialistReviews);
        } catch (error: any) {
          toast.error(`Error fetching reviews: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchReviews();
    } else {
      setReviews([]);
    }
  }, [selectedSpecialistId, getSpecialistReviews]);

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please log in to submit a review');
      return;
    }

    if (!selectedSpecialistId) {
      toast.error('Please select a specialist to review');
      return;
    }

    const reviewData = {
      client_id: user.id,
      specialist_id: selectedSpecialistId,
      overall_rating: overallRating,
      service_rating: serviceRating,
      communication_rating: communicationRating,
      professionalism_rating: professionalismRating,
      comment: comment,
    };

    const newReview = await createReview(reviewData);

    if (newReview) {
      setReviews((prev) => [newReview, ...prev]);
      setOverallRating(5);
      setServiceRating(5);
      setCommunicationRating(5);
      setProfessionalismRating(5);
      setComment('');
      toast.success('Review submitted successfully!');
    }
  };

  // Calculate summary stats
  const avgOverall =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  const avgService =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.service_rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  const avgCommunication =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.communication_rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  const avgProfessionalism =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.professionalism_rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* Specialist Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Select Specialist to Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Search Specialists</Label>
            <Input
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
          </div>
          
          <div>
            <Label>Select Specialist</Label>
            <Select value={selectedSpecialistId} onValueChange={setSelectedSpecialistId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a specialist to review" />
              </SelectTrigger>
              <SelectContent>
                {filteredSpecialists.map((specialist) => (
                  <SelectItem key={specialist.id} value={specialist.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                        {specialist.profile_picture_url ? (
                          <img 
                            src={specialist.profile_picture_url} 
                            alt="" 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          specialist.full_name?.charAt(0) || 'S'
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{specialist.full_name}</div>
                        <div className="text-xs text-muted-foreground">{specialist.specialist_type}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSpecialist && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  {selectedSpecialist.profile_picture_url ? (
                    <img 
                      src={selectedSpecialist.profile_picture_url} 
                      alt={selectedSpecialist.full_name || ''} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{selectedSpecialist.full_name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedSpecialist.specialist_type}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Card - Only show if specialist is selected */}
      {selectedSpecialistId && (
        <Card>
          <CardHeader>
            <CardTitle>Rating Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              {avgOverall} <span className="text-base font-normal text-muted-foreground">/ 5</span>
            </div>
            <p className="text-sm text-muted-foreground">{reviews.length} review(s)</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>Service Quality: ⭐ {avgService}</p>
              <p>Communication: ⭐ {avgCommunication}</p>
              <p>Professionalism: ⭐ {avgProfessionalism}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Form - Only show if specialist is selected */}
      {selectedSpecialistId && (
        <Card>
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Overall Rating</Label>
              <Rating rating={overallRating} setRating={setOverallRating} />
            </div>
            <div>
              <Label>Service Quality</Label>
              <Rating rating={serviceRating} setRating={setServiceRating} />
            </div>
            <div>
              <Label>Communication</Label>
              <Rating rating={communicationRating} setRating={setCommunicationRating} />
            </div>
            <div>
              <Label>Professionalism</Label>
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
            <Button onClick={handleSubmitReview} disabled={!selectedSpecialistId}>
              Submit Review
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List - Only show if specialist is selected */}
      {selectedSpecialistId && (
        <Card>
          <CardHeader>
            <CardTitle>Reviews for {selectedSpecialist?.full_name}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading reviews...</div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-md p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{review.overall_rating}/5</span>
                      <span className="text-xs text-muted-foreground">Overall</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-2">
                      <span>Service: {review.service_rating}/5</span>
                      <span>Communication: {review.communication_rating}/5</span>
                      <span>Professionalism: {review.professionalism_rating}/5</span>
                    </div>
                    {review.comment && (
                      <p className="text-sm mb-2">{review.comment}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Reviewed on {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No reviews yet for this specialist.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instruction Card - Show when no specialist is selected */}
      {!selectedSpecialistId && (
        <Card className="border-dashed">
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a Specialist to Review</h3>
            <p className="text-muted-foreground">
              Choose a specialist from the dropdown above to view their reviews or leave your own review.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IntegratedReviewsSystem;