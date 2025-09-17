import React, { useState } from 'react';
import { 
  Star, MapPin, Clock, Calendar, MessageSquare, Video, DollarSign, Phone, Eye 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useBookingRequests } from '@/hooks/useBookingRequests';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Specialist {
  id: string;
  full_name: string | null;
  specialist_type: string | null;
  location: string | null;
  bio: string | null;
  consultation_fee: number | null;
  subsequent_visits_fee: number | null;
  availability: string | null;
  languages: string | null;
  is_online: boolean | null;
  experience: string | null;
  profile_picture_url: string | null;
  verification_status: string | null;
}

interface RealTimeSpecialistCardProps {
  specialist: Specialist;
  rating?: number;
  reviewCount?: number;
  onStartMessage?: (specialist: Specialist) => void;
  onStartVideo?: (specialist: Specialist) => Promise<void>;
  onStartZoom?: (specialist: Specialist) => Promise<void>;
  onBookAppointment?: (specialist: Specialist) => void;
  onViewReviews?: (specialist: Specialist) => void;
  loading?: {
    video: boolean;
    zoom: boolean;
  };
}

const RealTimeSpecialistCard: React.FC<RealTimeSpecialistCardProps> = ({
  specialist,
  rating = 4.8,
  reviewCount = 24,
  onStartMessage,
  onStartVideo,
  onStartZoom,
  onBookAppointment,
  onViewReviews,
  loading = { video: false, zoom: false }
}) => {
  const { createBookingRequest } = useBookingRequests(specialist.id);
  const { user } = useAuth();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    preferred_date: '',
    service_type: specialist.specialist_type || '',
    duration: 60,
    notes: ''
  });

  const resetBookingForm = () => {
    setBookingData({
      preferred_date: '',
      service_type: specialist.specialist_type || '',
      duration: 60,
      notes: ''
    });
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('You must be logged in to book an appointment');
      return;
    }

    if (!bookingData.preferred_date) {
      toast.error('Please select a preferred date and time');
      return;
    }

    const result = await createBookingRequest({
      client_id: user.id,
      specialist_id: specialist.id,
      service_type: bookingData.service_type,
      preferred_date: new Date(bookingData.preferred_date).toISOString(),
      duration: bookingData.duration,
      notes: bookingData.notes,
      status: 'pending',
      patient_id: user.id,
      patient_name: '', // optional
      reason: '',       // optional
      scheduled_time: null
    });

    if (result) {
      toast.success('Booking request sent successfully!');
      setIsBookingOpen(false);
      resetBookingForm();
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      {/* Online Badge */}
      {specialist.is_online && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Online
          </Badge>
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Profile Picture */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary text-xl font-semibold overflow-hidden">
            {specialist.profile_picture_url ? (
              <img
                src={specialist.profile_picture_url}
                alt={specialist.full_name || 'Specialist'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              specialist.full_name?.charAt(0) || 'S'
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-2">
            {/* Name + Verification */}
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {specialist.full_name}
              </h3>
              {specialist.verification_status === 'pending' && (
                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                  Pending Verification
                </Badge>
              )}
            </div>
            <p className="text-primary font-medium">{specialist.specialist_type}</p>

            {/* Rating + Experience */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div 
                className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                onClick={() => onViewReviews?.(specialist)}
              >
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{rating > 0 ? rating.toFixed(1) : 'No ratings'}</span>
                <span>({reviewCount} reviews)</span>
              </div>
              {specialist.experience && <span>{specialist.experience}</span>}
            </div>

            {/* Location */}
            {specialist.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{specialist.location}</span>
              </div>
            )}

            {/* Languages */}
            {specialist.languages && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Languages:</span> {specialist.languages}
              </div>
            )}

            {/* Bio */}
            {specialist.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {specialist.bio}
              </p>
            )}

            {/* Fees & Availability */}
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                {specialist.consultation_fee && (
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-medium">KES {specialist.consultation_fee}</span>
                    <span className="text-muted-foreground">/ consultation</span>
                  </div>
                )}
                {specialist.availability && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{specialist.availability}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onStartMessage?.(specialist)}>
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Message
                </Button>
                <Button size="sm" variant="outline" onClick={() => onStartVideo?.(specialist)} disabled={loading.video}>
                  <Video className="h-3 w-3 mr-1" />
                  {loading.video ? 'Starting...' : 'Video'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => onStartZoom?.(specialist)} disabled={loading.zoom}>
                  <Phone className="h-3 w-3 mr-1" />
                  {loading.zoom ? 'Creating...' : 'Zoom'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => onViewReviews?.(specialist)}>
                  <Eye className="h-3 w-3 mr-1" />
                  Reviews
                </Button>

                {/* Booking Dialog */}
                <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Calendar className="h-3 w-3 mr-1" />
                      Book
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book Appointment with {specialist.full_name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Service Type */}
                      <div>
                        <Label htmlFor="service_type">Service Type</Label>
                        <Input
                          id="service_type"
                          value={bookingData.service_type}
                          onChange={(e) => setBookingData({ ...bookingData, service_type: e.target.value })}
                          placeholder="Enter service type"
                        />
                      </div>

                      {/* Date */}
                      <div>
                        <Label htmlFor="preferred_date">Preferred Date & Time</Label>
                        <Input
                          id="preferred_date"
                          type="datetime-local"
                          value={bookingData.preferred_date}
                          onChange={(e) => setBookingData({ ...bookingData, preferred_date: e.target.value })}
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </div>

                      {/* Duration */}
                      <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={bookingData.duration}
                          onChange={(e) => setBookingData({ ...bookingData, duration: parseInt(e.target.value) })}
                          min="30"
                          step="15"
                        />
                      </div>

                      {/* Notes */}
                      <div>
                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={bookingData.notes}
                          onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                          placeholder="Any specific requirements or health concerns..."
                          rows={3}
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsBookingOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button onClick={handleBooking} className="flex-1">
                          Send Booking Request
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeSpecialistCard;