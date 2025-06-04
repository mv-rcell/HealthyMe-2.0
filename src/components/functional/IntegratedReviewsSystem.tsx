import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Filter, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
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
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    overall_rating: 5,
    service_rating: 5,
    communication_rating: 5,
    professionalism_rating: 5,
    comment: ''
  });
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { reviews, createReview, fetchReviews } = useReviews();

  useEffect(() => {
    fetchSpecialists();
  }, []);

  useEffect(() => {
    if (selectedSpecialist) {
      fetchReviews(selectedSpecialist);
    }
  }, [selectedSpecialist]);

  const fetchSpecialists = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, specialist_type, profile_picture_url')
        .eq('role', 'specialist')
        .not('specialist_type', 'is', null);

      if (error) throw error;
      setSpecialists(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to fetch specialists: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedSpecialist || !user) {
      toast({
        title: "Error",
        description: "Please select a specialist and ensure you're logged in.",
        variant: "destructive"
      });
      return;
    }

    const reviewData = {
      specialist_id: selectedSpecialist,
      ...newReview
    };

    const result = await createReview(reviewData);
    if (result) {
      setShowReviewForm(false);
      setNewReview({
        overall_rating: 5,
        service_rating: 5,
        communication_rating: 5,
        professionalism_rating: 5,
        comment: ''
      });
    }
  };

  const renderStars = (rating: number, size = 'sm') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const renderRatingSelector = (
    label: string,
    value: number,
    onChange: (value: number) => void
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Button
            key={i}
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => onChange(i + 1)}
          >
            <Star
              className={`h-5 w-5 ${i < value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          </Button>
        ))}
      </div>
    </div>
  );

  const selectedSpecialistData = specialists.find(s => s.id === selectedSpecialist);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Doctor & Specialist Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium">Select Specialist</label>
          <Select value={selectedSpecialist} onValueChange={setSelectedSpecialist}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a specialist to view reviews" />
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

        {selectedSpecialist && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedSpecialistData?.profile_picture_url} />
                <AvatarFallback>
                  {selectedSpecialistData?.full_name?.split(' ').map(n => n[0]).join('') || 'SP'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{selectedSpecialistData?.full_name}</h3>
                <p className="text-sm text-muted-foreground">{selectedSpecialistData?.specialist_type}</p>
              </div>
            </div>
            
            {user && (
              <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Write Review
              </Button>
            )}
          </div>
        )}

        {showReviewForm && user && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Write a Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderRatingSelector(
                  "Overall Rating",
                  newReview.overall_rating,
                  (value) => setNewReview({ ...newReview, overall_rating: value })
                )}
                {renderRatingSelector(
                  "Service Quality",
                  newReview.service_rating,
                  (value) => setNewReview({ ...newReview, service_rating: value })
                )}
                {renderRatingSelector(
                  "Communication",
                  newReview.communication_rating,
                  (value) => setNewReview({ ...newReview, communication_rating: value })
                )}
                {renderRatingSelector(
                  "Professionalism",
                  newReview.professionalism_rating,
                  (value) => setNewReview({ ...newReview, professionalism_rating: value })
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium">Comment</label>
                <Textarea
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSubmitReview}>Submit Review</Button>
                <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedSpecialist && (
          <div className="space-y-4">
            <h3 className="font-semibold">Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
            ) : (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {renderStars(review.overall_rating)}
                        </div>
                        {review.is_verified && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Service: </span>
                        <div className="flex">
                          {renderStars(review.service_rating)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Communication: </span>
                        <div className="flex">
                          {renderStars(review.communication_rating)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Professionalism: </span>
                        <div className="flex">
                          {renderStars(review.professionalism_rating)}
                        </div>
                      </div>
                    </div>
                    
                    {review.comment && (
                      <p className="text-sm">{review.comment}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntegratedReviewsSystem;