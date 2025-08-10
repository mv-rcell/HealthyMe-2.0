
import React from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBookingRequests } from '@/hooks/useBookingRequests';
import { useAuth } from '@/hooks/useAuth';
import { useAppointments } from '@/hooks/useAppointments';
import { format } from 'date-fns';

const BookingRequestsPanel = () => {
  const { profile } = useAuth();
  const specialistId = profile?.id ?? null;
  const { bookingRequests, loading, updateBookingRequestStatus } = useBookingRequests(specialistId);

  const { createAppointment } = useAppointments();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      // Find the booking request to get details
      const request = bookingRequests.find(req => req.id === requestId);
      if (!request || !profile?.id) return;

      // Create appointment from booking request
      await createAppointment({
        client_id: request.client_id,
        specialist_id: request.specialist_id,
        service_type: request.service_type,
        appointment_date: request.preferred_date,
        duration: request.duration,
        notes: request.notes,
        status: 'confirmed'
      });

      // Update booking request status
      await updateBookingRequestStatus(requestId, 'accepted');
    } catch (error) {
      console.error('Error accepting booking request:', error);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    updateBookingRequestStatus(requestId, 'declined');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {profile?.role === 'specialist' ? 'Incoming Booking Requests' : 'My Booking Requests'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookingRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No booking requests at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookingRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{request.service_type}</span>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(request.preferred_date), 'PPP')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {request.duration} minutes
                      </div>
                    </div>

                    {request.notes && (
                      <div className="flex items-start gap-1 text-sm">
                        <MessageSquare className="h-3 w-3 mt-0.5" />
                        <span className="text-muted-foreground">{request.notes}</span>
                      </div>
                    )}
                  </div>

                  {profile?.role === 'specialist' && request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcceptRequest(request.id)}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectRequest(request.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingRequestsPanel;