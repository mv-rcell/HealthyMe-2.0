import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBookingRequests } from '@/hooks/useBookingRequests';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const BookingNotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useAuth();
  const specialistId = profile?.id ?? null;
  const { bookingRequests, loading, updateBookingRequestStatus } = useBookingRequests(specialistId);
  const navigate = useNavigate();

  // Only show for specialists
  if (profile?.role !== 'specialist') {
    return null;
  }

  // Count pending requests
  const pendingRequests = bookingRequests.filter(request => request.status === 'pending');
  const pendingCount = pendingRequests.length;

  const handleAcceptRequest = async (requestId: string) => {
    await updateBookingRequestStatus(requestId, 'accepted');
  };

  const handleRejectRequest = async (requestId: string) => {
    await updateBookingRequestStatus(requestId, 'declined');
  };

  const handleViewDetails = () => {
    navigate('/specialist-appointments');
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Calendar className="h-5 w-5" />
          {pendingCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {pendingCount > 9 ? '9+' : pendingCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Booking Requests</CardTitle>
              {pendingCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleViewDetails}
                  className="text-xs"
                >
                  View all
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {pendingRequests.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No pending requests</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {pendingRequests.slice(0, 5).map((request) => (
                    <div
                      key={request.id}
                      className="p-4 border-b space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium">
                              {request.service_type}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {request.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <Clock className="h-3 w-3" />
                            <span>{request.duration} minutes</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(request.preferred_date), { addSuffix: true })}
                          </p>
                          {request.notes && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {request.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptRequest(request.id)}
                          className="flex-1 h-8 text-xs"
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectRequest(request.id)}
                          className="flex-1 h-8 text-xs"
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default BookingNotificationBell;