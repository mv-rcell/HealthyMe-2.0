import React, { useState, useEffect } from 'react';
import { MapPin, Video, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useVideoCall } from '@/hooks/useVideoCall.tsx';
import { useBookingRequests } from '@/hooks/useBookingRequests';
import { supabase } from '@/integrations/supabase/client';

interface Specialist {
  id: string;
  full_name: string;
  specialist_type: string;
  bio: string;
  experience: string;
}

const IntegratedHomeCareBooking = () => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  const { startVideoCall, activeSession } = useVideoCall();
  const { createBookingRequest } = useBookingRequests();

  const services = [
    { id: 'physiotherapy', name: 'Home Physiotherapy' },
    { id: 'nursing', name: 'Home Nursing Care' },
    { id: 'massage', name: 'Therapeutic Massage' },
    { id: 'counseling', name: 'Mental Health Counseling' }
  ];

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'specialist')
        .not('specialist_type', 'is', null);

      if (error) throw error;
      setSpecialists(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch specialists: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedSpecialist || !user) {
      toast({
        title: 'Missing Information',
        description: 'Please select a service and specialist.',
        variant: 'destructive',
      });
      return;
    }

    // Default preferred time = 1 hour from now
    const preferredDate = new Date();
    preferredDate.setHours(preferredDate.getHours() + 1);

    const bookingRequestData = {
      client_id: user.id,
      specialist_id: selectedSpecialist,
      service_type: selectedService,
      preferred_date: preferredDate.toISOString(),
      duration: 60,
      notes: 'Requested via HomeCare page',
      status: 'pending' as const,
    };

    try {
      const request = await createBookingRequest(bookingRequestData);
      if (request) {
        toast({
          title: 'Booking Request Sent!',
          description: 'Your request has been submitted. The specialist will confirm shortly.',
          variant: 'default',
        });
        setSelectedService('');
        setSelectedSpecialist('');
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: `Could not create booking request: ${err.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleVideoCall = async () => {
    if (!selectedSpecialist || !user) return;
    await startVideoCall(0, selectedSpecialist);
  };

  const selectedSpecialistData = specialists.find((s) => s.id === selectedSpecialist);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Home Care Services
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Service Selection */}
        <div>
          <label className="text-sm font-medium">Select Service</label>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger>
              <SelectValue placeholder="Choose service type" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Specialist Selection */}
        <div>
          <label className="text-sm font-medium">Available Specialists</label>
          <Select value={selectedSpecialist} onValueChange={setSelectedSpecialist}>
            <SelectTrigger>
              <SelectValue placeholder="Choose specialist" />
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

        {/* Specialist Info */}
        {selectedSpecialistData && (
          <div className="p-3 border rounded-lg">
            <div className="font-medium">{selectedSpecialistData.full_name}</div>
            <div className="text-sm text-muted-foreground">
              {selectedSpecialistData.specialist_type}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {selectedSpecialistData.experience}
            </div>
            <div className="text-xs mt-2">{selectedSpecialistData.bio}</div>
          </div>
        )}

        {/* Video Call Indicator */}
        {activeSession && (
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <Video className="h-4 w-4" />
              <span className="text-sm font-medium">Video call active</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleBooking}
            className="flex-1"
            disabled={loading || !user}
          >
            Book Home Visit
          </Button>
          <Button
            onClick={handleVideoCall}
            variant="outline"
            size="icon"
            disabled={!selectedSpecialist || !user}
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" disabled>
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegratedHomeCareBooking;
