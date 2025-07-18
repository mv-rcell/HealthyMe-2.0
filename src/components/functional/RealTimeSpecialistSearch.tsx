import React, { useState } from 'react';
import {
  Search, Star, MapPin, Clock, Users,
  Brain, Stethoscope, Video, MessageSquare, Phone
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useRealSpecialists } from '@/hooks/useRealSpecialists.tsx';
import { useZoomIntegration } from '@/hooks/useZoomIntegration';
import { useVideoCall } from '@/hooks/useVideoCall';
import { toast } from 'sonner';
import VirtualChats from '@/components/functional/VirtualChats.tsx';
import MessageThread from '../messaging/MessageThread';
import BookingRequestsPanel from './BookingRequestPanel';

const RealTimeSpecialistSearch = () => {
  const { user } = useAuth();
  const { specialists, loading } = useRealSpecialists();
  const { createZoomMeeting, loading: zoomLoading } = useZoomIntegration();
  const { startVideoCall, loading: videoLoading } = useVideoCall();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
  const [communicationType, setCommunicationType] = useState<'chat' | 'message' | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false); // ✅

  const specialties = Array.from(new Set(specialists.map(s => s.specialist_type).filter(Boolean))).sort();

  const filteredSpecialists = specialists.filter(specialist => {
    const matchesSearch = !searchTerm ||
      specialist.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.specialist_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.bio?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = !selectedSpecialty || specialist.specialist_type === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  const startZoomCall = async (specialist: any) => {
    if (!user) {
      toast.error('Please log in to start a call');
      return;
    }

    const meeting = await createZoomMeeting(
      `Consultation with ${specialist.full_name}`,
      user.email || 'client@example.com'
    );

    if (meeting) {
      toast.success(`Zoom meeting created with ${specialist.full_name}!`);
    }
  };

  const startVideo = async (specialist: any) => {
    if (!user) {
      toast.error('Please log in to start a video call');
      return;
    }

    const appointmentId = Math.floor(Math.random() * 1000000);

    const session = await startVideoCall(appointmentId, specialist.id);
    if (session) {
      toast.success(`Video call started with ${specialist.full_name}!`);
    }
  };

  const openCommunication = (specialist: any, type: 'chat' | 'message') => {
    if (!user) {
      toast.error('Please log in to communicate');
      return;
    }

    setSelectedSpecialist(specialist);
    setCommunicationType(type);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading specialists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search specialists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button variant="outline" className="md:w-auto">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {specialties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
          {specialties.map((specialty) => (
            <Button
              key={specialty}
              variant={selectedSpecialty === specialty ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialty(selectedSpecialty === specialty ? '' : specialty)}
              className="text-xs justify-start"
            >
              {specialty}
            </Button>
          ))}
        </div>
      )}

      <div className="text-sm text-muted-foreground mb-4">
        Showing {filteredSpecialists.length} of {specialists.length} specialists
      </div>

      <div className="grid gap-4">
        {filteredSpecialists.map((specialist) => (
          <Card key={specialist.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-3">
                  {specialist.profile_picture_url ? (
                    <img
                      src={specialist.profile_picture_url}
                      alt={specialist.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      {specialist.full_name?.charAt(0) || 'S'}
                    </div>
                  )}
                  {specialist.is_online && (
                    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{specialist.full_name}</h3>
                      <p className="text-primary font-medium">{specialist.specialist_type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={specialist.is_online ? "default" : "secondary"}>
                        {specialist.is_online ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {specialist.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {specialist.location}
                      </div>
                    )}
                    {specialist.experience && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {specialist.experience}
                      </div>
                    )}
                    {specialist.availability && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {specialist.availability}
                      </div>
                    )}
                  </div>

                  {specialist.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{specialist.bio}</p>
                  )}

                  {specialist.languages && (
                    <div className="flex flex-wrap gap-2">
                      {specialist.languages.split(',').map((language, index) => (
                        <Badge key={index} variant="secondary">
                          {language.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Separator />

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="text-sm">
                      {specialist.consultation_fee && (
                        <>
                          <span className="text-muted-foreground">Consultation fee: </span>
                          <span className="font-semibold">KES {specialist.consultation_fee}</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedSpecialist(specialist);
                          setShowBookingDialog(true);
                        }}
                      >
                        Book Appointment
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCommunication(specialist, 'chat')}
                        className="flex items-center gap-1"
                      >
                        <MessageSquare className="h-3 w-3" />
                        Chat
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCommunication(specialist, 'message')}
                        className="flex items-center gap-1"
                      >
                        <MessageSquare className="h-3 w-3" />
                        Message
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startVideo(specialist)}
                        disabled={videoLoading}
                        className="flex items-center gap-1"
                      >
                        <Video className="h-3 w-3" />
                        {videoLoading ? 'Starting...' : 'Video'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startZoomCall(specialist)}
                        disabled={zoomLoading}
                        className="flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {zoomLoading ? 'Creating...' : 'Zoom'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSpecialists.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {specialists.length === 0
            ? "No specialists have registered yet."
            : "No specialists found matching your criteria. Try adjusting your search."
          }
        </div>
      )}

      {/* Chat Dialog */}
      <Dialog open={!!selectedSpecialist && communicationType === 'chat'} onOpenChange={() => {
        setSelectedSpecialist(null);
        setCommunicationType(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Virtual Chat with {selectedSpecialist?.full_name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <VirtualChats />
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={!!selectedSpecialist && communicationType === 'message'} onOpenChange={() => {
        setSelectedSpecialist(null);
        setCommunicationType(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Message {selectedSpecialist?.full_name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {user && selectedSpecialist && (
              <MessageThread
                currentUserId={user.id}
                recipientId={selectedSpecialist.id}
                recipientName={selectedSpecialist.full_name}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={(open) => {
        setShowBookingDialog(open);
        if (!open) setSelectedSpecialist(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Book Appointment with {selectedSpecialist?.full_name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedSpecialist && (
              <BookingRequestsPanel specialist={selectedSpecialist} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RealTimeSpecialistSearch;
