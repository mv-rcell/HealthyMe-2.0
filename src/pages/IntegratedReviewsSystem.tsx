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

// Main Page Component
const SpecialistReviewsPage = () => {
  // Demo specialist ID - in real app this would come from routing/props
  const specialistId = "demo-specialist-123";
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Healthcare Reviews</h1>
            </div>
           
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Specialist Reviews</h2>
          <p className="text-gray-600">Share your experience and read reviews from other patients</p>
        </div>


        {/* Reviews System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <IntegratedReviewsSystem specialistId={specialistId} />
          </div>
          
          {/* Additional Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Be honest and respectful in your feedback</li>
                  <li>• Focus on your experience with the specialist</li>
                  <li>• Avoid sharing personal medical information</li>
                  <li>• Reviews are moderated to ensure quality</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Phone:</strong> (555) 123-4567</p>
                  <p><strong>Email:</strong> info@HealthyMe.com</p>
                  <p><strong>Address:</strong> 123 Medical Center Dr, Health City, HC 12345</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Healthcare Reviews</h3>
              <p className="text-gray-400">Connecting patients with quality healthcare providers.</p>
            </div>
           
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Healthcare Reviews. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SpecialistReviewsPage;