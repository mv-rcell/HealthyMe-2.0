import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBookingRequests } from '@/hooks/useBookingRequests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const BookingRequestsPanel = () => {
  const { bookingRequests, loading, updateBookingRequestStatus } = useBookingRequests();
  const { profile } = useAuth();

  const handleAcceptRequest = (requestId: string): void => {
    if (confirm('Accept this booking request?')) {
      updateBookingRequestStatus(requestId, 'accepted');
    }
  };

  const handleRejectRequest = (requestId: string): void => {
    if (confirm('Reject this booking request?')) {
      updateBookingRequestStatus(requestId, 'rejected');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookingRequests.length === 0 ? (
          <p className="text-center text-muted-foreground">No booking requests at the moment.</p>
        ) : (
          bookingRequests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 shadow-sm space-y-2">
              <p><strong>From:</strong> {request.patient_name}</p>
              <p><strong>Reason:</strong> {request.reason}</p>
              <p><strong>Time:</strong> {format(new Date(request.preferred_date), 'p')}</p>
              <p><strong>Status:</strong> {request.status}</p>

              {profile?.role === 'specialist' && (
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => handleAcceptRequest(request.id)} size="sm">
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleRejectRequest(request.id)}
                    size="sm"
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default BookingRequestsPanel;
