
import React, { useState } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { useBookingRequests } from '@/hooks/useBookingRequests';
import { useAuth } from '@/hooks/useAuth';
import { useVideoCall } from '@/hooks/useVideoCall';
import { useZoomIntegration } from '@/hooks/useZoomIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, User, Video, Phone, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { specialistsData } from '@/data/specialist';
import { toast } from 'sonner';
import MessageThread from '../messaging/MessageThread';
import GlobalVideoCallHandler from '../video/GlobalVideoCallHandler';

const AppointmentHistory = () => {
  const { appointments, loading } = useAppointments();
  const { bookingRequests, loading: bookingLoading } = useBookingRequests(profile?.id ?? null);  const { profile } = useAuth();
  const { startVideoCall, loading: videoLoading } = useVideoCall();
  const { createZoomMeeting, loading: zoomLoading } = useZoomIntegration();
  const [selectedCommunication, setSelectedCommunication] = useState<{
    type: 'message' | null;
    recipientId: string;
    recipientName: string;
    appointmentId?: number;
  } | null>(null);

  const getSpecialistInfo = (specialistId: string) => {
    return specialistsData.find(s => s.id === specialistId);
  };

  const handleStartVideoCall = async (appointmentId: number, otherUserId: string, otherUserName: string) => {
    try {
      const session = await startVideoCall(appointmentId, otherUserId, "client")

      if (session) {
        toast.success(`Video call started with ${otherUserName}!`);
      }
    } catch (error) {
      toast.error('Failed to start video call');
    }
  };

  const handleStartZoomCall = async (otherUserName: string, otherUserEmail: string) => {
    try {
      const meeting = await createZoomMeeting(
        `Consultation with ${otherUserName}`,
        otherUserEmail
      );
      if (meeting) {
        toast.success('Zoom meeting created! Opening meeting...');
        window.open(meeting.join_url, '_blank');
      }
    } catch (error) {
      toast.error('Failed to create Zoom meeting');
    }
  };

  const openMessageDialog = (recipientId: string, recipientName: string, appointmentId?: number) => {
    setSelectedCommunication({
      type: 'message',
      recipientId,
      recipientName,
      appointmentId
    });
  };

  // Combine appointments and booking requests for specialists
  const allItems = React.useMemo(() => {
    const items = [];
    
    // Add appointments
    appointments.forEach(appointment => {
      items.push({
        ...appointment,
        type: 'appointment',
        date: appointment.appointment_date,
        otherUserId: profile?.role === 'specialist' ? appointment.client_id : appointment.specialist_id,
        otherUserName: profile?.role === 'specialist' ? 'Client' : getSpecialistInfo(appointment.specialist_id)?.name || 'Specialist'
      });
    });

    // Add booking requests for specialists
    if (profile?.role === 'specialist') {
      bookingRequests.forEach(request => {
        items.push({
          ...request,
          type: 'booking_request',
          date: request.preferred_date,
          appointment_date: request.preferred_date,
          otherUserId: request.client_id,
          otherUserName: 'Client',
          service_type: request.service_type
        });
      });
    }

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments, bookingRequests, profile?.role]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || bookingLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          {profile?.role === 'specialist' ? 'Appointments & Requests' : 'Appointment History'}
        </h2>
        
        {allItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {profile?.role === 'specialist' 
                  ? 'No appointments or requests found.'
                  : 'No appointments found. Book your first consultation!'
                }
              </p>
              {profile?.role !== 'specialist' && (
                <Button className="mt-4" onClick={() => window.location.href = '/book-consultation'}>
                  Book Consultation
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {allItems.map((item) => {
              const specialist = item.type === 'appointment' ? getSpecialistInfo(item.specialist_id) : null;
              const isBookingRequest = item.type === 'booking_request';
              
              return (
                <Card key={`${item.type}-${item.id}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {specialist && (
                          <img
                            src={specialist.imageUrl}
                            alt={specialist.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">
                              {specialist?.name || item.otherUserName}
                            </h3>
                            {isBookingRequest && (
                              <Badge variant="outline">Booking Request</Badge>
                            )}
                          </div>
                          <p className="text-primary font-medium">
                            {specialist?.specialty || item.service_type}
                          </p>
                          
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(item.appointment_date), 'MMM dd, yyyy')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {format(new Date(item.appointment_date), 'HH:mm')}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {item.duration} minutes
                            </div>
                          </div>
                          
                          {item.notes && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                        {item.price && (
                          <p className="text-lg font-semibold">KES {item.price}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          {/* Communication Actions */}
                          {(item.status === 'confirmed' || item.status === 'active') && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openMessageDialog(
                                  item.otherUserId, 
                                  item.otherUserName, 
                                  item.type === 'appointment' ? item.id : undefined
                                )}
                              >
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Message
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleStartVideoCall(
                                  item.type === 'appointment' ? item.id : Math.floor(Math.random() * 1000000),
                                  item.otherUserId,
                                  item.otherUserName
                                )}
                                disabled={videoLoading}
                              >
                                <Video className="h-3 w-3 mr-1" />
                                Video Call
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleStartZoomCall(
                                  item.otherUserName,
                                  'user@example.com'
                                )}
                                disabled={zoomLoading}
                              >
                                <Phone className="h-3 w-3 mr-1" />
                                Zoom
                              </Button>
                            </>
                          )}
                          
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          
                          {item.status === 'pending' && (
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Dialog */}
      <Dialog 
        open={selectedCommunication?.type === 'message'} 
        onOpenChange={() => setSelectedCommunication(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Message {selectedCommunication?.recipientName}
            </DialogTitle>
          </DialogHeader>
          {selectedCommunication && profile && (
            <MessageThread
              currentUserId={profile.id}
              recipientId={selectedCommunication.recipientId}
              recipientName={selectedCommunication.recipientName}
              appointmentId={selectedCommunication.appointmentId}
            />
          )}
        </DialogContent>
      </Dialog>

      <GlobalVideoCallHandler />
    </>
  );
};

export default AppointmentHistory;